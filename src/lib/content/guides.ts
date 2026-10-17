import { dual as t, type SiteContent } from "./types.ts";

export const guides: SiteContent[] = [
  {
    id: "guide",
    slug: "guide",
    kind: "guide",
    updated: "2026-10-17",
    title: t("从一次观察开始", "Start with one observation"),
    description: t(
      "开始测量、切换仪表、进入全屏，以及结束后保存本机摘要的方法。",
      "How to start, change displays, use fullscreen and save a local observation summary.",
    ),
    takeaway: t(
      "先固定设备和位置，再开始测量。看清模式与趋势，结束后保存条件，下一次比较才更有意义。",
      "Fix the input and position before starting. Check the scale, observe a trend and save the context for a useful comparison later.",
    ),
    sections: [
      {
        id: "start",
        title: t("01 允许麦克风，开始观察", "01 Allow the microphone and begin"),
        paragraphs: [
          t(
            "在首页点击开始测量，并回应浏览器的麦克风请求。工具不会在打开页面时主动访问麦克风。没有设备或权限未获得时，会给出相应提示；等待中也可以取消。",
            "Select Start measuring and respond to the microphone request. Opening the page does not activate the microphone. A missing input or denied access produces a message, and you can cancel a pending request.",
          ),
        ],
      },
      {
        id: "mode",
        title: t("02 先看口径，再看数字", "02 Check the mode before the number"),
        paragraphs: [
          t(
            "默认是相对 RMS dBFS。它表示数字输入的幅度，不是环境声压级。具备合适参考设备时，可以建立本次页面内有效的参考关系，改看设备专属估算值。刻度和统计会使用同一口径。",
            "The default is relative RMS dBFS, a digital input amplitude rather than environmental sound pressure. With a suitable reference device, establish an estimate for this page session. The dial, scale and statistics use the same mode.",
          ),
        ],
      },
      {
        id: "view",
        title: t("03 选择合适的观察方式", "03 Choose a display that suits the task"),
        paragraphs: [
          t(
            "指针适合看变化方向，数显适合读数，电平条便于持续观察。切换显示不会重启采集。全屏观察会收起站点内容和侧栏，同时保留单位、结束操作、统计与趋势；可用退出按钮或 Esc 返回。",
            "Use the dial to see direction, digital for reading, or the level bar for continued observation. Switching displays does not restart capture. Fullscreen keeps the mode, finish control, statistics and trend; use Exit fullscreen or Esc to return.",
          ),
          t(
            "不方便授权时，可以先体验演示。模拟数据始终带有演示标签，不进入本机测量记录，也不能作为测量摘要导出。",
            "Try the demo when you do not want to grant access. Simulated data is labelled throughout and cannot become a local measurement record or summary export.",
          ),
        ],
      },
      {
        id: "save",
        title: t("04 结束、保存与复测", "04 Finish, save and repeat"),
        paragraphs: [
          t(
            "在测量前或过程中填写本次条件，例如位置、距离和家电状态。结束后，麦克风音轨会停止。你可以保存本机摘要或导出 JSON；摘要包括统计、口径、条件与最近一段趋势，不包含录音。",
            "Note position, distance and appliance state before or during the observation. Finishing stops the microphone tracks. Save a local summary or export JSON with statistics, scale, context and the recent trend, without recorded audio.",
          ),
          t(
            "记录最多保留最近 30 条，只在当前浏览器可见。比较记录时，输入设置和校准口径需要一致；条件仍需由你核对。均值差不是家电独立声级，也不是窗户的隔声性能。",
            "Up to 30 recent records are kept in this browser. Comparisons require matching input settings and calibration, and you must also check the conditions. A mean difference is not an isolated appliance level or window insulation rating.",
          ),
        ],
      },
    ],
    sources: [
      {
        title: "MDN · getUserMedia",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia",
      },
    ],
    related: ["calibration", "microphone-help", "dbfs-spl"],
  },
  {
    id: "calibration",
    slug: "calibration",
    kind: "guide",
    updated: "2026-10-17",
    title: t("建立一个有条件的声音参考", "Establish a sound reference, with its conditions"),
    description: t(
      "使用参考声级计建立单点估算关系，了解输入要求、有效条件和参考校准的限制。",
      "Establish a single-point estimate with a reference sound level meter and understand its input requirements and limits.",
    ),
    takeaway: t(
      "参考校准建立的是当前输入与一个参考读数的关系。它不认证设备，也不自动实现 A 计权、频响补偿或法规测量。",
      "Reference calibration relates the current input to one reference reading. It does not certify the device or implement A weighting, frequency correction or compliance measurement.",
    ),
    sections: [
      {
        id: "need",
        title: t("你需要哪些条件？", "What do you need?"),
        paragraphs: [
          t(
            "使用适合当前声音范围、具备有效校准记录的参考声级计。两台设备应在接近的位置、相同方向观察稳定声源，避免遮挡、风吹和手持摩擦。不要把另一个未知准确度的网页数字作为可靠参考。",
            "Use a reference sound level meter suitable for the current range, with a valid calibration record. Observe a stable source in nearby positions and matching orientations, avoiding wind and handling noise. An unverified number from another webpage is not a reliable reference.",
          ),
        ],
      },
      {
        id: "steps",
        title: t("在本站建立参考关系", "Set a reference in this tool"),
        paragraphs: [
          t(
            "先开始一次真实测量，确认输入稳定且未接近满幅。展开设备与记录中的参考校准，填写参考声级计读数与来源，再建立参考关系。首版接受 20–120 dB 的参考值，这只是工具输入范围，不代表已验证的测量量程。",
            "Begin a real measurement and confirm a stable input without a full-scale warning. Open Reference calibration under Input & context, enter the reference reading and source, and set the reference. The accepted 20–120 dB range is an input constraint, not a validated measurement range.",
          ),
          t(
            "估算值由当前 dBFS 加上参考偏移得到。该偏移会应用于本次输入的读数与窗口统计，结果明确标为估算 dB，而不是 dBA。参考值、来源和时间随摘要保留。",
            "The estimate adds the reference offset to the current dBFS value. It also applies to window statistics for this input. The result is labelled estimated dB, not dBA, and summaries keep the reference, source and time.",
          ),
        ],
      },
      {
        id: "validity",
        title: t("什么时候需要重新建立？", "When do you need a new reference?"),
        paragraphs: [
          t(
            "首版参考关系仅在当前页面停留期间保留；刷新后回到相对模式。切换麦克风会清除参考，重新开始时也会核对输入与音频处理设置。即使设置看似一致，声源频谱、音量或系统自动处理变化仍可能影响估算。",
            "The reference lasts only while this page remains open; refreshing returns to relative mode. Switching microphones clears it, and a new capture checks input and processing settings. Even matching settings cannot remove changes caused by source spectrum, level or system processing.",
          ),
        ],
      },
      {
        id: "limits",
        title: t("一个偏移不能解决所有误差", "One offset cannot correct every error"),
        paragraphs: [
          t(
            "单点关系不能验证整个频率和声级范围，也不能恢复削波信号。需要跨设备比较、标准测量、健康或法律判断时，请使用适合该任务的仪器和方法。你仍可以回到相对模式，继续观察同一输入的变化。",
            "A single point does not validate every frequency or level, or restore clipped input. For comparisons across devices, standardized measurements or health and legal decisions, use suitable instruments and methods. Relative mode remains available for observing changes in one input.",
          ),
        ],
      },
    ],
    sources: [
      {
        title: "CDC/NIOSH · Validated Sound Level Meter App conditions",
        url: "https://www.cdc.gov/niosh/noise/about/app.html",
      },
      {
        title: "MDN · MediaTrackSettings",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings",
      },
    ],
    related: ["phone-accuracy", "dbfs-spl", "guide"],
  },
  {
    id: "about",
    slug: "about",
    kind: "trust",
    updated: "2026-10-17",
    title: t("关于分贝测试", "About fenbeiceshi.com"),
    description: t(
      "分贝测试的产品目的、方法、能力范围与项目维护入口。",
      "The purpose, methods and limits of this browser sound observation project.",
    ),
    takeaway: t(
      "让一次声音观察更容易开始，也更容易正确理解。我们把模式、输入与方法放在数字旁，帮助你记录变化。",
      "Make an observation easier to start and easier to understand. The mode, input and method stay close to the number so you can record change in context.",
    ),
    sections: [
      {
        id: "purpose",
        title: t("为什么做这个工具", "Why this tool exists"),
        paragraphs: [
          t(
            "当你在意房间、家电或工作位置的声音时，一个数字往往不够。分贝测试把相对读数、趋势、条件记录和本机摘要放在一起，让你可以在相同条件下再次观察。",
            "When you care about a room, an appliance or a workspace, one number is rarely enough. This tool brings together relative levels, trends, context and local summaries for another observation under matching conditions.",
          ),
        ],
      },
      {
        id: "method",
        title: t("方法保持可解释", "Keep the method understandable"),
        paragraphs: [
          t(
            "工具在浏览器本机处理麦克风输入，默认使用 RMS dBFS；具备参考条件后才切换到估算显示。声音知识区说明公式、来源与使用限制。它不是经认证的声级计，不提供法定检测或个人健康结论。",
            "Microphone input is processed in your browser. RMS dBFS is the default, with an estimate available after reference calibration. The guides explain the calculations, sources and limits. This is not a certified meter or a legal or personal health assessment.",
          ),
        ],
      },
      {
        id: "maintain",
        title: t("项目维护与反馈", "Maintenance and feedback"),
        paragraphs: [
          t(
            "分贝测试由 fenbeiceshi.com 项目维护。你可以通过项目仓库查看开发进展并反馈问题。反馈设备兼容问题时，描述浏览器、系统和发生步骤即可，不需要提供录音、私人地点或完整测量记录。",
            "The fenbeiceshi.com project maintains this tool. Use the project repository to follow development and report problems. For compatibility feedback, a browser, operating system and reproduction steps are enough; recordings, private locations and complete measurement records are not needed.",
          ),
        ],
      },
    ],
    sources: [
      {
        title: "fenbeiceshi · 项目仓库 / Project repository",
        url: "https://github.com/ystarlongzi/fenbeiceshi",
      },
    ],
    related: ["guide", "privacy", "phone-accuracy"],
  },
  {
    id: "privacy",
    slug: "privacy",
    kind: "trust",
    updated: "2026-10-17",
    title: t("你的声音，留在你的设备上", "Your audio stays on your device"),
    description: t(
      "了解麦克风权限、音频本机处理、本机记录、参考校准和删除方式。",
      "Understand microphone access, on-device processing, local records, reference calibration and deletion.",
    ),
    takeaway: t(
      "本站不录制或上传原始音频。你主动保存的是当前浏览器中的观察摘要，可逐条删除或自行导出。",
      "This tool does not record or upload raw audio. Summaries are saved in this browser only when you choose, and you can delete or export them.",
    ),
    sections: [
      {
        id: "audio",
        title: t("麦克风与音频", "Microphone and audio"),
        paragraphs: [
          t(
            "点击开始后才请求麦克风权限。音频采样在浏览器内存中计算，不生成录音文件，也不发送至服务器。结束、离开前台或关闭页面时，采集会停止。浏览器是否记住授权由你的浏览器设置决定。",
            "Microphone access is requested only after Start. Audio samples are processed in browser memory without recording files or server uploads. Capture stops when you finish, leave the foreground or close the page. Your browser controls whether permission is remembered.",
          ),
        ],
      },
      {
        id: "records",
        title: t("本机摘要与删除", "Local summaries and deletion"),
        paragraphs: [
          t(
            "保存操作使用当前浏览器的网站存储，最多保留最近 30 条摘要。摘要包括时间、时长、输入信息、采样统计、条件、最近一段趋势及已使用的参考信息，不包含音频。它们不会自动同步到其他浏览器或设备。",
            "Saving uses this browser's site storage for up to 30 recent summaries: time, duration, input information, sampled statistics, conditions, recent trend and any reference used. No audio is included, and records do not automatically sync to another device or browser.",
          ),
          t(
            "本机记录页可以逐条确认删除。清除浏览器中的本站数据也会删除摘要；请先导出你希望保留的结果。本机存储不可用或损坏时，工具会提示并保留已有数据，不静默覆盖。",
            "Confirm individual deletions on the local records page. Clearing this site's browser data also removes summaries, so export any you want to keep first. Unavailable or malformed storage is reported and existing data is not silently overwritten.",
          ),
          t(
            "手动选择的亮色或暗色主题会作为独立偏好保存在当前浏览器，仅用于恢复外观，不包含音频或观察摘要，也不上传至服务器。尚未选择时跟随系统外观；清除本站数据后会恢复这一默认行为。",
            "Your chosen light or dark theme is stored as a separate preference in this browser to restore the appearance. It contains no audio or observation summaries and is not uploaded. Before you choose, the site follows your system appearance; clearing site data restores that default.",
          ),
        ],
      },
      {
        id: "reference",
        title: t("参考关系与导出", "Reference data and exports"),
        paragraphs: [
          t(
            "参考关系仅在当前页面停留期间使用，刷新后不自动沿用。摘要会保留它的来源和数值。本机记录中的输入签名用于检查可比性；导出的 JSON 不包含浏览器内部设备标识。导出后的文件由你自行保存和分享。",
            "A reference lasts only while this page remains open, though a saved summary keeps its source and value. Local input signatures help check comparability; exported JSON excludes the browser's internal device identifier. You control storage and sharing of exported files.",
          ),
        ],
      },
      {
        id: "network",
        title: t("页面请求与统计", "Page requests and analytics"),
        paragraphs: [
          t(
            "打开网站仍需要常规页面和资源请求；音频不上传不代表完全没有网络通信。当前工具没有接入广告、第三方访问分析、用户账户或云端记录服务。托管服务可能处理提供网页所需的连接信息与访问日志；若后续改变统计或数据处理方式，会更新本说明。",
            "Opening a website still involves normal page and asset requests; no audio uploads does not mean no network traffic. This version includes no ads, third-party analytics, accounts or cloud records. Hosting services may process connection data and access logs needed to serve pages. This notice will be updated if data processing changes.",
          ),
        ],
      },
    ],
    sources: [
      {
        title: "MDN · getUserMedia",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia",
      },
      {
        title: "MDN · localStorage",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
      },
    ],
    related: ["guide", "about", "microphone-help"],
  },
];
