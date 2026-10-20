import { useId } from "react";
import { Icon } from "@/components/icon";
import { scalePosition } from "../level.ts";
import { NOISE_MAX, NOISE_MIN } from "../readings.ts";
import { noiseColors, readingColor } from "../palette.ts";
import type { MeterCopy } from "../copy.ts";
import type { LevelPoint } from "../types.ts";
import styles from "./index.module.css";

const referenceLines = [
  { value: 70, label: "trendWarning", tone: "warning" },
  { value: 85, label: "trendDanger", tone: "danger" },
] as const;
const yAxisTicks = [120, 90, 60, 30, 0] as const;

export function SoundTrend({
  points,
  copy,
  demo,
}: {
  points: LevelPoint[];
  copy: MeterCopy;
  demo: boolean;
}) {
  const gradientId = useId();
  const latest = points.at(-1);
  const end = latest?.time ?? 0;
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
                <linearGradient
                  id={gradientId}
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="118"
                  x2="0"
                  y2="0"
                >
                  {noiseColors.map((color, i) => (
                    <stop
                      key={color}
                      offset={`${(i / (noiseColors.length - 1)) * 100}%`}
                      stopColor={color}
                    />
                  ))}
                </linearGradient>
              </defs>
              {yAxisTicks.map((value) => (
                <line
                  key={value}
                  x1="0"
                  x2="632"
                  y1={(1 - scalePosition(value, min, max)) * 118}
                  y2={(1 - scalePosition(value, min, max)) * 118}
                  stroke="var(--line)"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {coordinates.length > 1 ? (
                <path
                  d={`${path} L${last?.x},118 L${coordinates[0].x},118 Z`}
                  fill={`url(#${gradientId})`}
                  fillOpacity="0.12"
                />
              ) : null}
              {referenceLines.map(({ value, tone }) => {
                const y = (1 - scalePosition(value, min, max)) * 118;
                return (
                  <line
                    key={value}
                    className={styles[tone]}
                    x1="0"
                    x2="632"
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeDasharray="6 4"
                    vectorEffect="non-scaling-stroke"
                    data-reference-level={value}
                  />
                );
              })}
              {coordinates.length > 1 ? (
                <>
                  <path
                    d={path}
                    stroke="var(--ink)"
                    strokeOpacity="0.3"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={path}
                    stroke={`url(#${gradientId})`}
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </>
              ) : null}
            </svg>
            {referenceLines.map(({ value, label, tone }) => (
              <span
                key={value}
                className={`${styles.referenceLabel} ${styles[tone]}`}
                style={{ top: `${(1 - scalePosition(value, min, max)) * 100}%` }}
                data-reference-label={value}
              >
                {copy[label]}
              </span>
            ))}
            <div className={styles.yAxis} aria-hidden="true">
              {yAxisTicks.map((value) => (
                <span key={value} style={{ top: `${(1 - scalePosition(value, min, max)) * 100}%` }}>
                  {value}
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
                style={{
                  left: `${(last.x / 632) * 100}%`,
                  top: `${(last.y / 118) * 100}%`,
                  background: readingColor(latest?.value ?? null),
                }}
              />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
