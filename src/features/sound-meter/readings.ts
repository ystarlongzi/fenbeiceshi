import { averageLevel, DISPLAY_FLOOR, scalePosition } from "./level.ts";
import type { Calibration, EstimateModel, LevelStats, Measurement, MeterFrame } from "./types.ts";

// 通用偏移是产品估算假设，不能当作设备校准或经过实测的准确度保证。
export const DEFAULT_ESTIMATE: Readonly<EstimateModel> = Object.freeze({
  id: "generic-rms-v1",
  offset: 100,
});
export const NOISE_MIN = 0;
export const NOISE_MAX = 120;

export interface ReadingBasis {
  mode: "generic-estimate" | "reference-estimate" | "relative";
  model: "generic-rms-v1" | "reference-offset-v1" | "relative-rms-v1";
  offset: number;
}

export function measurementBasis(
  record: Pick<Measurement, "calibration" | "estimate">,
): ReadingBasis {
  if (record.calibration)
    return {
      mode: "reference-estimate",
      model: "reference-offset-v1",
      offset: record.calibration.offset,
    };
  if (record.estimate)
    return { mode: "generic-estimate", model: record.estimate.id, offset: record.estimate.offset };
  // 已保存的旧记录缺少模型信息，必须保留原来的相对口径。
  return { mode: "relative", model: "relative-rms-v1", offset: 0 };
}

export function currentBasis(calibration: Calibration | null = null): ReadingBasis {
  return measurementBasis({ calibration, estimate: DEFAULT_ESTIMATE });
}

export function displayLevel(raw: number, basis: ReadingBasis): number {
  if (!Number.isFinite(raw) || !Number.isFinite(basis.offset))
    throw new RangeError("读数与估算偏移必须是有限数值。");
  return raw + basis.offset;
}

export function displayStats(stats: LevelStats, basis: ReadingBasis) {
  const mean = averageLevel(stats);
  return {
    minimum: stats.count ? displayLevel(stats.min, basis) : null,
    maximum: stats.count ? displayLevel(stats.max, basis) : null,
    average: mean === null ? null : displayLevel(mean, basis),
    minimumAtFloor: Boolean(stats.count && stats.min <= DISPLAY_FLOOR),
    maximumAtFloor: Boolean(stats.count && stats.max <= DISPLAY_FLOOR),
    averageAtFloor: mean !== null && mean <= DISPLAY_FLOOR,
  };
}

export function displayFrame(frame: MeterFrame, basis: ReadingBasis) {
  return {
    ...displayStats(frame.stats, basis),
    value: displayLevel(frame.value, basis),
    belowFloor: frame.value <= DISPLAY_FLOOR,
    elapsed: frame.elapsed,
    clipped: frame.clipped,
    points: frame.points.map((point) => ({ ...point, value: displayLevel(point.value, basis) })),
  };
}

export type NoiseFrame = ReturnType<typeof displayFrame>;

export function formatReading(value: number | null, atFloor = false): string {
  if (value === null) return "— —";
  return `${atFloor ? "≤" : ""}${value.toFixed(1).replace("-", "−")}`;
}

export function signalBars(raw: number | null): number {
  if (raw === null || !Number.isFinite(raw) || raw <= DISPLAY_FLOOR) return 0;
  return Math.ceil(scalePosition(raw, -90, 0) * 5);
}
