import type { SoundReference } from "./sound-references.ts";

export function referenceRange(sound: Pick<SoundReference, "min" | "max">): string {
  return sound.min === sound.max ? String(sound.min) : `${sound.min}–${sound.max}`;
}

export function referenceLevel(sound: Pick<SoundReference, "min" | "max" | "unit">): string {
  return `${referenceRange(sound)} ${sound.unit}`;
}
