import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/components/icon";
import { formatDuration } from "../level.ts";
import { formatReading, type NoiseFrame } from "../readings.ts";
import { readingColor } from "../palette.ts";
import type { MeterCopy } from "../copy.ts";
import styles from "./index.module.css";

export function SessionStats({
  frame,
  copy,
  demo = false,
}: {
  frame: NoiseFrame | null;
  copy: MeterCopy;
  demo?: boolean;
}) {
  const items: {
    label: string;
    value: string;
    icon: IconName;
    color?: string;
    numberColor?: string;
    hint: string;
  }[] = [
    {
      label: copy.minimum,
      value: formatReading(frame?.minimum ?? null, frame?.minimumAtFloor),
      icon: "arrow-down",
      color: readingColor(frame?.minimum ?? null, "display", frame?.minimumAtFloor),
      numberColor: readingColor(frame?.minimum ?? null, "ink", frame?.minimumAtFloor),
      hint: copy.currentSession,
    },
    {
      label: copy.maximum,
      value: formatReading(frame?.maximum ?? null, frame?.maximumAtFloor),
      icon: "arrow-up",
      color: readingColor(frame?.maximum ?? null, "display", frame?.maximumAtFloor),
      numberColor: readingColor(frame?.maximum ?? null, "ink", frame?.maximumAtFloor),
      hint: copy.currentSession,
    },
    {
      label: copy.average,
      value: formatReading(frame?.average ?? null, frame?.averageAtFloor),
      icon: "audio-lines",
      color: readingColor(frame?.average ?? null, "display", frame?.averageAtFloor),
      numberColor: readingColor(frame?.average ?? null, "ink", frame?.averageAtFloor),
      hint: copy.sampled,
    },
    {
      label: copy.duration,
      value: frame ? formatDuration(frame.elapsed) : "00:00",
      icon: "timer",
      hint: demo ? copy.demoShort : copy.elapsedHint,
    },
  ];
  return (
    <div className={styles.stats}>
      {items.map((item, i) => {
        const isReading = i < 3;
        const waiting = isReading && frame?.minimum == null;
        return (
          <div
            className={isReading ? `${styles.stat} ${styles.reading}` : styles.stat}
            style={
              { "--stat-color": item.color, "--stat-number": item.numberColor } as CSSProperties
            }
            key={item.label}
          >
            <div className={styles.label}>
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </div>
            <div className={styles.result}>
              <strong>{item.value}</strong>
              {isReading ? <span>dB</span> : null}
            </div>
            <p className={waiting ? styles.waiting : undefined}>
              {waiting ? copy.statsWaiting : item.hint}
            </p>
          </div>
        );
      })}
    </div>
  );
}
