import assert from "node:assert/strict";
import test from "node:test";
import { durationParts, exposureContext, exposureMinutes, readLevel } from "./model.ts";

test("声级输入接受 40–130 dBA、0.5 步长，拒绝空值、越界及非法数值", () => {
  for (const [raw, level] of [
    ["85", 85],
    [" 100 ", 100],
    ["91.5", 91.5],
    ["115", 115],
    ["40", 40],
    ["70", 70],
    ["84.5", 84.5],
    ["115.5", 115.5],
    ["130", 130],
  ] as const)
    assert.equal(readLevel(raw), level);
  for (const raw of [
    "",
    " ",
    "0",
    "39.5",
    "130.5",
    "85.1",
    "NaN",
    "Infinity",
    "1e309",
    "0x50",
    "声音",
  ])
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
    [130, 0.0146484375],
  ]) {
    assert.equal(exposureMinutes(level), minutes);
  }
  for (let level = 40; level <= 127; level += 0.5)
    assert.ok(Math.abs(exposureMinutes(level + 3)! / (exposureMinutes(level)! / 2) - 1) < 1e-12);
  assert.ok(Math.abs(exposureMinutes(85.5)! - 480 / 2 ** (0.5 / 3)) < 1e-9);
});

test("演示范围外和非法输入没有暴露时长结果", () => {
  for (const level of [0, 39.5, 130.5, 85.1, NaN, Infinity, -Infinity])
    assert.equal(exposureMinutes(level), null);
});

test("时长保留不足一分钟的秒数，并向下取整到秒", () => {
  assert.deepEqual(durationParts(480), { comparison: null, hours: 8, minutes: 0, seconds: 0 });
  assert.deepEqual(durationParts(60), { comparison: null, hours: 1, minutes: 0, seconds: 0 });
  assert.deepEqual(durationParts(7.5), { comparison: null, hours: 0, minutes: 7, seconds: 30 });
  assert.deepEqual(durationParts(exposureMinutes(110)!), {
    comparison: null,
    hours: 0,
    minutes: 1,
    seconds: 29,
  });
  assert.deepEqual(durationParts(0.9375), { comparison: null, hours: 0, minutes: 0, seconds: 56 });
  assert.deepEqual(durationParts(0.46875), { comparison: null, hours: 0, minutes: 0, seconds: 28 });
});

test("范围两端不显示巨大时长或零秒，保留超过一天和不足一秒的含义", () => {
  assert.deepEqual(durationParts(exposureMinutes(40)!), {
    comparison: ">",
    hours: 24,
    minutes: 0,
    seconds: 0,
  });
  assert.deepEqual(durationParts(exposureMinutes(130)!), {
    comparison: "<",
    hours: 0,
    minutes: 0,
    seconds: 1,
  });
  assert.deepEqual(durationParts(1440), { comparison: null, hours: 24, minutes: 0, seconds: 0 });
  for (const minutes of [0, -1, NaN, Infinity])
    assert.throws(() => durationParts(minutes), RangeError);
});

test("动态说明在关键声级切换，无效输入不残留上一条建议", () => {
  for (const [level, context] of [
    [40, "lower"],
    [69.5, "lower"],
    [70, "belowReference"],
    [84.5, "belowReference"],
    [85, "reference"],
    [99.5, "reference"],
    [100, "high"],
    [119.5, "high"],
    [120, "extreme"],
    [130, "extreme"],
  ] as const)
    assert.equal(exposureContext(level), context);
  for (const level of [null, NaN, 39.5, 130.5, 85.1])
    assert.equal(exposureContext(level), "invalid");
});
