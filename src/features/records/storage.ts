import type { Calibration, Measurement } from "../sound-meter/types.ts";
import { validRecordingInfo } from "../audio-recording/pcm.ts";
import { DISPLAY_FLOOR } from "../sound-meter/level.ts";
import { validAdjustment } from "../calibration/adjustment.ts";
import {
  DEFAULT_ESTIMATE,
  displayLevel,
  displayStats,
  measurementBasis,
} from "../sound-meter/readings.ts";

export const RECORD_KEY = "fenbeiceshi:records:v1";
export const MAX_RECORDS = 30;
export type RecordError =
  "saveError" | "corrupt" | "audioUnavailable" | "audioFull" | "audioQuota" | "audioCorrupt" | null;
export interface RecordState {
  records: Measurement[];
  error: RecordError;
}
export const EMPTY_RECORDS: RecordState = { records: [], error: null };

function finite(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function text(value: unknown, max: number): value is string {
  return typeof value === "string" && value.length <= max;
}

function validReference(value: unknown): value is Calibration {
  if (!value || typeof value !== "object") return false;
  const c = value as Calibration;
  return (
    finite(c.offset, 0, 220) &&
    finite(c.reference, 20, 120) &&
    text(c.source, 120) &&
    text(c.signature, 1000) &&
    text(c.createdAt, 40) &&
    Number.isFinite(Date.parse(c.createdAt))
  );
}

export function validMeasurement(value: unknown): value is Measurement {
  if (!value || typeof value !== "object") return false;
  const r = value as Measurement;
  return (
    text(r.id, 100) &&
    r.id.length > 0 &&
    text(r.startedAt, 40) &&
    Number.isFinite(Date.parse(r.startedAt)) &&
    finite(r.duration, 1, 86400000) &&
    text(r.note, 120) &&
    Boolean(r.input) &&
    text(r.input.label, 200) &&
    text(r.input.signature, 1000) &&
    typeof r.input.processing === "boolean" &&
    (r.recording === undefined || validRecordingInfo(r.recording)) &&
    (r.estimate === undefined ||
      (r.estimate !== null &&
        r.estimate.id === DEFAULT_ESTIMATE.id &&
        r.estimate.offset === DEFAULT_ESTIMATE.offset)) &&
    (r.adjustment === undefined ||
      (validAdjustment(r.adjustment) && r.estimate !== undefined && r.calibration === null)) &&
    (r.calibration === null ||
      (validReference(r.calibration) && r.calibration.signature === r.input.signature)) &&
    Boolean(r.stats) &&
    Number.isSafeInteger(r.stats.count) &&
    r.stats.count > 0 &&
    finite(r.stats.energy, 0, 1e12) &&
    finite(r.stats.min, -100, 24) &&
    finite(r.stats.max, r.stats.min, 24) &&
    ["user", "hidden", "device-ended"].includes(r.reason) &&
    Array.isArray(r.points) &&
    r.points.length <= 600 &&
    r.points.every((p) => p && finite(p.time, 0, r.duration + 1000) && finite(p.value, -100, 24))
  );
}

export function parseRecords(raw: string | null): RecordState {
  if (!raw) return EMPTY_RECORDS;
  if (raw.length > 1000000) return { records: [], error: "corrupt" };
  try {
    const data = JSON.parse(raw);
    if (
      ![1, 2, 3].includes(data.version) ||
      !Array.isArray(data.records) ||
      data.records.length > MAX_RECORDS ||
      !data.records.every(validMeasurement) ||
      (data.version < 3 && data.records.some((r: Measurement) => r.adjustment !== undefined)) ||
      (data.version === 1 &&
        data.records.some(
          (r: Measurement) => r.estimate !== undefined || r.recording !== undefined,
        ))
    )
      return { records: [], error: "corrupt" };
    if (new Set(data.records.map((r: Measurement) => r.id)).size !== data.records.length)
      return { records: [], error: "corrupt" };
    return { records: data.records, error: null };
  } catch {
    return { records: [], error: "corrupt" };
  }
}

let cachedRaw: string | null | undefined;
let cachedState: RecordState = EMPTY_RECORDS;

export function getRecords(): RecordState {
  if (typeof window === "undefined") return EMPTY_RECORDS;
  try {
    const raw = localStorage.getItem(RECORD_KEY);
    if (raw !== cachedRaw || cachedState.error === "saveError") {
      cachedRaw = raw;
      cachedState = parseRecords(raw);
    }
    return cachedState;
  } catch {
    if (cachedState.error !== "saveError") cachedState = { records: [], error: "saveError" };
    return cachedState;
  }
}

export function watchRecords(listener: () => void) {
  const external = (event: StorageEvent) => {
    if (event.key === RECORD_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", external);
  window.addEventListener("fenbei-records", listener);
  return () => {
    window.removeEventListener("storage", external);
    window.removeEventListener("fenbei-records", listener);
  };
}

export function compareRecords(a: Measurement, b: Measurement): number | null {
  const aBasis = measurementBasis(a);
  const bBasis = measurementBasis(b);
  if (
    a.input.signature !== b.input.signature ||
    aBasis.model !== bBasis.model ||
    aBasis.offset !== bBasis.offset
  )
    return null;
  const aMean = displayStats(a.stats, aBasis).average;
  const bMean = displayStats(b.stats, bBasis).average;
  return aMean !== null && bMean !== null ? bMean - aMean : null;
}

export function publicSummary(record: Measurement) {
  if (!validMeasurement(record)) throw new RangeError("无法导出无效的观察记录。");
  const basis = measurementBasis(record);
  const stats = displayStats(record.stats, basis);
  return {
    format: "fenbeiceshi-summary-v3",
    startedAt: record.startedAt,
    durationMs: Math.round(record.duration),
    mode: basis.mode,
    unit: basis.mode === "relative" ? "dBFS RMS" : "estimated dB",
    model: { id: basis.model, offsetDb: basis.offset },
    adjustment: record.adjustment
      ? { id: record.adjustment.id, offsetDb: record.adjustment.offset }
      : null,
    minimum: stats.minimum,
    maximum: stats.maximum,
    energyMean: stats.average,
    limits: {
      minimumAtInputFloor: stats.minimumAtFloor,
      maximumAtInputFloor: stats.maximumAtFloor,
      meanAtInputFloor: stats.averageAtFloor,
    },
    sampledWindows: record.stats.count,
    displayFloorDbfs: DISPLAY_FLOOR,
    inputLabel: record.input.label,
    conditions: record.note,
    endReason: record.reason,
    reference: record.calibration
      ? {
          value: record.calibration.reference,
          source: record.calibration.source,
          createdAt: record.calibration.createdAt,
        }
      : null,
    recentTrend: record.points.map((point) => ({
      timeMs: Math.round(point.time),
      level: displayLevel(point.value, basis),
      atInputFloor: point.value <= DISPLAY_FLOOR,
    })),
    notice:
      basis.mode === "generic-estimate" || basis.mode === "manual-estimate"
        ? "Uncalibrated generic RMS + 100 estimate with optional manual adjustment; heuristic mapping, not validated acoustic accuracy. No A weighting, safety or compliance conclusion. No audio included."
        : "Sampled browser observation. No A weighting, certification, safety or compliance conclusion. No audio included.",
  };
}
