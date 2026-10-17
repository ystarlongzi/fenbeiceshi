import assert from "node:assert/strict";
import test from "node:test";
import {
  compareRecords,
  getRecords,
  parseRecords,
  publicSummary,
  saveRecord,
  validMeasurement,
} from "./storage.ts";
import type { Measurement } from "../sound-meter/types.ts";

const sample: Measurement = {
  id: "test-observation",
  startedAt: "2026-10-17T00:00:00.000Z",
  duration: 10000,
  stats: { count: 2, energy: 0.0002, min: -40, max: -40 },
  points: [{ time: 1000, value: -40 }],
  input: { label: "Test input", signature: "private-device-id", processing: false },
  calibration: null,
  note: "Window closed",
  reason: "user",
};

test("损坏、错误版本、重复或超量记录不会被当作空历史覆盖", () => {
  assert.equal(parseRecords("not json").error, "corrupt");
  assert.equal(parseRecords('{"version":2,"records":[]}').error, "corrupt");
  assert.equal(
    parseRecords(JSON.stringify({ version: 1, records: [sample, sample] })).error,
    "corrupt",
  );
  assert.equal(
    parseRecords(JSON.stringify({ version: 1, records: Array(31).fill(sample) })).error,
    "corrupt",
  );
  assert.equal(parseRecords(JSON.stringify({ version: 1, records: [sample] })).records.length, 1);
});

test("外部记录拒绝无效数值、过长输入和假冒演示模式", () => {
  assert.equal(validMeasurement({ ...sample, duration: NaN }), false);
  assert.equal(validMeasurement({ ...sample, note: "x".repeat(121) }), false);
  assert.equal(validMeasurement({ ...sample, reason: "demo" }), false);
  assert.equal(validMeasurement({ ...sample, stats: { ...sample.stats, count: 0 } }), false);
});

test("导出移除内部输入标识，保留口径和条件", () => {
  const summary = publicSummary(sample);
  assert.equal(summary.unit, "dBFS RMS");
  assert.equal(summary.energyMean, -40);
  assert.equal(JSON.stringify(summary).includes("private-device-id"), false);
});

test("仅同输入与同校准口径可以比较", () => {
  assert.equal(
    compareRecords(sample, { ...sample, input: { ...sample.input, signature: "other" } }),
    null,
  );
  const louder = { ...sample, stats: { count: 2, energy: 0.002, min: -30, max: -30 } };
  assert.ok(Math.abs((compareRecords(sample, louder) ?? 0) - 10) < 0.001);
});

test("本机存储恢复后可继续保存，配额失败不会覆盖旧记录", () => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  let unavailable = false;
  let full = false;
  let raw: string | null = null;
  const storage = {
    getItem: () => {
      if (unavailable) throw new Error("storage disabled");
      return raw;
    },
    setItem: (_key: string, value: string) => {
      if (full) throw new Error("quota exceeded");
      raw = value;
    },
  };
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: new EventTarget() });
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
    assert.equal(getRecords().error, null);
    unavailable = true;
    assert.equal(getRecords().error, "saveError");
    unavailable = false;
    assert.equal(getRecords().error, null);
    assert.equal(saveRecord(sample), null);
    const saved = raw;
    full = true;
    assert.equal(saveRecord({ ...sample, id: "later" }), "saveError");
    assert.equal(raw, saved);
    assert.equal(getRecords().records.length, 1);
  } finally {
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");
    if (storageDescriptor) Object.defineProperty(globalThis, "localStorage", storageDescriptor);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
