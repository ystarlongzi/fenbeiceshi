import assert from "node:assert/strict";
import test from "node:test";
import { makeCalibration } from "../calibration/calibration.ts";
import { appliedAdjustment, editAdjustment, EMPTY_ADJUSTMENT } from "../calibration/adjustment.ts";
import { meterCopy } from "./copy.ts";
import { modeLabel } from "./mode-label.ts";
import { currentBasis, DEFAULT_ESTIMATE, measurementBasis } from "./readings.ts";

test("三语模式标签区分默认估算和手动修正，并显示实际生效的正负修正值", () => {
  for (const locale of ["zh-CN", "zh-TW", "en"] as const) {
    const copy = meterCopy[locale];
    assert.equal(modeLabel(currentBasis(), copy), copy.generic);
    assert.match(copy.generic, /未修正|unadjusted/);
    for (const [offset, label] of [
      [-50, "−50.0"],
      [-5, "−5.0"],
      [-0.1, "−0.1"],
      [0, "0.0"],
      [0.1, "+0.1"],
      [5, "+5.0"],
      [50, "+50.0"],
    ] as const) {
      const basis = currentBasis(null, { id: "manual-offset-v1", offset });
      assert.equal(modeLabel(basis, copy), `${copy.adjusted} · ${label} dB`);
    }
  }
});

test("标签跟随有效投影和结束快照，不将无效草稿或之后的设置写入报告", () => {
  const copy = meterCopy["zh-CN"];
  const valid = editAdjustment({ ...EMPTY_ADJUSTMENT, enabled: true }, "5");
  const snapshot = {
    calibration: null,
    estimate: DEFAULT_ESTIMATE,
    adjustment: appliedAdjustment(valid),
  };
  const invalid = editAdjustment(valid, "50.1");
  assert.equal(
    modeLabel(currentBasis(null, appliedAdjustment(invalid)), copy),
    "手动修正 · +5.0 dB",
  );
  const changed = editAdjustment(invalid, "-50");
  assert.equal(
    modeLabel(currentBasis(null, appliedAdjustment(changed)), copy),
    "手动修正 · −50.0 dB",
  );
  assert.equal(modeLabel(measurementBasis(snapshot), copy), "手动修正 · +5.0 dB");
  assert.equal(
    modeLabel(currentBasis(null, appliedAdjustment({ ...changed, enabled: false })), copy),
    "通用估算 · 未修正",
  );
});

test("历史参考与相对记录保留原来的模式标签", () => {
  const reference = currentBasis(makeCalibration(-40, 75, "Reference", "input"));
  const relative = measurementBasis({ calibration: null });
  for (const copy of Object.values(meterCopy)) {
    assert.equal(modeLabel(reference, copy), copy.estimate);
    assert.equal(modeLabel(relative, copy), copy.relative);
  }
});
