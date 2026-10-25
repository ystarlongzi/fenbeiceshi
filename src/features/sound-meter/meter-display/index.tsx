import type { CSSProperties } from "react";
import { formatReading, NOISE_MAX, NOISE_MIN } from "../readings.ts";
import { noiseStops, readingColor, readingPosition } from "../palette.ts";
import type { MeterCopy } from "../copy.ts";
import type { MeterView } from "../types.ts";
import styles from "./index.module.css";

function point(fraction: number, radius: number) {
  const angle = Math.PI * (1 - fraction);
  return {
    x: Number((240 + radius * Math.cos(angle)).toFixed(2)),
    y: Number((218 - radius * Math.sin(angle)).toFixed(2)),
  };
}

const divisions = 30;
const ticks = Array.from({ length: divisions + 1 }, (_, i) => i / divisions);
const labels = ticks
  .filter((_, i) => i % 5 === 0)
  .map((fraction) => {
    const label = point(fraction, 135);
    return {
      value: Math.round(NOISE_MIN + fraction * (NOISE_MAX - NOISE_MIN)),
      left: `${(label.x / 480) * 100}%`,
      top: `${(label.y / 250) * 100}%`,
    };
  });
const dialStops = noiseStops.map(({ color, position }) => ({
  color,
  // 分贝位置沿半圆按角度分布，SVG 渐变需换算为对应的横坐标。
  offset: `${((1 - Math.cos(Math.PI * position)) / 2) * 100}%`,
}));
const barCount = 40;
const barPositions = Array.from({ length: barCount }, (_, i) => ({
  fraction: i / (barCount - 1),
  backgroundPosition: `${(i / (barCount - 1)) * 100}%`,
}));

export function MeterDisplay({
  value,
  view,
  copy,
  belowFloor = false,
}: {
  value: number | null;
  view: MeterView;
  copy: MeterCopy;
  belowFloor?: boolean;
}) {
  const position = readingPosition(value, belowFloor);
  const numeric = formatReading(value, belowFloor);
  const unit = copy.estimatedUnit;
  return (
    <div className={styles.display} data-view={view} dir="ltr">
      {view === "gauge" ? (
        <div className={styles.dial} aria-hidden="true">
          <svg viewBox="0 0 480 250">
            <defs>
              <linearGradient
                id="dial-color"
                gradientUnits="userSpaceOnUse"
                x1="54"
                y1="218"
                x2="426"
                y2="218"
              >
                {dialStops.map((stop, i) => (
                  <stop key={i} offset={stop.offset} stopColor={stop.color} />
                ))}
              </linearGradient>
            </defs>
            <path
              d="M 54 218 A 186 186 0 0 1 426 218"
              fill="none"
              stroke="url(#dial-color)"
              strokeOpacity="0.45"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <path
              d="M 54 218 A 186 186 0 0 1 426 218"
              fill="none"
              stroke="url(#dial-color)"
              strokeWidth="13"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray={`${position === null ? 0 : position * 100} 100`}
            />
            <circle
              cx="426"
              cy="218"
              r="6.5"
              fill="var(--noise-extreme)"
              opacity={position !== null && position >= 1 ? 1 : 0.45}
            />
            {ticks.map((fraction, i) => {
              const a = point(fraction, 165);
              const b = point(fraction, i % 5 === 0 ? 151 : 158);
              return (
                <g key={i}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={i % 5 === 0 ? "#a5bcb0" : "#526e60"}
                    strokeWidth={i % 5 === 0 ? 2 : 1}
                  />
                </g>
              );
            })}
            <g
              className={styles.needle}
              style={{ transform: `rotate(${position === null ? -90 : -90 + position * 180}deg)` }}
            >
              <path
                d="M 240 73 L 237 218 L 243 218 Z"
                fill={value === null ? "#698578" : "#d7edbd"}
              />
              <circle cx="240" cy="218" r="8" fill="#bdd99c" />
              <circle cx="240" cy="218" r="3" fill="#1c382b" />
            </g>
          </svg>
          {labels.map((label) => (
            <span
              key={label.value}
              className={styles.dialLabel}
              style={{ left: label.left, top: label.top }}
            >
              {label.value}
            </span>
          ))}
        </div>
      ) : view === "bars" ? (
        <div
          className={styles.bars}
          aria-hidden="true"
          style={{ "--bar-count": barCount } as CSSProperties}
        >
          {barPositions.map(({ fraction, backgroundPosition }, i) => (
            <span
              key={i}
              data-on={position !== null && position > 0 && position >= fraction}
              style={{ "--bar-position": backgroundPosition } as CSSProperties}
            />
          ))}
        </div>
      ) : (
        <div className={styles.digitalLines} aria-hidden="true" />
      )}
      <div className={styles.readout}>
        <output
          aria-live="off"
          className={styles.number}
          aria-label={`${copy.noiseLevel}: ${numeric} ${unit}`}
          style={{ "--reading-color": readingColor(value, "display", belowFloor) } as CSSProperties}
        >
          {numeric}
        </output>
        <span className={styles.unit}>{unit}</span>
      </div>
    </div>
  );
}
