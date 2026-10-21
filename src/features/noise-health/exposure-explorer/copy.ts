import { dual as t } from "../../../lib/content/types.ts";

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
