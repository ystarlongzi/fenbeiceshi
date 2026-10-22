import { numberIssue, readNumber } from "../../components/number-input/model.ts";
import type { ReadingAdjustment } from "../sound-meter/types.ts";

export const adjustmentBounds = { min: -50, max: 50, step: 0.1, required: true };
export const EMPTY_ADJUSTMENT = { enabled: false, draft: "0", offset: 0 };
export type AdjustmentState = typeof EMPTY_ADJUSTMENT;

export function editAdjustment(state: AdjustmentState, draft: string): AdjustmentState {
  // 输入未完成时保留上次有效修正，避免空值或非法数字污染测量结果。
  const offset = numberIssue(draft, adjustmentBounds) === null ? readNumber(draft)! : state.offset;
  return { ...state, draft, offset };
}

export function appliedAdjustment(state: AdjustmentState): ReadingAdjustment | undefined {
  return state.enabled ? { id: "manual-offset-v1", offset: state.offset } : undefined;
}

export function validAdjustment(value: unknown): value is ReadingAdjustment {
  if (!value || typeof value !== "object") return false;
  const adjustment = value as ReadingAdjustment;
  return (
    adjustment.id === "manual-offset-v1" &&
    typeof adjustment.offset === "number" &&
    Number.isFinite(adjustment.offset) &&
    numberIssue(String(adjustment.offset), adjustmentBounds) === null
  );
}
