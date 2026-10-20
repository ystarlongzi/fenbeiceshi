export const minLevel = 85;
export const maxLevel = 115;
export const levelStep = 0.5;
export const referenceLevels = [85, 88, 91, 94, 97, 100] as const;

export function readLevel(raw: string): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return validLevel(value) ? value : null;
}

export function exposureMinutes(level: number): number | null {
  if (!validLevel(level)) return null;
  return 480 * 2 ** ((85 - level) / 3);
}

export function durationParts(minutes: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const total = Math.floor(minutes * 60);
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function validLevel(level: number): boolean {
  return (
    Number.isFinite(level) &&
    level >= minLevel &&
    level <= maxLevel &&
    Number.isInteger(level / levelStep)
  );
}
