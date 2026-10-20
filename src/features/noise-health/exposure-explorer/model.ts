export function readLevel(raw: string, min: number, max: number): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && Number.isInteger(value) && value >= min && value <= max
    ? value
    : null;
}

export function exposureMinutes(level: number): number | null {
  if (!Number.isFinite(level) || !Number.isInteger(level) || level < 85 || level > 100) return null;
  return 480 * 2 ** ((85 - level) / 3);
}
