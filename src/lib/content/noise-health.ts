import { soundSources } from "./sound-references.ts";
import { dual as t, type SiteContent } from "./types.ts";

export const healthSources = {
  hearing: soundSources.nidcd,
  occupation: soundSources.niosh,
  environment: {
    id: "health-source-environment",
    label: "WHO",
    title: "WHO · Guidance on environmental noise · 2024 compendium",
    url: "https://www.who.int/tools/compendium-on-health-and-environment/environmental-noise",
  },
  overview: {
    id: "health-source-overview",
    label: "WHO Europe",
    title: "WHO Europe · Noise: health effects and environmental exposure",
    url: "https://www.who.int/europe/health-topics/noise",
  },
  night: {
    id: "health-source-night",
    label: "WHO Europe · 2011",
    title: "WHO Europe · Noise fact sheet (2011): sleep and children's learning",
    url: "https://www.who.int/europe/news-room/fact-sheets/item/noise",
  },
  guidance: {
    id: "health-source-guidance",
    label: "WHO Europe",
    title: "WHO Europe · Environmental noise guidelines for the European Region (2018)",
    url: "https://www.who.int/europe/publications/i/item/9789289053563",
  },
};

export const healthImpacts = [
  {
    id: "hearing",
    title: t("听力损伤", "Hearing damage"),
    paragraphs: [
      t(
        "一次强烈冲击声，或长时间、反复接触强声，都可能损伤听力。损伤有时逐渐发生，不应等到明显不适才采取保护。",
        "One intense impulse or repeated, prolonged loud sound can damage hearing. Harm can develop gradually, before you notice a problem.",
      ),
    ],
    sources: [healthSources.hearing],
  },
  {
    id: "tinnitus",
    title: t("耳鸣与听觉发闷", "Ringing and muffled hearing"),
    paragraphs: [
      t(
        "强声后可能出现耳鸣或听声音发闷。感觉恢复不代表没有残留损伤；怀疑听力变化时，应安排专业检查。",
        "Ringing or muffled hearing can follow loud sound. Feeling better does not rule out lasting harm. Arrange a hearing test if you suspect a change.",
      ),
    ],
    sources: [healthSources.hearing],
  },
  {
    id: "sleep",
    title: t("睡眠干扰", "Disturbed sleep"),
    paragraphs: [
      t(
        "交通、邻里或设备声可能打断睡眠，影响休息。除了声音大小，也要关注发生时段、反复次数，以及是否被吵醒。",
        "Traffic, neighbours or equipment may interrupt sleep and rest. Consider when sound occurs, how often it repeats and whether it wakes you.",
      ),
    ],
    sources: [healthSources.overview],
  },
  {
    id: "daily-life",
    title: t("烦扰与专注", "Annoyance and focus"),
    paragraphs: [
      t(
        "噪音可能引起烦扰，干扰交谈、工作和学习。即使主要问题不是听力损伤，持续的日常干扰也值得改善。",
        "Noise can cause annoyance and interrupt conversation, work and learning. Persistent disruption deserves attention even when hearing damage is not the main concern.",
      ),
    ],
    sources: [healthSources.overview],
  },
  {
    id: "long-term",
    title: t("心血管风险", "Cardiovascular risk"),
    paragraphs: [
      t(
        "WHO 资料指出，环境噪音暴露与缺血性心脏病、高血压等风险有关。应结合研究人群、声源与长期暴露条件理解。",
        "WHO material links environmental noise exposure with risks including ischaemic heart disease and hypertension. Interpret findings in their population, source and long-term exposure context.",
      ),
    ],
    sources: [healthSources.environment],
  },
  {
    id: "vulnerable-groups",
    title: t("儿童与敏感人群", "Children and vulnerable groups"),
    paragraphs: [
      t(
        "儿童的学习与休息需要特别关注。WHO 也提示，老人、慢病人群及轮班工作者更易受到噪音干扰。",
        "Children's learning and rest need particular attention. WHO also identifies older people, people with chronic conditions and shift workers as vulnerable to noise disturbance.",
      ),
    ],
    sources: [healthSources.night],
  },
] as const;

export const exposureFactors = [
  t(
    "强度与持续时间：短促冲击声、连续运行和反复出现的声音，不能只凭一个最高值比较。",
    "Level and duration: an impulse, steady sound and repeated events cannot be compared by one maximum alone.",
  ),
  t(
    "时段与活动：睡眠、学习和白天普通活动，对干扰的关注点不同。",
    "Timing and activity: sleep, learning and ordinary daytime activities raise different concerns.",
  ),
  t(
    "单位与平均周期：瞬时读数不等于长期平均；网页未校准估算也不等于 A 计权的 dBA。",
    "Units and averaging: a momentary reading is not a long-term average; this site's uncalibrated estimate is not A-weighted dBA.",
  ),
] as const;

