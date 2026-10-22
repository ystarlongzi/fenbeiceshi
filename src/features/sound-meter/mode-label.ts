import type { MeterCopy } from "./copy.ts";
import { DEFAULT_ESTIMATE, formatReading, type ReadingBasis } from "./readings.ts";

export function modeLabel(basis: ReadingBasis, copy: MeterCopy): string {
  if (basis.mode === "manual-estimate") {
    const adjustment = basis.offset - DEFAULT_ESTIMATE.offset;
    return `${copy.adjusted} · ${adjustment > 0 ? "+" : ""}${formatReading(adjustment)} dB`;
  }
  if (basis.mode === "reference-estimate") return copy.estimate;
  if (basis.mode === "relative") return copy.relative;
  return copy.generic;
}
