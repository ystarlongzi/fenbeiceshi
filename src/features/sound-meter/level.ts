import type { LevelStats } from "./types.ts";

export const DISPLAY_FLOOR = -100;

export function analyzeSamples(samples: Float32Array) {
  if (!samples.length) throw new RangeError("音频采样窗口为空。");
  let energy = 0;
  let peak = 0;
  for (const sample of samples) {
    if (!Number.isFinite(sample)) throw new RangeError("音频窗口包含无效采样。");
    energy += sample * sample;
    peak = Math.max(peak, Math.abs(sample));
  }
  const meanEnergy = energy / samples.length;
  return { energy: meanEnergy, value: energyToDb(meanEnergy), clipped: peak >= 0.999 };
}

export function energyToDb(energy: number): number {
  if (!Number.isFinite(energy) || energy < 0) throw new RangeError("能量值必须是有限非负数。");
  return Math.max(DISPLAY_FLOOR, energy === 0 ? DISPLAY_FLOOR : 10 * Math.log10(energy));
}

export function emptyStats(): LevelStats {
  return { count: 0, energy: 0, min: DISPLAY_FLOOR, max: DISPLAY_FLOOR };
}

export function addWindow(stats: LevelStats, energy: number): LevelStats {
  const value = energyToDb(energy);
  return {
    count: stats.count + 1,
    energy: stats.energy + energy,
    min: stats.count ? Math.min(stats.min, value) : value,
    max: stats.count ? Math.max(stats.max, value) : value,
  };
}

export function averageLevel(stats: LevelStats): number | null {
  return stats.count ? energyToDb(stats.energy / stats.count) : null;
}

export function scalePosition(value: number, min: number, max: number): number {
  if (![value, min, max].every(Number.isFinite) || max <= min) return 0;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
