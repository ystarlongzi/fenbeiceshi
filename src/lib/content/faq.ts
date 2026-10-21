import { dual as t, type Dual, type SiteContent } from "./types.ts";

export interface FaqItem {
  id: string;
  question: Dual;
  answer: Dual[];
  link: { pageId: string; hash?: string; label: Dual };
}

export const faqGroups: {
  id: string;
  title: Dual;
  description: Dual;
  questions: FaqItem[];
}[] = [
  {
    id: "getting-started",
    title: t("开始使用", "Getting started"),
    description: t("先确认设备和使用方式。", "Check your device and how to get started."),
    questions: [
      {
        id: "install",
        question: t("需要下载 App、注册或付费吗？", "Do I need an app, an account or a payment?"),
        answer: [
          t(
            "不需要。当前工具可以直接在浏览器中免费使用，无需安装 App 或注册。点击“开始测量”后，才会请求麦克风权限；不授权也能阅读帮助和体验演示。",
            "No. The current tool is free to use in your browser without installing an app or creating an account. Microphone permission is requested only after you select Start measuring. You can read the help or try the demo without granting access.",
          ),
        ],
        link: { pageId: "guide", hash: "start", label: t("查看开始方法", "See how to start") },
      },
      {
        id: "devices",
        question: t("手机和电脑都能测吗？", "Can I use a phone or a computer?"),
        answer: [
          t(
            "需要设备有可用麦克风，并且浏览器允许网页访问它。手机可先尝试系统浏览器，电脑可选择内置或外接麦克风。App 内置浏览器、系统权限和设备设置可能影响使用，不能保证所有组合都能正常采集。",
            "You need a working microphone and a browser that allows the page to access it. On a phone, try a system browser; on a computer, choose the built-in or an external microphone. In-app browsers, system permissions and device settings can affect capture, so support is not guaranteed for every combination.",
          ),
        ],
        link: { pageId: "microphone-help", label: t("查看设备与权限排查", "Check device access") },
      },
    ],
  },
  {
    id: "accuracy",
    title: t("读数准不准", "Understanding accuracy"),
    description: t(
      "看清估算、校准和专业测量的区别。",
      "Understand estimates, calibration and professional measurements.",
    ),
    questions: [
      {
        id: "accuracy",
        question: t("网页测分贝准吗？", "How accurate is a browser decibel meter?"),
        answer: [
          t(
            "本站提供粗略的噪音分贝估算，方便在同一设备、位置和设置下观察变化。通用估算没有经过跨设备声学精度验证，我们不承诺固定误差范围。需要准确声压级或专业结论时，应使用适合该用途的仪器和方法。",
            "This tool provides a rough noise estimate for observing changes with the same device, position and settings. The generic estimate has not undergone cross-device acoustic accuracy validation, and we do not promise a fixed error range. For accurate sound pressure levels or professional conclusions, use appropriate instruments and methods.",
          ),
        ],
        link: {
          pageId: "phone-accuracy",
          label: t("了解准确性与适用范围", "Read about accuracy and limits"),
        },
      },
      {
        id: "devices-differ",
        question: t("为什么两台设备的读数不一样？", "Why do two devices show different readings?"),
        answer: [
          t(
            "麦克风灵敏度、距离、朝向、保护壳和系统音频处理都会改变输入。即使两台设备放在一起，也可能给出不同估算；换设备后的数字不能直接与原记录比较。固定同一套设备和条件，再重复观察更有意义。",
            "Microphone sensitivity, distance, orientation, cases and system audio processing all affect the input. Two devices placed together can still give different estimates. Readings from a new device should not be directly compared with earlier records. Keep the device and conditions fixed for repeat observations.",
          ),
        ],
        link: {
          pageId: "dbfs-spl",
          hash: "chain",
          label: t("了解设备如何影响读数", "See how devices affect readings"),
        },
      },
      {
        id: "calibration",
        question: t("开始前一定要校准吗？", "Do I have to calibrate before starting?"),
        answer: [
          t(
            "不用。默认即可查看标注“未校准”的通用估算。有合适的参考声级计时，可选用参考校准调整当前设备的显示偏移。它不会修正全部设备误差；更换麦克风会清除参考，刷新页面后也会恢复通用估算。",
            "No. You can start with the default estimate, labelled uncalibrated. With a suitable reference sound level meter, optional calibration adjusts the display offset for your current input. It does not correct every device error. Switching microphones clears the reference, and reloading restores the generic estimate.",
          ),
        ],
        link: { pageId: "calibration", label: t("查看校准方法", "Read the calibration guide") },
      },
      {
        id: "professional",
        question: t(
          "读数是 dBA 吗，能用来判断噪音超标吗？",
          "Are the readings dBA, and can they prove a noise violation?",
        ),
        answer: [
          t(
            "不是。本站显示“dB · 估算”，没有实现 A 计权，也不是认证声级测量。颜色、警告线和导出的报告都不能证明超标或给出个人安全结论。涉及投诉取证、职业评估等任务，需要符合用途的测量方法与适用依据。",
            "No. Readings are labelled estimated dB. The tool does not implement A weighting or certified sound level measurement. Colours, warning lines and exported reports do not prove a violation or establish personal safety. Formal evidence or occupational assessments require appropriate methods and applicable requirements.",
          ),
        ],
        link: {
          pageId: "phone-accuracy",
          hash: "choose",
          label: t("判断什么时候需要专业测量", "Decide when professional measurement is needed"),
        },
      },
    ],
  },
  {
    id: "microphone",
    title: t("麦克风与故障", "Microphone problems"),
    description: t(
      "按实际提示检查权限和输入。",
      "Follow the message to check permissions and input.",
    ),
    questions: [
      {
        id: "permission",
        question: t(
          "麦克风打不开，或一直在等待授权怎么办？",
          "What if microphone access fails or keeps waiting?",
        ),
        answer: [
          t(
            "先检查地址栏的权限提示，并确认网站与系统都允许当前浏览器使用麦克风。一直等待时可以取消，再重新开始；App 内置浏览器可尝试改用系统浏览器。请使用 HTTPS 网站或本地 localhost，不要关闭浏览器安全保护。",
            "Check the browser's permission prompt and make sure both the site and operating system allow microphone access. You can cancel a pending request and start again. If using an in-app browser, try a system browser. Use HTTPS or local localhost; do not disable browser security.",
          ),
        ],
        link: {
          pageId: "microphone-help",
          label: t("按提示排查麦克风", "Troubleshoot microphone access"),
        },
      },
      {
        id: "no-input",
        question: t(
          "已经允许麦克风，为什么还是没有读数？",
          "Why is there no reading after I allow microphone access?",
        ),
        answer: [
          t(
            "确认选中了需要的麦克风、设备没有静音或被系统禁用，并查看采集状态。外接麦克风移除后，可以选择默认麦克风重试；提示无法读取时，检查其他应用是否占用设备。未收到有效输入不会显示成一次成功测量，小信号柱很低也不能单独证明房间安静或设备损坏。",
            "Check that the intended microphone is selected, enabled and not muted, then read the capture status. If an external input was removed, retry with the default microphone. If it cannot be read, check whether another app is using it. Missing input is not shown as a successful measurement, and low signal bars alone do not establish a quiet room or a broken device.",
          ),
        ],
        link: {
          pageId: "microphone-help",
          hash: "input",
          label: t("检查没有信号的原因", "Check missing input"),
        },
      },
    ],
  },
  {
    id: "readings",
    title: t("看懂分贝数字", "Reading the numbers"),
    description: t(
      "理解零值、统计与常见声音参考。",
      "Understand zero, statistics and everyday sound references.",
    ),
    questions: [
      {
        id: "quiet",
        question: t(
          "房间很安静，为什么读数不是 0？",
          "Why isn't the reading zero in a quiet room?",
        ),
        answer: [
          t(
            "安静不等于没有声音，麦克风和输入链路也会影响数字。本站还会把原始输入换算为粗略估算，因此不能用“是否归零”判断设备好坏。若出现“≤”标记，它表示计算下限，不代表房间实际达到了这个声级。",
            "Quiet does not mean no sound, and the microphone and input chain also affect the number. This tool maps the input to a rough estimate, so reaching zero is not a device test. A ≤ marker indicates a calculation floor, not the room's actual sound level.",
          ),
        ],
        link: {
          pageId: "how-it-works",
          hash: "calculate",
          label: t("了解声音怎样变成数字", "See how sound becomes a number"),
        },
      },
      {
        id: "statistics",
        question: t(
          "最低、最高和平均分贝分别是什么意思？",
          "What do minimum, maximum and average mean?",
        ),
        answer: [
          t(
            "它们概括本次测量已观察到的采样窗口：最低和最高是窗口读数的两端，平均值先对声音能量求平均，再换算成分贝。它们不是专业峰值或连续积分的 LAeq。趋势图保留最近 60 秒，统计则覆盖本次已累计的有效样本，两者时间范围不同。",
            "They summarize sample windows observed during this measurement. Minimum and maximum are the lowest and highest window readings; the average is calculated from energy before conversion to decibels. These are not professional peak or continuously integrated LAeq measurements. The trend shows the latest 60 seconds, while statistics cover accumulated valid samples from the session.",
          ),
        ],
        link: {
          pageId: "dbfs-spl",
          hash: "average",
          label: t("了解平均值怎么算", "See how the average is calculated"),
        },
      },
      {
        id: "sound-levels",
        question: t("60、70、80 分贝大概有多响？", "How loud are 60, 70 or 80 decibels?"),
        answer: [
          t(
            "可以通过分贝对照表查找交谈、家电和交通等声音的参考范围。不同来源的测距、环境和单位可能不同，例子只帮助理解量级；不要把网页估算直接套入表格，判断自己的环境是否安全或超标。",
            "Use the decibel chart to look up reference ranges for conversation, appliances and traffic. Distance, surroundings and units differ between sources, so examples provide context rather than a direct comparison with your browser estimate or a safety or compliance decision.",
          ),
        ],
        link: {
          pageId: "decibel-chart",
          label: t("查找常见声音的分贝范围", "Look up everyday sounds"),
        },
      },
    ],
  },
  {
    id: "measuring",
    title: t("怎样测和比较", "Measuring and comparing"),
    description: t(
      "保持条件一致，也了解持续测量的限制。",
      "Keep conditions consistent and understand continuous capture limits.",
    ),
    questions: [
      {
        id: "compare",
        question: t(
          "怎样比较家电开关或关窗前后的声音？",
          "How can I compare an appliance or open and closed windows?",
        ),
        answer: [
          t(
            "固定设备、麦克风、距离、朝向和设置，分别观察两种状态，并在备注中记下条件；尽量重复几次，留意背景声是否改变。记录只有在输入与估算模型、校准偏移一致时才适合比较。两次读数相减不能直接当作家电独立声级或窗户隔声性能。",
            "Keep the device, microphone, distance, orientation and settings fixed. Observe each state, note the conditions and repeat while checking for background changes. Records need matching input, estimate model and calibration offset for comparison. Subtracting readings does not establish an appliance's isolated level or a window's sound insulation rating.",
          ),
        ],
        link: {
          pageId: "guide",
          hash: "save",
          label: t("查看保存条件与复测方法", "Read about saving context and repeating"),
        },
      },
      {
        id: "background",
        question: t(
          "能锁屏、切到后台或整夜测量吗？",
          "Can I measure with the screen locked or overnight?",
        ),
        answer: [
          t(
            "当前版本在页面离开前台时停止采集，并保留已经取得的有效摘要，不支持后台或锁屏整夜监测。回到页面后需重新开始，并检查麦克风与校准状态。",
            "This version stops capture when the page leaves the foreground and keeps the valid summary collected so far. It does not support overnight background or lock-screen monitoring. Start again after returning and check the microphone and calibration status.",
          ),
        ],
        link: {
          pageId: "microphone-help",
          hash: "interrupted",
          label: t("了解测量中断后的处理", "Read about interrupted capture"),
        },
      },
    ],
  },
  {
    id: "audio-records",
    title: t("录音、保存与导出", "Audio, saving and exports"),
    description: t(
      "了解哪些数据会保留，以及怎样带走它们。",
      "See what is kept and how to download it.",
    ),
    questions: [
      {
        id: "audio",
        question: t("会录音或上传我的声音吗？", "Does the tool record or upload my audio?"),
        answer: [
          t(
            "录音默认关闭，音频在本机处理，不上传服务器。测量前主动开启“同步录音”后，结束时可播放或下载 MP3、PCM。保存报告时可选存同次录音，留在当前浏览器；未保存的录音在刷新、离开页面或新录音后清除。",
            "Recording is off by default. Audio is processed on your device and never uploaded. Turn on Record audio before measuring to play or download MP3 or PCM afterward. You can save matching audio with a report in this browser. Unsaved audio is cleared on reload, navigation or a new recording.",
          ),
        ],
        link: {
          pageId: "privacy",
          hash: "audio",
          label: t("查看音频与存储说明", "Read about audio and storage"),
        },
      },
      {
        id: "recording-limit",
        question: t(
          "为什么录音会自动停止，测量却还在继续？",
          "Why does recording stop while measurement continues?",
        ),
        answer: [
          t(
            "单次录音最多 10 分钟，或达到 64 MiB 采样内存上限时提前停止。到达限制后保留已有片段，测量可以继续；这是录音限制，不是测量失败。当前浏览器保存的录音总量最多 200 MiB，空间不足会提示，不会自动删除其他报告的录音来腾出空间。",
            "A recording stops after 10 minutes or earlier at the 64 MiB sample limit. The captured audio is kept and measurement can continue; reaching this recording limit is not a measurement failure. Saved audio in this browser is limited to 200 MiB. Insufficient space is reported without deleting audio from other retained reports to make room.",
          ),
        ],
        link: {
          pageId: "guide",
          hash: "save",
          label: t("了解录音限制与下载方法", "Read about recording limits and downloads"),
        },
      },
      {
        id: "reports",
        question: t(
          "怎样保存结果，能导出哪些格式？",
          "How do I save results, and which formats can I export?",
        ),
        answer: [
          t(
            "结束真实测量后，“保存报告”把结果留在当前浏览器，“导出数据”可下载 CSV、Excel、PDF 或复制文字摘要；保存和导出时都可选填备注。有同次录音时，可另外下载 MP3、PCM，数据报告不包含音频。演示结果不能保存或导出为真实测量。",
            "After a real measurement, Save report keeps the result in this browser. Export data downloads CSV, Excel or PDF, or copies a text summary. Both allow an optional note. Matching audio can be downloaded separately as MP3 or PCM; data reports do not contain audio. Demo results cannot be saved or exported as real measurements.",
          ),
        ],
        link: {
          pageId: "guide",
          hash: "save",
          label: t("查看保存与导出的步骤", "See saving and export steps"),
        },
      },
      {
        id: "missing-records",
        question: t(
          "记录和录音会同步吗，为什么找不到了？",
          "Do records sync, and why might a record or its audio be missing?",
        ),
        answer: [
          t(
            "不会自动同步。报告和选存录音只在保存它们的浏览器中可见，换设备、换浏览器或清除网站数据后可能找不到。最多保留 30 条报告，保存第 31 条会淘汰最早保存的报告及其录音；删除报告也会清理关联录音。没有随报告保存的录音，无法以后恢复。重要内容请先下载。",
            "Records do not sync automatically. Reports and saved audio are available only in the browser where they were saved, so changing devices, browsers or clearing site data can make them unavailable. Up to 30 reports are retained; saving a 31st removes the earliest saved report and its audio. Deleting a report also removes its audio. Audio not saved with a report cannot be recovered later. Download important files first.",
          ),
        ],
        link: {
          pageId: "privacy",
          hash: "records",
          label: t("了解本机记录与删除规则", "Read local storage and deletion rules"),
        },
      },
    ],
  },
];

