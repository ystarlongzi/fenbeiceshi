import { numberIssue, readNumber } from "../../../components/number-input/model.ts";

export const minLevel = 40;
export const maxLevel = 130;
export const defaultLevel = 85;
export const levelStep = 0.5;

export function readLevel(raw: string): number | null {
  return numberIssue(raw, { min: minLevel, max: maxLevel, step: levelStep, required: true })
    ? null
    : readNumber(raw);
}

export function exposureMinutes(level: number): number | null {
  if (!validLevel(level)) return null;
  return 480 * 2 ** ((85 - level) / 3);
}

export function durationParts(minutes: number): {
  comparison: ">" | "<" | null;
  hours: number;
  minutes: number;
  seconds: number;
} {
  if (!Number.isFinite(minutes) || minutes <= 0)
    throw new RangeError("暴露时长必须是大于零的有限数值");
  const total = Math.floor(Math.min(1440, Math.max(1 / 60, minutes)) * 60);
  return {
    comparison: minutes > 1440 ? ">" : minutes < 1 / 60 ? "<" : null,
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function exposureContext(level: number | null) {
  if (level === null || !validLevel(level)) return "invalid";
  if (level < 70) return "lower";
  if (level < 85) return "belowReference";
  if (level < 100) return "reference";
  return level < 120 ? "high" : "extreme";
}

function validLevel(level: number): boolean {
  return (
    Number.isFinite(level) &&
    level >= minLevel &&
    level <= maxLevel &&
    Number.isInteger(level / levelStep)
  );
}
