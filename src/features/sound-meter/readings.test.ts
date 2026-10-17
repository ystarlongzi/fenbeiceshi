import assert from "node:assert/strict";
import test from "node:test";
import { makeCalibration } from "../calibration/calibration.ts";
import { addWindow, analyzeSamples, emptyStats } from "./level.ts";
import {
  currentBasis,
  displayFrame,
  displayLevel,
  displayStats,
  formatReading,
  signalBars,
} from "./readings.ts";

test("采样统一投影为通用估算，原始电平保留供信号和校准使用", () => {
  const samples = analyzeSamples(new Float32Array(32).fill(0.01));
  const frame = {
    value: samples.value,
    elapsed: 1000,
    stats: addWindow(emptyStats(), samples.energy),
    points: [{ time: 1000, value: samples.value }],
    clipped: false,
  };
  const displayed = displayFrame(frame, currentBasis());
  for (const value of [
    displayed.value,
    displayed.minimum,
    displayed.maximum,
    displayed.average,
    displayed.points[0].value,
  ])
    assert.ok(Math.abs((value ?? 0) - 60) < 0.001);
  assert.ok(Math.abs(frame.value + 40) < 0.001);
  assert.equal(frame.points[0].value, frame.value);
  assert.equal(displayed.elapsed, frame.elapsed);
});

test("参考偏移替换通用偏移，清除校准后统一恢复通用估算", () => {
  const calibration = makeCalibration(-40, 75, "Reference meter", "input-a");
  const reference = currentBasis(calibration);
  assert.equal(reference.mode, "reference-estimate");
  assert.equal(displayLevel(-40, reference), 75);
  assert.equal(displayLevel(-40, currentBasis(null)), 60);
});

test("平均值先按采样能量计算再估算，不平均分贝，也不截断超出色带的数值", () => {
  const stats = addWindow(addWindow(emptyStats(), 0.0001), 0.01);
  const displayed = displayStats(stats, currentBasis());
  assert.ok(Math.abs((displayed.average ?? 0) - 77.032914) < 0.0001);
  assert.equal(displayed.minimum, 60);
  assert.equal(displayed.maximum, 80);
  const reference = currentBasis(makeCalibration(-40, 120, "Reference", "input"));
  assert.equal(displayLevel(0, reference), 160);
  assert.throws(() => displayLevel(NaN, reference), RangeError);
});

test("零输入保留下限标记，信号柱不将未采集或无效输入伪装成活动", () => {
  const raw = analyzeSamples(new Float32Array(32));
  const stats = displayStats(addWindow(emptyStats(), raw.energy), currentBasis());
  assert.equal(formatReading(stats.average, stats.averageAtFloor), "≤0.0");
  assert.equal(formatReading(null), "— —");
  assert.equal(displayStats(emptyStats(), currentBasis()).average, null);
  assert.equal(signalBars(null), 0);
  assert.equal(signalBars(NaN), 0);
  assert.equal(signalBars(-100), 0);
  assert.equal(signalBars(-60), 2);
  assert.equal(signalBars(-30), 4);
  assert.equal(signalBars(0), 5);
});
