import { scalePosition } from "./level.ts";
import { NOISE_MAX, NOISE_MIN } from "./readings.ts";

type NoisePalette = readonly [string, string, string, string, string];

export const noiseColors: NoisePalette = [
  "var(--noise-faint)",
  "var(--noise-quiet)",
  "var(--noise-everyday)",
  "var(--noise-loud)",
  "var(--noise-very-loud)",
];

export function readingColor(value: number | null, colors: NoisePalette = noiseColors) {
  if (value === null) return undefined;
  const position = scalePosition(value, NOISE_MIN, NOISE_MAX) * (colors.length - 1);
  const index = Math.min(Math.floor(position), colors.length - 2);
  const mix = (position - index) * 100;
  return `color-mix(in srgb, ${colors[index]}, ${colors[index + 1]} ${mix}%)`;
}
