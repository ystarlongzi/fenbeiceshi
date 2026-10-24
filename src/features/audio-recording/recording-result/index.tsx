"use client";

import { useState } from "react";
import { Notice } from "@/components/notice";
import type { Locale } from "../../sound-meter/types";
import type { useAudioRecording } from "../use-audio-recording";
import type { PlaybackClip } from "../use-audio-clip";
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
      {recording.phase === "finishing" ? <Notice role="status">{copy.finishing}</Notice> : null}
      {recording.clip ? (
        <ClipResult
          key={recording.clip.measurementId}
          clip={recording.clip}
          locale={locale}
          recording={recording}
        />
      ) : null}
    </div>
  );
}

function ClipResult({
  clip,
  locale,
  recording,
}: {
  clip: PlaybackClip;
  locale: Locale;
  recording: ReturnType<typeof useAudioRecording>;
}) {
  const copy = recordingCopy[locale];
  const { mp3, createMp3, clear } = recording;
  const encoding = mp3.phase === "encoding";
  const [playbackError, setPlaybackError] = useState(false);

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
        {mp3.url ? (
          <a href={mp3.url} download={recordingFilename(clip, "mp3")}>
            {copy.mp3Ready}
          </a>
        ) : (
          <button type="button" onClick={createMp3} disabled={encoding}>
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
      <div aria-live="polite">
        {encoding ? <Notice>{copy.encoding}</Notice> : null}
        {clip.limited ? <Notice tone="warning">{copy.limited}</Notice> : null}
        {clip.interrupted ? <Notice tone="warning">{copy.interrupted}</Notice> : null}
        {mp3.phase === "error" ? (
          <Notice tone="error" role="alert">
            {copy.encodeError}
          </Notice>
        ) : null}
        {playbackError ? (
          <Notice tone="error" role="alert">
            {copy.playbackError}
          </Notice>
        ) : null}
      </div>
    </section>
  );
}
