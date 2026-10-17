import { dual as t, type SiteContent } from "./types.ts";

const mdnAudio = {
  title: "MDN · Web Audio API",
  url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
};
const mdnInput = {
  title: "MDN · getUserMedia",
  url: "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia",
};

export const articles: SiteContent[] = [
  {
    id: "phone-accuracy",
    slug: "knowledge/phone-decibel-accuracy",
    kind: "article",
    updated: "2026-10-18",
    title: t(
      "手机测分贝准吗？先确认你要比较什么",
      "Are phone decibel meters accurate? Start with your purpose",
    ),
    description: t(
      "了解手机麦克风、自动处理与参考校准的影响，区分通用噪音估算、参考校准和专业检测。",
      "Understand microphone differences, audio processing and reference calibration before using a phone or browser reading.",
    ),
    takeaway: t(
      "同一设备、同一设置下的重复观察，可以帮助发现声音变化。没有经过验证的参考关系时，数字输入电平不等于环境声压级。",
      "Repeat observations with the same device and settings can reveal changes. Without a verified reference, digital input level is not environmental sound pressure level.",
    ),
    sections: [
      {
        id: "purpose",
        title: t("先问：你希望得到什么答案？", "First, decide what you need to know"),
        paragraphs: [
          t(
            "比较空调开关前后、记录某个位置的变化，与判断是否符合法规，是不同的任务。前者需要固定条件并反复观察；后者还需要符合要求的仪器、测量方法和适用标准。",
            "Comparing an appliance on and off is a different task from checking compliance. The first needs repeatable conditions. The second also needs suitable instruments, methods and an applicable standard.",
          ),
          t(
            "本站默认显示标注未校准的通用估算噪音分贝，方便观察声音变化。这个通用映射尚未通过跨设备声学精度验证；可选参考校准能调整当前设备的偏移，但不会使浏览器成为认证声级计。",
            "This tool defaults to a labelled, uncalibrated noise estimate for observing change. The generic mapping has not undergone cross-device acoustic accuracy validation. Optional reference calibration adjusts the offset for the active device, without certifying the browser as a sound level meter.",
          ),
        ],
      },
      {
        id: "devices",
        title: t("为什么两部手机可能显示不同数字？", "Why can two phones disagree?"),
        paragraphs: [
          t(
            "麦克风灵敏度、频率响应、朝向、保护壳遮挡和与声源的距离都会影响输入。浏览器和系统还可能启用自动增益、降噪或回声消除。即使网页请求关闭这些处理，设备也不一定按请求执行。",
            "Sensitivity, frequency response, orientation, an obstructed microphone and distance all affect the input. Browsers and operating systems may also apply gain control, noise reduction or echo cancellation. A request to disable processing does not guarantee the device will do so.",
          ),
        ],
        items: [
          t(
            "固定设备、输入、距离和朝向，记录测量时的状态。",
            "Keep the device, input, distance and orientation fixed, and note the conditions.",
          ),
          t(
            "避免手持摩擦、风吹麦克风和设备突然移动。",
            "Avoid handling noise, wind at the microphone and sudden movement.",
          ),
          t(
            "同一问题重复观察，保留完整条件而不只记一个最高值。",
            "Repeat the observation and keep its context, rather than only a maximum number.",
          ),
        ],
      },
      {
        id: "reference",
        title: t("参考校准能改变什么？", "What does a reference calibration change?"),
        paragraphs: [
          t(
            "单点校准用一个参考读数建立偏移关系，只调整显示尺度。它不能自动修正不同频率、不同声级下的麦克风响应，也不能消除增益变化或削波。更换输入和处理设置后，需要重新建立参考关系。",
            "A single reference point establishes an offset in the displayed scale. It cannot correct microphone response across frequencies and levels, eliminate gain changes or repair clipping. Establish a new reference after changing the input or processing settings.",
          ),
          t(
            "研究或机构应用的准确度，属于其特定硬件、软件与验证条件。不能把另一个应用的误差范围，直接作为本网页或所有手机的误差承诺。",
            "An accuracy result belongs to the hardware, software and test conditions that were validated. A result from another application is not an accuracy guarantee for this website or every phone.",
          ),
        ],
      },
      {
        id: "choose",
        title: t("怎样选择下一步", "Choose your next step"),
        paragraphs: [
          t(
            "只想观察变化，可以先使用通用估算，并固定条件。具备参考声级计时，可按校准方法调整当前设备的偏移。涉及法律、职业安全或健康决定时，应选择适合该用途的专业测量，不用此网页读数下结论。",
            "For observing change, start with the generic estimate and fixed conditions. With a reference meter, follow the calibration guide to adjust the active device offset. For legal, occupational or health decisions, use an appropriate professional assessment.",
          ),
        ],
      },
    ],
    sources: [
      mdnInput,
      {
        title: "CDC/NIOSH · Sound Level Meter App and its validation conditions",
        url: "https://www.cdc.gov/niosh/noise/about/app.html",
      },
    ],
    related: ["calibration", "dbfs-spl", "microphone-help"],
  },
  {
    id: "dbfs-spl",
    slug: "knowledge/dbfs-vs-db-spl",
    kind: "article",
    updated: "2026-10-18",
    title: t("dBFS 与 dB SPL：相同的 dB，不同的参考", "dBFS vs dB SPL: different reference points"),
    description: t(
      "解释数字音频电平与环境声压级为什么不能直接换算，以及本站通用估算、参考校准与原始输入的关系。",
      "Learn why digital audio level cannot be universally converted to sound pressure level, and how this tool labels each mode.",
    ),
    takeaway: t(
      "dB 描述相对某个参考量的对数比值。dBFS 的参考是数字满幅，dB SPL 的参考是声压；缺少设备和输入链路的参考关系，就没有通用换算常数。",
      "A decibel expresses a logarithmic ratio to a reference. dBFS refers to digital full scale; dB SPL refers to sound pressure. There is no universal conversion without an input-specific reference.",
    ),
    sections: [
      {
        id: "chain",
        title: t("从空气中的声音，到屏幕上的数字", "From air pressure to a number on screen"),
        paragraphs: [
          t(
            "麦克风先把声学信号转换为电信号，设备输入链路再将其转为数字采样。灵敏度、输入增益和音频处理会影响同一个声音最终产生多大的采样值。网页读取的是这条链路末端的数据。",
            "A microphone converts an acoustic signal into an electrical one, then the input chain produces digital samples. Sensitivity, gain and processing affect those samples. The browser reads data at the end of this chain.",
          ),
          t(
            "因此，两套输入链路的 -40 dBFS 不一定对应同一个环境声级。把一个固定常数加到所有设备读数上，不能建立可靠的声压级对应关系。",
            "Consequently, -40 dBFS from two input chains need not represent the same environmental level. Adding a fixed constant to all devices does not establish a reliable sound pressure relationship.",
          ),
        ],
      },
      {
        id: "rms",
        title: t("本站怎样计算相对电平？", "How this tool calculates relative level"),
        paragraphs: [
          t(
            "本站对采样窗口求均方能量，采用 10 × log10(均方能量)，以满幅样本幅度 1 为参考，标为 RMS dBFS。这里不采用将满幅正弦定义为 0 的其他计量约定。",
            "This tool uses 10 × log10(mean square energy), referenced to a full-scale sample amplitude of 1, labelled RMS dBFS. It does not use conventions that define a full-scale sine wave as 0.",
          ),
          t(
            "在这个约定下，幅度为 1 的理想正弦约为 -3.01 dBFS。数字零输入的对数是负无穷，原始计算使用 -100 dBFS 下限；主界面换算后保留 ≤ 标记，并提示它不是房间的实际声学下限。",
            "With this convention, an ideal sine of amplitude 1 is about -3.01 dBFS. Digital zero has a logarithm of negative infinity. Raw calculations use a -100 dBFS floor; the converted display retains a ≤ marker and explains that this is not the room's acoustic floor.",
          ),
        ],
      },
      {
        id: "estimate",
        title: t("通用估算与参考校准", "Generic estimation and reference calibration"),
        paragraphs: [
          t(
            "本站默认通用模型为 generic-rms-v1：估算 dB = RMS dBFS + 100。例如原始 -40 dBFS 显示约 60 dB。100 是用于粗略显示的产品假设，不是设备灵敏度或通用声压换算常数，没有获得跨设备声学精度验证。仪表 0–120 的刻度也不代表经过验证的测量量程。",
            "The default generic-rms-v1 model is estimated dB = RMS dBFS + 100: for example, -40 dBFS displays about 60 dB. The offset of 100 is a product assumption for rough display, not device sensitivity or a universal SPL conversion, and has no cross-device acoustic validation. The 0–120 dial is not a validated measurement range.",
          ),
          t(
            "使用合适的参考声级计，在位置和声源保持稳定时，对照当前输入建立偏移。本站会保留参考值、来源、时间和输入设置。显示的估算值仍是设备专属的单点对应，不是 dBA 或认证测量。",
            "Use a suitable reference meter while position and source remain stable, then establish an offset for the active input. This tool keeps the reference, source, time and input settings. The estimate remains a device-specific single-point relationship, not dBA or a certified measurement.",
          ),
        ],
      },
      {
        id: "average",
        title: t("为什么不能直接平均分贝数字？", "Why not simply average decibel numbers?"),
        paragraphs: [
          t(
            "分贝是对数值。本站先对实际观察到的采样窗口能量求均值，再转回分贝；例如 -20 与 -40 dBFS 两个等权窗口，能量均值约为 -22.97 dBFS，而不是 -30。",
            "Decibels are logarithmic. This tool averages the energy of observed sample windows before converting back. Two equally weighted windows at -20 and -40 dBFS produce an energy mean of about -22.97 dBFS, rather than -30.",
          ),
          t(
            "这是抽样窗口统计，并非对全部时间进行连续积分的专业 LAeq。记录中的最高值也是观察窗口最高值，不是专业峰值声压指标。",
            "These are sampled-window statistics, not a professional continuously integrated LAeq. The recorded maximum is a window maximum, not a professional peak sound pressure metric.",
          ),
        ],
      },
    ],
    sources: [
      mdnAudio,
      {
        title: "MDN · AnalyserNode.getFloatTimeDomainData",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatTimeDomainData",
      },
    ],
    related: ["phone-accuracy", "calibration", "guide"],
  },
  {
    id: "decibel-chart",
    slug: "knowledge/decibel-chart",
    kind: "article",
    updated: "2026-10-18",
    title: t("分贝对照表：先看条件，再比较声音", "Decibel chart: compare the context too"),
    description: t(
      "用常见声音的参考量级理解分贝，同时核对距离、计权与测量条件，避免把 dBFS 直接套入环境分贝表。",
      "Use everyday sound references with their distance, weighting and measurement context. Do not place dBFS directly on an environmental chart.",
    ),
    takeaway: t(
      "常见声音对照只能提供量级感。声源名称并不固定对应某个读数；距离、环境和计权不同，数值也会变化。",
      "Everyday sound references provide a sense of scale. A source name does not determine one fixed reading: distance, surroundings and weighting all matter.",
    ),
    sections: [
      {
        id: "reference",
        title: t("常见声音的参考量级", "Everyday sound references"),
        paragraphs: [
          t(
            "下表选取 NIDCD 教育资料中的常见例子。它们用于理解量级，不是对你所在位置的测量，也不是本站验证过的设备校准点。来源表中的示例不都具有相同距离，不能当成统一测试条件。",
            "The examples below are drawn from NIDCD educational material. They describe a scale, not your location or validated calibration points for this tool. Their measurement distances are not uniform and should not be treated as one test method.",
          ),
        ],
        table: {
          headers: [
            t("常见声音", "Everyday example"),
            t("资料中的参考范围", "Reference range"),
            t("比较时应记录", "Record when comparing"),
          ],
          rows: [
            [
              t("正常交谈", "Normal conversation"),
              t("约 60–70 dBA", "About 60–70 dBA"),
              t("说话者距离与环境", "Distance and surroundings"),
            ],
            [
              t("摩托车或越野车", "Motorcycles or dirt bikes"),
              t("约 80–110 dBA", "About 80–110 dBA"),
              t("距离、负载及是否经过", "Distance, load and pass-by"),
            ],
            [
              t(
                "最大音量耳机、体育活动或音乐会",
                "Headphones at maximum volume, sporting events or concerts",
              ),
              t("约 94–110 dBA", "About 94–110 dBA"),
              t("具体设备、位置与时间", "Device, position and duration"),
            ],
          ],
        },
      },
      {
        id: "numbers",
        title: t("40、50、60 或 70 分贝，到底有多大？", "How loud are 40, 50, 60 or 70 decibels?"),
        paragraphs: [
          t(
            "先确认数字的单位和条件。若是网页未校准的 dBFS，它不能直接回答环境声音有多大；若是声级计的 dBA，还需知道测量位置、时段和方法。仅凭一个数字，也不能替每个人判断是否舒适。",
            "First identify the unit and conditions. An uncalibrated browser dBFS value cannot directly tell you an environmental sound level. A meter's dBA value also needs a position, duration and method. One number cannot determine comfort for everyone.",
          ),
          t(
            "对照表可帮助提出一个更具体的问题，例如同一张书桌上，关窗前后是否出现可重复的变化。用固定条件复测，比给一次读数贴一个场景名称更有帮助。",
            "A chart can help you form a more useful question, such as whether closing a window produces a repeatable change at the same desk. Repeating fixed conditions is more informative than assigning one reading a source name.",
          ),
        ],
      },
      {
        id: "distance",
        title: t("让比较有意义的三个条件", "Three conditions for a useful comparison"),
        paragraphs: [
          t(
            "使用相同设备与输入设置；保持距离、位置和朝向一致；记录声源状态和观察时间。关窗、移动设备或改变输入增益，都可能改变读数，不能把变化一概归因于某个声源。",
            "Use the same input and settings, keep distance and orientation fixed, and record the source state and observation time. Closing a window, moving a device or changing gain can all affect the result.",
          ),
        ],
      },
      {
        id: "limits",
        title: t(
          "颜色和播放音量不能代替校准",
          "Colours and playback volume do not calibrate a meter",
        ),
        paragraphs: [
          t(
            "本站主仪表和色带显示估算噪音分贝，颜色与文字仅帮助理解声音量级，不自动判定健康风险。通用估算有设备误差，也不能直接等同于表中的 dBA。网页播放一段声音，也不能保证你的扬声器在某个位置输出指定的环境分贝。需要声压级参考时，请使用合适的参考设备。",
            "The main meter and scale show estimated noise. Colours and descriptions indicate approximate sound levels, not health risk. Generic estimates vary by device and are not equivalent to the dBA examples in the table. Playing a sound on a webpage cannot guarantee a specified environmental level from your speakers. Use a suitable reference instrument when sound pressure is required.",
          ),
        ],
      },
    ],
    sources: [
      {
        title: "NIDCD · Noise-Induced Hearing Loss",
        url: "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss",
      },
    ],
    related: ["dbfs-spl", "phone-accuracy", "calibration"],
  },
  {
    id: "microphone-help",
    slug: "knowledge/microphone-permission",
    kind: "article",
    updated: "2026-10-18",
    title: t(
      "麦克风打不开？按现象检查权限与输入",
      "Microphone not working? Check access and input",
    ),
    description: t(
      "处理网页麦克风授权等待、被拒绝、设备未找到、占用和系统中断，恢复分贝测试操作。",
      "Troubleshoot pending or denied microphone permission, missing inputs, device conflicts and interrupted browser capture.",
    ),
    takeaway: t(
      "先确认页面使用安全连接，再区分授权等待、权限未获得和设备读取失败。未采集到数据时，界面不会用零值假装测量成功。",
      "Check the secure connection, then distinguish a pending request, access not granted and an unreadable device. Missing input is never presented as a successful zero reading.",
    ),
    sections: [
      {
        id: "waiting",
        title: t("一直停在“等待授权”", "The permission request stays pending"),
        paragraphs: [
          t(
            "浏览器允许用户暂不回答权限请求，因此等待不一定意味着程序卡住。检查地址栏或浏览器的权限提示；不准备授权时可以取消等待，再按需要重新开始。",
            "A browser may leave the request pending until you choose. Look for its permission prompt or address-bar indicator. You can cancel the wait and start again later.",
          ),
          t(
            "取消不会修改浏览器已记住的权限。即使之前的请求稍后返回了音轨，本站也会立即释放，不把它接到下一次会话。",
            "Cancelling does not change permissions remembered by the browser. If an earlier request returns an audio track late, this tool releases it rather than attaching it to a later session.",
          ),
        ],
      },
      {
        id: "denied",
        title: t("提示未获得麦克风权限", "Microphone access was not granted"),
        paragraphs: [
          t(
            "查看当前网站的麦克风权限，并检查系统是否允许这个浏览器访问麦克风。在手机上，App 内置浏览器可能有额外限制；可尝试在 Safari、Chrome 等系统浏览器中打开。具体入口会随浏览器与系统版本变化。",
            "Check microphone permission for the current site and whether the operating system permits this browser to use it. An in-app browser may impose extra limits; try Safari, Chrome or another system browser. The exact settings vary by version.",
          ),
          t(
            "访问被拒绝也可能与页面策略或不安全连接有关，并不总是用户点了拒绝。使用本站 HTTPS 地址或本地开发的 localhost；不要为使用工具关闭浏览器安全保护。",
            "Access may also be blocked by a document policy or an insecure connection. It is not always a user rejection. Use the HTTPS site or localhost for development; do not disable browser security to use the tool.",
          ),
        ],
      },
      {
        id: "input",
        title: t("没有设备，或设备无法读取", "No input was found or it could not be read"),
        paragraphs: [
          t(
            "麦克风选择旁的小信号柱反映原始输入幅度，状态文字说明是否正在采集。信号柱很低不自动代表设备故障，也不等于房间安静；主仪表中的估算噪音分贝使用单独标注的估算口径。",
            "The small bars beside Microphone reflect raw input amplitude, while the text indicates capture status. Low bars alone do not establish a device fault or a quiet room. The main noise estimate uses its separately labelled estimation scale.",
          ),
          t(
            "确认麦克风已连接、未被系统禁用，并选中需要的输入。外接设备移除或浏览器记住了已经不存在的设备时，先选择默认麦克风重试。设备读取失败时，可结束其他正在占用麦克风的应用，再重新开始。",
            "Confirm the microphone is connected and enabled, and choose the intended input. If an external input was removed or the browser remembers an unavailable device, retry with the default microphone. Close other apps using it if the input cannot be read.",
          ),
        ],
      },
      {
        id: "interrupted",
        title: t(
          "切到后台、锁屏或输入突然中断",
          "The page moves to the background or capture stops",
        ),
        paragraphs: [
          t(
            "手机系统可能暂停后台页面或音频上下文。首版在页面离开前台或输入结束时停止本次测量，保留已取得的有效摘要。它不承诺锁屏或后台整夜监测。返回后重新开始，并核对输入与参考关系。",
            "Mobile systems can suspend a background page or its audio context. This version stops when the page leaves the foreground or the input ends, keeping the valid summary. It does not promise overnight or lock-screen monitoring. Start again and check the input and reference.",
          ),
        ],
      },
      {
        id: "privacy",
        title: t("结束后怎样停止访问？", "How does access stop?"),
        paragraphs: [
          t(
            "点击结束后，本站停止音轨并关闭音频上下文。浏览器仍可能保留你为网站授予的权限；可以在浏览器的网站权限界面自行更改。音频本身不录制、不上传，也不进入本机摘要记录。",
            "Finishing stops the tracks and closes the audio context. Your browser may remember the site's permission; change it in its site settings when you choose. Audio is not recorded, uploaded or included in local summaries.",
          ),
        ],
      },
    ],
    sources: [
      mdnInput,
      {
        title: "MDN · Permissions-Policy: microphone",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy/microphone",
      },
    ],
    related: ["guide", "privacy", "phone-accuracy"],
  },
];
