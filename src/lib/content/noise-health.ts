import { soundSources } from "./sound-references.ts";
import { translations as t, type SiteContent } from "./types.ts";

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
    emoji: "👂",
    title: t("听力损伤", "Hearing damage", "聽力損傷"),
    paragraphs: [
      t(
        "一次强烈冲击声，或长时间、反复接触强声，都可能损伤听力。损伤有时逐渐发生，不应等到明显不适才采取保护。",
        "One intense impulse or repeated, prolonged loud sound can damage hearing. Harm can develop gradually, before you notice a problem.",
        "一次強烈衝擊聲，或長時間、反覆接觸強聲，都可能損傷聽力。損傷有時逐漸發生，不應等到明顯不適才採取保護。",
      ),
    ],
    sources: [healthSources.hearing],
  },
  {
    id: "tinnitus",
    emoji: "🔔",
    title: t("耳鸣与听觉发闷", "Ringing and muffled hearing", "耳鳴與聽覺發悶"),
    paragraphs: [
      t(
        "强声后可能出现耳鸣或听声音发闷。感觉恢复不代表没有残留损伤；怀疑听力变化时，应安排专业检查。",
        "Ringing or muffled hearing can follow loud sound. Feeling better does not rule out lasting harm. Arrange a hearing test if you suspect a change.",
        "強聲後可能出現耳鳴或聽聲音發悶。感覺恢復不代表沒有殘留損傷；懷疑聽力變化時，應安排專業檢查。",
      ),
    ],
    sources: [healthSources.hearing],
  },
  {
    id: "sleep",
    emoji: "😴",
    title: t("睡眠干扰", "Disturbed sleep", "睡眠干擾"),
    paragraphs: [
      t(
        "交通、邻里或设备声可能打断睡眠，影响休息。除了声音大小，也要关注发生时段、反复次数，以及是否被吵醒。",
        "Traffic, neighbours or equipment may interrupt sleep and rest. Consider when sound occurs, how often it repeats and whether it wakes you.",
        "交通、鄰里或裝置聲可能打斷睡眠，影響休息。除了聲音大小，也要關注發生時段、反覆次數，以及是否被吵醒。",
      ),
    ],
    sources: [healthSources.overview],
  },
  {
    id: "daily-life",
    emoji: "🧠",
    title: t("烦扰与专注", "Annoyance and focus", "煩擾與專注"),
    paragraphs: [
      t(
        "噪音可能引起烦扰，干扰交谈、工作和学习。即使主要问题不是听力损伤，持续的日常干扰也值得改善。",
        "Noise can cause annoyance and interrupt conversation, work and learning. Persistent disruption deserves attention even when hearing damage is not the main concern.",
        "噪音可能引起煩擾，干擾交談、工作和學習。即使主要問題不是聽力損傷，持續的日常干擾也值得改善。",
      ),
    ],
    sources: [healthSources.overview],
  },
  {
    id: "long-term",
    emoji: "❤️",
    title: t("心血管风险", "Cardiovascular risk", "心血管風險"),
    paragraphs: [
      t(
        "WHO 资料指出，环境噪音暴露与缺血性心脏病、高血压等风险有关。应结合研究人群、声源与长期暴露条件理解。",
        "WHO material links environmental noise exposure with risks including ischaemic heart disease and hypertension. Interpret findings in their population, source and long-term exposure context.",
        "WHO 資料指出，環境噪音暴露與缺血性心臟病、高血壓等風險有關。應結合研究人群、聲源與長期暴露條件理解。",
      ),
    ],
    sources: [healthSources.environment],
  },
  {
    id: "vulnerable-groups",
    emoji: "👶",
    title: t("儿童与敏感人群", "Children and vulnerable groups", "兒童與敏感人群"),
    paragraphs: [
      t(
        "儿童的学习与休息需要特别关注。WHO 也提示，老人、慢病人群及轮班工作者更易受到噪音干扰。",
        "Children's learning and rest need particular attention. WHO also identifies older people, people with chronic conditions and shift workers as vulnerable to noise disturbance.",
        "兒童的學習與休息需要特別關注。WHO 也提示，老人、慢病人群及輪班工作者更易受到噪音干擾。",
      ),
    ],
    sources: [healthSources.night],
  },
] as const;

