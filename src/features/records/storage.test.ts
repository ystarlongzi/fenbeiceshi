import assert from "node:assert/strict";
import test from "node:test";
import {
  compareRecords,
  getRecords,
  parseRecords,
  publicSummary,
  validMeasurement,
} from "./storage.ts";
import { saveRecord } from "./mutations.ts";
import type { Measurement } from "../sound-meter/types.ts";
import { DEFAULT_ESTIMATE } from "../sound-meter/readings.ts";
import { makeCalibration } from "../calibration/calibration.ts";

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
  assert.equal(parseRecords('{"version":4,"records":[]}').error, "corrupt");
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

test("新估算模型随记录和导出保留，旧记录继续使用原口径", () => {
  const generic = { ...sample, estimate: DEFAULT_ESTIMATE };
  const parsed = parseRecords(
    JSON.stringify({ version: 2, records: [sample, { ...generic, id: "new" }] }),
  );
  assert.equal(parsed.error, null);
  assert.equal(publicSummary(parsed.records[0]).unit, "dBFS RMS");
  const summary = publicSummary(parsed.records[1]);
  assert.equal(summary.format, "fenbeiceshi-summary-v3");
  assert.equal(summary.mode, "generic-estimate");
  assert.equal(summary.unit, "estimated dB");
  assert.equal(summary.model.id, DEFAULT_ESTIMATE.id);
  assert.equal(summary.energyMean, 60);
  assert.equal(summary.minimum, 60);
  assert.equal(summary.maximum, 60);
  assert.equal(summary.recentTrend[0].level, 60);
  assert.equal(summary.recentTrend[0].atInputFloor, false);
  const floorSummary = publicSummary({
    ...generic,
    stats: { count: 1, energy: 0, min: -100, max: -100 },
    points: [{ time: 1000, value: -100 }],
  });
  assert.equal(floorSummary.energyMean, 0);
  assert.equal(floorSummary.limits.meanAtInputFloor, true);
  assert.equal(floorSummary.recentTrend[0].atInputFloor, true);
  assert.equal(compareRecords(sample, generic), null);
  assert.equal(
    compareRecords(generic, { ...generic, stats: { count: 2, energy: 0.002, min: -30, max: -30 } }),
    10,
  );
  const reference = {
    ...generic,
    calibration: makeCalibration(-40, 75, "Reference", sample.input.signature),
  };
  assert.equal(publicSummary(reference).energyMean, 75);
  assert.equal(publicSummary(reference).recentTrend[0].level, 75);
  assert.equal(compareRecords(generic, reference), null);
  assert.equal(compareRecords({ ...sample, calibration: reference.calibration }, reference), 0);
  assert.equal(JSON.stringify(publicSummary(reference)).includes(sample.input.signature), false);
  assert.equal(validMeasurement({ ...generic, estimate: { id: "unknown", offset: 100 } }), false);
  assert.equal(
    validMeasurement({ ...generic, estimate: { id: DEFAULT_ESTIMATE.id, offset: 101 } }),
    false,
  );
  assert.equal(parseRecords(JSON.stringify({ version: 1, records: [generic] })).error, "corrupt");
});

test("旧记录升级与存储恢复可继续保存，配额失败不覆盖已有数据", async (t) => {
  t.mock.method(console, "error", () => {});
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  let unavailable = false;
  let full = false;
  let raw: string | null = JSON.stringify({ version: 1, records: [sample] });
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
    assert.equal(JSON.parse(raw).version, 1);
    assert.equal(getRecords().records[0].estimate, undefined);
    unavailable = true;
    assert.equal(getRecords().error, "saveError");
    unavailable = false;
    assert.equal(getRecords().error, null);
    assert.equal(await saveRecord(sample), null);
    assert.equal(JSON.parse(raw ?? "{}").version, 3);
    assert.equal(await saveRecord({ ...sample, id: "generic", estimate: DEFAULT_ESTIMATE }), null);
    assert.equal(getRecords().records[1].estimate, undefined);
    const saved = raw;
    full = true;
    assert.equal(await saveRecord({ ...sample, id: "later" }), "saveError");
    assert.equal(raw, saved);
    assert.equal(getRecords().records.length, 2);
  } finally {
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");
    if (storageDescriptor) Object.defineProperty(globalThis, "localStorage", storageDescriptor);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});

test("手动修正随 v3 保存并导出，历史口径与不同修正值不能混比", () => {
  const generic = { ...sample, estimate: DEFAULT_ESTIMATE };
  const adjusted: Measurement = {
    ...generic,
    adjustment: { id: "manual-offset-v1", offset: 5 },
  };
  const loaded = parseRecords(JSON.stringify({ version: 3, records: [adjusted] }));
  assert.equal(loaded.error, null);
  const summary = publicSummary(loaded.records[0]);
  assert.equal(summary.mode, "manual-estimate");
  assert.equal(summary.model.id, "manual-offset-v1");
  assert.equal(summary.model.offsetDb, 105);
  assert.equal(summary.adjustment?.offsetDb, 5);
  assert.equal(summary.energyMean, 65);
  assert.equal(summary.minimum, 65);
  assert.equal(summary.maximum, 65);
  assert.equal(summary.recentTrend[0].level, 65);
  assert.equal(summary.reference, null);
  assert.equal(compareRecords(generic, adjusted), null);
  assert.equal(
    compareRecords(adjusted, { ...adjusted, adjustment: { id: "manual-offset-v1", offset: -5 } }),
    null,
  );
  assert.equal(
    compareRecords(adjusted, {
      ...adjusted,
      stats: { count: 2, energy: 0.002, min: -30, max: -30 },
    }),
    10,
  );
  for (const version of [1, 2])
    assert.equal(parseRecords(JSON.stringify({ version, records: [adjusted] })).error, "corrupt");
  for (const adjustment of [
    { id: "unknown", offset: 5 },
    { id: "manual-offset-v1", offset: 50.1 },
    { id: "manual-offset-v1", offset: 0.05 },
    null,
  ])
    assert.equal(validMeasurement({ ...adjusted, adjustment }), false);
  assert.equal(validMeasurement({ ...adjusted, estimate: undefined }), false);
  assert.equal(
    validMeasurement({
      ...adjusted,
      calibration: makeCalibration(-40, 75, "Reference", sample.input.signature),
    }),
    false,
  );
});

test("修正范围扩大后，旧边界和正负 50 dB 均能保存、读取并导出同一口径", () => {
  for (const offset of [-50, -31, -30, 30, 31, 50]) {
    const adjusted: Measurement = {
      ...sample,
      estimate: DEFAULT_ESTIMATE,
      adjustment: { id: "manual-offset-v1", offset },
    };
    const loaded = parseRecords(JSON.stringify({ version: 3, records: [adjusted] }));
    assert.equal(loaded.error, null);
    assert.equal(loaded.records[0].adjustment?.offset, offset);
    const summary = publicSummary(loaded.records[0]);
    assert.equal(summary.model.offsetDb, 100 + offset);
    assert.equal(summary.adjustment?.offsetDb, offset);
    assert.equal(summary.energyMean, 60 + offset);
    assert.equal(summary.recentTrend[0].level, 60 + offset);
  }
});
