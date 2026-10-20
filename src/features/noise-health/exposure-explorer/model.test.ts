import assert from "node:assert/strict";
import test from "node:test";
import { exposureMinutes, readLevel } from "./model.ts";

test("职业演示输入接受范围内整数，拒绝空值、越界、小数与非有限数", () => {
  assert.equal(readLevel("85", 85, 100), 85);
  assert.equal(readLevel(" 100 ", 85, 100), 100);
  for (const raw of ["", " ", "0", "84", "101", "85.5", "NaN", "Infinity", "1e309", "声音"])
    assert.equal(readLevel(raw, 85, 100), null, raw);
});

test("NIOSH 六个参考点符合 85 dBA 八小时及每 3 dBA 时长减半", () => {
  for (const [level, minutes] of [
    [85, 480],
    [88, 240],
    [91, 120],
    [94, 60],
    [97, 30],
    [100, 15],
  ]) {
    assert.equal(exposureMinutes(level), minutes);
  }
  for (let level = 85; level <= 97; level += 1)
    assert.ok(Math.abs(exposureMinutes(level + 3)! - exposureMinutes(level)! / 2) < 1e-9);
});

test("演示范围外和非法输入没有暴露时长结果", () => {
  for (const level of [0, 70, 84, 101, 120, 85.5, NaN, Infinity, -Infinity])
    assert.equal(exposureMinutes(level), null);
});
