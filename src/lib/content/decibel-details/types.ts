import type { soundSources } from "../sound-references.ts";
import type { LocalizedText } from "../types.ts";

export interface SoundDetailDefinition {
  soundIds: string[];
  topic: LocalizedText;
  perception: LocalizedText;
  answer: LocalizedText;
  questions: { question: LocalizedText; answer: LocalizedText }[];
  relatedSoundIds: string[];
  relatedPageIds: string[];
  extraSources?: (keyof typeof soundSources)[];
}
