import { soundReferences, soundSources } from "./sound-references.ts";
import {
  translations as t,
  type ContentSection,
  type LocalizedText,
  type SiteContent,
} from "./types.ts";

export const decibelChart: SiteContent = {
  id: "decibel-chart",
  slug: "knowledge/decibel-chart",
  kind: "article",
  updated: "2026-10-25",
  title: t(
    "分贝对照表：常见声音有多大？",
    "Decibel Chart: How Loud Are Everyday Sounds?",
    "分貝對照表：常見聲音有多大？",
  ),
  description: t(
    "40、60、80 分贝分别有多响？用分贝对照表查询 31 项日常声音，从轻声说话到家电、车流和演出，按声音名称或数值查找参考。也能了解噪音大小与持续时间的关系，进一步查看听力保护知识。",
    "How loud are 40, 60 or 80 decibels? Search 31 everyday sounds, from whispers to appliances, traffic and concerts, then explore how sound level and duration relate to hearing protection.",
    "40、60、80 分貝分別有多響？用分貝對照表查詢 31 項日常聲音，從輕聲說話到家電、車流和演出，依聲音名稱或數值查找參考。也能瞭解噪音大小與持續時間的關係，進一步查看聽力保護知識。",
  ),
  takeaway: t(
    "40 dB 可参考图书馆；50 dB 左右接近普通家庭背景声（45–55 dB）；正常交谈约 60–70 dBA。下方可按声音名称或数值查找更多参考。",
    "Think of a library at 40 dB, home background around 50 dB (45–55 dB), and conversation at 60–70 dBA. Browse or search the sounds below for more references.",
    "40 dB 可參考圖書館；50 dB 左右接近普通家庭背景聲（45–55 dB）；正常交談約 60–70 dBA。下方可按聲音名稱或數值查詢更多參考。",
  ),
  sections: [
    {
      id: "levels",
      tocTitle: t("声音对照", "Sound comparison", "聲音對照"),
      title: t("声音分贝对照", "Compare everyday sound levels", "聲音分貝對照"),
      paragraphs: [
        t(
          "参考保留来源的 dB / dBA，测量距离未统一，不能直接等同于本站网页估算。七档仅帮助浏览声音量级，不代表舒适度或安全等级。",
          "References retain the source's dB / dBA units without a common measurement distance and are not equivalents of this site's browser estimates. Bands help compare approximate levels; they are not comfort or safety ratings.",
          "參考保留來源的 dB / dBA，測量距離未統一，不能直接等同於本站網頁估算。七檔僅幫助瀏覽聲音量級，不代表舒適度或安全等級。",
        ),
      ],
    },
    {
      id: "health",
      tocTitle: t("噪音与健康", "Noise and health", "噪音與健康"),
      title: t("噪音与健康", "Noise and health", "噪音與健康"),
      paragraphs: [
        t(
          "声音大小之外，还要看持续多久、是否反复出现。先用下表了解职业噪音中声级与暴露时长的关系，再进一步了解听力、睡眠与专注受到的影响。",
          "Duration and repetition matter alongside sound level. Compare occupational exposure references below, then explore how noise affects hearing, sleep and focus.",
          "聲音大小之外，還要看持續多久、是否反覆出現。先用下表瞭解職業噪音中聲級與暴露時長的關係，再進一步瞭解聽力、睡眠與專注受到的影響。",
        ),
      ],
    },
    {
      id: "reading",
      tocTitle: t("参考说明", "Using the chart", "參考說明"),
      title: t(
        "如何理解这些声音参考？",
        "How to use these sound references",
        "如何理解這些聲音參考？",
      ),
      paragraphs: [],
    },
  ],
  sources: [
    ...Object.values(soundSources).filter((source) =>
      soundReferences.some((sound) => soundSources[sound.source].id === source.id),
    ),
    {
      id: "chart-source-niosh-exposure",
      title: "CDC/NIOSH · Noise-Induced Hearing Loss · 85 dBA / 8 hours and 3 dBA exchange rate",
      url: "https://www.cdc.gov/niosh/noise/about/noise.html",
    },
    {
      id: "chart-source-osha-exposure",
      title: "OSHA · 29 CFR 1910.95 Appendix A · Table G-16a: noise dose reference durations",
      url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95AppA",
    },
    {
      id: "chart-source-osha-action",
      title: "OSHA · 29 CFR 1910.95(c) · Hearing conservation action level",
      url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95",
    },
    {
      id: "chart-source-niosh-dose",
      title: "CDC/NIOSH · Understanding Noise Exposure Limits · Maximum daily noise dose",
      url: "https://www.cdc.gov/niosh/bulletin/2016/noise.html",
    },
    {
      id: "chart-source-niosh-criteria",
      title: "NIOSH · Occupational Noise Exposure, Revised Criteria 1998 · Table 1-1",
      url: "https://stacks.cdc.gov/view/cdc/6376/cdc_6376_DS1.pdf",
    },
    {
      id: "chart-source-osha-continuous",
      title: "OSHA Technical Manual · Noise · Table G-16 and G-16A have different purposes",
      url: "https://www.osha.gov/otm/section-3-health-hazards/chapter-5",
    },
  ],
  related: ["dbfs-spl", "phone-accuracy", "calibration", "guide"],
};

