import type { Locale } from "../../sound-meter/types";
import type { useAudioRecording } from "../use-audio-recording";
import { recordingCopy } from "../copy";
import styles from "./index.module.css";

export function RecordingOptions({
  locale,
  recording,
  busy,
  demo,
}: {
  locale: Locale;
  recording: ReturnType<typeof useAudioRecording>;
  busy: boolean;
  demo: boolean;
}) {
  const copy = recordingCopy[locale];
  const hint = demo
    ? copy.demo
    : recording.phase === "recording"
      ? copy.active
      : recording.enabled && recording.phase === "error"
        ? copy.unavailable
        : busy && recording.enabled && recording.phase === "ready"
          ? copy.stopped
          : recording.enabled
            ? copy.on
            : copy.off;
  return (
    <div className={styles.options}>
      <label>
        <input
          type="checkbox"
          checked={recording.enabled}
          disabled={busy || recording.phase === "finishing"}
          onChange={(event) => recording.setEnabled(event.target.checked)}
          aria-describedby="recording-hint"
        />
        <span>{copy.enable}</span>
        <small aria-live="polite">{hint}</small>
      </label>
      <p id="recording-hint">{copy.hint}</p>
      {recording.enabled && recording.phase === "error" ? (
        <p className={styles.error} role="alert">
          {copy.error}
        </p>
      ) : null}
    </div>
  );
}
