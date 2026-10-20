export function exposureMinutes(level: number): number | null {
  if (!Number.isFinite(level) || !Number.isInteger(level) || level < 85 || level > 100) return null;
  return 480 * 2 ** ((85 - level) / 3);
}
