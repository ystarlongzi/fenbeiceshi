"use client";

import { useEffect, useRef, useState } from "react";
import { SoundMeter } from "../../src/features/sound-meter";
import { makeCalibration } from "../../src/features/calibration/calibration";
import { saveRecord } from "../../src/features/records/mutations";
import { DEFAULT_ESTIMATE } from "../../src/features/sound-meter/readings";
import { RECORDING_DB, RECORDING_STORE } from "../../src/features/records/recording-storage";
import { getRecords } from "../../src/features/records/storage";
import type { Locale, Measurement } from "../../src/features/sound-meter/types";
import { localePrefix } from "../../src/lib/i18n/locales";

// 只由临时本地测试路由导入，不注册生产页面，也不请求真实麦克风。
export default function WorkbenchFixture() {
  const [armed, setArmed] = useState(false);
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const [recordsFeedback, setRecordsFeedback] = useState("");
  const [workerCount, setWorkerCount] = useState(0);
  const mode = useRef("tone");
  const restore = useRef<(() => void) | null>(null);
  useEffect(() => () => restore.current?.(), []);

  async function seedRecords() {
    const sample: Measurement = {
      id: "qa-records-generic",
      startedAt: "2026-10-20T01:00:00.000Z",
      duration: 10000,
      stats: { count: 2, energy: 0.0002, min: -40, max: -40 },
      points: [{ time: 1000, value: -40 }],
      input: { label: "QA 合成输入", signature: "qa-records-only", processing: false },
      calibration: null,
      estimate: DEFAULT_ESTIMATE,
      note: "QA 通用估算 · 关窗，空调关闭",
      reason: "user",
    };
    const records: Measurement[] = [
      sample,
      {
        ...sample,
        id: "qa-records-reference",
        startedAt: "2026-10-20T01:01:00.000Z",
        calibration: makeCalibration(-40, 75, "QA 合成参考", sample.input.signature),
        note: "QA 参考估算 · " + "长备注用于验证换行，".repeat(10),
      },
      {
        ...sample,
        id: "qa-records-legacy",
        startedAt: "2026-10-20T01:02:00.000Z",
        estimate: undefined,
        note: "",
      },
    ];
    for (const record of records) {
      const error = await saveRecord(record);
      if (error) {
        setRecordsFeedback(`添加 QA 记录失败：${error}`);
        return;
      }
    }
    setRecordsFeedback("已添加 QA 通用估算、参考估算和历史相对记录。");
  }

  async function inspectAudio() {
    try {
      const count = await new Promise<number>((resolve, reject) => {
        const request = indexedDB.open(RECORDING_DB, 1);
        request.onupgradeneeded = () =>
          request.result.createObjectStore(RECORDING_STORE, { keyPath: "measurementId" });
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction(RECORDING_STORE);
          const query = tx.objectStore(RECORDING_STORE).count();
          tx.oncomplete = () => {
            db.close();
            resolve(query.result);
          };
          tx.onabort = () => {
            db.close();
            reject(tx.error);
          };
        };
      });
      setRecordsFeedback(`QA 存储核对：${getRecords().records.length} 条报告，${count} 段音频。`);
    } catch (cause) {
      console.error("QA 存储核对失败", cause);
      setRecordsFeedback("QA 存储核对失败。");
    }
  }

  function arm() {
    const media = navigator.mediaDevices;
    const originalInput = media.getUserMedia;
    const originalDevices = media.enumerateDevices;
    const originalCopy = navigator.clipboard?.writeText;
    const OriginalWorker = window.Worker;
    const originalPut = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (value: unknown, key?: IDBValidKey) {
      if (mode.current === "audio-quota" && this.name === RECORDING_STORE)
        throw new DOMException("QA 录音空间不足", "QuotaExceededError");
      return originalPut.call(this, value, key);
    };
    window.Worker = class extends OriginalWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        if (mode.current === "mp3-error") throw new Error("QA MP3 编码不可用");
        super(url, options);
        setWorkerCount((count) => count + 1);
      }
    };
    if (navigator.clipboard)
      navigator.clipboard.writeText = async (text) => {
        if (mode.current === "copy-error")
          throw new DOMException("QA clipboard denied", "NotAllowedError");
        return originalCopy.call(navigator.clipboard, text);
      };
    media.enumerateDevices = async () =>
      ["qa-default", "qa-external"].map((deviceId) => ({
        deviceId,
        groupId: "qa-only",
        kind: "audioinput" as const,
        label:
          mode.current === "long" ? `验证输入${deviceId}`.repeat(16) : `QA 合成输入 ${deviceId}`,
        toJSON: () => ({}),
      }));
    media.getUserMedia = async (constraints) => {
      if (mode.current === "denied") throw new DOMException("QA denied", "NotAllowedError");
      if (mode.current === "waiting") return new Promise<MediaStream>(() => {});
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      gain.gain.value = 0.0141421356;
      const destination = context.createMediaStreamDestination();
      oscillator.connect(gain).connect(destination);
      oscillator.start();
      await context.resume();
      const track = destination.stream.getAudioTracks()[0];
      const stop = track.stop.bind(track);
      const settings = track.getSettings.bind(track);
      const audio = constraints?.audio;
      const selected =
        typeof audio === "object" &&
        typeof audio.deviceId === "object" &&
        !Array.isArray(audio.deviceId)
          ? audio.deviceId.exact
          : "qa-default";
      Object.defineProperty(track, "label", {
        value: mode.current === "long" ? "验证输入".repeat(50) : `QA 合成输入 ${selected}`,
      });
      track.getSettings = () => ({
        ...settings(),
        deviceId: String(selected),
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      });
      track.stop = () => {
        stop();
        oscillator.stop();
        void context.close().catch((error: unknown) => console.error("QA 音源关闭失败", error));
      };
      return destination.stream;
    };
    restore.current = () => {
      media.getUserMedia = originalInput;
      media.enumerateDevices = originalDevices;
      window.Worker = OriginalWorker;
      IDBObjectStore.prototype.put = originalPut;
      if (navigator.clipboard) navigator.clipboard.writeText = originalCopy;
    };
    setArmed(true);
  }

  return (
    <main style={{ maxWidth: 1200, margin: "24px auto", padding: 16 }}>
      <h1>本地交互验证 · 合成信号</h1>
      <p>不代表真实测量；不请求麦克风。该夹具不进入生产构建。</p>
      <p>
        <button type="button" onClick={seedRecords}>
          添加导出验证记录
        </button>{" "}
        <a href={`${localePrefix(locale)}/records/`}>查看验证记录</a>{" "}
        <button type="button" onClick={() => void inspectAudio()}>
          核对本机音频
        </button>
      </p>
      {recordsFeedback ? <p role="status">{recordsFeedback}</p> : null}
      <label>
        验证语言{" "}
        <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
          <option value="zh-CN">中文</option>
          <option value="zh-TW">繁體中文</option>
          <option value="en">English</option>
        </select>
      </label>{" "}
      <label>
        输入场景{" "}
        <select
          onChange={(event) => {
            mode.current = event.target.value;
          }}
        >
          <option value="tone">合成音频</option>
          <option value="denied">拒绝访问</option>
          <option value="waiting">等待授权</option>
          <option value="copy-error">复制被拒绝</option>
          <option value="mp3-error">MP3 编码失败</option>
          <option value="audio-quota">录音存储容量不足</option>
          <option value="long">长设备名</option>
        </select>
      </label>{" "}
      {armed ? (
        <p role="status">合成输入已启用 · MP3 编码次数 {workerCount}</p>
      ) : (
        <button type="button" onClick={arm}>
          启用合成输入
        </button>
      )}
      {armed ? <SoundMeter locale={locale} /> : null}
    </main>
  );
}
