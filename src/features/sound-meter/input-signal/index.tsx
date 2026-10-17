import type { MeterCopy } from "../copy.ts";
import { signalBars } from "../readings.ts";
import type { MeterFrame, MeterStatus } from "../types.ts";
import styles from "./index.module.css";

export function InputSignal({
  frame,
  status,
  copy,
}: {
  frame: MeterFrame | null;
  status: MeterStatus;
  copy: MeterCopy;
}) {
  const active = status === "running" || status === "demo";
  const bars = signalBars(active ? (frame?.value ?? null) : null);
  const clipped = active && Boolean(frame?.clipped);
  const label =
    status === "demo"
      ? copy.signalDemo
      : clipped
        ? copy.signalClipped
        : status === "requesting"
          ? copy.signalWaiting
          : active
            ? copy.signalLive
            : copy.signalOff;
  return (
    <span
      className={styles.signal}
      data-clipped={clipped}
      data-demo={status === "demo"}
      role="img"
      aria-label={`${copy.microphoneSignal} · ${label}`}
      title={`${copy.microphoneSignal} · ${label}`}
    >
      <span className={styles.bars} aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} data-on={i < bars} />
        ))}
      </span>
      <span aria-hidden="true">{label}</span>
    </span>
  );
}
