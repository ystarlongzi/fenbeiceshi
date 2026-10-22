import { soundReferences, soundSources, type SoundReference } from "../sound-references.ts";
import { referenceRange } from "../sound-reference-format.ts";
import { translations as t, type LocalizedText, type SiteContent } from "../types.ts";
import { quietDetails } from "./quiet.ts";
import { homeDetails } from "./home.ts";
import { speechTrafficDetails } from "./speech-traffic.ts";
import { leisureDetails } from "./leisure.ts";
import { equipmentDetails } from "./equipment.ts";
import type { SoundDetailDefinition } from "./types.ts";
import { browserLimit, hearingGuidance } from "./guidance.ts";

export interface SoundQuestion {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
}

export interface SoundDetail {
  key: string;
  sounds: SoundReference[];
  questions: SoundQuestion[];
  content: SiteContent;
}

const groups = [
  ...quietDetails,
  ...homeDetails,
  ...speechTrafficDetails,
  ...leisureDetails,
  ...equipmentDetails,
].map((definition) => {
  const sounds = definition.soundIds.map(soundById);
  const first = sounds[0];
  if (!first || sounds.some((sound) => sound.min !== first.min || sound.max !== first.max))
    throw new Error(`同一详情页必须对应相同单值或范围：${definition.soundIds.join(", ")}`);
  const key = referenceRange(first).replace("–", "-");
  return { definition, sounds, key };
});

const idsBySound = new Map(
  groups.flatMap((group) =>
    group.sounds.map((sound) => [sound.id, `decibel-${group.key}`] as const),
  ),
);

export const soundDetails: SoundDetail[] = groups.map(({ definition, sounds, key }) => ({
  key,
  sounds,
  questions: [
    ...definition.questions.map((question, index) => ({
      id: index === 0 ? "scenario-question" : "reference-question",
      ...question,
    })),
    {
      id: "browser",
      question: t(
        "手机测出来不一样，正常吗？",
        "Why does my phone show a different number?",
        "手機測出來不一樣，正常嗎？",
      ),
      answer: browserLimit,
    },
  ],
  content: buildContent(definition, sounds, key),
}));

export function detailForSound(id: string): SoundDetail {
  const pageId = idsBySound.get(id);
  const detail = soundDetails.find((item) => item.content.id === pageId);
  if (!detail) throw new Error(`声音缺少对应的分贝详情页：${id}`);
  return detail;
}

export function detailForLevel(
  level: Pick<SoundReference, "min" | "max">,
): SoundDetail | undefined {
  return soundDetails.find(
    ({ sounds: [sound] }) => sound.min === level.min && sound.max === level.max,
  );
}

function buildContent(
  definition: SoundDetailDefinition,
  sounds: SoundReference[],
  key: string,
): SiteContent {
  const range = referenceRange(sounds[0]);
  const sourceKeys = [
    ...new Set([
      ...sounds.map((sound) => sound.source),
      ...(definition.extraSources ?? []),
      "nidcd" as const,
      "nidcdLoudness" as const,
      "niosh" as const,
      "ccohs" as const,
    ]),
  ];
  const id = `decibel-${key}`;
  const related = [
    "decibel-chart",
    ...definition.relatedSoundIds.map((soundId) => {
      const relatedId = idsBySound.get(soundId);
      if (!relatedId) throw new Error(`分贝详情的相关声音缺少页面：${soundId}`);
      return relatedId;
    }),
    ...definition.relatedPageIds,
  ];
  return {
    id,
    slug: `knowledge/decibel-chart/${key}-db`,
    parentId: "decibel-chart",
    kind: "article",
    updated: "2026-10-22",
    title: t(
      `${range} 分贝有多大？${definition.topic.zh}`,
      `How loud is ${range} dB? ${definition.topic.en}`,
      `${range} 分貝有多大？${definition.topic.zhTW}`,
    ),
    description: t(
      `用${definition.topic.zh}理解 ${range} 分贝，查看直观感受、常见声音、量级对比、听力建议、常见问题和资料来源。`,
      `Understand ${range} dB through ${definition.topic.en.toLowerCase()}, with a clear overview, sound examples, comparisons, hearing guidance, questions and sources.`,
      `用${definition.topic.zhTW}理解 ${range} 分貝，檢視直觀感受、常見聲音、量級對比、聽力建議、常見問題和資料來源。`,
    ),
    takeaway: definition.perception,
    sections: [
      {
        id: "examples",
        tocTitle: t("常见声音", "Sound examples", "常見聲音"),
        title: t(
          `${range} 分贝可以参考哪些声音？`,
          `Which sounds illustrate ${range} dB?`,
          `${range} 分貝可以參考哪些聲音？`,
        ),
        paragraphs: [definition.answer],
      },
      {
        id: "context",
        tocTitle: t("量级对比", "Compare sounds", "量級對比"),
        title: t(
          `${range} 分贝和其他声级差多少？`,
          `How does ${range} dB compare?`,
          `${range} 分貝和其他聲級差多少？`,
        ),
        paragraphs: [
          t(
            "多 10 分贝，听起来通常大约是原来的两倍响；多 3 分贝，声音能量就约翻倍。",
            "An extra 10 dB usually sounds about twice as loud; an extra 3 dB roughly doubles the sound energy.",
            "多 10 分貝，聽起來通常大約是原來的兩倍響；多 3 分貝，聲音能量就約翻倍。",
          ),
          t(
            "下面把本页声级作为 1 倍参照，看看同一段声音调高或调低后的差别。",
            "Take this page's level as 1 and see what happens when the same sound is turned up or down.",
            "下面把本頁聲級作為 1 倍參照，看看同一段聲音調高或調低後的差別。",
          ),
        ],
      },
      {
        id: "hearing",
        tocTitle: t("会伤听力吗", "Hearing risk", "會傷聽力嗎"),
        title: t(
          `${range} dB 对听力有害吗？`,
          `Can ${range} dB harm your hearing?`,
          `${range} dB 對聽力有害嗎？`,
        ),
        paragraphs: hearingGuidance(sounds),
      },
      {
        id: "question",
        tocTitle: t("常见问题", "Common questions", "常見問題"),
        title: t(
          `关于 ${range} 分贝的常见问题`,
          `Common questions about ${range} dB`,
          `關於 ${range} 分貝的常見問題`,
        ),
        paragraphs: [],
      },
    ],
    sources: sourceKeys.map((source) => soundSources[source]),
    related: [...new Set(related)].filter((relatedId) => relatedId !== id),
  };
}

function soundById(id: string): SoundReference {
  const sound = soundReferences.find((item) => item.id === id);
  if (!sound) throw new Error(`分贝详情引用了不存在的声音：${id}`);
  return sound;
}
