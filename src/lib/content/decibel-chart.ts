import { soundSources } from "./sound-references.ts";
import { healthSources } from "./health-effects.ts";
import { dual as t, type SiteContent } from "./types.ts";

export const decibelChart: SiteContent = {
  id: "decibel-chart",
  slug: "knowledge/decibel-chart",
  kind: "article",
  updated: "2026-10-18",
  title: t("分贝对照表：常见声音与噪音水平", "Decibel chart: everyday sounds and noise levels"),
  description: t(
    "查询耳语、家电、交通和音乐会的分贝参考，按声音名称、分贝值与类别筛选，了解 40、50、60、70 分贝有多大及比较条件。",
    "Look up whispers, appliances, traffic and concerts by name, decibel value or category. Compare everyday sound references, their conditions and what 40–70 dB means.",
  ),
  takeaway: t(
    "轻声耳语约 30 dB，图书馆约 40 dB，正常交谈约 60–70 dBA。用下面的概览和声音查询建立量级感，再结合距离、环境与测量口径理解数值。",
    "Soft whispering is around 30 dB, a library around 40 dB, and normal conversation around 60–70 dBA. Explore the scale and sound lookup, keeping distance, surroundings and measurement method in context.",
  ),
  sections: [
    {
      id: "levels",
      tocTitle: t("分段概览", "Level overview"),
      title: t("从安静到强声：分贝分段概览", "From quiet to intense: the decibel scale"),
      paragraphs: [
        t(
          "分段便于快速浏览，示例范围可能跨越相邻区间。它们不是舒适度或安全等级；具体数值、单位和来源见下方查询。",
          "These bands help you browse; example ranges may span adjacent bands. They are not comfort or safety ratings. Find values, units and sources in the lookup below.",
        ),
      ],
    },
    {
      id: "reference",
      tocTitle: t("声音查询", "Sound lookup"),
      title: t("常见声音查询", "Look up everyday sounds"),
      paragraphs: [
        t(
          "参考来自 WHO、NIH、NIDCD、CDC 和 NPS 的公开教育资料。按原来源保留 dB 或 dBA 标记，未统一测量距离；这些数值不是某款产品的保证值，也不是本站测量或校准结果。",
          "References come from public educational material by WHO, NIH, NIDCD, CDC and NPS. Original dB or dBA labels are retained, without a common measurement distance. These are not product guarantees, measurements by this site or calibration results.",
        ),
      ],
    },
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
          t("分贝量级", "Approximate level"),
          t("可以联想到的声音", "Sound reference"),
          t("来源", "Source"),
        ],
        rows: [
          [
            t("40 dB", "40 dB"),
            t("图书馆、冰箱运转", "Library or refrigerator humming"),
            t("WHO / CDC", "WHO / CDC"),
          ],
          [
            t("50 dB", "50 dB"),
            t("普通家庭背景声", "Average home background"),
            t("NIH 教育资料", "NIH educational material"),
          ],
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
      id: "exposure",
      tocTitle: t("暴露参考", "Exposure reference"),
      title: t("声级与时间：NIOSH 职业暴露参考", "Level and time: NIOSH occupational reference"),
      paragraphs: [
        t(
          "NIOSH 的职业噪音建议以 8 小时工作日平均 85 dBA 为参考，每增加 3 dBA，相应暴露时长减半。下表用于理解这条规则，不是个人安全倒计时，也不表示低于某个数字就适合无限时暴露。",
          "NIOSH uses an occupational reference of 85 dBA averaged over an eight-hour workday, halving the exposure duration for each 3 dBA increase. This table explains that rule; it is not a personal safety countdown or a promise of unlimited exposure below one number.",
        ),
      ],
      table: {
        headers: [
          t("职业噪音声级", "Occupational noise level"),
          t("对应每日参考时长", "Corresponding daily duration"),
        ],
        rows: [
          [t("85 dBA", "85 dBA"), t("8 小时", "8 hours")],
          [t("88 dBA", "88 dBA"), t("4 小时", "4 hours")],
          [t("91 dBA", "91 dBA"), t("2 小时", "2 hours")],
          [t("94 dBA", "94 dBA"), t("1 小时", "1 hour")],
          [t("97 dBA", "97 dBA"), t("30 分钟", "30 minutes")],
          [t("100 dBA", "100 dBA"), t("15 分钟", "15 minutes")],
        ],
      },
      items: [
        t(
          "来源：CDC/NIOSH。该参考面向职业噪音；混合暴露、冲击声和个人差异需要单独考虑。",
          "Source: CDC/NIOSH. This is an occupational reference; mixed exposures, impulses and individual susceptibility need separate consideration.",
        ),
        t(
          "降低音量、远离声源、减少停留时间并使用合适的听力防护，有助于减少暴露。",
          "Lower the volume, move away, shorten exposure and use suitable hearing protection to reduce exposure.",
        ),
        t(
          "本站通用噪音估算没有 A 计权，也未经过跨设备声学精度验证，不能代入此表决定还能停留多久。",
          "This site's generic estimate is not A-weighted and has not undergone cross-device acoustic accuracy validation. Do not use it in this table to decide how long to stay.",
        ),
      ],
    },
    {
      id: "health",
      tocTitle: t("健康影响", "Health effects"),
      title: t("噪音污染对健康的影响", "How noise pollution can affect health"),
      paragraphs: [
        t(
          "噪音的影响不限于听力，也可能涉及睡眠、烦扰和长期健康。以下概括 WHO 与 CDC/NIOSH 的公开资料；实际影响与声源、暴露方式及个人情况有关。",
          "Noise can affect hearing, sleep, annoyance and long-term health. These summaries draw on public WHO and CDC/NIOSH material; effects depend on the source, exposure and individual circumstances.",
        ),
        t(
          "展开各主题查看背景与应对建议，来源就在条目下方。这里不使用单次网页读数判断个人健康风险。",
          "Expand a topic for context and practical actions, with its source immediately below. A single browser reading cannot determine personal health risk.",
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
  ],
  sources: [...Object.values(soundSources), ...Object.values(healthSources)],
  related: ["dbfs-spl", "phone-accuracy", "calibration", "guide"],
};
