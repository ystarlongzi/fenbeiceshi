"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../sound-meter/types";
import type { PlaybackClip, useAudioRecording } from "../use-audio-recording";
import { recordingFilename } from "../pcm";
import { recordingCopy } from "../copy";
import styles from "./index.module.css";

export function RecordingResult({
  locale,
  recording,
}: {
  locale: Locale;
  recording: ReturnType<typeof useAudioRecording>;
}) {
  const copy = recordingCopy[locale];
  return (
    <div className={styles.result}>
      {recording.phase === "finishing" ? <p role="status">{copy.finishing}</p> : null}
      {recording.clip ? (
        <ClipResult
          key={recording.clip.startedAt}
          clip={recording.clip}
          locale={locale}
          clear={recording.clear}
        />
      ) : null}
    </div>
  );
}

function ClipResult({
  clip,
  locale,
  clear,
}: {
  clip: PlaybackClip;
  locale: Locale;
  clear: () => void;
}) {
  const copy = recordingCopy[locale];
  const [encoding, setEncoding] = useState(false);
  const [mp3Url, setMp3Url] = useState("");
  const [error, setError] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const job = useRef<{
    worker: Worker | null;
    url: string;
    cancelled: boolean;
    timer: ReturnType<typeof setTimeout> | null;
  }>({
    worker: null,
    url: "",
    cancelled: false,
    timer: null,
  });

  useEffect(() => {
    const current = job.current;
    current.cancelled = false;
    return () => {
      current.cancelled = true;
      current.worker?.terminate();
      if (current.timer) clearTimeout(current.timer);
      if (current.url) URL.revokeObjectURL(current.url);
    };
  }, []);

  async function makeMp3() {
    if (encoding || job.current.cancelled) return;
    setError(false);
    setEncoding(true);
    function finish() {
      job.current.worker?.terminate();
      job.current.worker = null;
      if (job.current.timer) clearTimeout(job.current.timer);
      job.current.timer = null;
      if (!job.current.cancelled) setEncoding(false);
    }
    function fail(cause: unknown) {
      console.error("本机 MP3 导出失败。", cause);
      finish();
      if (!job.current.cancelled) setError(true);
    }
    try {
      const pcm = await clip.pcm.arrayBuffer();
      if (job.current.cancelled) return;
      const worker = new Worker(new URL("../mp3.worker.ts", import.meta.url), { type: "module" });
      job.current.worker = worker;
      worker.onmessage = (event: MessageEvent<{ blob?: Blob; error?: boolean }>) => {
        if (job.current.cancelled) return;
        if (!(event.data.blob instanceof Blob) || !event.data.blob.size || event.data.error) {
          fail(new Error("编码器没有返回有效 MP3。"));
          return;
        }
        try {
          const url = URL.createObjectURL(event.data.blob);
          job.current.url = url;
          setMp3Url(url);
          finish();
        } catch (cause) {
          fail(cause);
        }
      };
      worker.onerror = (event) => fail(new Error(event.message));
      worker.onmessageerror = () => fail(new Error("无法读取 MP3 编码结果。"));
      job.current.timer = setTimeout(() => fail(new Error("MP3 编码超时。")), 120000);
      worker.postMessage({ pcm, sampleRate: clip.sampleRate }, [pcm]);
    } catch (cause) {
      fail(cause);
    }
  }

  return (
    <section className={styles.clip} aria-label={copy.title}>
      <div className={styles.heading}>
        <h3>{copy.title}</h3>
        <span>
          <time dateTime={clip.startedAt}>
            {new Intl.DateTimeFormat(locale, {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(clip.startedAt))}
          </time>
          {" · "}
          {(clip.frames / clip.sampleRate).toFixed(1)} {copy.seconds} · {clip.sampleRate} Hz
        </span>
      </div>
      <audio
        controls
        preload="metadata"
        src={clip.playbackUrl}
        aria-label={copy.title}
        onError={() => setPlaybackError(true)}
      />
      <div className={styles.actions}>
        {mp3Url ? (
          <a href={mp3Url} download={recordingFilename(clip, "mp3")}>
            {copy.mp3Ready}
          </a>
        ) : (
          <button type="button" onClick={() => void makeMp3()} disabled={encoding}>
            {encoding ? copy.encoding : copy.mp3}
          </button>
        )}
        <a href={clip.pcmUrl} download={recordingFilename(clip, "pcm")}>
          {copy.pcm}
        </a>
        <button type="button" onClick={clear} className={styles.clear}>
          {copy.clear}
        </button>
      </div>
      <p className={styles.format}>
        {copy.format} · {clip.sampleRate} Hz
      </p>
      <a
        className={styles.license}
        href="/vendor/lamejs/NOTICE.txt"
        target="_blank"
        rel="noopener noreferrer"
      >
        {copy.license}
      </a>
      <p>{copy.temporary}</p>
      <div aria-live="polite">
        {encoding ? <p>{copy.encoding}</p> : null}
        {clip.limited ? <p className={styles.notice}>{copy.limited}</p> : null}
        {clip.interrupted ? <p className={styles.notice}>{copy.interrupted}</p> : null}
        {error ? (
          <p className={styles.notice} role="alert">
            {copy.encodeError}
          </p>
        ) : null}
        {playbackError ? (
          <p className={styles.notice} role="alert">
            {copy.playbackError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
