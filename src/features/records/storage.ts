import type { Calibration, Measurement } from "../sound-meter/types.ts";
import { averageLevel } from "../sound-meter/level.ts";

export const RECORD_KEY = "fenbeiceshi:records:v1";
const MAX_RECORDS = 30;
export type RecordError = "saveError" | "corrupt" | null;
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
      data.version !== 1 ||
      !Array.isArray(data.records) ||
      data.records.length > MAX_RECORDS ||
      !data.records.every(validMeasurement)
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

function writeRecords(records: Measurement[]): RecordError {
  try {
    const raw = JSON.stringify({ version: 1, records });
    if (raw.length > 1000000) return "saveError";
    localStorage.setItem(RECORD_KEY, raw);
    window.dispatchEvent(new Event("fenbei-records"));
    return null;
  } catch {
    return "saveError";
  }
}

export function saveRecord(record: Measurement): RecordError {
  if (!validMeasurement(record)) return "saveError";
  const state = getRecords();
  if (state.error) return state.error;
  return writeRecords(
    [record, ...state.records.filter((item) => item.id !== record.id)].slice(0, MAX_RECORDS),
  );
}

export function deleteRecord(id: string): RecordError {
  const state = getRecords();
  if (state.error) return state.error;
  return writeRecords(state.records.filter((item) => item.id !== id));
}

export function compareRecords(a: Measurement, b: Measurement): number | null {
  if (
    a.input.signature !== b.input.signature ||
    (a.calibration?.offset ?? null) !== (b.calibration?.offset ?? null)
  )
    return null;
  const aMean = averageLevel(a.stats);
  const bMean = averageLevel(b.stats);
  return aMean !== null && bMean !== null ? bMean - aMean : null;
}

export function publicSummary(record: Measurement) {
  const offset = record.calibration?.offset ?? 0;
  return {
    format: "fenbeiceshi-summary-v1",
    startedAt: record.startedAt,
    durationMs: Math.round(record.duration),
    mode: record.calibration ? "reference-estimate" : "relative",
    unit: record.calibration ? "estimated dB SPL" : "dBFS RMS",
    minimum: record.stats.min + offset,
    maximum: record.stats.max + offset,
    energyMean: (averageLevel(record.stats) ?? -100) + offset,
    sampledWindows: record.stats.count,
    displayFloorDbfs: -100,
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
      level: point.value + offset,
    })),
    notice:
      "Sampled browser observation. No A weighting, certification, safety or compliance conclusion. No audio included.",
  };
}

export function downloadSummary(record: Measurement) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(publicSummary(record), null, 2)], { type: "application/json" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `fenbeiceshi-${record.startedAt.replace(/[:.]/g, "-")}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