export const faqItems = faqGroups.flatMap((group) => group.questions);
export const homeFaqIds = [
  "install",
  "devices",
  "accuracy",
  "calibration",
  "permission",
  "audio",
  "background",
  "reports",
];
export const homeFaqItems = homeFaqIds.map((id) => {
  const item = faqItems.find((question) => question.id === id);
  if (!item) throw new Error(`首页问题未定义：${id}`);
  return item;
});

export const faq: SiteContent = {
  id: "faq",
  slug: "faq",
  kind: "guide",
  updated: "2026-10-21",
  title: t("分贝测试常见问题", "Decibel meter FAQ"),
  description: t(
    "解答手机与电脑使用、测量准确性、麦克风故障、分贝读数、后台测量、录音和报告保存等常见问题。",
    "Answers about devices, accuracy, microphone access, readings, background capture, audio recording and saved reports.",
  ),
  takeaway: t(
    "从你遇到的问题开始。每个回答先说明怎么做，再提供详细方法；测量结果是估算，音频在本机处理。",
    "Start with the question you have. Each answer gives a practical explanation and a link to more detail. Readings are estimates, and audio is processed on your device.",
  ),
  sections: faqGroups.map((group) => ({
    id: group.id,
    title: group.title,
    paragraphs: [group.description],
  })),
  sources: [
    {
      title: "MDN · getUserMedia",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia",
    },
    {
      title: "CDC/NIOSH · Sound Level Meter App and its validation conditions",
      url: "https://www.cdc.gov/niosh/noise/about/app.html",
    },
  ],
  related: ["how-it-works", "guide", "privacy"],
};
