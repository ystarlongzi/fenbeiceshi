import assert from "node:assert/strict";
import test from "node:test";
import { linkedLanguageHref, nextLanguageIndex } from "./navigation.ts";

test("跨域语言链接保留提前附加的 Google linker 及语言、查询和锚点", () => {
  assert.equal(
    linkedLanguageHref(
      "https://soundmetergo.com/guide/?theme=dark&language=en#start",
      "https://soundmetergo.com/guide/?_gl=1~abc",
    ),
    "https://soundmetergo.com/guide/?theme=dark&language=en&_gl=1%7Eabc#start",
  );
  for (const decorated of [
    "https://unrelated.test/guide/?_gl=secret",
    "https://soundmetergo.com/privacy/?_gl=secret",
  ])
    assert.equal(
      linkedLanguageHref("https://soundmetergo.com/guide/", decorated),
      "https://soundmetergo.com/guide/",
    );
});

test("三列面板上下移动同一列，左右移动相邻项并保留首尾定位", () => {
  assert.equal(nextLanguageIndex("ArrowDown", 1, 27, 3, false), 4);
  assert.equal(nextLanguageIndex("ArrowUp", 4, 27, 3, false), 1);
  assert.equal(nextLanguageIndex("ArrowRight", 4, 27, 3, false), 5);
  assert.equal(nextLanguageIndex("ArrowLeft", 4, 27, 3, false), 3);
  assert.equal(nextLanguageIndex("Home", 18, 27, 3, false), 0);
  assert.equal(nextLanguageIndex("End", 0, 27, 3, false), 26);
  assert.equal(nextLanguageIndex("a", 4, 27, 3, false), undefined);
});

test("两列面板最后一行不满时，纵向循环始终停留在原列", () => {
  assert.equal(nextLanguageIndex("ArrowDown", 24, 27, 2, false), 26);
  assert.equal(nextLanguageIndex("ArrowDown", 26, 27, 2, false), 0);
  assert.equal(nextLanguageIndex("ArrowDown", 25, 27, 2, false), 1);
  assert.equal(nextLanguageIndex("ArrowUp", 0, 27, 2, false), 26);
  assert.equal(nextLanguageIndex("ArrowUp", 1, 27, 2, false), 25);
});

test("RTL 横向方向与视觉位置对应，纵向和首尾规则不变", () => {
  assert.equal(nextLanguageIndex("ArrowRight", 4, 27, 3, true), 3);
  assert.equal(nextLanguageIndex("ArrowLeft", 4, 27, 3, true), 5);
  assert.equal(nextLanguageIndex("ArrowRight", 0, 27, 3, true), 26);
  assert.equal(nextLanguageIndex("ArrowLeft", 26, 27, 3, true), 0);
  assert.equal(nextLanguageIndex("ArrowDown", 4, 27, 3, true), 7);
  assert.equal(nextLanguageIndex("ArrowUp", 1, 27, 3, true), 25);
});

test("单列布局和全部网格位置的移动均不会生成空选项", () => {
  for (const columns of [1, 2, 3])
    for (const rtl of [false, true])
      for (let index = 0; index < 27; index++)
        for (const key of ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"]) {
          const next = nextLanguageIndex(key, index, 27, columns, rtl);
          assert.ok(next !== undefined && next >= 0 && next < 27);
        }
  assert.equal(nextLanguageIndex("ArrowUp", 0, 27, 1, false), 26);
  assert.equal(nextLanguageIndex("ArrowDown", 26, 27, 1, false), 0);
});
