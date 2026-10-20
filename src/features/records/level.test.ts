import assert from "node:assert/strict";
import test from "node:test";
import { soundBands } from "../../lib/content/sound-bands.ts";
import { recordBand } from "./level.ts";

test("记录复用分贝对照页七档的边界和描述，交界归入后一档", () => {
  const cases = [
    [0, 0],
    [29.9, 0],
    [30, 1],
    [49.9, 1],
    [50, 2],
    [69.9, 2],
    [70, 3],
    [84.9, 3],
    [85, 4],
    [99.9, 4],
    [100, 5],
    [119.9, 5],
    [120, 6],
    [160, 6],
  ];
  for (const [value, expected] of cases) {
    assert.equal(recordBand(value, "generic-estimate"), soundBands[expected]);
    assert.equal(recordBand(value, "reference-estimate"), soundBands[expected]);
  }
});

test("描述标签与一位小数的显示值保持一致", () => {
  for (const [value, expected] of [
    [29.99, 1],
    [49.99, 2],
    [69.99, 3],
    [84.99, 4],
    [99.99, 5],
    [119.99, 6],
  ])
    assert.equal(recordBand(value, "generic-estimate"), soundBands[expected]);
});

test("历史相对电平、输入下限和缺失读数不生成环境量级", () => {
  assert.equal(recordBand(-40, "relative"), null);
  assert.equal(recordBand(60, "relative"), null);
  assert.equal(recordBand(0, "generic-estimate", true), null);
  assert.equal(recordBand(30, "reference-estimate", true), null);
  for (const value of [null, NaN, Infinity, -Infinity])
    assert.equal(recordBand(value, "generic-estimate"), null);
});

test("刻度外的有限估算值保留端点描述", () => {
  assert.equal(recordBand(-5, "reference-estimate"), soundBands[0]);
  assert.equal(recordBand(170, "generic-estimate"), soundBands.at(-1));
});
