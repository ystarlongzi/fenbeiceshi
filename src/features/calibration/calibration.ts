import type { Calibration } from "../sound-meter/types.ts";

export function makeCalibration(
  raw: number,
  reference: number,
  source: string,
  signature: string,
): Calibration {
  if (!Number.isFinite(raw) || raw <= -90 || raw > 0) {
    throw new RangeError("输入信号过低或已超出满幅，无法建立参考关系。");
  }
  if (!Number.isFinite(reference) || reference < 20 || reference > 120) {
    throw new RangeError("参考读数需在 20–120 dB 范围内。");
  }
  if (!source.trim() || source.trim().length > 120 || !signature) {
    throw new RangeError("需要有效的参考来源和当前输入设置。");
  }
  return {
    offset: reference - raw,
    reference,
    source: source.trim(),
    signature,
    createdAt: new Date().toISOString(),
  };
}

export function activeCalibration(calibration: Calibration | null, signature: string) {
  return calibration?.signature === signature ? calibration : null;
}
