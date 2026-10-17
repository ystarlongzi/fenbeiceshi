import type { CSSProperties } from "react";
import { scalePosition } from "../level.ts";
import { formatReading, NOISE_MAX, NOISE_MIN } from "../readings.ts";
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
  const min = NOISE_MIN;
  const max = NOISE_MAX;
  const position = value === null ? null : scalePosition(value, min, max);
  const divisions = 30;
  const ticks = Array.from({ length: divisions + 1 }, (_, i) => i / divisions);
  const numeric = formatReading(value, belowFloor);
  const unit = copy.estimatedUnit;
  return (
    <div className={styles.display} data-view={view}>
      {view === "gauge" ? (
        <svg className={styles.dial} viewBox="0 0 480 250" aria-hidden="true">
          <defs>
            <linearGradient id="dial-color">
              <stop offset="0%" stopColor="#68a88e" />
              <stop offset="65%" stopColor="#d1ef9b" />
              <stop offset="100%" stopColor="#e5ad70" />
            </linearGradient>
          </defs>
          <path
            d="M 54 218 A 186 186 0 0 1 426 218"
            fill="none"
            stroke="#345046"
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
          {ticks.map((fraction, i) => {
            const a = point(fraction, 165);
            const b = point(fraction, i % 5 === 0 ? 151 : 158);
            const label = point(fraction, 135);
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
                {i % 5 === 0 ? (
                  <text
                    x={label.x}
                    y={label.y + 4}
                    textAnchor="middle"
                    fill="#b4c8be"
                    fontSize="11"
                  >
                    {Math.round(min + fraction * (max - min))}
                  </text>
                ) : null}
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
      ) : view === "bars" ? (
        <div className={styles.bars} aria-hidden="true">
          {Array.from({ length: 40 }, (_, i) => (
            <span
              key={i}
              data-on={position !== null && i < Math.ceil(position * 40)}
              style={
                {
                  "--bar-color": i > 34 ? "#e5ad70" : i > 24 ? "#d1ef9b" : "#86c9a4",
                } as CSSProperties
              }
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
        >
          {numeric}
        </output>
        <span className={styles.unit}>{unit}</span>
      </div>
    </div>
  );
}
