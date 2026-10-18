import assert from "node:assert/strict";
import test from "node:test";
import { activeSectionId } from "./active-section.ts";

test("进入正文前标记首节，没有章节时不标记", () => {
  assert.equal(activeSectionId([], 190, false), null);
  assert.equal(activeSectionId([{ id: "intro", top: 420 }], 190, false), "intro");
});

test("长章节持续高亮，下一节抵达阅读位置才切换", () => {
  assert.equal(
    activeSectionId(
      [
        { id: "lookup", top: -2600 },
        { id: "numbers", top: 650 },
      ],
      190,
      false,
    ),
    "lookup",
  );
  assert.equal(
    activeSectionId(
      [
        { id: "lookup", top: -3060 },
        { id: "numbers", top: 190.8 },
      ],
      190,
      false,
    ),
    "numbers",
  );
});

test("向上滚动越过章节开头后恢复上一节", () => {
  assert.equal(
    activeSectionId(
      [
        { id: "intro", top: -200 },
        { id: "method", top: 250 },
        { id: "limits", top: 800 },
      ],
      190,
      false,
    ),
    "intro",
  );
});

test("快速跨过多个短章节只标记最近一节", () => {
  assert.equal(
    activeSectionId(
      [
        { id: "intro", top: -700 },
        { id: "method", top: -320 },
        { id: "limits", top: 100 },
      ],
      190,
      false,
    ),
    "limits",
  );
});

test("页底的短章节尚未到达阅读线时也能高亮", () => {
  assert.equal(
    activeSectionId(
      [
        { id: "method", top: -120 },
        { id: "limits", top: 330 },
      ],
      190,
      true,
    ),
    "limits",
  );
});
