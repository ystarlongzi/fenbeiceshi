import assert from "node:assert/strict";
import test from "node:test";
import { durationParts, exposureMinutes, readLevel } from "./model.ts";

test("职业参考接受 85–115 dBA、0.5 步长，拒绝空值、越界及非法数值", () => {
  for (const [raw, level] of [
    ["85", 85],
    [" 100 ", 100],
    ["91.5", 91.5],
    ["115", 115],
  ] as const)
    assert.equal(readLevel(raw), level);
  for (const raw of ["", " ", "0", "84.5", "115.5", "85.1", "NaN", "Infinity", "1e309", "声音"])
    assert.equal(readLevel(raw), null, raw);
});

test("NIOSH 参考点符合 85 dBA 八小时及每 3 dBA 时长减半", () => {
  for (const [level, minutes] of [
    [85, 480],
    [88, 240],
    [91, 120],
    [94, 60],
    [97, 30],
    [100, 15],
    [103, 7.5],
    [115, 0.46875],
  ]) {
    assert.equal(exposureMinutes(level), minutes);
  }
  for (let level = 85; level <= 112; level += 0.5)
    assert.ok(Math.abs(exposureMinutes(level + 3)! - exposureMinutes(level)! / 2) < 1e-9);
  assert.ok(Math.abs(exposureMinutes(85.5)! - 480 / 2 ** (0.5 / 3)) < 1e-9);
});

test("演示范围外和非法输入没有暴露时长结果", () => {
  for (const level of [0, 70, 84.5, 115.5, 120, 85.1, NaN, Infinity, -Infinity])
    assert.equal(exposureMinutes(level), null);
});

test("时长保留不足一分钟的秒数，并向下取整到秒", () => {
  assert.deepEqual(durationParts(480), { hours: 8, minutes: 0, seconds: 0 });
  assert.deepEqual(durationParts(60), { hours: 1, minutes: 0, seconds: 0 });
  assert.deepEqual(durationParts(7.5), { hours: 0, minutes: 7, seconds: 30 });
  assert.deepEqual(durationParts(0.9375), { hours: 0, minutes: 0, seconds: 56 });
  assert.deepEqual(durationParts(0.46875), { hours: 0, minutes: 0, seconds: 28 });
});
