import assert from "node:assert/strict";
import test from "node:test";
import {
  appliedAdjustment,
  editAdjustment,
  EMPTY_ADJUSTMENT,
  validAdjustment,
} from "./adjustment.ts";

test("手动修正从零开始，正负数实时应用，未完成或无效输入保留上次有效值", () => {
  assert.equal(appliedAdjustment(EMPTY_ADJUSTMENT), undefined);
  let state = { ...EMPTY_ADJUSTMENT, enabled: true };
  for (const offset of [5, -5, 0, -30, 30, -31, 31, -50, 50, 0.1]) {
    state = editAdjustment(state, String(offset));
    assert.deepEqual(appliedAdjustment(state), { id: "manual-offset-v1", offset });
  }
  for (const draft of [
    "",
    "-",
    "51",
    "-51",
    "50.1",
    "-50.1",
    "NaN",
    "1.05",
    "1e2",
    "9".repeat(33),
  ]) {
    const next = editAdjustment(state, draft);
    assert.equal(next.draft, draft);
    assert.equal(next.offset, 0.1);
  }
  assert.equal(editAdjustment(state, "-2.5").offset, -2.5);
});

test("外部修正必须使用已知模型、有限数值和合法范围与步长", () => {
  for (const offset of [-50, -31, -30, -0.1, 0, 30, 31, 50])
    assert.equal(validAdjustment({ id: "manual-offset-v1", offset }), true);
  for (const offset of [NaN, Infinity, -51, 51, -50.1, 50.1, 0.05, "5", null])
    assert.equal(validAdjustment({ id: "manual-offset-v1", offset }), false);
  assert.equal(validAdjustment({ id: "unknown", offset: 5 }), false);
  assert.equal(validAdjustment(null), false);
});
