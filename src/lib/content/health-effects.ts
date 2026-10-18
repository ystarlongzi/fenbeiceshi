import { soundSources } from "./sound-references.ts";
import { dual as t } from "./types.ts";

export const healthSources = {
  environment: {
    id: "health-source-environment",
    label: "WHO",
    title: "WHO · Guidance on environmental noise · 2024 compendium",
    url: "https://www.who.int/tools/compendium-on-health-and-environment/environmental-noise",
  },
  europe: {
    id: "health-source-europe",
    label: "WHO Europe",
    title: "WHO Europe · Noise · Sleep, performance and children",
    url: "https://www.who.int/europe/news-room/fact-sheets/item/noise",
  },
  stress: {
    id: "health-source-stress",
    label: "WHO Europe",
    title:
      "WHO Europe · Biological mechanisms related to cardiovascular and metabolic effects by environmental noise",
    url: "https://www.who.int/europe/publications/i/item/WHO-EURO-2018-3009-42767-59666",
  },
  performance: {
    id: "health-source-performance",
    label: "WHO Europe",
    title: "WHO Europe · Noise · Health topic overview",
    url: "https://www.who.int/europe/health-topics/noise",
  },
};

export const healthEffects = [
  {
    id: "hearing",
    title: t("听力与耳鸣", "Hearing & tinnitus"),
    summary: t(
      "听力风险与声音强度、暴露时长及重复频率有关。",
      "Hearing risk depends on level, duration and repeated exposure.",
    ),
    detail: t(
      "强噪音可能损伤听力。NIOSH 的 85 dBA／8 小时是职业暴露参考，不能解释为每个人在该时长内都没有风险。",
      "Loud noise can damage hearing. The NIOSH reference of 85 dBA over eight hours is occupational guidance, not a guarantee that everyone is free from risk within that duration.",
    ),
    action: t(
      "优先降低声源音量、拉开距离，并在高噪音活动中使用合适的听力防护。",
      "Lower source volume, move farther away and use suitable hearing protection during loud activities.",
    ),
    source: soundSources.niosh,
  },
  {
    id: "sleep",
    title: t("睡眠与休息", "Sleep & rest"),
    summary: t(
      "夜间噪音可能干扰睡眠，敏感人群更容易受到影响。",
      "Night-time noise can disturb sleep, especially for sensitive groups.",
    ),
    detail: t(
      "WHO 的夜间噪音资料区分卧室内外及不同平均周期。卧室外的全年夜间平均指标，不能直接当作房间里某次网页读数的睡眠界线。",
      "WHO guidance distinguishes indoor and outdoor conditions and averaging periods. An annual night-time average outside a bedroom is not a sleep threshold for one browser reading inside a room.",
    ),
    action: t(
      "记录夜间干扰出现的时段和声源，在相同条件下比较关窗或设备调整前后的变化。",
      "Note when night-time disturbances occur and their sources. Compare window or equipment changes under matching conditions.",
    ),
    source: healthSources.europe,
  },
  {
    id: "stress",
    title: t("烦扰与压力", "Annoyance & stress"),
    summary: t(
      "持续噪音可能带来烦扰和压力反应，个人感受存在差异。",
      "Persistent noise can cause annoyance and stress responses; experiences differ.",
    ),
    detail: t(
      "WHO 的机制资料讨论了环境噪音与压力反应的关系，也强调感知和心理因素的影响。相同分贝数不代表相同感受。",
      "WHO's mechanisms paper discusses environmental noise and stress responses, including the role of perception and psychological factors. Equal levels do not imply identical experiences.",
    ),
    action: t(
      "找出最打扰自己的声音与时段，优先减少可控制的声源。",
      "Identify the most disturbing sounds and times, then reduce sources you can control.",
    ),
    source: healthSources.stress,
  },
  {
    id: "cardiovascular",
    title: t("长期心血管影响", "Long-term cardiovascular effects"),
    summary: t(
      "长期环境噪音暴露与部分心血管疾病风险增加有关。",
      "Long-term environmental noise is linked to increased risk of some cardiovascular diseases.",
    ),
    detail: t(
      "WHO 资料涉及缺血性心脏病和高血压等影响。这些人群研究中的风险关系，不能由一次未校准网页读数推算个人患病风险。",
      "WHO material covers effects including ischaemic heart disease and hypertension. These population-level relationships cannot be used to calculate personal disease risk from one uncalibrated browser reading.",
    ),
    action: t(
      "对长期反复出现的噪音保留时间、声源和环境条件记录，便于进一步沟通与评估。",
      "Keep the timing, sources and conditions of recurring noise to support further discussion and assessment.",
    ),
    source: healthSources.environment,
  },
  {
    id: "attention",
    title: t("专注与学习表现", "Attention & performance"),
    summary: t(
      "噪音可能干扰学习、工作和需要专注的活动。",
      "Noise can interfere with learning, work and focused activities.",
    ),
    detail: t(
      "WHO 将较差的工作和学习表现列为噪音可能带来的影响。观察环境时，也应记录正在进行的任务与实际干扰。",
      "WHO lists poorer work and school performance among possible noise effects. Record the task and experienced disturbance when observing an environment.",
    ),
    action: t(
      "把需要专注的任务安排在较安静的时段或位置，并比较调整前后的实际体验。",
      "Use quieter times or locations for focused tasks and compare your experience before and after changes.",
    ),
    source: healthSources.performance,
  },
  {
    id: "children",
    title: t("儿童的学习环境", "Children's learning environments"),
    summary: t(
      "儿童长期噪音暴露的研究提示，应重视安静的学习环境。",
      "Research on children's long-term noise exposure highlights the value of quieter learning settings.",
    ),
    detail: t(
      "WHO 引述的长期飞机噪音研究发现儿童认知表现受到影响；理解结论时应保留具体人群、声源和长期暴露背景。",
      "WHO cites studies linking chronic aircraft noise exposure with poorer cognitive performance in children. Keep the population, source and long-term exposure context with the finding.",
    ),
    action: t(
      "为学习与休息安排更安静的位置，与照护者或学校沟通持续出现的噪音干扰。",
      "Seek quieter places for learning and rest, and discuss recurring disturbances with caregivers or the school.",
    ),
    source: healthSources.europe,
  },
] as const;
