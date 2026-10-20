import assert from "node:assert/strict";
import test from "node:test";
import { recordBand } from "../records/level.ts";
import { noiseGradient, noiseStops, readingColor, readingPosition } from "./palette.ts";

test("仪表、正文数字和记录标签按同一显示值归入七档", () => {
  const cases = [
    [0, "faint"],
    [29.9, "faint"],
    [29.99, "quiet"],
    [30, "quiet"],
    [49.9, "quiet"],
    [49.99, "everyday"],
    [50, "everyday"],
    [69.9, "everyday"],
    [69.99, "raised"],
    [70, "raised"],
    [84.99, "loud"],
    [85, "loud"],
    [99.99, "intense"],
    [100, "intense"],
    [119.9, "intense"],
    [119.99, "extreme"],
    [120, "extreme"],
  ] as const;
  for (const [value, tone] of cases) {
    assert.equal(readingColor(value), `var(--noise-${tone})`);
    assert.equal(readingColor(value, "ink"), `var(--noise-${tone}-ink)`);
    assert.equal(recordBand(value, "generic-estimate")?.tone, tone);
    assert.equal(recordBand(value, "reference-estimate")?.tone, tone);
  }
});

test("同档读数保持相同颜色，不在区间内变成下一档色相", () => {
  for (const [start, end] of [
    [0, 29.9],
    [30, 49.9],
    [50, 69.9],
    [70, 84.9],
    [85, 99.9],
    [100, 119.9],
    [120, 160],
  ]) {
    assert.equal(readingColor(start), readingColor(end));
    assert.equal(readingColor(start, "ink"), readingColor(end, "ink"));
  }
});

test("待测、非法输入与输入下限不生成量级颜色，量程外保留端点色", () => {
  for (const value of [null, NaN, Infinity, -Infinity]) {
    assert.equal(readingColor(value), undefined);
    assert.equal(readingColor(value, "ink"), undefined);
  }
  for (const value of [0, 10, 100]) {
    assert.equal(readingColor(value, "display", true), undefined);
    assert.equal(readingColor(value, "ink", true), undefined);
  }
  assert.equal(readingColor(-10), "var(--noise-faint)");
  assert.equal(readingColor(180), "var(--noise-extreme)");
  assert.equal(recordBand(60, "relative"), null);
});

test("色带按真实分贝边界定位，120+ 仅占终点", () => {
  const values = [0, 30, 30, 50, 50, 70, 70, 85, 85, 100, 100, 120, 120, 120];
  assert.deepEqual(
    noiseStops.map((stop) => stop.position),
    values.map((value) => value / 120),
  );
  assert.deepEqual(
    noiseStops.slice(-2).map((stop) => stop.color),
    ["var(--noise-extreme)", "var(--noise-extreme)"],
  );
  const offsets = [...noiseGradient.matchAll(/([\d.]+)%/g)].map((match) => Number(match[1]));
  assert.equal(offsets.length, values.length);
  for (const [i, value] of values.entries())
    assert.ok(Math.abs(offsets[i] - (value / 120) * 100) < 0.001);
});

test("仪表和色带指示与显示读数同步，显示 120.0 时到达终点", () => {
  assert.equal(readingPosition(29.99), 30 / 120);
  assert.equal(readingPosition(69.99), 70 / 120);
  assert.equal(readingPosition(119.99), 1);
  assert.equal(readingPosition(119.9), 119.9 / 120);
  assert.equal(readingPosition(-5), 0);
  assert.equal(readingPosition(130), 1);
  for (const value of [null, NaN, Infinity, -Infinity]) assert.equal(readingPosition(value), null);
  assert.equal(readingPosition(10, true), null);
});
