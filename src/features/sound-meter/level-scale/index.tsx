import type { MeterCopy } from "../copy.ts";
import { scalePosition } from "../level.ts";
import styles from "./index.module.css";

export function LevelScale({
  value,
  estimated,
  copy,
}: {
  value: number | null;
  estimated: boolean;
  copy: MeterCopy;
}) {
  const min = estimated ? 0 : -100;
  const max = estimated ? 120 : 0;
  const values = estimated ? [0, 30, 60, 90, 120] : [-100, -75, -50, -25, 0];
  const labels = estimated ? copy.estimateScaleLabels : copy.relativeScaleLabels;
  const unit = estimated ? copy.estimateScaleUnit : copy.relativeScaleUnit;
  return (
    <div className={styles.scale} role="group" aria-label={`${copy.scale} · ${unit}`}>
      <div className={styles.ticks}>
        {values.map((tick, i) => (
          <span
            key={tick}
            data-edge={i === 0 ? "start" : i === values.length - 1 ? "end" : undefined}
          >
            <span className={styles.value}>{tick}</span>
            <span className={styles.meaning}>{labels[i]}</span>
          </span>
        ))}
      </div>
      <div className={styles.track} aria-hidden="true">
        <span className={styles.band} />
        {value !== null ? (
          <span
            className={styles.marker}
            style={{ left: `${scalePosition(value, min, max) * 100}%` }}
          />
        ) : null}
      </div>
      <p>
        <span className={styles.unit}>{unit}</span>{" "}
        {estimated ? copy.estimateScaleHint : copy.scaleHint}
      </p>
    </div>
  );
}
