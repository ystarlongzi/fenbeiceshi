import type { SoundReference } from "../sound-references.ts";

const changes = [-10, -3, 0, 3, 10] as const;

export function levelComparisons(sound: Pick<SoundReference, "min" | "max">) {
  return changes.map((offset) => ({
    offset,
    min: sound.min + offset,
    max: sound.max + offset,
    loudness: Number((2 ** (offset / 10)).toPrecision(2)),
    energy: Number((10 ** (offset / 10)).toPrecision(2)),
  }));
}
