import assert from "node:assert/strict";
import test from "node:test";
import { numberIssue, readNumber, stepNumber } from "./model.ts";

const exposure = { min: 40, max: 130, step: 0.5, required: true };
const reference = { min: 20, max: 120, step: 0.1, required: true };

test("数字输入保留十进制规则，拒绝空值、非有限值及隐式进制转换", () => {
  for (const [raw, value] of [
    [" 85.5 ", 85.5],
    [".5", 0.5],
    ["+40", 40],
    ["-1.2", -1.2],
  ] as const)
    assert.equal(readNumber(raw), value);
  for (const raw of ["", " ", "-", ".", "1e2", "0x50", "Infinity", "NaN", "40 dBA", "1".repeat(33)])
    assert.equal(readNumber(raw), null, raw);
});

test("数字输入校验必填、上下界和以最小值为起点的步长", () => {
  assert.equal(numberIssue("", exposure), "required");
  assert.equal(numberIssue("", { ...exposure, required: false }), null);
  assert.equal(numberIssue("abc", exposure), "number");
  assert.equal(numberIssue("39.5", exposure), "min");
  assert.equal(numberIssue("130.5", exposure), "max");
  assert.equal(numberIssue("85.1", exposure), "step");
  assert.equal(numberIssue("85.5", exposure), null);
  assert.equal(numberIssue("60.1", reference), null);
  assert.equal(numberIssue("60.15", reference), "step");
});

test("步进不产生浮点尾数，并修正非对齐值及越界值", () => {
  assert.equal(stepNumber("60.1", 1, reference), "60.2");
  assert.equal(stepNumber("60.1", -1, reference), "60");
  assert.equal(stepNumber("60.15", 1, reference), "60.2");
  assert.equal(stepNumber("60.15", -1, reference), "60.1");
  assert.equal(stepNumber("85", 1, exposure), "85.5");
  assert.equal(stepNumber("130", 1, exposure), "130");
  assert.equal(stepNumber("40", -1, exposure), "40");
  assert.equal(stepNumber("999", -1, exposure), "130");
  assert.equal(stepNumber("", 1, exposure), "40");
  assert.equal(stepNumber("abc", -1, exposure), "40");
});

test("错误的数字输入配置明确失败", () => {
  for (const bounds of [
    { ...exposure, step: 0 },
    { ...exposure, min: 200 },
    { ...exposure, max: Infinity },
    { ...exposure, step: 1e-13 },
  ])
    assert.throws(() => numberIssue("85", bounds), RangeError);
});
