import { dual as t } from "./types.ts";

export const soundBands = [
  {
    min: 0,
    max: 30,
    range: "0–30",
    title: t("非常安静", "Very quiet"),
    description: t(
      "背景声很弱，轻微的呼吸或树叶声也容易被注意到。",
      "With very little background sound, even soft breathing or rustling leaves can stand out.",
    ),
    tone: "faint",
    examples: ["breathing", "leaves"],
  },
  {
    min: 30,
    max: 50,
    range: "30–50",
    title: t("安静", "Quiet"),
    description: t(
      "背景声较轻，轻声交谈和电器的细微运转声可以被分辨出来。",
      "Background sound is subdued; soft speech and the gentle hum of an appliance can be distinct.",
    ),
    tone: "quiet",
    examples: ["whisper", "library", "fridge"],
  },
  {
    min: 50,
    max: 70,
    range: "50–70",
    title: t("适中", "Moderate"),
    description: t(
      "声音存在感明显，类似日常交谈或家电运行时的听感。",
      "Sound is clearly present, much like everyday conversation or a running household appliance.",
    ),
    tone: "everyday",
    examples: ["home", "conversation", "washing-machine"],
  },
  {
    min: 70,
    max: 85,
    range: "70–85",
    title: t("较吵", "Fairly noisy"),
    description: t(
      "环境声较突出，交谈时可能需要提高音量。",
      "Background sound becomes prominent, and you may need to raise your voice to talk.",
    ),
    tone: "raised",
    examples: ["vacuum", "street-traffic", "doorbell"],
  },
  {
    min: 85,
    max: 100,
    range: "85–100",
    title: t("很吵", "Very noisy"),
    description: t(
      "声音很强，近距离交谈也可能被背景声盖住。",
      "Sound is forceful enough that background noise may mask even a nearby conversation.",
    ),
    tone: "loud",
    examples: ["traffic-inside-car", "shaver", "sports"],
  },
  {
    min: 100,
    max: 120,
    range: "100–120",
    title: t("极吵", "Extremely noisy"),
    description: t(
      "声音压迫感强，喊话也可能难以听清，让人想远离声源。",
      "Sound can feel overwhelming; even shouting may be hard to hear, prompting an urge to move away.",
    ),
    tone: "intense",
    examples: ["horn", "chainsaw", "siren"],
  },
  {
    min: 120,
    max: 160,
    range: "120+",
    title: t("极强噪音", "Extreme noise"),
    description: t(
      "声音极强，可能让人产生刺耳或难以忍受的感觉。",
      "Sound is exceptionally intense and may feel piercing or difficult to tolerate.",
    ),
    tone: "extreme",
    examples: ["jet", "airplane", "fireworks"],
  },
] as const;

export function readingBand(value: number | null, atInputFloor = false) {
  if (atInputFloor || value === null || !Number.isFinite(value)) return null;
  // 按屏幕的一位小数判档，避免 69.99 显示为 70.0 却仍使用上一档颜色。
  const displayedValue = Number(value.toFixed(1));
  return soundBands.findLast((band) => displayedValue >= band.min) ?? soundBands[0];
}
