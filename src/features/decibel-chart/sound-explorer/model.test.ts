import assert from "node:assert/strict";
import test from "node:test";
import { soundBands } from "../../../lib/content/sound-references.ts";
import { bandAtLevel, readLevel } from "./model.ts";

const bands = soundBands.map((band) => ({ ...band, title: band.title.zh, examples: "" }));

test("探索输入保留零值和上界，拒绝空值、越界、小数与非有限数", () => {
  assert.equal(readLevel("0", 0, 160), 0);
  assert.equal(readLevel(" 160 ", 0, 160), 160);
  for (const raw of ["", " ", "-1", "161", "60.5", "NaN", "Infinity", "1e309", "声音"])
    assert.equal(readLevel(raw, 0, 160), null, raw);
});

test("交界数值归入后一档，160 仍属于最后一档", () => {
  const expected = [
    [0, "faint"],
    [29, "faint"],
    [30, "quiet"],
    [50, "everyday"],
    [70, "raised"],
    [85, "loud"],
    [100, "intense"],
    [120, "extreme"],
    [160, "extreme"],
  ] as const;
  for (const [value, tone] of expected) assert.equal(bandAtLevel(bands, value)?.tone, tone);
  for (const value of [-1, 161, NaN]) assert.equal(bandAtLevel(bands, value), undefined);
});
