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
  updated: "2026-10-21",
  title: t(
    "分贝对照表：常见声音与噪音水平",
    "Decibel chart: everyday sounds and noise levels",
    "分貝對照表：常見聲音與噪音水平",
  ),
  description: t(
    "按七档分组浏览耳语、家电、交通和音乐会的分贝参考，搜索声音名称或数值，了解 40、50、60、70 分贝有多大，并查看各项条件与来源。",
    "Browse whispers, appliances, traffic and concerts in seven level bands. Search by sound or decibel value, compare what 40–70 dB means, and open each sound for its context and source.",
    "按七檔分組瀏覽耳語、家電、交通和音樂會的分貝參考，搜尋聲音名稱或數值，瞭解 40、50、60、70 分貝有多大，並檢視各項條件與來源。",
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
          "声音大小之外，还要看持续多久、是否反复出现。了解噪音对听力、睡眠和专注的影响。",
          "Duration and repetition matter alongside sound level. Learn how noise affects hearing, sleep and focus.",
          "聲音大小之外，還要看持續多久、是否反覆出現。瞭解噪音對聽力、睡眠和專注的影響。",
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
  sources: Object.values(soundSources).filter((source) =>
    soundReferences.some((sound) => soundSources[sound.source].id === source.id),
  ),
  related: ["dbfs-spl", "phone-accuracy", "calibration", "guide"],
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
