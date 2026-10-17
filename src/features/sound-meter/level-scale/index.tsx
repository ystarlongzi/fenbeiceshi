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
  return (
    <div className={styles.scale} aria-label={copy.scale}>
      <div className={styles.ticks} aria-hidden="true">
        {values.map((tick, i) => (
          <span
            key={tick}
            style={{ left: `${scalePosition(tick, min, max) * 100}%` }}
            data-edge={i === 0 ? "start" : i === values.length - 1 ? "end" : undefined}
          >
            {tick}
          </span>
        ))}
      </div>
      <div className={styles.track}>
        <span className={styles.band} />
        {value !== null ? (
          <span
            className={styles.marker}
            style={{ left: `${scalePosition(value, min, max) * 100}%` }}
          />
        ) : null}
      </div>
      <div className={styles.labels}>
        <span>{copy.lower}</span>
        <span>{copy.higher}</span>
      </div>
      <p>{estimated ? copy.estimateScaleHint : copy.scaleHint}</p>
    </div>
  );
}
