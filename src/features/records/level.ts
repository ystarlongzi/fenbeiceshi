import { soundBands } from "../../lib/content/sound-bands.ts";
import type { ReadingBasis } from "../sound-meter/readings.ts";

export function recordBand(value: number | null, mode: ReadingBasis["mode"], atInputFloor = false) {
  // 历史电平和输入下限都不能用来判断环境声音强弱。
  if (mode === "relative" || atInputFloor || value === null || !Number.isFinite(value)) return null;
  // 与一位小数的读数一致，避免显示 70.0 时标签仍停留在上一档。
  const displayedValue = Number(value.toFixed(1));
  return soundBands.findLast((band) => displayedValue >= band.min) ?? soundBands[0];
}
