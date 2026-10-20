import { readingBand } from "../../lib/content/sound-bands.ts";
import type { ReadingBasis } from "../sound-meter/readings.ts";

export function recordBand(value: number | null, mode: ReadingBasis["mode"], atInputFloor = false) {
  // 历史相对电平不能用来判断环境声音强弱。
  return mode === "relative" ? null : readingBand(value, atInputFloor);
}
