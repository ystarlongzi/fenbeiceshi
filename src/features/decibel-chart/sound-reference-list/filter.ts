import type { SoundReference } from "../../../lib/content/sound-references.ts";

export interface LookupSound extends Pick<
  SoundReference,
  "id" | "category" | "min" | "max" | "unit"
> {
  name: string;
  context: string;
  searchText: string;
  sourceId: string;
  sourceLabel: string;
}

export function filterSounds(
  sounds: LookupSound[],
  query: string,
  category: string,
): LookupSound[] {
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
    if (category !== "all" && sound.category !== category) return false;
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

export function referenceLevel(sound: Pick<SoundReference, "min" | "max" | "unit">): string {
  return `${sound.min === sound.max ? sound.min : `${sound.min}–${sound.max}`} ${sound.unit}`;
}
