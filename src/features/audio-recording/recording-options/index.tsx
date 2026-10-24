import { useId } from "react";
import { Switch } from "@/components/switch";
import { Notice } from "@/components/notice";
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
  const hintId = useId();
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
      <Switch
        checked={recording.enabled}
        disabled={busy || recording.phase === "finishing"}
        onCheckedChange={recording.setEnabled}
        describedBy={hintId}
        setting="recording"
      >
        {copy.enable}
      </Switch>
      <small aria-live="polite">{hint}</small>
      <p id={hintId}>{copy.hint}</p>
      {recording.enabled && recording.phase === "error" ? (
        <Notice className={styles.error} tone="error" role="alert">
          {copy.error}
        </Notice>
      ) : null}
    </div>
  );
}