export const decibelChartExposure = {
  id: "exposure",
  title: t("职业暴露与风险参考", "Exposure and risk guide", "職業暴露與風險參考"),
  paragraphs: [
    t(
      "NIOSH 一栏表示达到每日推荐剂量上限的时长，按 85 dBA／8 小时、每增加 3 dB 时长减半。OSHA 一栏是美国一般工业的剂量计算参考，按 90 dBA／8 小时、每增加 5 dB 时长减半，不能一律读作“最多可停留”。",
      "NIOSH durations reach the recommended daily dose limit: 85 dBA for 8 hours, halving with each 3 dB increase. OSHA values are US general-industry dose-calculation references using 90 dBA for 8 hours and a 5 dB exchange rate, not blanket maximum stay times.",
      "NIOSH 一欄表示達到每日建議劑量上限的時長，按 85 dBA／8 小時、每增加 3 dB 時長減半。OSHA 一欄是美國一般工業的劑量計算參考，按 90 dBA／8 小時、每增加 5 dB 時長減半，不能一律讀作「最多可停留」。",
    ),
    t(
      "仅用于稳定职业声级参考，不是个人安全时长，也不能套用本站网页估算。OSHA 在 85 dBA 的 8 小时平均值时已要求听力保护计划，连续稳态噪音上限为 115 dBA。按 NIOSH 关系换算，120 dBA 约为 9 秒；本表 120+ 行的“0 秒（立即危害）”是本站建议立即远离的预防性警示，不是两机构给出的统一时限。",
      "These constant-level occupational references are not personal safe times or values for this browser meter. OSHA requires hearing conservation at an 85 dBA 8-hour average and has a 115 dBA continuous steady-state ceiling. The NIOSH relationship gives about 9 seconds at 120 dBA. The 120+ row's zero-second warning is this site's precaution to move away immediately, not a single duration set by either agency.",
      "僅用於穩定職業聲級參考，不是個人安全時長，也不能套用本站網頁估算。OSHA 在 85 dBA 的 8 小時平均值時已要求聽力保護計畫，連續穩態噪音上限為 115 dBA。按 NIOSH 關係換算，120 dBA 約為 9 秒；本表 120+ 列的「0 秒（立即危害）」是本站建議立即遠離的預防性警示，不是兩機構給出的統一時限。",
    ),
    t(
      "风险等级为本站按声级整理的定性提示，并非 NIOSH／OSHA 官方分级。实际风险还与暴露时长、重复频率、防护和个体差异有关。",
      "Risk levels are this site's qualitative guide by sound level, not official NIOSH or OSHA categories. Actual risk also depends on duration, repetition, protection and individual susceptibility.",
      "風險等級為本站按聲級整理的定性提示，並非 NIOSH／OSHA 官方分級。實際風險還與暴露時長、重複頻率、防護和個體差異有關。",
    ),
  ],
  table: {
    headers: [
      t("声级（dBA）", "Level (dBA)", "聲級（dBA）"),
      t("NIOSH 推荐时长上限", "NIOSH recommended time limit", "NIOSH 建議時長上限"),
      t("OSHA 剂量参考时长", "OSHA dose reference duration", "OSHA 劑量參考時長"),
      t("风险等级（本站提示）", "Risk level (site guide)", "風險等級（本站提示）"),
    ],
    rows: [
      [
        t("85", "85", "85"),
        t("8 小时", "8 hours", "8 小時"),
        t("16 小时", "16 hours", "16 小時"),
        t("警示", "Caution", "警示"),
      ],
      [
        t("88", "88", "88"),
        t("4 小时", "4 hours", "4 小時"),
        t("约 10.6 小时", "≈ 10.6 hours", "約 10.6 小時"),
        t("中度风险", "Moderate risk", "中度風險"),
      ],
      [
        t("91", "91", "91"),
        t("2 小时", "2 hours", "2 小時"),
        t("约 7 小时", "≈ 7 hours", "約 7 小時"),
        t("高风险", "High risk", "高風險"),
      ],
      [
        t("94", "94", "94"),
        t("1 小时", "1 hour", "1 小時"),
        t("约 4.6 小时", "≈ 4.6 hours", "約 4.6 小時"),
        t("高风险", "High risk", "高風險"),
      ],
      [
        t("100", "100", "100"),
        t("15 分钟", "15 minutes", "15 分鐘"),
        t("2 小时", "2 hours", "2 小時"),
        t("严重风险", "Severe risk", "嚴重風險"),
      ],
      [
        t("110", "110", "110"),
        t("约 1 分 29 秒", "≈ 1 min 29 sec", "約 1 分 29 秒"),
        t("30 分钟", "30 minutes", "30 分鐘"),
        t("极高风险", "Extreme risk", "極高風險"),
      ],
    ],
  },
} satisfies ContentSection;

