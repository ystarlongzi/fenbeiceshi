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
  updated: "2026-10-24",
  title: t(
    "分贝对照表：常见声音与噪音水平",
    "Decibel chart: everyday sounds and noise levels",
    "分貝對照表：常見聲音與噪音水平",
  ),
  description: t(
    "按七档查询 31 项常见声音的分贝范围与比较条件，对照 NIOSH 与 OSHA 的职业暴露时长参考，并进一步了解噪音与健康。",
    "Explore 31 everyday sounds in seven level bands, check their comparison conditions, compare NIOSH and OSHA occupational exposure references, and learn about noise and health.",
    "按七檔查詢 31 項常見聲音的分貝範圍與比較條件，對照 NIOSH 與 OSHA 的職業暴露時長參考，並進一步瞭解噪音與健康。",
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
  title: t(
    "职业噪音每日暴露参考",
    "Daily occupational noise exposure references",
    "職業噪音每日暴露參考",
  ),
  paragraphs: [
    t(
      "NIOSH 一栏表示达到每日推荐剂量上限的时长，按 85 dBA／8 小时、每增加 3 dB 时长减半。OSHA 一栏是美国一般工业的剂量计算参考，按 90 dBA／8 小时、每增加 5 dB 时长减半，不能一律读作“最多可停留”。",
      "NIOSH durations reach the recommended daily dose limit: 85 dBA for 8 hours, halving with each 3 dB increase. OSHA values are US general-industry dose-calculation references using 90 dBA for 8 hours and a 5 dB exchange rate, not blanket maximum stay times.",
      "NIOSH 一欄表示達到每日建議劑量上限的時長，按 85 dBA／8 小時、每增加 3 dB 時長減半。OSHA 一欄是美國一般工業的劑量計算參考，按 90 dBA／8 小時、每增加 5 dB 時長減半，不能一律讀作「最多可停留」。",
    ),
    t(
      "仅用于稳定职业声级参考，不是个人安全时长，也不能套用本站网页估算。OSHA 在 85 dBA 的 8 小时平均值时已要求听力保护计划；120 dBA 又超出其 115 dBA 连续稳态噪音上限，不能把附录计算值当作允许暴露时间。120+ 是一个范围，本表单列 120 dBA 为示例，不统一写成 0 秒。",
      "These constant-level occupational references are not personal safe times or values for this browser meter. OSHA requires hearing conservation at an 85 dBA 8-hour average; 120 dBA also exceeds its 115 dBA continuous steady-state ceiling. Appendix A calculations do not authorize that exposure. The chart gives 120 dBA as a specific example; 120+ is a range without one duration or a blanket zero-second value.",
      "僅用於穩定職業聲級參考，不是個人安全時長，也不能套用本站網頁估算。OSHA 在 85 dBA 的 8 小時平均值時已要求聽力保護計畫；120 dBA 又超出其 115 dBA 連續穩態噪音上限，不能把附錄計算值當作允許暴露時間。120+ 是一個範圍，本表單列 120 dBA 為示例，不統一寫成 0 秒。",
    ),
  ],
  table: {
    headers: [
      t("声级（dBA）", "Level (dBA)", "聲級（dBA）"),
      t("NIOSH 推荐时长上限", "NIOSH recommended time limit", "NIOSH 建議時長上限"),
      t("OSHA 剂量参考时长", "OSHA dose reference duration", "OSHA 劑量參考時長"),
    ],
    rows: [
      [t("85", "85", "85"), t("8 小时", "8 hours", "8 小時"), t("16 小时", "16 hours", "16 小時")],
      [
        t("88", "88", "88"),
        t("4 小时", "4 hours", "4 小時"),
        t("约 10.6 小时", "≈ 10.6 hours", "約 10.6 小時"),
      ],
      [
        t("91", "91", "91"),
        t("2 小时", "2 hours", "2 小時"),
        t("约 7 小时", "≈ 7 hours", "約 7 小時"),
      ],
      [
        t("94", "94", "94"),
        t("1 小时", "1 hour", "1 小時"),
        t("约 4.6 小时", "≈ 4.6 hours", "約 4.6 小時"),
      ],
      [
        t("100", "100", "100"),
        t("15 分钟", "15 minutes", "15 分鐘"),
        t("2 小时", "2 hours", "2 小時"),
      ],
      [
        t("110", "110", "110"),
        t("约 1 分 29 秒", "≈ 1 min 29 sec", "約 1 分 29 秒"),
        t("30 分钟", "30 minutes", "30 分鐘"),
      ],
      [
        t("120", "120", "120"),
        t("约 9 秒", "≈ 9 seconds", "約 9 秒"),
        t(
          "超出 115 dBA 连续噪音上限",
          "Above the 115 dBA continuous-noise ceiling",
          "超出 115 dBA 連續噪音上限",
        ),
      ],
    ],
  },
} satisfies ContentSection;

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
