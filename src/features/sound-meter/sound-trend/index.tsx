import { Icon } from "@/components/icon";
import { scalePosition } from "../level.ts";
import type { MeterCopy } from "../copy.ts";
import type { LevelPoint } from "../types.ts";
import styles from "./index.module.css";

export function SoundTrend({
  points,
  offset,
  copy,
  demo,
}: {
  points: LevelPoint[];
  offset: number | null;
  copy: MeterCopy;
  demo: boolean;
}) {
  const end = points.at(-1)?.time ?? 0;
  const min = offset === null ? -100 : 0;
  const max = offset === null ? 0 : 120;
  const coordinates = points.map((point) => ({
    x: 48 + scalePosition(point.time, end - 60000, end) * 632,
    y: 16 + (1 - scalePosition(point.value + (offset ?? 0), min, max)) * 118,
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
        <span>{demo ? copy.demoShort : copy.recent}</span>
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
          <svg viewBox="0 0 700 166" role="img" aria-label={copy.trend}>
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
              <g key={fraction}>
                <line
                  x1="48"
                  x2="680"
                  y1={16 + fraction * 118}
                  y2={16 + fraction * 118}
                  stroke="var(--line)"
                  strokeDasharray="3 5"
                />
                <text
                  x="35"
                  y={20 + fraction * 118}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--muted)"
                >
                  {Math.round(max - fraction * (max - min))}
                </text>
              </g>
            ))}
            {coordinates.length > 1 ? (
              <>
                <path
                  d={`${path} L${last?.x},134 L${coordinates[0].x},134 Z`}
                  fill="url(#trend-fill)"
                />
                <path
                  d={path}
                  stroke={demo ? "var(--plot-demo)" : "var(--plot-line)"}
                  strokeWidth="2"
                  fill="none"
                  strokeLinejoin="round"
                />
              </>
            ) : null}
            {last ? (
              <circle
                cx={last.x}
                cy={last.y}
                r="3"
                fill={demo ? "var(--plot-demo)" : "var(--plot-line)"}
              />
            ) : null}
            <text x="48" y="157" fontSize="10" fill="var(--muted)">
              −60s
            </text>
            <text x="364" y="157" textAnchor="middle" fontSize="10" fill="var(--muted)">
              −30s
            </text>
            <text x="680" y="157" textAnchor="end" fontSize="10" fill="var(--muted)">
              {copy.now}
            </text>
          </svg>
        )}
      </div>
    </section>
  );
}
