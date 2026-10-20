import { soundSources } from "./sound-references.ts";
import { dual as t, type ContentSection, type SiteContent } from "./types.ts";

export const decibelChart: SiteContent = {
  id: "decibel-chart",
  slug: "knowledge/decibel-chart",
  kind: "article",
  updated: "2026-10-20",
  title: t("分贝对照表：常见声音与噪音水平", "Decibel chart: everyday sounds and noise levels"),
  description: t(
    "查询耳语、家电、交通和音乐会的分贝参考，按声音名称、分贝值与类别筛选，了解 40、50、60、70 分贝有多大及比较条件。",
    "Look up whispers, appliances, traffic and concerts by name, decibel value or category. Compare everyday sound references, their conditions and what 40–70 dB means.",
  ),
  takeaway: t(
    "轻声耳语约 30 dB，正常交谈约 60–70 dBA。按分段、声音名称或数值，查找常见声音的参考量级。",
    "Soft whispering is around 30 dB; normal conversation is around 60–70 dBA. Find everyday sound references by band, name or number.",
  ),
  sections: [
    {
      id: "levels",
      tocTitle: t("分段概览", "Level overview"),
      title: t("从安静到吵闹", "From quiet to noisy"),
      paragraphs: [
        t(
          "点选分段查看对应声音。分段仅描述大致吵闹程度，不代表舒适度或安全等级。",
          "Select a band to find sounds. Bands describe approximate noisiness, not comfort or safety ratings.",
        ),
      ],
    },
    {
      id: "reference",
      tocTitle: t("声音查询", "Sound lookup"),
      title: t("常见声音查询", "Look up everyday sounds"),
      paragraphs: [
        t(
          "参考保留来源的 dB / dBA，未统一测量距离。数值不是本站测量或校准结果，也不能直接等同于网页估算读数。",
          "References retain the source's dB / dBA units without a common measurement distance. They are not measurements or calibration results from this site, or equivalents of its browser estimates.",
        ),
      ],
    },
    {
      id: "reading",
      tocTitle: t("读数说明", "Reading guide"),
      title: t("关于读数，你可能还想了解", "Understanding the numbers"),
      paragraphs: [],
    },
  ],
  sources: Object.values(soundSources).filter((source) => source.id !== soundSources.niosh.id),
  related: ["dbfs-spl", "phone-accuracy", "calibration", "guide"],
};

export const decibelChartNotes: ContentSection[] = [
  {
    id: "numbers",
    tocTitle: t("40–70 分贝", "40–70 dB"),
    title: t("40、50、60、70 分贝有多大？", "How loud are 40, 50, 60 and 70 decibels?"),
    paragraphs: [
      t(
        "可以先用以下例子形成直觉。相同分贝值不意味着相同听感；持续嗡声、交谈和短促撞击的影响也不相同。",
        "Use these examples to build an intuition. Equal levels do not imply identical experiences; a steady hum, speech and a brief impact differ.",
      ),
    ],
    table: {
      headers: [
        t("分贝量级", "Level"),
        t("可以联想到的声音", "Sound reference"),
        t("来源", "Source"),
      ],
      rows: [
        [
          t("40 dB", "40 dB"),
          t("图书馆、冰箱运转", "Library or refrigerator humming"),
          t("WHO / CDC", "WHO / CDC"),
        ],
        [t("50 dB", "50 dB"), t("普通家庭背景声", "Average home background"), t("NIH", "NIH")],
        [
          t("60 dB 左右", "Around 60 dB"),
          t(
            "干衣机；正常交谈参考范围为 60–70 dBA",
            "Clothes dryer; normal conversation spans 60–70 dBA",
          ),
          t("NIH / NIDCD", "NIH / NIDCD"),
        ],
        [
          t("70 dB 左右", "Around 70 dB"),
          t(
            "吸尘器；也接近上述交谈范围的上端",
            "Vacuum cleaner; also near the upper end of that conversation range",
          ),
          t("NIH / NIDCD", "NIH / NIDCD"),
        ],
      ],
    },
  },
  {
    id: "scale",
    tocTitle: t("分贝刻度", "Decibel scale"),
    title: t("为什么分贝不能直接相加？", "Why do decibels not add directly?"),
    paragraphs: [
      t(
        "分贝采用对数刻度。在相同参考与可比条件下，声强级相差 10 dB 对应声强相差 10 倍，相差 20 dB 则为 100 倍；这不等于人耳感觉响了 10 倍或 100 倍。",
        "Decibels use a logarithmic scale. With the same reference and comparable conditions, a 10 dB intensity-level difference represents ten times the intensity, and 20 dB represents a hundred times. Perceived loudness does not increase by those factors.",
      ),
      t(
        "例如，两个在同一位置各贡献 60 dB、可按能量叠加的独立非相干声源，合计约为 63 dB，并不是 120 dB。实际结果仍受背景声和声源条件影响。",
        "For example, two independent, incoherent sources each contributing 60 dB at the same position combine to about 63 dB, rather than 120 dB. Background sound and source conditions still affect the result.",
      ),
    ],
  },
  {
    id: "distance",
    tocTitle: t("比较方法", "How to compare"),
    title: t("怎样比较自己环境里的声音？", "How to compare sounds in your surroundings"),
    paragraphs: [
      t(
        "先固定观察条件，再比较同一问题的变化。来源没有给出距离的条目，仅用于理解量级；不能把它当作当前设备应当显示的目标数。",
        "Fix the observation conditions before comparing a change. Where a source gives no distance, use the reference only as a sense of scale, not as a target reading for your device.",
      ),
    ],
    items: [
      t(
        "使用同一设备、输入与设置，保持位置、距离和朝向一致。",
        "Use the same device, input and settings, with a fixed position, distance and orientation.",
      ),
      t(
        "比较家电开关或档位时，同时记录门窗、背景活动与运行状态。",
        "When comparing appliance states or settings, note windows, background activity and operating state.",
      ),
      t(
        "观察一段时间并重复测量，保留摘要与条件；不要只比较一次最高值。",
        "Observe for a while and repeat, keeping summaries with conditions instead of comparing one maximum.",
      ),
    ],
  },
  {
    id: "limits",
    tocTitle: t("读数限制", "Reading limits"),
    title: t("对照表与网页读数怎样配合使用？", "How does the chart relate to browser readings?"),
    paragraphs: [
      t(
        "本站默认提供标注未校准的通用估算噪音分贝，适合在相同设备与条件下观察变化。它不能直接等同于表中的 dBA；原始 dBFS 也不是环境声压级。具备参考声级计时，可选用参考校准，但单点偏移不会自动带来 A 计权或专业测量能力。",
        "The meter defaults to a labelled, uncalibrated noise estimate for observing changes with the same device and conditions. It is not equivalent to the dBA references; raw dBFS is not environmental sound pressure level either. An optional reference offset does not add A-weighting or professional measurement capability.",
      ),
      t(
        "网页播放声音的实际分贝取决于扬声器、音量与距离，不能用播放按钮保证重现指定声级。需要判断合规或健康风险时，应采用适合该用途的专业测量。",
        "Playback level depends on speakers, volume and distance, so a web playback button cannot guarantee a specified sound level. Use an appropriate professional assessment for compliance or health decisions.",
      ),
    ],
  },
];

export const healthTeaser = t(
  "健康影响需要结合暴露时长、活动与环境理解，单次网页读数不能判断个人风险。",
  "Health effects depend on exposure, activity and setting; one browser reading cannot determine personal risk.",
);
