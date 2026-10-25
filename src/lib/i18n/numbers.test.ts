import assert from "node:assert/strict";
import test from "node:test";
import { readNumber, numberIssue } from "../../components/number-input/model.ts";
import { normalizeNumberInput } from "./numbers.ts";

test("新增语言接收本地小数点及阿拉伯、泰文、全角数字，内部仍使用十进制字符串", () => {
  for (const [locale, raw] of [
    ["de", "85,5"],
    ["fr", "85,5"],
    ["pt-BR", "85,5"],
    ["ar", "٨٥٫٥"],
    ["th", "๘๕.๕"],
    ["ja", "８５．５"],
  ] as const) {
    const value = normalizeNumberInput(raw, locale);
    assert.equal(value, "85.5", locale);
    assert.equal(readNumber(value), 85.5, locale);
    assert.equal(numberIssue(value, { min: 40, max: 130, step: 0.5 }), null, locale);
  }
  assert.equal(normalizeNumberInput("−۵,۵", "de"), "-5.5");
});

test("数字转换保留空值、无效输入和原三语规则，不移除千位分隔符或绕过范围", () => {
  for (const raw of ["", "1 000", "1e2", "0x10", "=1+1", "Ⅷ", "85,5"]) {
    assert.equal(normalizeNumberInput(raw, "en"), raw);
    assert.equal(normalizeNumberInput(raw, "zh-CN"), raw);
    assert.equal(normalizeNumberInput(raw, "zh-TW"), raw);
  }
  assert.equal(readNumber(normalizeNumberInput("1 000", "fr")), null);
  assert.equal(readNumber(normalizeNumberInput("1,000", "ja")), null);
  assert.equal(
    numberIssue(normalizeNumberInput("١٣١", "ar"), { min: 40, max: 130, step: 0.5 }),
    "max",
  );
});
