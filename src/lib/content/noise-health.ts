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
    title: t("强声暴露：听力与耳鸣", "Loud sound: hearing and tinnitus"),
    paragraphs: [
      t(
        "爆炸等强烈冲击声，以及长时间、反复接触的强声，都可能损伤听力。音量、距离和暴露时长需要一起看，不能只等到耳朵明显不舒服才采取保护。",
        "An intense impulse or repeated, prolonged loud sound can harm hearing. Consider level, distance and duration together; obvious discomfort is not a prerequisite for protection.",
      ),
      t(
        "强声暴露后可能出现耳鸣或听声音发闷。感觉恢复不等于可以继续承受相同暴露；怀疑听力变化时，应安排专业听力检查。",
        "Ringing or muffled hearing can follow loud sound. Feeling better does not establish that further exposure is harmless. Arrange a hearing test if you suspect a change.",
      ),
    ],
    sources: [healthSources.hearing],
  },
  {
    id: "daily-life",
    title: t("日常干扰：睡眠、烦扰与专注", "Everyday disturbance: sleep, annoyance and focus"),
    paragraphs: [
      t(
        "交通、邻里或设备声可能打断睡眠、引起烦扰，或干扰工作和学习。听力损伤不是判断噪音是否值得改善的唯一依据，也不存在适合所有活动的同一条分贝界线。",
        "Traffic, neighbours or equipment may disturb sleep, cause annoyance or interrupt work and learning. Hearing damage is not the only reason to address noise; one decibel boundary does not suit every activity.",
      ),
      t(
        "观察夜间或学习环境时，把醒来、难以听清说话、任务被打断等实际影响一起记录。儿童、老人、慢病人群和轮班工作者的活动与休息安排，也需要纳入考虑。",
        "Alongside noise observations, note awakenings, difficulty hearing speech or interrupted tasks. Consider the learning and rest needs of children, older people, people with chronic conditions and shift workers.",
      ),
    ],
    sources: [healthSources.overview, healthSources.night],
  },
  {
    id: "long-term",
    title: t("长期影响：怎样理解研究结论", "Long-term effects: reading the evidence"),
    paragraphs: [
      t(
        "WHO 的环境噪音资料涉及睡眠、认知，以及缺血性心脏病和高血压等长期健康影响。这些证据需要结合研究人群、声源与长期暴露条件理解。",
        "WHO material covers sleep and cognition, alongside longer-term outcomes such as ischaemic heart disease and hypertension. Interpret findings with their population, source and exposure conditions.",
      ),
      t(
        "群体研究中的风险关系不能换算成某个人的患病概率；一次网页估算也不能证明这些疾病由当前声源造成。长期反复的干扰值得记录和评估，单个数字并不能完成判断。",
        "Population findings do not calculate an individual's disease probability. One browser estimate cannot establish that a source caused an illness. Recurring disturbance deserves documentation and assessment beyond a single number.",
      ),
    ],
    sources: [healthSources.environment],
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
    "噪音的影响不只取决于分贝数，还与持续时间、出现时段和活动有关。先分清问题，再选择减少干扰、记录变化或寻求专业帮助；单次网页读数不能判断个人健康风险。",
    "Noise effects depend on duration, timing and activity as well as level. Identify the concern before reducing disturbance, documenting change or seeking help. One browser reading cannot determine personal health risk.",
  ),
  sections: [
    {
      id: "effects",
      tocTitle: t("影响概览", "Health effects"),
      title: t("噪音会怎样影响我们？", "How can noise affect us?"),
      paragraphs: [
        t(
          "先区分强声对听力的伤害、日常活动受到的干扰，以及长期暴露研究中的健康影响。它们关注的问题不同，需要的判断依据也不同。",
          "Distinguish hearing harm, disruption to daily activities and findings about long-term exposure. Each concern calls for different evidence.",
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
