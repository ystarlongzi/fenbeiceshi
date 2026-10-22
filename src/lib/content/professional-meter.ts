import { translations as t, type SiteContent } from "./types.ts";

export const professionalMeter: SiteContent = {
  id: "when-professional-meter",
  slug: "knowledge/when-to-use-a-sound-level-meter",
  kind: "article",
  updated: "2026-10-23",
  title: t(
    "什么时候需要专业声级计或噪声检测？",
    "When do you need a sound level meter or a noise assessment?",
    "什麼時候需要專業噪音計或噪音檢測？",
  ),
  description: t(
    "从邻里噪音、隔音装修和工作场所出发，判断何时可以先观察、何时值得找专业人员，以及联系前要问什么、准备什么。",
    "Decide when to observe noise yourself and when to seek help with neighbour noise, soundproofing or noisy work. Learn what to ask and what to prepare before arranging a visit.",
    "從鄰里噪音、隔音裝修和工作場所出發，判斷何時可以先觀察、何時值得找專業人員，以及聯絡前要問什麼、準備什麼。",
  ),
  takeaway: t(
    "想知道声音有没有变化，可以先做同条件观察；需要判断是否达标、准备较大的隔音改造，或评估工作中的噪音，就应找能处理这类问题的专业人员。先说清用途，再决定是否买仪器或安排检测。",
    "For changes in sound, start with observations under the same conditions. For compliance, substantial soundproofing work or workplace exposure, seek someone with the relevant expertise. Explain your purpose before buying equipment or booking a test.",
    "想知道聲音有沒有變化，可以先做同條件觀察；需要判斷是否符合標準、準備較大的隔音改造，或評估工作中的噪音，就應找能處理這類問題的專業人員。先說清用途，再決定是否買儀器或安排檢測。",
  ),
  sections: [
    {
      id: "choose",
      tocTitle: t("先看你想解决什么", "Start with your goal", "先看你想解決什麼"),
      title: t(
        "先想清楚：你需要变化记录，还是正式结论？",
        "Do you need to track a change or obtain a formal conclusion?",
        "先想清楚：你需要變化記錄，還是正式結論？",
      ),
      paragraphs: [
        t(
          "“空调换个位置会不会安静些”和“这个噪音是否超过适用标准”，需要的答案不同。前者可以从简单比较开始；后者还要确认由谁测、怎样测，以及结果准备交给谁。",
          "“Will moving the air conditioner make this quieter?” and “Does this noise exceed the applicable limit?” need different answers. A simple comparison can help with the first. The second also needs an agreed measurement method and a clear purpose for the result.",
          "「冷氣換個位置會不會安靜些」和「這個噪音是否超過適用標準」，需要的答案不同。前者可以從簡單比較開始；後者還要確認由誰量測、怎樣量測，以及結果準備交給誰。",
        ),
      ],
      table: {
        headers: [
          t("你想做的事", "Your goal", "你想做的事"),
          t("可以从哪里开始", "Where to start", "可以從哪裡開始"),
        ],
        rows: [
          [
            t(
              "比较开窗、关窗或家电开关前后的变化。",
              "Compare windows open and closed, or an appliance on and off.",
              "比較開窗、關窗或家電開關前後的變化。",
            ),
            t(
              "固定设备和位置，重复观察，并记下当时的情况。",
              "Keep the device and position fixed, repeat the observation and note the conditions.",
              "固定裝置和位置，重複觀察，並記下當時的情況。",
            ),
          ],
          [
            t(
              "经常自己查看声音大小，需要更有依据的读数。",
              "Make regular checks with more dependable sound-level readings.",
              "經常自己查看聲音大小，需要更有依據的讀數。",
            ),
            t(
              "考虑合适的声级计，并学习按说明使用和检查仪器。",
              "Consider a suitable sound level meter and learn how to use and check it correctly.",
              "考慮合適的噪音計，並學習按說明使用和檢查儀器。",
            ),
          ],
          [
            t(
              "判断是否达标、提交报告，或解决复杂的噪音问题。",
              "Check compliance, submit a report or resolve a complex noise problem.",
              "判斷是否符合標準、提交報告，或解決複雜的噪音問題。",
            ),
            t(
              "先问接收报告的一方或相关专业人员，确认需要什么服务。",
              "Ask the report recipient or a relevant professional what assessment is needed.",
              "先問接收報告的一方或相關專業人員，確認需要什麼服務。",
            ),
          ],
        ],
      },
    },
    {
      id: "seek-help",
      tocTitle: t("哪些情况值得找人", "When to seek help", "哪些情況值得找人"),
      title: t(
        "这些情况，可以找哪些人帮忙？",
        "When to ask someone for help",
        "這些情況，可以找哪些人幫忙？",
      ),
      paragraphs: [
        t(
          "不必等自己弄懂所有声学术语才咨询。先描述发生了什么、你希望解决什么，对方再判断需要现场排查、测量还是其他处理。",
          "You do not need to learn acoustic terminology before asking for help. Describe what happens and what you want to resolve. The next step may be an inspection, measurements or another form of action.",
          "不必等自己弄懂所有聲學術語才諮詢。先描述發生了什麼、你希望解決什麼，對方再判斷需要現場排查、量測還是其他處理。",
        ),
        t(
          "在中国大陆，邻里生活噪音可以先请物业、业委会或社区协助沟通，未解决时再确认当地受理部门；其他地区按当地渠道处理。先咨询需要哪些材料，再决定是否自费检测。",
          "For neighbourhood noise in mainland China, property management, owners' committees or community services can help with mediation, with unresolved issues directed to the locally responsible authority. Elsewhere, use local channels. Ask what information is needed before paying for a test.",
          "在中國大陸，鄰里生活噪音可以先請物業、業主委員會或社區協助溝通，未解決時再確認當地受理部門；其他地區按當地管道處理。先諮詢需要哪些資料，再決定是否自費檢測。",
        ),
      ],
      items: [
        t(
          "反复影响休息的邻里、装修或共用设备声：整理出现规律，向物业、设备维护方或当地受理渠道说明情况。",
          "Recurring neighbour, renovation or shared-equipment noise that disrupts rest: note the pattern and contact property management, the equipment operator or the relevant local service.",
          "反覆影響休息的鄰里、裝修或共用設備聲：整理出現規律，向物業、設備維護方或當地受理管道說明情況。",
        ),
        t(
          "准备花钱换窗、做吊顶或整屋隔音：先请熟悉住宅噪音的人员判断声音从哪儿来，再确定改造方案。",
          "Before spending on windows, ceilings or major soundproofing: ask someone experienced in residential acoustics to identify how the sound reaches you before choosing the work.",
          "準備花錢換窗、做天花板或全屋隔音：先請熟悉住宅噪音的人員判斷聲音從哪裡來，再確定改造方案。",
        ),
        t(
          "声音沉闷、伴随振动，或总在某些时候突然出现：告诉排查人员这些特点，别只给一个最高读数。",
          "Rumbling, vibration or sound that appears only at certain times: describe these features to the person investigating, alongside any readings.",
          "聲音低沉、伴隨振動，或總在某些時候突然出現：告訴排查人員這些特點，別只給一個最高讀數。",
        ),
        t(
          "在机器旁工作，担心长期接触噪音：联系单位的职业卫生或安全人员，结合工作内容和接触时间评估。",
          "Concern about noise while working around machinery: contact your occupational health or safety team so the assessment reflects your tasks and time exposed.",
          "在機器旁工作，擔心長期接觸噪音：聯絡單位的職業衛生或安全人員，結合工作內容和暴露時間評估。",
        ),
      ],
    },
    {
      id: "meter-or-service",
      tocTitle: t("买仪器还是找服务", "A meter or a service?", "買儀器還是找服務"),
      title: t(
        "声级计是工具，专业检测还包括方法和解释",
        "A sound level meter is one part of an assessment",
        "噪音計是工具，專業檢測還包括方法和解釋",
      ),
      paragraphs: [
        t(
          "声级计可以简单理解为专门测量声音大小的仪器。经常需要自己检查、愿意学习正确用法时，可以考虑购买、借用或租用合适设备；只有一次具体问题时，也可以先咨询服务，不必急着买。",
          "A sound level meter is an instrument designed to measure sound. If you make regular checks and can learn its proper use, buying, borrowing or renting suitable equipment may make sense. For a one-off problem, an initial consultation may be a better starting point.",
          "噪音計可以簡單理解為專門量測聲音大小的儀器。經常需要自己檢查、願意學習正確用法時，可以考慮購買、借用或租用合適設備；只有一次具體問題時，也可以先諮詢服務，不必急著買。",
        ),
        t(
          "拿着仪器测一下，并不自动得到适用于投诉、验收或工作场所的结论。专业人员还需要选对位置和时间，检查仪器是否正常，说明结果对应什么情况，以及接下来能采取什么措施。",
          "Owning a meter does not by itself produce a conclusion suitable for a complaint, acceptance check or workplace assessment. The person assessing the noise also needs appropriate locations and timing, checked equipment, an explanation of what the results represent and useful next steps.",
          "拿著儀器量一下，並不自動得到適用於申訴、驗收或工作場所的結論。專業人員還需要選對位置和時間，檢查儀器是否正常，說明結果對應什麼情況，以及接下來能採取什麼措施。",
        ),
      ],
    },
    {
      id: "ask-first",
      tocTitle: t("联系前先问什么", "What to ask first", "聯絡前先問什麼"),
      title: t(
        "预约前，把这几个问题问清楚",
        "Ask these questions before booking",
        "預約前，把這幾個問題問清楚",
      ),
      paragraphs: [
        t(
          "先用自己的话说明用途，比如“查出卧室的嗡嗡声来自哪里”，或“需要一份交给某部门的报告”。找声源、做改善方案和出具正式检测报告，可能是不同的服务。",
          "Explain your purpose in everyday words: “Find the hum in my bedroom” or “Provide a report for this authority.” Finding a source, designing improvements and producing a formal test report can be different services.",
          "先用自己的話說明用途，比如「查出臥室的嗡嗡聲來自哪裡」，或「需要一份交給某部門的報告」。找聲源、做改善方案和出具正式檢測報告，可能是不同的服務。",
        ),
      ],
      items: [
        t(
          "你们处理过类似的住宅、设备或工作场所问题吗？这次服务具体能回答什么？",
          "Have you handled similar homes, equipment or workplaces? What question will this service answer?",
          "你們處理過類似的住宅、設備或工作場所問題嗎？這次服務具體能回答什麼？",
        ),
        t(
          "需要在声音出现时到场吗？要观察多久、哪些位置，需要物业或设备管理方配合什么？",
          "Does the sound need to be present during the visit? Which times and locations are needed, and who must provide access or operate equipment?",
          "需要在聲音出現時到場嗎？要觀察多久、哪些位置，需要物業或設備管理方配合什麼？",
        ),
        t(
          "如果报告要交给某个单位，对方要求什么机构条件、检测项目和报告形式？先向接收方确认，再与服务方核对。",
          "If a report goes to a particular organisation, what provider qualifications, tests and report format does it require? Check with the recipient, then with the provider.",
          "如果報告要交給某個單位，對方要求什麼機構條件、檢測項目和報告形式？先向接收方確認，再與服務方核對。",
        ),
        t(
          "报价包含哪些现场工作、报告和解释？如果到场时声音没出现，或需要再次到场，怎样安排和收费？",
          "What visits, reporting and explanation are included in the quote? What happens, including any extra cost, if the sound is absent or another visit is needed?",
          "報價包含哪些現場工作、報告和解釋？如果到場時聲音沒出現，或需要再次到場，怎樣安排和收費？",
        ),
      ],
    },
    {
      id: "prepare",
      tocTitle: t("提前准备哪些信息", "What to prepare", "提前準備哪些資訊"),
      title: t(
        "一份清楚的情况说明，能让沟通更有效",
        "Prepare a clear description of the problem",
        "一份清楚的情況說明，能讓溝通更有效",
      ),
      paragraphs: [
        t(
          "先记下下面这些信息。它们既可以帮助物业和维护人员排查，也能让检测人员判断何时到场、需要谁配合。",
          "These notes can help property or maintenance staff investigate, and help an assessor plan the visit and identify who needs to be involved.",
          "先記下下面這些資訊。它們既可以幫助物業和維護人員排查，也能讓檢測人員判斷何時到場、需要誰配合。",
        ),
      ],
      items: [
        t(
          "什么时候：日期、开始和结束时间，是否每天重复，周末有没有不同。",
          "When: dates, start and end times, recurrence and any weekday/weekend differences.",
          "什麼時候：日期、開始和結束時間，是否每天重複，週末有沒有不同。",
        ),
        t(
          "在哪里：哪个房间、哪个位置最明显，门窗开关时有什么变化。",
          "Where: the room and position where it is most noticeable, and what changes with doors or windows open or closed.",
          "在哪裡：哪個房間、哪個位置最明顯，門窗開關時有什麼變化。",
        ),
        t(
          "什么声音：说话、敲击、拖动、嗡嗡声，是否伴有地面、墙面或家具振动。",
          "What it sounds like: voices, banging, dragging or humming, and any vibration in floors, walls or furniture.",
          "什麼聲音：說話、敲擊、拖動、嗡嗡聲，是否伴有地板、牆面或家具振動。",
        ),
        t(
          "可能的声源：什么设备或活动同时开始、停止；不确定的地方就标明不确定。",
          "Possible source: equipment or activities that start and stop at the same time. Mark anything uncertain as uncertain.",
          "可能的聲源：什麼設備或活動同時開始、停止；不確定的地方就標明不確定。",
        ),
        t(
          "影响与目标：影响了什么活动、已经尝试过什么，以及希望得到排查建议、改善方案还是正式报告。",
          "Impact and goal: which activities are affected, what you have tried, and whether you want investigation, an improvement plan or a formal report.",
          "影響與目標：影響了什麼活動、已經嘗試過什麼，以及希望得到排查建議、改善方案還是正式報告。",
        ),
      ],
    },
    {
      id: "results",
      tocTitle: t("拿到结果后怎么看", "Use the results", "拿到結果後怎麼看"),
      title: t(
        "看懂测了什么，再决定下一步",
        "Understand what was assessed and what to do next",
        "看懂量測了什麼，再決定下一步",
      ),
      paragraphs: [
        t(
          "拿到结果后，请对方用通俗的话说明：测的是哪个位置、哪段时间，声音是否正常出现，结论适用于什么情况。如果声音当天没有出现，要问清这次结果能够说明什么，是否需要补充观察。",
          "Ask for a plain-language explanation of the locations, time period, whether the usual sound was present, and the situations the conclusion covers. If the sound did not occur, ask what can be concluded and whether further observation is needed.",
          "拿到結果後，請對方用通俗的話說明：量測的是哪個位置、哪段時間，聲音是否正常出現，結論適用於什麼情況。如果聲音當天沒有出現，要問清這次結果能夠說明什麼，是否需要補充觀察。",
        ),
        t(
          "需要改善时，继续问清先处理哪里、预期改善什么，以及怎样检查效果。关于是否符合某项要求，要看报告采用的标准和适用条件；一个数字无法同时回答邻里干扰、装修效果和职业听力风险。",
          "For improvements, ask what to address first, what change to expect and how to check it. A compliance conclusion depends on the applicable rules and conditions. One number cannot answer every question about neighbour disturbance, soundproofing and workplace hearing risks.",
          "需要改善時，繼續問清先處理哪裡、預期改善什麼，以及怎樣檢查效果。關於是否符合某項要求，要看報告採用的標準和適用條件；一個數字無法同時回答鄰里干擾、裝修效果和職業聽力風險。",
        ),
        t(
          "本站适合帮助你观察变化、记下线索，提供的是未经专业校准的通用噪音估算。手动调过数字或导出报告，也不会让它变成正式检测结果。其他应用经过验证的准确度，不能直接套用到本站。",
          "This site helps you observe changes and keep notes using a generic noise estimate without professional calibration. Manual adjustment or exporting a report does not turn it into a formal test. Accuracy verified for another app does not establish this site's accuracy.",
          "本站適合幫助你觀察變化、記下線索，提供的是未經專業校正的通用噪音估算。手動調過數字或匯出報告，也不會讓它變成正式檢測結果。其他應用程式經過驗證的準確度，不能直接套用到本站。",
        ),
      ],
    },
  ],
  sources: [
    {
      title: "CDC/NIOSH: Understand Noise Exposure — measuring noise and choosing equipment",
      url: "https://www.cdc.gov/niosh/noise/prevent/understand.html",
    },
    {
      title:
        "CDC/NIOSH: Sound Level Meter App — validation applies to the stated app and equipment",
      url: "https://www.cdc.gov/niosh/noise/about/app.html",
    },
    {
      title: "UK HSE: How do I assess the risks? — representative assessment and competence",
      url: "https://www.hse.gov.uk/noise/risks.htm",
    },
    {
      title: "Australian Government · Your Home: Noise control — advice before acoustic upgrades",
      url: "https://www.yourhome.gov.au/live-adapt/noise-control",
    },
    {
      title:
        "生态环境部：《中华人民共和国生态环境法典》第 599 条（中国大陆社会生活噪声调解与投诉）",
      url: "https://www.mee.gov.cn/ywgz/fgbz/fl/202603/t20260313_1146496.shtml",
    },
  ],
  related: [
    "phone-accuracy",
    "noise-reduction",
    "china-noise-standards",
    "workplace-noise-standards",
  ],
};
