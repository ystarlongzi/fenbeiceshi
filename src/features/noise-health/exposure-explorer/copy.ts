import { translations as t } from "../../../lib/content/types.ts";

export const exposureReferences = [
  {
    level: 85,
    description: t(
      "割草机、吸尘器等设备可达到这一量级；长时间接触需保护听力。",
      "Lawn mowers and vacuums can reach this level. Protect your hearing during prolonged exposure.",
      "割草機、吸塵器等裝置可達到這一量級；長時間接觸需保護聽力。",
    ),
  },
  {
    level: 88,
    description: t(
      "比 85 dBA 增加 3 dBA，每日累计参考时长减半。",
      "A 3 dBA increase from 85 dBA halves the daily reference duration.",
      "比 85 dBA 增加 3 dBA，每日累計參考時長減半。",
    ),
  },
  {
    level: 91,
    description: t(
      "噪音工作或活动中，减少连续停留，并安排安静休息。",
      "Spend less time in noisy work or activities and take breaks somewhere quiet.",
      "噪音工作或活動中，減少連續停留，並安排安靜休息。",
    ),
  },
  {
    level: 94,
    description: t(
      "高音量耳机、体育赛事可达到这一量级；优先调低音量或拉开距离。",
      "Loud headphones and sporting events can reach this level. Lower the volume or move farther away.",
      "高音量耳機、體育賽事可達到這一量級；優先調低音量或拉開距離。",
    ),
  },
  {
    level: 100,
    description: t(
      "音乐会、夜店等强声环境中，缩短停留并正确使用听力防护。",
      "At loud concerts or nightclubs, limit your stay and use hearing protection correctly.",
      "音樂會、夜店等強聲環境中，縮短停留並正確使用聽力防護。",
    ),
  },
  {
    level: 110,
    description: t(
      "警笛等强声附近，优先远离声源，避免继续暴露。",
      "Near intense sound such as sirens, move away from the source to avoid further exposure.",
      "警笛等強聲附近，優先遠離聲源，避免繼續暴露。",
    ),
  },
] as const;

export const exposureNotes = {
  lower: t(
    "留意声音是否影响交谈、休息或睡眠，优先处理持续、反复的噪音干扰。",
    "Notice whether sound interrupts conversation, rest or sleep. Address persistent or recurring disturbance first.",
    "留意聲音是否影響交談、休息或睡眠，優先處理持續、反覆的噪音干擾。",
  ),
  belowReference: t(
    "调低音乐或设备音量，远离持续噪音；工作、学习间隙可到安静处休息。",
    "Lower music or equipment volume and move away from continuous noise. Take breaks in a quieter place during work or study.",
    "調低音樂或裝置音量，遠離持續噪音；工作、學習間隙可到安靜處休息。",
  ),
  reference: t(
    "长时间或反复接触强噪音可能损伤听力。优先降低声源、缩短停留，并在需要时正确使用听力防护。",
    "Long or repeated loud-noise exposure can damage hearing. Reduce the source, limit time nearby and use suitable hearing protection when needed.",
    "長時間或反覆接觸強噪音可能損傷聽力。優先降低聲源、縮短停留，並在需要時正確使用聽力防護。",
  ),
  high: t(
    "应尽快降低音量或拉开距离，减少停留，并正确使用合适的听力防护。",
    "Turn the volume down or move farther away promptly. Keep your stay brief and use suitable hearing protection correctly.",
    "應儘快降低音量或拉開距離，減少停留，並正確使用合適的聽力防護。",
  ),
  extreme: t(
    "强烈噪音可能迅速损伤听力，应立即远离声源，避免继续暴露。",
    "Intense noise can damage hearing quickly. Move away from the source immediately and avoid further exposure.",
    "強烈噪音可能迅速損傷聽力，應立即遠離聲源，避免繼續暴露。",
  ),
  invalid: t(
    "请检查输入的噪音水平。",
    "Check the noise level you entered.",
    "請檢查輸入的噪音水平。",
  ),
};