export const exposureFactors = [
  t(
    "强度与持续时间：短促冲击声、连续运行和反复出现的声音，不能只凭一个最高值比较。",
    "Level and duration: an impulse, steady sound and repeated events cannot be compared by one maximum alone.",
    "強度與持續時間：短促衝擊聲、連續執行和反覆出現的聲音，不能只憑一個最高值比較。",
  ),
  t(
    "时段与活动：睡眠、学习和白天普通活动，对干扰的关注点不同。",
    "Timing and activity: sleep, learning and ordinary daytime activities raise different concerns.",
    "時段與活動：睡眠、學習和白天普通活動，對干擾的關注點不同。",
  ),
  t(
    "单位与平均周期：瞬时读数不等于长期平均；网页未校准估算也不等于 A 计权的 dBA。",
    "Units and averaging: a momentary reading is not a long-term average; this site's uncalibrated estimate is not A-weighted dBA.",
    "單位與平均週期：瞬時讀數不等於長期平均；網頁未校正估算也不等於 A 計權的 dBA。",
  ),
] as const;

export const healthActions = [
  {
    title: t(
      "先降低或避开可控声源",
      "Reduce or avoid sources you can control",
      "先降低或避開可控聲源",
    ),
    body: t(
      "降低播放音量、拉开距离，减少在强声环境中的停留；需要时正确使用合适的听力防护。工作场所还应优先考虑声源和工程控制。",
      "Lower playback volume, move away and spend less time around loud sound. Use suitable hearing protection correctly when needed. Workplaces should also prioritize source and engineering controls.",
      "降低播放音量、拉開距離，減少在強聲環境中的停留；需要時正確使用合適的聽力防護。工作場所還應優先考慮聲源和工程控制。",
    ),
  },
  {
    title: t("按正在做的事调整环境", "Adapt the setting to the activity", "按正在做的事調整環境"),
    body: t(
      "把睡眠、学习和普通活动分开观察。尝试调整设备位置、活动时段或门窗状态，比较实际干扰是否减轻。",
      "Observe sleep, study and everyday activities separately. Try equipment placement, quieter times or window changes, then compare the disturbance you experience.",
      "把睡眠、學習和普通活動分開觀察。嘗試調整裝置位置、活動時段或門窗狀態，比較實際干擾是否減輕。",
    ),
  },
  {
    title: t("记录变化，也保留条件", "Keep context with the change", "記錄變化，也保留條件"),
    body: t(
      "记下声源、时段、持续多久和实际影响。使用网页工具时固定设备、位置和设置；摘要用于沟通与同条件比较，不充当健康证明。",
      "Record the source, timing, duration and experienced effects. Keep device, position and settings fixed for browser comparisons. Summaries support discussion, without certifying health or safety.",
      "記下聲源、時段、持續多久和實際影響。使用網頁工具時固定裝置、位置和設定；摘要用於溝通與同條件比較，不充當健康證明。",
    ),
  },
] as const;

