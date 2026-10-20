import type { MeterCopy } from "../copy.ts";
import { scalePosition } from "../level.ts";
import { readingPosition } from "../palette.ts";
import { NOISE_MAX, NOISE_MIN, NOISE_SCALE_TICKS } from "../readings.ts";
import styles from "./index.module.css";

export function LevelScale({ value, copy }: { value: number | null; copy: MeterCopy }) {
  const min = NOISE_MIN;
  const max = NOISE_MAX;
  const position = readingPosition(value);
  const labels = copy.estimateScaleLabels;
  const unit = copy.estimateScaleUnit;
  return (
    <div className={styles.scale} role="group" aria-label={`${copy.scale} · ${unit}`}>
      <div className={styles.ticks}>
        {NOISE_SCALE_TICKS.map((tick, i) => (
          <span
            key={tick}
            data-edge={i === 0 ? "start" : i === NOISE_SCALE_TICKS.length - 1 ? "end" : undefined}
            style={{ left: `${scalePosition(tick, min, max) * 100}%` }}
          >
            <span className={styles.value}>{tick}</span>
            <span className={styles.meaning}>{labels[i]}</span>
          </span>
        ))}
      </div>
      <div className={styles.track} aria-hidden="true">
        <span className={styles.band} />
        {position !== null ? (
          <span className={styles.marker} style={{ left: `${position * 100}%` }} />
        ) : null}
      </div>
      <p>
        <span className={styles.unit}>{unit}</span> {copy.estimateScaleHint}
      </p>
    </div>
  );
}
