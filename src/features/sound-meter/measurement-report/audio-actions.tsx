"use client";

import { useRef } from "react";
import { Icon } from "@/components/icon";
import { getRecordingCopy } from "../../audio-recording/copy";
import { recordingFilename } from "../../audio-recording/pcm";
import type { PlaybackClip, useAudioClip } from "../../audio-recording/use-audio-clip";
import type { Locale } from "../types";
import { getReportCopy } from "./copy";
import styles from "./index.module.css";

export function AudioReportActions({
  clip,
  recording,
  locale,
}: {
  clip: PlaybackClip;
  recording: Pick<ReturnType<typeof useAudioClip>, "mp3" | "createMp3">;
  locale: Locale;
}) {
  const audio = getRecordingCopy(locale);
  const copy = getReportCopy(locale);
  const pcmAction = useRef<HTMLAnchorElement>(null);
  return (
    <>
      {recording.mp3.url ? (
        <a href={recording.mp3.url} download={recordingFilename(clip, "mp3")}>
          <span>
            <Icon name="download" size={16} />
            {audio.mp3Ready}
          </span>
          <small>{copy.mp3Hint}</small>
        </a>
      ) : recording.mp3.phase === "encoding" ? (
        <div className={styles.encoding} role="status">
          <span>{audio.encoding}</span>
          <small>{copy.mp3Hint}</small>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            recording.createMp3();
            pcmAction.current?.focus();
          }}
        >
          <span>
            <Icon name="download" size={16} />
            {audio.mp3}
          </span>
          <small>{copy.mp3Hint}</small>
        </button>
      )}
      <a ref={pcmAction} href={clip.pcmUrl} download={recordingFilename(clip, "pcm")}>
        <span>
          <Icon name="download" size={16} />
          {audio.pcm}
        </span>
        <small>{clip.sampleRate} Hz · mono · s16le</small>
      </a>
    </>
  );
}
