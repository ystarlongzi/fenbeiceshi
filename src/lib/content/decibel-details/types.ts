import type { soundSources } from "../sound-references.ts";
import type { LocalizedText } from "../types.ts";

export interface SoundQuestionDefinition {
  question: LocalizedText;
  answer: LocalizedText;
  chineseLink?: {
    pageId: string;
    hash: string;
    label: Pick<LocalizedText, "zh" | "zhTW">;
  };
}

export interface SoundDetailDefinition {
  soundIds: string[];
  updated?: string;
  chineseHeading?: Pick<LocalizedText, "zh" | "zhTW">;
  topic: LocalizedText;
  perception: LocalizedText;
  answer: LocalizedText;
  questions: SoundQuestionDefinition[];
  relatedSoundIds: string[];
  relatedPageIds: string[];
  extraSources?: (keyof typeof soundSources)[];
}