export const decibelChartWarning = {
  level: t("120+", "120+", "120+"),
  duration: t("0 秒（立即危害）", "0 seconds (immediate harm)", "0 秒（立即危害）"),
  note: t(
    "本站预防性警示：“0 秒”表示建议立即远离，不是 NIOSH／OSHA 给出的统一暴露时限。",
    "Site precaution: zero seconds means move away immediately, not a single exposure limit set by NIOSH or OSHA.",
    "本站預防性警示：「0 秒」表示建議立即遠離，不是 NIOSH／OSHA 給出的統一暴露時限。",
  ),
  risk: t("极高风险", "Extreme risk", "極高風險"),
};

type ChartNote = Pick<ContentSection, "id" | "title" | "paragraphs"> & {
  link: { id?: string; pageId: string; label: LocalizedText };
};

export const decibelChartNotes: ChartNote[] = [
  {
    id: "distance",
    title: t(
      "为什么同一种声音的参考值会不同？",
      "Why can the same sound have different levels?",
      "為什麼同一種聲音的參考值會不同？",
    ),
    paragraphs: [
      t(
        "型号、工作状态、距离和背景声都会影响读数。表中保留来源的单值或范围，查看时要连同比较条件一起理解。",
        "The model, operating state, distance and background sound can change a reading. References retain each source's value or range, so compare them with their stated conditions.",
        "型號、工作狀態、距離和背景聲都會影響讀數。表中保留來源的單值或範圍，檢視時要連同比較條件一起理解。",
      ),
    ],
    link: {
      pageId: "guide",
      label: t(
        "查看同条件测量的方法",
        "Learn how to compare under the same conditions",
        "檢視同條件測量的方法",
      ),
    },
  },
  {
    id: "limits",
    title: t(
      "表中的数值，能和网页读数直接比较吗？",
      "Can I compare the chart directly with the browser meter?",
      "表中的數值，能和網頁讀數直接比較嗎？",
    ),
    paragraphs: [
      t(
        "本站网页提供标注未校准的估算噪音分贝，不等同于表中的 dBA。比较环境变化时，请保持同一设备、输入设置和观察位置。",
        "This site's meter gives a labelled, uncalibrated noise estimate. It is not equivalent to the chart's dBA values. To compare a change, keep the same device, input settings and position.",
        "本站網頁提供標註未校正的估算噪音分貝，不等同於表中的 dBA。比較環境變化時，請保持同一裝置、輸入設定和觀察位置。",
      ),
    ],
    link: {
      id: "scale",
      pageId: "dbfs-spl",
      label: t(
        "了解 dBFS、dB SPL 与网页估算",
        "Understand dBFS, dB SPL and meter estimates",
        "瞭解 dBFS、dB SPL 與網頁估算",
      ),
    },
  },
];
