export type NumberBounds = { min: number; max: number; step: number; required?: boolean };

export function readNumber(raw: string): number | null {
  const text = raw.trim();
  if (text.length > 32 || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

export function numberIssue(raw: string, bounds: NumberBounds) {
  checkBounds(bounds);
  if (!raw.trim()) return bounds.required ? "required" : null;
  const value = readNumber(raw);
  if (value === null) return "number";
  if (value < bounds.min) return "min";
  if (value > bounds.max) return "max";
  const steps = (value - bounds.min) / bounds.step;
  return Math.abs(steps - Math.round(steps)) < 1e-7 ? null : "step";
}

export function stepNumber(raw: string, direction: -1 | 1, bounds: NumberBounds): string {
  checkBounds(bounds);
  const value = readNumber(raw);
  if (value === null) return String(bounds.min);
  const steps = (value - bounds.min) / bounds.step;
  const nextStep = direction > 0 ? Math.floor(steps + 1e-7) + 1 : Math.ceil(steps - 1e-7) - 1;
  const next = Math.max(bounds.min, Math.min(bounds.max, bounds.min + nextStep * bounds.step));
  // 依配置精度收尾，避免 0.1 步进留下浮点尾数；非对齐输入回到相邻合法刻度。
  const digits = Math.max(...[bounds.min, bounds.max, bounds.step].map(decimalPlaces));
  return String(Number(next.toFixed(digits)));
}

function checkBounds({ min, max, step }: NumberBounds) {
  if (![min, max, step].every(Number.isFinite) || min > max || step <= 0)
    throw new RangeError("数字输入的范围与步长配置无效");
  if ([min, max, step].some((value) => decimalPlaces(value) > 12))
    throw new RangeError("数字输入最多支持十二位小数");
}

function decimalPlaces(value: number): number {
  const [base, exponent = "0"] = String(value).split("e");
  return Math.max(0, (base.split(".")[1]?.length ?? 0) - Number(exponent));
}
