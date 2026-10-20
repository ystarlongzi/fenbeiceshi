import assert from "node:assert/strict";
import test from "node:test";
import { exposureMinutes } from "./model.ts";

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
