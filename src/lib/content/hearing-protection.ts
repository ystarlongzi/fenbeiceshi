import { translations as t, type SiteContent } from "./types.ts";

export const hearingProtection: SiteContent = {
  id: "hearing-protection",
  slug: "knowledge/hearing-protection",
  kind: "article",
  updated: "2026-10-22",
  title: t(
    "听力保护：耳塞、耳罩与日常听音方法",
    "Hearing protection: earplugs, earmuffs and everyday listening",
    "聽力保護：耳塞、耳罩與日常聆聽方法",
  ),
  description: t(
    "了解如何降低强声暴露、选择耳塞或耳罩、正确佩戴泡棉耳塞，以及主动降噪耳机和听力防护用品的区别。认识需要专业检查的听力变化。",
    "Reduce loud-sound exposure, choose earplugs or earmuffs, fit foam earplugs correctly and understand the limits of noise-cancelling headphones. Recognize hearing changes that need professional attention.",
    "瞭解如何降低強聲暴露、選擇耳塞或耳罩、正確佩戴泡棉耳塞，以及主動抗噪耳機和聽力防護用品的區別。認識需要專業檢查的聽力變化。",
  ),
  takeaway: t(
    "先降低音量、远离强声并缩短停留，再按场景选择舒适、贴合且能持续正确佩戴的耳塞或耳罩。防护效果取决于实际佩戴，不能只看包装上的数字。",
    "Turn down the sound, move away and limit exposure. Choose comfortable earplugs or earmuffs that fit the setting and that you can wear correctly throughout the noise. Fit matters more than a packaging number alone.",
    "先降低音量、遠離強聲並縮短停留，再按情境選擇舒適、貼合且能持續正確佩戴的耳塞或耳罩。防護效果取決於實際佩戴，不能只看包裝上的數字。",
  ),
  sections: [
    {
      id: "reduce-exposure",
      tocTitle: t("先减少暴露", "Reduce exposure first", "先減少暴露"),
      title: t(
        "不要等耳朵不舒服才采取行动",
        "Act before you notice a hearing problem",
        "不要等耳朵不舒服才採取行動",
      ),
      paragraphs: [
        t(
          "强烈冲击声可能一次就损伤听力，长期或反复接触强声也可能逐渐造成损伤。声级、持续时间、距离和声音特征都重要；没有明显不适，不能证明当前声音安全。",
          "An intense impulse can damage hearing in one event, while repeated or prolonged loud sound can cause gradual harm. Level, duration, distance and sound characteristics all matter. A lack of obvious discomfort does not establish safety.",
          "強烈衝擊聲可能一次就損傷聽力，長期或反覆接觸強聲也可能逐漸造成損傷。聲級、持續時間、距離和聲音特徵都重要；沒有明顯不適，不能證明目前聲音安全。",
        ),
      ],
      items: [
        t(
          "能调低时先降低音量，能离开时拉开距离，并在安静处休息，减少累计接触时间。",
          "Lower sound you control, move away when you can, and take quiet breaks to reduce cumulative exposure.",
          "能調低時先降低音量，能離開時拉開距離，並在安靜處休息，減少累計接觸時間。",
        ),
        t(
          "在一臂距离交谈也需要提高声音，是该减小音量、离开或采取保护的提醒，不是精确的声级测量。",
          "Having to raise your voice to someone an arm's length away is a cue to lower sound, leave or protect your hearing, rather than a precise sound-level test.",
          "在一臂距離交談也需要提高聲音，是該減小音量、離開或採取保護的提醒，不是精確的聲級測量。",
        ),
        t(
          "工作场所应先评估声源和工程控制，再安排合适的听力防护、培训与佩戴效果检查。",
          "Workplaces should assess source and engineering controls, alongside suitable hearing protection, training and fit checks.",
          "工作場所應先評估聲源和工程控制，再安排合適的聽力防護、訓練與佩戴效果檢查。",
        ),
      ],
    },
    {
      id: "choose",
      tocTitle: t("选择耳塞或耳罩", "Choose protection", "選擇耳塞或耳罩"),
      title: t(
        "选择能贴合、也愿意一直戴的防护用品",
        "Choose protection you can fit and keep wearing",
        "選擇能貼合、也願意一直戴的防護用品",
      ),
      paragraphs: [
        t(
          "先确认产品用于听力防护，再考虑尺寸、舒适度、清洁、沟通和其他装备的兼容性。没有一种款式适合所有人。",
          "Check that a product is intended for hearing protection, then consider size, comfort, hygiene, communication and compatibility with other equipment. No style suits everyone.",
          "先確認產品用於聽力防護，再考慮尺寸、舒適度、清潔、溝通和其他裝備的相容性。沒有一種款式適合所有人。",
        ),
        t(
          "按说明清洁和保存，检查耳垫、头带与耳塞是否完好；变硬、破损或无法密封时及时更换。不要自行改造防护用品。",
          "Follow cleaning and storage instructions. Inspect cushions, headbands and plugs, and replace damaged, hardened or poorly sealing parts as directed. Do not modify the protector.",
          "按說明清潔和保存，檢查耳墊、頭帶與耳塞是否完好；變硬、破損或無法密封時及時更換。不要自行改造防護用品。",
        ),
      ],
      table: {
        headers: [
          t("类型", "Type", "類型"),
          t("特点", "Features", "特點"),
          t("佩戴重点", "Fit considerations", "佩戴重點"),
        ],
        rows: [
          [
            t("泡棉耳塞", "Foam earplugs", "泡棉耳塞"),
            t(
              "轻便，需搓细后放入耳道，等待回弹密封。",
              "Lightweight; rolled before insertion, then allowed to expand and seal.",
              "輕便，需搓細後放入耳道，等待回彈密封。",
            ),
            t(
              "双手清洁、尺寸合适，每次都要正确放置。",
              "Clean hands, suitable size and correct insertion every time.",
              "雙手清潔、尺寸合適，每次都要正確放置。",
            ),
          ],
          [
            t("预成型或定制耳塞", "Pre-moulded or custom earplugs", "預成型或訂製耳塞"),
            t(
              "按产品形状佩戴；部分音乐耳塞强调较均衡的衰减。",
              "Fitted as designed; some musicians' plugs provide flatter attenuation.",
              "按產品形狀佩戴；部分音樂耳塞強調較均衡的衰減。",
            ),
            t(
              "按说明选择尺寸、清洁和更换，不照搬泡棉耳塞的搓细步骤。",
              "Follow sizing, cleaning and replacement instructions; do not apply foam-rolling steps to every design.",
              "按說明選擇尺寸、清潔和更換，不照搬泡棉耳塞的搓細步驟。",
            ),
          ],
          [
            t("防护耳罩", "Protective earmuffs", "防護耳罩"),
            t(
              "罩住整个外耳，依靠耳垫与头部之间的连续密封。",
              "Surround the outer ear and rely on a continuous cushion seal against the head.",
              "罩住整個外耳，依靠耳墊與頭部之間的連續密封。",
            ),
            t(
              "检查镜腿、头发或其他头部装备是否影响密封。",
              "Check whether glasses, hair or other head equipment disturb the seal.",
              "檢查鏡腳、頭髮或其他頭部裝備是否影響密封。",
            ),
          ],
        ],
      },
    },
    {
      id: "foam-fit",
      tocTitle: t("泡棉耳塞怎么戴", "Fit foam earplugs", "泡棉耳塞怎麼戴"),
      title: t(
        "泡棉耳塞：搓细、提耳、扶住",
        "Foam earplugs: roll, pull and hold",
        "泡棉耳塞：搓細、提耳、扶住",
      ),
      paragraphs: [
        t(
          "下面适用于可搓细回弹的软泡棉耳塞；先阅读该产品的说明，并用清洁双手操作。",
          "These steps are for soft foam earplugs designed to be rolled and expand. Read the product instructions and start with clean hands.",
          "下面適用於可搓細回彈的軟泡棉耳塞；先閱讀該產品的說明，並用清潔雙手操作。",
        ),
      ],
      items: [
        t(
          "搓细：用手指把耳塞搓成细而平滑的条状。",
          "Roll the plug into a thin, smooth cylinder with your fingers.",
          "搓細：用手指把耳塞搓成細而平滑的條狀。",
        ),
        t(
          "提耳：用另一只手绕过头部，轻轻将耳廓上方向上、向后提，再按说明放入搓细的耳塞。",
          "Reach over with the opposite hand and gently pull the top of the ear up and back, then insert the rolled plug as instructed.",
          "提耳：用另一隻手繞過頭部，輕輕將耳廓上方向上、向後提，再按說明放入搓細的耳塞。",
        ),
        t(
          "扶住：用手指轻扶耳塞，等它回弹、填合耳道；不要只松松地挂在耳道入口。",
          "Hold the plug in place while it expands to seal the canal; do not leave it loosely at the entrance.",
          "扶住：用手指輕扶耳塞，等它回彈、填合耳道；不要只鬆鬆地掛在耳道入口。",
        ),
        t(
          "初步检查：戴好后双手捂住双耳，如果声音又明显变闷，耳塞可能没有密封，应取下重戴。这个检查不能给出实际降噪分贝。",
          "For a basic check, cup your hands over your plugged ears. A large extra drop in sound suggests a poor seal; remove and refit. This check does not measure attenuation in decibels.",
          "初步檢查：戴好後雙手摀住雙耳，如果聲音又明顯變悶，耳塞可能沒有密封，應取下重戴。這個檢查不能給出實際降噪分貝。",
        ),
      ],
    },
    {
      id: "ratings",
      tocTitle: t("怎么看降噪标称", "Understand ratings", "怎麼看降噪標稱"),
      title: t(
        "包装数字不等于你的实际防护效果",
        "A rating is not your personal protection result",
        "包裝數字不等於你的實際防護效果",
      ),
      paragraphs: [
        t(
          "NRR 等包装标称不能直接代表每个人的实际衰减。不要把网页分贝读数减去包装数字，算成耳朵受到的声级，也不要把耳塞与耳罩的标称数字直接相加。",
          "A packaging rating such as NRR does not establish the attenuation you receive. Do not subtract it from a browser reading to estimate the level at your ear, or add earplug and earmuff ratings together.",
          "NRR 等包裝標稱不能直接代表每個人的實際衰減。不要把網頁分貝讀數減去包裝數字，算成耳朵受到的聲級，也不要把耳塞與耳罩的標稱數字直接相加。",
        ),
        t(
          "NIOSH 建议在职业听力保护计划中使用个体定量适合性测试，确认某人佩戴某款防护用品时得到的衰减。需要双重防护、听见警报或兼容安全帽等装备时，应结合实际暴露，由职业安全人员选择并验证。",
          "NIOSH recommends individual quantitative fit testing in workplace hearing-loss prevention programmes to assess a specific person's protection with a specific device. Have occupational safety staff assess exposure and verify protection when dual protection, warning signals or other safety equipment are involved.",
          "NIOSH 建議在職業聽力保護計畫中使用個別定量密合度測試，確認某人佩戴某款防護用品時得到的衰減。需要雙重防護、聽見警報或相容安全帽等裝備時，應結合實際暴露，由職業安全人員選擇並驗證。",
        ),
      ],
    },
    {
      id: "headphones",
      tocTitle: t("耳机与日常听音", "Headphones and listening", "耳機與日常聆聽"),
      title: t(
        "主动降噪能帮助降低播放音量，但要分清用途",
        "Use noise cancellation to help keep listening levels down",
        "主動抗噪能幫助降低播放音量，但要分清用途",
      ),
      paragraphs: [
        t(
          "合适且贴合的主动降噪耳机，可减少在嘈杂环境中不断调高播放音量的需要。仍应使用较低音量、安排安静休息，并留意设备支持的耳机暴露提醒。音量百分比本身不能换算成统一的耳内分贝。",
          "Well-fitting noise-cancelling headphones can reduce the urge to turn audio up over background noise. Keep playback low, take quiet breaks and use supported headphone-exposure alerts. A volume percentage alone does not specify a universal sound level at the ear.",
          "合適且貼合的主動抗噪耳機，可減少在吵雜環境中不斷調高播放音量的需要。仍應使用較低音量、安排安靜休息，並留意裝置支援的耳機暴露提醒。音量百分比本身不能換算成統一的耳內分貝。",
        ),
        t(
          "消费耳机的 ANC 功能，不代表它已经是适用于强声作业的听力防护用品。购买和使用防护产品时，要查看相应防护标识、说明与适用条件，不能仅凭“感觉安静”判断保护足够。",
          "ANC in consumer headphones does not by itself make them suitable hearing protection for noisy work. Check the hearing-protection labelling, instructions and intended conditions; a quieter sensation does not establish adequate protection.",
          "消費耳機的 ANC 功能，不代表它已經是適用於強聲作業的聽力防護用品。購買和使用防護產品時，要檢視相應防護標示、說明與適用條件，不能僅憑「感覺安靜」判斷保護足夠。",
        ),
      ],
    },
    {
      id: "scenarios",
      tocTitle: t("常见场景", "Everyday situations", "常見情境"),
      title: t(
        "把防护安排在声音开始之前",
        "Plan protection before the sound starts",
        "把防護安排在聲音開始之前",
      ),
      paragraphs: [
        t(
          "除了自己佩戴，也要考虑旁边的人。现场管理人员的要求和设备说明，应一起纳入安排。",
          "Consider people nearby as well as yourself. Include venue instructions and equipment guidance in your plan.",
          "除了自己佩戴，也要考慮旁邊的人。現場管理人員的要求和裝置說明，應一起納入安排。",
        ),
      ],
      table: {
        headers: [
          t("场景", "Situation", "情境"),
          t("可以提前做的事", "Plan ahead", "可以提前做的事"),
        ],
        rows: [
          [
            t("音乐会或体育活动", "Concerts and sporting events", "音樂會或體育活動"),
            t(
              "备好合适的耳塞或耳罩，远离扬声器，安排离开强声区域的休息。",
              "Bring suitable earplugs or earmuffs, stay away from loudspeakers and take breaks away from loud sound.",
              "備好合適的耳塞或耳罩，遠離揚聲器，安排離開強聲區域的休息。",
            ),
          ],
          [
            t("电动工具或园艺设备", "Power tools and garden equipment", "電動工具或園藝裝置"),
            t(
              "先读设备警示，按要求佩戴防护，并提醒附近的人避开或采取保护。",
              "Read equipment warnings, wear the specified protection and help nearby people move away or protect their hearing.",
              "先讀裝置警示，按要求佩戴防護，並提醒附近的人避開或採取保護。",
            ),
          ],
          [
            t("日常耳机听音", "Everyday headphone listening", "日常耳機聆聽"),
            t(
              "从较低音量开始，不靠加大音量盖过环境声，穿插安静休息。",
              "Start low, avoid turning audio up to compete with noise, and include quiet breaks.",
              "從較低音量開始，不靠加大音量蓋過環境聲，穿插安靜休息。",
            ),
          ],
        ],
      },
    },
    {
      id: "help",
      tocTitle: t("听力变化与检查", "Hearing changes and help", "聽力變化與檢查"),
      title: t(
        "听力发生变化时，不用等网页读数确认",
        "Seek help for a hearing change without waiting for a reading",
        "聽力發生變化時，不用等網頁讀數確認",
      ),
      paragraphs: [
        t(
          "如果听力突然下降，尤其一侧突然听不清，应立即就医；不要自行认定只是耳垢或等待它恢复。持续耳鸣、听声音发闷或越来越难听清交谈，也应向医疗或听力专业人员咨询。",
          "Seek medical attention immediately for a sudden loss of hearing, particularly in one ear; do not assume it is earwax or wait for recovery. Persistent ringing, muffled sound or increasing difficulty following conversation also deserves professional assessment.",
          "如果聽力突然下降，尤其一側突然聽不清，應立即就醫；不要自行認定只是耳垢或等待它恢復。持續耳鳴、聽聲音發悶或越來越難聽清交談，也應向醫療或聽力專業人員諮詢。",
        ),
        t(
          "强声后感觉恢复，不一定意味着没有残留损伤。听力检查用于了解实际听觉情况；网页麦克风读数不能诊断听力损伤，也不能验证耳塞或耳罩的保护效果。",
          "Feeling better after loud sound does not rule out lasting damage. A hearing assessment checks your hearing; a browser microphone reading cannot diagnose hearing loss or verify the protection from earplugs or earmuffs.",
          "強聲後感覺恢復，不一定意味著沒有殘留損傷。聽力檢查用於瞭解實際聽覺情況；網頁麥克風讀數不能診斷聽力損傷，也不能驗證耳塞或耳罩的保護效果。",
        ),
        t(
          "本站健康文章另有 NIOSH 职业暴露时长参考，只用于解释稳定职业声级与时长的关系，不读取仪表估算，也不提供个人安全倒计时。",
          "The health article includes a NIOSH occupational exposure-time reference to explain the relationship between steady occupational sound levels and duration. It does not use the meter's estimates or provide a personal safe-time countdown.",
          "本站健康文章另有 NIOSH 職業暴露時長參考，只用於解釋穩定職業聲級與時長的關係，不讀取儀表估算，也不提供個人安全倒數計時。",
        ),
      ],
    },
  ],
  sources: [
    {
      title: "NIH/NIDCD · Noise-Induced Hearing Loss",
      url: "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss",
    },
    {
      title: "CDC/NIOSH · Provide Hearing Protection",
      url: "https://www.cdc.gov/niosh/noise/prevent/ppe.html",
    },
    {
      title: "CDC/NIOSH · How to Wear Soft Foam Earplugs",
      url: "https://www.cdc.gov/niosh/mining/tools/earplugs.html",
    },
    {
      title:
        "CDC/NIOSH · Individual Fit-Testing Recommendation for Hearing Protection Devices (2025)",
      url: "https://www.cdc.gov/niosh/docs/2025-104/pdfs/2025-104.pdf",
    },
    {
      title: "WHO · Deafness and hearing loss: Safe listening",
      url: "https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening",
    },
    {
      title: "Health Canada · Noise and sound: Protect your hearing health",
      url: "https://www.canada.ca/en/health-canada/services/noise-your-health/protect-hearing-health.html",
    },
    {
      title: "NIH/NIDCD · Sudden Deafness",
      url: "https://www.nidcd.nih.gov/health/sudden-deafness",
    },
    {
      title: "CCOHS · Hearing Protectors",
      url: "https://www.ccohs.ca/oshanswers/prevention/ppe/ear_prot.html",
    },
  ],
  related: ["noise-health", "noise-reduction", "decibel-chart"],
};
