import { readingBand, soundBands } from "../../lib/content/sound-bands.ts";
import { scalePosition } from "./level.ts";
import { NOISE_MAX, NOISE_MIN } from "./readings.ts";

export const noiseStops = soundBands.flatMap((band) =>
  [band.min, band.max].map((value) => ({
    position: scalePosition(value, NOISE_MIN, NOISE_MAX),
    color: `var(--noise-${band.tone})`,
    ink: `var(--noise-${band.tone}-ink)`,
  })),
);

// 相邻分段共享边界；120+ 只有终点，不人为分配超出量程的色带宽度。
export const noiseGradient = `linear-gradient(90deg, ${noiseStops
  .map((stop) => `${stop.color} ${stop.position * 100}%`)
  .join(", ")})`;

export function readingColor(
  value: number | null,
  role: "display" | "ink" = "display",
  atInputFloor = false,
) {
  const band = readingBand(value, atInputFloor);
  return band ? `var(--noise-${band.tone}${role === "ink" ? "-ink" : ""})` : undefined;
}

export function readingPosition(value: number | null, atInputFloor = false) {
  if (value === null || !readingBand(value, atInputFloor)) return null;
  return scalePosition(Number(value.toFixed(1)), NOISE_MIN, NOISE_MAX);
}
