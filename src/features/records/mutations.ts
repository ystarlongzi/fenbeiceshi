import { restoreClip, type RecordedClip } from "../audio-recording/pcm.ts";
import type { Measurement } from "../sound-meter/types.ts";
import {
  MAX_RECORDS,
  RECORD_KEY,
  parseRecords,
  validMeasurement,
  type RecordError,
} from "./storage.ts";
import {
  changeRecordings,
  RecordingStorageError,
  type RecordingChange,
} from "./recording-storage.ts";

class RecordMutationError extends Error {
  readonly code: Exclude<RecordError, null>;
  constructor(code: Exclude<RecordError, null>, options?: ErrorOptions) {
    super(`本机报告修改失败：${code}`, options);
    this.code = code;
  }
}

function prepareChange(
  update: (records: Measurement[]) => Measurement[],
  clip?: RecordedClip,
): RecordingChange {
  const previous = localStorage.getItem(RECORD_KEY);
  const state = parseRecords(previous);
  if (state.error) throw new RecordMutationError(state.error);
  const records = update(state.records);
  const next = JSON.stringify({ version: 3, records });
  if (next.length > 1000000) throw new RecordMutationError("saveError");
  return {
    recordIds: records.map((record) => record.id),
    clip,
    commit: () => {
      if (localStorage.getItem(RECORD_KEY) !== previous)
        throw new RecordMutationError("saveError", { cause: new Error("报告已被其他页面修改。") });
      localStorage.setItem(RECORD_KEY, next);
      return () => {
        // 旧版本页面仍可能直接改 localStorage，回退不得覆盖另一页面的新数据。
        if (localStorage.getItem(RECORD_KEY) !== next)
          throw new Error("报告已被其他页面修改，不能覆盖回退。");
        if (previous === null) localStorage.removeItem(RECORD_KEY);
        else localStorage.setItem(RECORD_KEY, previous);
      };
    },
  };
}

async function mutate(
  update: (records: Measurement[]) => Measurement[],
  clip?: RecordedClip,
): Promise<RecordError> {
  try {
    try {
      await changeRecordings(() => prepareChange(update, clip));
    } catch (cause) {
      // 不支持 IndexedDB 时，仍允许不涉及音频写入或淘汰的摘要操作。
      if (cause instanceof RecordingStorageError && cause.stage === "open" && !clip) {
        const change = prepareChange(update);
        const state = parseRecords(localStorage.getItem(RECORD_KEY));
        if (
          state.records.some((record) => record.recording && !change.recordIds.includes(record.id))
        )
          throw cause;
        change.commit();
      } else throw cause;
    }
    window.dispatchEvent(new Event("fenbei-records"));
    return null;
  } catch (cause) {
    console.error("本机报告保存或清理失败。", cause);
    window.dispatchEvent(new Event("fenbei-records"));
    if (cause instanceof RecordMutationError || cause instanceof RecordingStorageError)
      return cause.code;
    return "saveError";
  }
}

export async function saveRecord(record: Measurement, clip?: RecordedClip): Promise<RecordError> {
  if (!validMeasurement(record) || (clip && clip.measurementId !== record.id)) return "saveError";
  try {
    if (clip) restoreClip(clip);
  } catch (cause) {
    console.error("待保存录音无效。", cause);
    return "audioCorrupt";
  }
  return mutate((records) => {
    // 编辑备注时保留已有音频关联；不接受调用方凭空添加音频标记。
    const recording = clip
      ? { version: 1 as const, sampleRate: clip.sampleRate, frames: clip.frames }
      : records.find((item) => item.id === record.id)?.recording;
    const saved = { ...record, recording };
    return [saved, ...records.filter((item) => item.id !== record.id)].slice(0, MAX_RECORDS);
  }, clip);
}

export function deleteRecord(id: string): Promise<RecordError> {
  if (!id || id.length > 100) return Promise.resolve("saveError");
  return mutate((records) => records.filter((item) => item.id !== id));
}
