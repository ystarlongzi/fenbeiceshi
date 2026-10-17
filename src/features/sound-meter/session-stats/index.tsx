import { Icon, type IconName } from "@/components/icon";
import { averageLevel, formatDuration } from "../level.ts";
import type { MeterCopy } from "../copy.ts";
import type { MeterFrame } from "../types.ts";
import styles from "./index.module.css";

export function SessionStats({
  frame,
  offset,
  copy,
  demo = false,
}: {
  frame: MeterFrame | null;
  offset: number | null;
  copy: MeterCopy;
  demo?: boolean;
}) {
  const average = frame ? averageLevel(frame.stats) : null;
  const format = (value: number | null) =>
    value === null ? "— —" : (value + (offset ?? 0)).toFixed(1).replace("-", "−");
  const items: { label: string; value: string; icon: IconName; tone: string; hint: string }[] = [
    {
      label: copy.minimum,
      value: format(frame ? frame.stats.min : null),
      icon: "arrow-down",
      tone: "blue",
      hint: copy.currentSession,
    },
    {
      label: copy.maximum,
      value: format(frame ? frame.stats.max : null),
      icon: "arrow-up",
      tone: "amber",
      hint: copy.currentSession,
    },
    {
      label: copy.average,
      value: format(average),
      icon: "audio-lines",
      tone: "green",
      hint: copy.sampled,
    },
    {
      label: copy.duration,
      value: frame ? formatDuration(frame.elapsed) : "00:00",
      icon: "timer",
      tone: "neutral",
      hint: demo ? copy.demoShort : copy.elapsedHint,
    },
  ];
  return (
    <div className={styles.stats}>
      {items.map((item, i) => (
        <div className={styles.stat} data-tone={item.tone} key={item.label}>
          <div className={styles.label}>
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
          </div>
          <div className={styles.result}>
            <strong>{item.value}</strong>
            {i < 3 ? <span>{offset === null ? "dBFS" : "dB EST."}</span> : null}
          </div>
          <p>{item.hint}</p>
        </div>
      ))}
    </div>
  );
}