export const noiseHealth: SiteContent = {
  id: "noise-health",
  slug: "knowledge/noise-and-health",
  kind: "article",
  updated: "2026-10-25",
  title: t(
    "噪音会影响健康吗？听力、睡眠与专注",
    "Noise and Health: Hearing, Sleep and Focus",
    "噪音會影響健康嗎？聽力、睡眠與專注",
  ),
  description: t(
    "噪音会怎样影响听力、睡眠和专注？了解声音大小与持续时间为什么都重要，查看六项健康影响、日常减少噪音的方法，以及 NIOSH 职业暴露时长参考，找到适合自己的下一步。",
    "How does noise affect hearing, sleep and focus? Explore six health effects, practical ways to reduce noise and the NIOSH workplace exposure reference, with its conditions clearly explained.",
    "噪音會怎樣影響聽力、睡眠和專注？瞭解聲音大小與持續時間為什麼都重要，查看六項健康影響、日常減少噪音的方法，以及 NIOSH 職業暴露時長參考，找到適合自己的下一步。",
  ),
  takeaway: t(
    "声音越响，越需要缩短暴露；健康影响还与时段、活动和个人情况有关。单次网页读数不能判断个人健康风险。",
    "Louder sound calls for shorter exposure. Timing, activity and individual factors also matter. One browser reading cannot determine personal health risk.",
    "聲音越響，越需要縮短暴露；健康影響還與時段、活動和個人情況有關。單次網頁讀數不能判斷個人健康風險。",
  ),
  sections: [
    {
      id: "exposure",
      tocTitle: t("暴露时长", "Exposure time", "暴露時長"),
      title: t(
        "暴露时长：声音越响，时间越短",
        "Exposure time: louder sound, less time",
        "暴露時長：聲音越響，時間越短",
      ),
      paragraphs: [
        t(
          "长期或反复接触 85 dBA 及以上噪音，可能造成听力损伤或耳鸣，部分损伤不可逆。下方按 NIOSH 职业听力保护建议，提供不同声级的每日累计暴露时长参考。",
          "Long or repeated exposure to noise at or above 85 dBA can cause hearing damage or tinnitus, and some damage is permanent. The calculator and reference points below follow NIOSH occupational hearing recommendations for daily cumulative exposure.",
          "長期或反覆接觸 85 dBA 及以上噪音，可能造成聽力損傷或耳鳴，部分損傷不可逆。下方按 NIOSH 職業聽力保護建議，提供不同聲級的每日累計暴露時長參考。",
        ),
      ],
    },
    {
      id: "effects",
      tocTitle: t("影响概览", "Health effects", "影響概覽"),
      title: t("噪音会怎样影响我们？", "How can noise affect us?", "噪音會怎樣影響我們？"),
      paragraphs: [
        t(
          "噪音的影响不只在耳朵。下面六个方面，分别涉及强声伤害、日常干扰和长期暴露研究。",
          "Noise affects more than hearing. These six topics cover loud-sound harm, everyday disruption and findings about long-term exposure.",
          "噪音的影響不只在耳朵。下面六個方面，分別涉及強聲傷害、日常干擾和長期暴露研究。",
        ),
      ],
    },
    {
      id: "actions",
      tocTitle: t("减少干扰", "Reduce disturbance", "減少干擾"),
      title: t("从能控制的部分开始", "Start with what you can change", "從能控制的部分開始"),
      paragraphs: [
        t(
          "优先减少暴露与干扰，再用记录检验调整是否有帮助。",
          "Reduce exposure and disturbance first, then use observations to review the change.",
          "優先減少暴露與干擾，再用記錄檢驗調整是否有幫助。",
        ),
      ],
    },
    {
      id: "context",
      tocTitle: t("理解暴露", "Exposure context", "理解暴露"),
      title: t(
        "为什么不能只看一个分贝数？",
        "Why is one decibel number not enough?",
        "為什麼不能只看一個分貝數？",
      ),
      paragraphs: [
        t(
          "读到健康建议时，先看它针对什么声源、哪个人群，以及采用什么测量指标。WHO 环境噪音指南与 NIOSH 职业听力保护参考服务于不同场景，不能互相替代。",
          "Check the source, population and measurement indicator behind a recommendation. WHO environmental guidance and NIOSH occupational hearing references address different settings.",
          "讀到健康建議時，先看它針對什麼聲源、哪個人群，以及採用什麼測量指標。WHO 環境噪音指南與 NIOSH 職業聽力保護參考服務於不同場景，不能互相替代。",
        ),
        t(
          "群体研究中的风险关系不能换算成个人患病概率；一次网页估算也不能证明某种疾病由当前声源造成。记录长期反复的干扰，比只看一个最高值更有帮助。",
          "Population findings cannot calculate your disease probability, and one browser estimate cannot establish the cause of an illness. Document recurring disturbance rather than relying on one maximum.",
          "群體研究中的風險關係不能換算成個人患病機率；一次網頁估算也不能證明某種疾病由當前聲源造成。記錄長期反覆的干擾，比只看一個最高值更有幫助。",
        ),
      ],
    },
    {
      id: "help",
      tocTitle: t("下一步", "Further help", "下一步"),
      title: t("什么时候需要专业帮助？", "When is further help useful?", "什麼時候需要專業幫助？"),
      paragraphs: [
        t(
          "如果怀疑自己的听力发生变化，可向医疗或听力专业人员咨询并安排听力检查，不必等网页数字给出结论。",
          "If you suspect a change in hearing, consult a health or hearing professional and arrange a hearing test rather than waiting for a browser number.",
          "如果懷疑自己的聽力發生變化，可向醫療或聽力專業人員諮詢並安排聽力檢查，不必等網頁數字給出結論。",
        ),
        t(
          "持续的睡眠干扰、复杂工作场所暴露或需要判断合规的场景，应分别寻求相应的医疗、职业健康或专业声学评估。网页摘要可保留观察条件，但不能替代这些评估。",
          "Persistent sleep concerns, complex workplace exposures and compliance questions call for the relevant health, occupational or acoustic assessment. Browser summaries can document observations but cannot replace those assessments.",
          "持續的睡眠干擾、複雜工作場所暴露或需要判斷合規的場景，應分別尋求相應的醫療、職業健康或專業聲學評估。網頁摘要可保留觀察條件，但不能替代這些評估。",
        ),
      ],
    },
  ],
  sources: Object.values(healthSources),
  related: ["phone-accuracy", "dbfs-spl", "guide"],
};
