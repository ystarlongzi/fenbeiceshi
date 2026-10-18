export interface ExplorerBand {
  range: string;
  title: string;
  tone: string;
  min: number;
  max: number;
  examples: string;
}

export type SoundSelection = { kind: "band"; tone: string } | { kind: "value"; raw: string };

export function readLevel(raw: string, min: number, max: number): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && Number.isInteger(value) && value >= min && value <= max
    ? value
    : null;
}

export function bandAtLevel(bands: readonly ExplorerBand[], value: number) {
  return bands.find(
    (band, index) =>
      value >= band.min && (value < band.max || (index === bands.length - 1 && value === band.max)),
  );
}