export const healthActions = [
  {
    title: t("先降低或避开可控声源", "Reduce or avoid sources you can control"),
    body: t(
      "降低播放音量、拉开距离，减少在强声环境中的停留；需要时正确使用合适的听力防护。工作场所还应优先考虑声源和工程控制。",
      "Lower playback volume, move away and spend less time around loud sound. Use suitable hearing protection correctly when needed. Workplaces should also prioritize source and engineering controls.",
    ),
  },
  {
    title: t("按正在做的事调整环境", "Adapt the setting to the activity"),
    body: t(
      "把睡眠、学习和普通活动分开观察。尝试调整设备位置、活动时段或门窗状态，比较实际干扰是否减轻。",
      "Observe sleep, study and everyday activities separately. Try equipment placement, quieter times or window changes, then compare the disturbance you experience.",
    ),
  },
  {
    title: t("记录变化，也保留条件", "Keep context with the change"),
    body: t(
      "记下声源、时段、持续多久和实际影响。使用网页工具时固定设备、位置和设置；摘要用于沟通与同条件比较，不充当健康证明。",
      "Record the source, timing, duration and experienced effects. Keep device, position and settings fixed for browser comparisons. Summaries support discussion, without certifying health or safety.",
    ),
  },
] as const;

export const noiseHealth: SiteContent = {
  id: "noise-health",
  slug: "knowledge/noise-and-health",
  kind: "article",
  updated: "2026-10-20",
  title: t("噪音对健康的影响", "Noise and health"),
  description: t(
    "分清强声对听力的影响与日常噪音干扰，理解暴露时长、研究语境和 NIOSH 职业参考，了解减少噪音与寻求专业帮助的下一步。",
    "Understand hearing effects, everyday disturbance and exposure context. Learn what the NIOSH occupational reference means and how to reduce noise or seek further help.",
  ),
  takeaway: t(
    "声音越响，越需要缩短暴露；健康影响还与时段、活动和个人情况有关。单次网页读数不能判断个人健康风险。",
    "Louder sound calls for shorter exposure. Timing, activity and individual factors also matter. One browser reading cannot determine personal health risk.",
  ),
  sections: [
    {
      id: "exposure",
      tocTitle: t("暴露时长", "Exposure time"),
      title: t("暴露时长：声音越响，时间越短", "Exposure time: louder sound, less time"),
      paragraphs: [
        t(
          "下面按 NIOSH 职业听力保护参考，演示声级与每日累计暴露时长的关系：85 dBA 对应 8 小时，每增加 3 dBA，参考时长减半。",
          "Explore the NIOSH occupational hearing reference for daily cumulative exposure: 85 dBA corresponds to 8 hours, with the duration halved for each 3 dBA increase.",
        ),
      ],
    },
    {
      id: "effects",
      tocTitle: t("影响概览", "Health effects"),
      title: t("噪音会怎样影响我们？", "How can noise affect us?"),
      paragraphs: [
        t(
          "噪音的影响不只在耳朵。下面六个方面，分别涉及强声伤害、日常干扰和长期暴露研究。",
          "Noise affects more than hearing. These six topics cover loud-sound harm, everyday disruption and findings about long-term exposure.",
        ),
      ],
    },
    {
      id: "actions",
      tocTitle: t("减少干扰", "Reduce disturbance"),
      title: t("从能控制的部分开始", "Start with what you can change"),
      paragraphs: [
        t(
          "优先减少暴露与干扰，再用记录检验调整是否有帮助。",
          "Reduce exposure and disturbance first, then use observations to review the change.",
        ),
      ],
    },
    {
      id: "context",
      tocTitle: t("理解暴露", "Exposure context"),
      title: t("为什么不能只看一个分贝数？", "Why is one decibel number not enough?"),
      paragraphs: [
        t(
          "读到健康建议时，先看它针对什么声源、哪个人群，以及采用什么测量指标。WHO 环境噪音指南与 NIOSH 职业听力保护参考服务于不同场景，不能互相替代。",
          "Check the source, population and measurement indicator behind a recommendation. WHO environmental guidance and NIOSH occupational hearing references address different settings.",
        ),
        t(
          "群体研究中的风险关系不能换算成个人患病概率；一次网页估算也不能证明某种疾病由当前声源造成。记录长期反复的干扰，比只看一个最高值更有帮助。",
          "Population findings cannot calculate your disease probability, and one browser estimate cannot establish the cause of an illness. Document recurring disturbance rather than relying on one maximum.",
        ),
      ],
    },
    {
      id: "help",
      tocTitle: t("下一步", "Further help"),
      title: t("什么时候需要专业帮助？", "When is further help useful?"),
      paragraphs: [
        t(
          "如果怀疑自己的听力发生变化，可向医疗或听力专业人员咨询并安排听力检查，不必等网页数字给出结论。",
          "If you suspect a change in hearing, consult a health or hearing professional and arrange a hearing test rather than waiting for a browser number.",
        ),
        t(
          "持续的睡眠干扰、复杂工作场所暴露或需要判断合规的场景，应分别寻求相应的医疗、职业健康或专业声学评估。网页摘要可保留观察条件，但不能替代这些评估。",
          "Persistent sleep concerns, complex workplace exposures and compliance questions call for the relevant health, occupational or acoustic assessment. Browser summaries can document observations but cannot replace those assessments.",
        ),
      ],
    },
  ],
  sources: Object.values(healthSources),
  related: ["phone-accuracy", "dbfs-spl", "guide"],
};
