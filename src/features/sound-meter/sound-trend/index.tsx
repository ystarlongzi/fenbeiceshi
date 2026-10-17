import { Icon } from "@/components/icon";
import { scalePosition } from "../level.ts";
import { NOISE_MAX, NOISE_MIN } from "../readings.ts";
import type { MeterCopy } from "../copy.ts";
import type { LevelPoint } from "../types.ts";
import styles from "./index.module.css";

export function SoundTrend({
  points,
  copy,
  demo,
}: {
  points: LevelPoint[];
  copy: MeterCopy;
  demo: boolean;
}) {
  const end = points.at(-1)?.time ?? 0;
  const min = NOISE_MIN;
  const max = NOISE_MAX;
  const coordinates = points.map((point) => ({
    x: scalePosition(point.time, end - 60000, end) * 632,
    y: (1 - scalePosition(point.value, min, max)) * 118,
  }));
  const path = coordinates
    .map((point, i) => `${i ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");
  const last = coordinates.at(-1);
  return (
    <section className={styles.trend}>
      <div className={styles.heading}>
        <div>
          <h3>
            <Icon name="chart-line" size={17} />
            {copy.trend}
          </h3>
          <p>{copy.trendHint}</p>
        </div>
        <span>
          {demo ? copy.demoShort : copy.recent} · {copy.estimatedUnit}
        </span>
      </div>
      <div className={styles.chart}>
        {!points.length ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <Icon name="chart-line" size={21} />
            </span>
            <div className={styles.emptyText}>
              <strong>{copy.trendEmptyTitle}</strong>
              <p>{copy.trendEmpty}</p>
            </div>
          </div>
        ) : (
          <div className={styles.plot} data-demo={demo}>
            <svg
              viewBox="0 0 632 118"
              preserveAspectRatio="none"
              role="img"
              aria-label={`${copy.trend} · ${copy.estimatedUnit}`}
            >
              <defs>
                <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={demo ? "var(--plot-demo)" : "var(--plot-line)"}
                    stopOpacity="0.2"
                  />
                  <stop offset="100%" stopColor="var(--plot-line)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 0.5, 1].map((fraction) => (
                <line
                  key={fraction}
                  x1="0"
                  x2="632"
                  y1={fraction * 118}
                  y2={fraction * 118}
                  stroke="var(--line)"
                  strokeDasharray="3 5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {coordinates.length > 1 ? (
                <>
                  <path
                    d={`${path} L${last?.x},118 L${coordinates[0].x},118 Z`}
                    fill="url(#trend-fill)"
                  />
                  <path
                    d={path}
                    stroke={demo ? "var(--plot-demo)" : "var(--plot-line)"}
                    strokeWidth="2"
                    fill="none"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </>
              ) : null}
            </svg>
            <div className={styles.yAxis} aria-hidden="true">
              {[0, 0.5, 1].map((fraction) => (
                <span key={fraction} style={{ top: `${fraction * 100}%` }}>
                  {Math.round(max - fraction * (max - min))}
                </span>
              ))}
            </div>
            <div className={styles.xAxis} aria-hidden="true">
              <span>−60s</span>
              <span>−30s</span>
              <span>{copy.now}</span>
            </div>
            {last ? (
              <span
                className={styles.endpoint}
                aria-hidden="true"
                style={{ left: `${(last.x / 632) * 100}%`, top: `${(last.y / 118) * 100}%` }}
              />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
