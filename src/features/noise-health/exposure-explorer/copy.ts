import { dual as t } from "../../../lib/content/types.ts";

export const exposureReferences = [
  {
    level: 85,
    description: t(
      "割草机、吸尘器等设备可达到这一量级；长时间接触需保护听力。",
      "Lawn mowers and vacuums can reach this level. Protect your hearing during prolonged exposure.",
    ),
  },
  {
    level: 88,
    description: t(
      "比 85 dBA 增加 3 dBA，每日累计参考时长减半。",
      "A 3 dBA increase from 85 dBA halves the daily reference duration.",
    ),
  },
  {
    level: 91,
    description: t(
      "噪音工作或活动中，减少连续停留，并安排安静休息。",
      "Spend less time in noisy work or activities and take breaks somewhere quiet.",
    ),
  },
  {
    level: 94,
    description: t(
      "高音量耳机、体育赛事可达到这一量级；优先调低音量或拉开距离。",
      "Loud headphones and sporting events can reach this level. Lower the volume or move farther away.",
    ),
  },
  {
    level: 100,
    description: t(
      "音乐会、夜店等强声环境中，缩短停留并正确使用听力防护。",
      "At loud concerts or nightclubs, limit your stay and use hearing protection correctly.",
    ),
  },
  {
    level: 110,
    description: t(
      "警笛等强声附近，优先远离声源，避免继续暴露。",
      "Near intense sound such as sirens, move away from the source to avoid further exposure.",
    ),
  },
] as const;

export const exposureNotes = {
  lower: t(
    "留意声音是否影响交谈、休息或睡眠，优先处理持续、反复的噪音干扰。",
    "Notice whether sound interrupts conversation, rest or sleep. Address persistent or recurring disturbance first.",
  ),
  belowReference: t(
    "调低音乐或设备音量，远离持续噪音；工作、学习间隙可到安静处休息。",
    "Lower music or equipment volume and move away from continuous noise. Take breaks in a quieter place during work or study.",
  ),
  reference: t(
    "长时间或反复接触强噪音可能损伤听力。优先降低声源、缩短停留，并在需要时正确使用听力防护。",
    "Long or repeated loud-noise exposure can damage hearing. Reduce the source, limit time nearby and use suitable hearing protection when needed.",
  ),
  high: t(
    "应尽快降低音量或拉开距离，减少停留，并正确使用合适的听力防护。",
    "Turn the volume down or move farther away promptly. Keep your stay brief and use suitable hearing protection correctly.",
  ),
  extreme: t(
    "强烈噪音可能迅速损伤听力，应立即远离声源，避免继续暴露。",
    "Intense noise can damage hearing quickly. Move away from the source immediately and avoid further exposure.",
  ),
  invalid: t("请检查输入的噪音水平。", "Check the noise level you entered."),
};
