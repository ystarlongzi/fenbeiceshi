import { soundReferences, soundSources } from "./sound-references.ts";
import { dual as t, type ContentSection, type Dual, type SiteContent } from "./types.ts";

export const decibelChart: SiteContent = {
  id: "decibel-chart",
  slug: "knowledge/decibel-chart",
  kind: "article",
  updated: "2026-10-21",
  title: t("分贝对照表：常见声音与噪音水平", "Decibel chart: everyday sounds and noise levels"),
  description: t(
    "按七档分组浏览耳语、家电、交通和音乐会的分贝参考，搜索声音名称或数值，了解 40、50、60、70 分贝有多大，并查看各项条件与来源。",
    "Browse whispers, appliances, traffic and concerts in seven level bands. Search by sound or decibel value, compare what 40–70 dB means, and open each sound for its context and source.",
  ),
  takeaway: t(
    "40 dB 可参考图书馆；50 dB 左右接近普通家庭背景声（45–55 dB）；正常交谈约 60–70 dBA。下方可按声音名称或数值查找更多参考。",
    "Think of a library at 40 dB, home background around 50 dB (45–55 dB), and conversation at 60–70 dBA. Browse or search the sounds below for more references.",
  ),
  sections: [
    {
      id: "levels",
      tocTitle: t("声音对照", "Sound comparison"),
      title: t("声音分贝对照", "Compare everyday sound levels"),
      paragraphs: [
        t(
          "参考保留来源的 dB / dBA，测量距离未统一，不能直接等同于本站网页估算。七档仅帮助浏览声音量级，不代表舒适度或安全等级。",
          "References retain the source's dB / dBA units without a common measurement distance and are not equivalents of this site's browser estimates. Bands help compare approximate levels; they are not comfort or safety ratings.",
        ),
      ],
    },
    {
      id: "health",
      tocTitle: t("噪音与健康", "Noise and health"),
      title: t("噪音与健康", "Noise and health"),
      paragraphs: [
        t(
          "声音大小之外，还要看持续多久、是否反复出现。了解噪音对听力、睡眠和专注的影响。",
          "Duration and repetition matter alongside sound level. Learn how noise affects hearing, sleep and focus.",
        ),
      ],
    },
    {
      id: "reading",
      tocTitle: t("参考说明", "Using the chart"),
      title: t("如何理解这些声音参考？", "How to use these sound references"),
      paragraphs: [],
    },
  ],
  sources: Object.values(soundSources).filter((source) =>
    soundReferences.some((sound) => soundSources[sound.source].id === source.id),
  ),
  related: ["dbfs-spl", "phone-accuracy", "calibration", "guide"],
};

type ChartNote = Pick<ContentSection, "id" | "title" | "paragraphs"> & {
  link: { id?: string; pageId: string; label: Dual };
};

export const decibelChartNotes: ChartNote[] = [
  {
    id: "distance",
    title: t("为什么同一种声音的参考值会不同？", "Why can the same sound have different levels?"),
    paragraphs: [
      t(
        "型号、工作状态、距离和背景声都会影响读数。表中保留来源的单值或范围，查看时要连同比较条件一起理解。",
        "The model, operating state, distance and background sound can change a reading. References retain each source's value or range, so compare them with their stated conditions.",
      ),
    ],
    link: {
      pageId: "guide",
      label: t("查看同条件测量的方法", "Learn how to compare under the same conditions"),
    },
  },
  {
    id: "limits",
    title: t(
      "表中的数值，能和网页读数直接比较吗？",
      "Can I compare the chart directly with the browser meter?",
    ),
    paragraphs: [
      t(
        "本站网页提供标注未校准的估算噪音分贝，不等同于表中的 dBA。比较环境变化时，请保持同一设备、输入设置和观察位置。",
        "This site's meter gives a labelled, uncalibrated noise estimate. It is not equivalent to the chart's dBA values. To compare a change, keep the same device, input settings and position.",
      ),
    ],
    link: {
      id: "scale",
      pageId: "dbfs-spl",
      label: t("了解 dBFS、dB SPL 与网页估算", "Understand dBFS, dB SPL and meter estimates"),
    },
  },
];
