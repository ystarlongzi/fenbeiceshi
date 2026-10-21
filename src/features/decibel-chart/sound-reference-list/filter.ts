import type { SoundReference } from "../../../lib/content/sound-references.ts";

export interface LookupSound extends Pick<SoundReference, "id" | "emoji" | "min" | "max" | "unit"> {
  name: string;
  context: string;
  searchText: string;
  sourceId: string;
  sourceLabel: string;
}

export interface LookupBand {
  range: string;
  title: string;
  description: string;
  tone: string;
  min: number;
  max: number;
}

export function filterSounds(sounds: LookupSound[], query: string): LookupSound[] {
  const normalized = query.slice(0, 100).normalize("NFKC").trim().toLowerCase();
  const levelQuery = normalized.match(/^(\d+(?:\.\d+)?)\s*(db(?:a|\(a\))?|分贝)?$/u);
  const value = levelQuery ? Number(levelQuery[1]) : null;
  const requestedUnit = levelQuery?.[2]?.startsWith("db")
    ? levelQuery[2] === "db"
      ? "dB"
      : "dBA"
    : null;
  const tokens = normalized.split(/\s+/u);
  return sounds.filter((sound) => {
    if (!normalized) return true;
    if (value !== null) {
      return (
        sound.min <= value && value <= sound.max && (!requestedUnit || sound.unit === requestedUnit)
      );
    }
    const searchable = `${sound.searchText} ${sound.context} ${referenceLevel(sound)}`
      .normalize("NFKC")
      .toLowerCase();
    return tokens.every((token) => searchable.includes(token));
  });
}

export function groupSounds(sounds: LookupSound[], bands: LookupBand[]) {
  return bands
    .map((band, index) => ({
      band,
      sounds: sounds.filter(
        (sound) =>
          sound.min >= band.min &&
          (sound.min < band.max || (index === bands.length - 1 && sound.min === band.max)),
      ),
    }))
    .filter((group) => group.sounds.length > 0);
}

export function referenceLevel(sound: Pick<SoundReference, "min" | "max" | "unit">): string {
  return `${sound.min === sound.max ? sound.min : `${sound.min}–${sound.max}`} ${sound.unit}`;
}
