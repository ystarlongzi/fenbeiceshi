import { dual as t, type SiteContent } from "./types.ts";

export const guides: SiteContent[] = [
  {
    id: "guide",
    slug: "guide",
    kind: "guide",
    updated: "2026-10-21",
    title: t("分贝测试怎么用？", "How do I use the decibel meter?"),
    description: t(
      "开始测量、切换仪表、进入全屏，以及结束后保存报告的方法。",
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
        title: t("02 看懂估算读数", "02 Understand the estimate"),
        paragraphs: [
          t(
            "默认显示通用估算噪音分贝，并标注未校准。仪表、色带、趋势、平均值和最大最小值使用同一套估算；设备差异可能造成明显偏差。具备参考声级计时，可选用参考校准，替换通用偏移。",
            "The default is a generic noise estimate, labelled uncalibrated. The meter, colour scale, trend, mean, minimum and maximum share the same estimate. Device differences can cause substantial error. Optional reference calibration replaces the generic offset.",
          ),
        ],
      },
      {
        id: "view",
        title: t("03 选择合适的观察方式", "03 Choose a display that suits the task"),
        paragraphs: [
          t(
            "指针、数显和条形均显示估算噪音分贝。麦克风旁的小信号柱只反馈输入幅度与采集状态，不代表噪音级别。切换显示不会重启采集。全屏观察会收起站点内容和侧栏，同时保留单位、结束操作、统计与趋势；可用退出按钮或 Esc 返回。",
            "The dial, digital display and bars all show estimated noise. The small signal bars next to Microphone indicate input amplitude and capture status, not environmental noise levels. Switching displays does not restart capture. Fullscreen keeps the mode, finish control, statistics and trend; use Exit fullscreen or Esc to return.",
          ),
          t(
            "仪表样式和同步录音在右侧设置区调整；手机端或全屏时，点击控制区“设置”打开右侧抽屉。",
            "Display style and audio recording are in the right-hand settings. On phones or in fullscreen, open Settings in the controls to reveal the drawer.",
          ),
        ],
      },
      {
        id: "save",
        title: t("04 结束、保存与复测", "04 Finish, save and repeat"),
        paragraphs: [
          t(
            "需要保留声音时，在开始前开启“同步录音”（默认关闭）。录音与真实测量一起开始，结束后可播放。点击“导出数据”打开报告弹框，有本次录音时可生成并下载 MP3，或下载单声道、16 位小端原始 PCM；录音区也保留下载入口。PCM 采样率标在界面与文件名中，导入播放器时需使用这些参数。单次录音最多 10 分钟，或在达到 64 MiB 采样上限时提前停止，测量继续。",
            "To keep the sound, turn on Record audio before starting (off by default). Recording starts with a real measurement and can be played after finishing. Open Export data: if this measurement has audio, the report dialog offers Create MP3 and Download PCM. Downloads also remain in the recording area. PCM is raw mono, signed 16-bit little-endian; use the sample rate shown in the interface and filename when importing it into a player. Recording stops after 10 minutes or at the 64 MiB sample limit; measurement continues.",
          ),
          t(
            "音频不上传。点击“保存报告”时，有同次录音会默认勾选“随报告保存录音”，将原始 PCM 保存在当前浏览器的 IndexedDB 中；也可取消勾选，仅保存报告数据。录音总容量上限为 200 MiB，空间不足会提示并保留已有数据。未保存的录音在刷新、离开页面或开始新录音后会清除；“清除录音”只释放当前页音频，不删除已存报告的录音。页面切到后台或输入中断会停止采集；尾部采样不完整时会保留片段并提示。",
            "Audio is never uploaded. Save report selects Save audio with this report by default when matching audio is available, storing raw PCM in this browser's IndexedDB. Uncheck it to save report data only. Total audio is limited to 200 MiB; storage failures are reported and existing data is kept. Unsaved audio is cleared when you reload, leave or start a new recording. Clear audio releases page-held audio without deleting audio saved with reports. Capture stops when the page leaves the foreground or input ends; incomplete final samples are kept with a warning.",
          ),
          t(
            "结束后，麦克风音轨会停止。点击“保存报告”或“导出数据”时，可在“备注”中选填位置、距离和家电状态等测量条件；两处共用备注。可导出 CSV、Excel、PDF 或复制摘要；摘要包括统计、口径、备注与最近一段趋势，不包含录音。",
            "Finishing stops the microphone tracks. When saving or exporting, optionally note the position, distance and appliance state. Both dialogs share this note. Export CSV, Excel or PDF, or copy a text summary, with statistics, scale, context and the recent trend, without recorded audio.",
          ),
          t(
            "记录最多保留最近 30 条，只在当前浏览器可见；删除或淘汰记录时会同时清理对应录音。比较记录时，输入设置、估算模型和校准口径需要一致；旧版相对记录继续显示原来的 dBFS，不能与通用估算混比；条件仍需由你核对。均值差不是家电独立声级，也不是窗户的隔声性能。",
            "Up to 30 recent records are kept in this browser. Deleting or replacing an old record also removes its audio. Comparisons require matching input settings, estimate models and calibration. Legacy relative records retain dBFS and cannot be mixed with generic estimates. You must also check the conditions. A mean difference is not an isolated appliance level or window insulation rating.",
          ),
          t(
            "在本机记录页点击某条记录的下载按钮，也会打开报告弹框，选择 CSV、Excel、PDF 或复制摘要；有已保存录音时，还可下载 PCM 或在本机生成 MP3。旧记录不会恢复未曾保存的录音。弹框内修改的备注仅用于本次导出，不会更改原记录。浏览器清理网站数据或回收存储时可能删除报告与录音，请下载重要文件留存。",
            "On the local records page, each download button opens the report dialog with CSV, Excel, PDF and Copy summary. Saved audio also offers PCM download and local MP3 creation. Audio that was never saved with an old record cannot be recovered. Note edits apply only to that export, leaving saved records unchanged. Clearing site data or browser storage eviction may remove reports and audio; download important files to keep them.",
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
    related: ["how-it-works", "faq", "calibration", "microphone-help", "dbfs-spl"],
  },
  {
    id: "calibration",
    slug: "calibration",
    kind: "guide",
    updated: "2026-10-21",
    title: t("有参考声级计，怎样校准？", "How do I calibrate with a reference meter?"),
    description: t(
      "使用参考声级计建立单点估算关系，了解输入要求、有效条件和参考校准的限制。",
      "Establish a single-point estimate with a reference sound level meter and understand its input requirements and limits.",
    ),
    takeaway: t(
      "参考校准是可选操作。默认通用估算不要求参考设备；有参考声级计时，可以用当前输入与参考读数建立偏移，替换通用估算假设。它不认证设备，也不自动实现 A 计权、频响补偿或法规测量。",
      "Reference calibration is optional. The default generic estimate does not require another device. A reference meter can establish an offset for the active input, replacing the generic assumption. This does not certify the device or implement A weighting, frequency correction or compliance measurement.",
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
        title: t("怎样输入参考读数？", "How do I enter a reference reading?"),
        paragraphs: [
          t(
            "先开始一次真实测量，确认输入稳定且没有过载提示。在“测量设置”中开启“参考校准”，填写参考声级计读数与来源，再建立参考关系。手机或全屏时，先点击“设置”打开抽屉。工具接受 20–120 dB 的参考值，这只是输入范围，不代表已验证的测量量程。",
            "Begin a real measurement and confirm a stable input without an overload warning. Enable Reference calibration in Measurement settings, enter the reference reading and source, then set the reference. On a phone or in fullscreen, open Settings first. The accepted 20–120 dB range is an input constraint, not a validated measurement range.",
          ),
          t(
            "估算值由当前 dBFS 加上参考偏移得到。参考偏移会替换通用模型的 +100，应用于本次输入的仪表、色带、趋势、统计、记录和导出；不会在通用偏移上再次叠加。结果明确标为估算 dB，而不是 dBA。参考值、来源和时间随摘要保留。",
            "The estimate adds the reference offset to the current dBFS value. The reference offset replaces the generic +100 in the meter, scale, trend, statistics, records and exports; the two offsets are not added together. The result is labelled estimated dB, not dBA, and summaries keep the reference, source and time.",
          ),
        ],
      },
      {
        id: "validity",
        title: t("什么时候需要重新校准？", "When do I need to calibrate again?"),
        paragraphs: [
          t(
            "首版参考关系仅在当前页面停留期间保留；刷新后恢复通用估算。切换麦克风会清除参考，重新开始时也会核对输入与音频处理设置。即使设置看似一致，声源频谱、音量或系统自动处理变化仍可能影响估算。",
            "The reference lasts only while this page remains open; refreshing restores the generic estimate. Switching microphones clears it, and a new capture checks input and processing settings. Even matching settings cannot remove changes caused by source spectrum, level or system processing.",
          ),
        ],
      },
      {
        id: "limits",
        title: t("一个偏移不能解决所有误差", "One offset cannot correct every error"),
        paragraphs: [
          t(
            "单点关系不能验证整个频率和声级范围，也不能恢复削波信号。需要跨设备比较、标准测量、健康或法律判断时，请使用适合该任务的仪器和方法。你可以清除参考，恢复通用估算并继续观察同一输入的变化。",
            "A single point does not validate every frequency or level, or restore clipped input. For comparisons across devices, standardized measurements or health and legal decisions, use suitable instruments and methods. Clear the reference to restore generic estimates and continue observing changes in one input.",
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
    updated: "2026-10-18",
    title: t("关于分贝测试", "About fenbeiceshi.com"),
    description: t(
      "分贝测试的产品目的、方法、能力范围与使用说明。",
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
            "当你在意房间、家电或工作位置的声音时，一个数字往往不够。分贝测试把估算噪音分贝、趋势、条件记录和本机摘要放在一起，让你可以在相同条件下再次观察。",
            "When you care about a room, an appliance or a workspace, one number is rarely enough. This tool brings together estimated noise levels, trends, context and local summaries for another observation under matching conditions.",
          ),
        ],
      },
      {
        id: "method",
        title: t("方法保持可解释", "Keep the method understandable"),
        paragraphs: [
          t(
            "工具在浏览器本机处理麦克风输入，默认将 RMS dBFS 加上 100，提供标注未校准的粗略估算。这个通用偏移是产品假设，没有通过跨设备声学精度验证；可选参考校准会替换它。声音知识区说明公式、来源与使用限制。它不是经认证的声级计，不提供法定检测或个人健康结论。",
            "Microphone input is processed in your browser. The default adds 100 to RMS dBFS for a labelled, uncalibrated estimate. This generic offset is a product assumption without cross-device acoustic validation. Optional reference calibration replaces it. The guides explain the calculations, sources and limits. This is not a certified meter or a legal or personal health assessment.",
          ),
        ],
      },
      {
        id: "maintain",
        title: t("维护与使用说明", "Maintenance and guidance"),
        paragraphs: [
          t(
            "分贝测试由 fenbeiceshi.com 项目维护。使用指南说明测量与本机摘要的操作方法，隐私说明介绍音频处理和数据保存方式。遇到设备兼容问题时，可先按声音知识区的麦克风排查说明检查浏览器权限与输入设置。",
            "The fenbeiceshi.com project maintains this tool. The user guide explains measurement and local summaries, and the privacy page describes audio processing and data storage. For device compatibility problems, start with the microphone troubleshooting guide to check browser permissions and input settings.",
          ),
        ],
      },
    ],
    sources: [
      {
        title: "分贝测试 · 使用指南 / User guide",
        url: "https://fenbeiceshi.com/guide/",
      },
    ],
    related: ["guide", "privacy", "phone-accuracy"],
  },
  {
    id: "privacy",
    slug: "privacy",
    kind: "trust",
    updated: "2026-10-21",
    title: t("你的声音，留在你的设备上", "Your audio stays on your device"),
    description: t(
      "了解麦克风权限、音频本机处理、本机记录、参考校准和删除方式。",
      "Understand microphone access, on-device processing, local records, reference calibration and deletion.",
    ),
    takeaway: t(
      "本站不上传音频。同步录音默认关闭；开启后可播放、下载，并在保存报告时将录音留在当前浏览器。删除或淘汰记录时会清理关联录音；导出的数据摘要不包含音频。",
      "This tool never uploads audio. Recording is off by default. Optional audio can be played, downloaded and saved with reports in this browser. Deleting or replacing a record removes its audio; exported data summaries exclude audio.",
    ),
    sections: [
      {
        id: "audio",
        title: t("麦克风与音频", "Microphone and audio"),
        paragraphs: [
          t(
            "点击开始后才请求麦克风权限。默认仅在浏览器内存中计算分贝，不录音；主动开启同步录音后，采样仍只在本机处理，结束后可播放、生成 MP3 或下载原始 PCM。音频不发送至服务器，编码器从本站加载，无需第三方音频服务。结束、离开前台或关闭页面时，采集会停止。浏览器是否记住授权由你的浏览器设置决定。",
            "Microphone access is requested only after Start. By default, samples are used only to calculate levels in browser memory. Optional recording stays on-device for playback, local MP3 encoding and raw PCM download after finishing. Audio is never sent to a server; the encoder is loaded from this site without a third-party audio service. Capture stops when you finish, leave the foreground or close the page. Your browser controls whether permission is remembered.",
          ),
          t(
            "单次录音最多 10 分钟，并受 64 MiB 采样内存上限约束；到达上限会停止录音、保留片段，测量可继续。保存报告时可将同次原始 PCM、实际采样率及报告 ID 留在当前浏览器的 IndexedDB，录音总容量最多 200 MiB，不会自动删除其他报告的录音腾出空间。未保存的录音仍只暂存当前页面，刷新、离开或新录音会释放；“清除录音”也只清理页面副本。下载到设备的音频文件不会被这些操作或网站数据清理删除。CSV、Excel、PDF 与文字摘要均不嵌入音频。",
            "Each recording is limited to 10 minutes and 64 MiB of samples; reaching either limit keeps the audio while measurement continues. Saving a report can keep its raw PCM, actual sample rate and report ID in this browser's IndexedDB, with a total audio limit of 200 MiB. Audio from retained reports is not silently deleted to make space. Unsaved audio stays in the page and is released on reload, navigation or a new recording. Clear audio also clears only the page copy. Downloaded files are unaffected by these actions or clearing site data. CSV, Excel, PDF and text summaries do not embed audio.",
          ),
          t(
            "MP3 编码使用本机运行的 LAME / lamejs 开源编码器，许可证、源码与替换说明见本站 /vendor/lamejs/NOTICE.txt。",
            "Local MP3 encoding uses the open-source LAME / lamejs encoder. License, source and replacement details are available at /vendor/lamejs/NOTICE.txt on this site.",
          ),
        ],
      },
      {
        id: "records",
        title: t("本机报告与删除", "Local reports and deletion"),
        paragraphs: [
          t(
            "保存操作在当前浏览器的 localStorage 中保留最多 30 条报告数据，包括时间、时长、输入信息、统计、备注、最近趋势、估算模型及参考信息；选存录音另外保存在 IndexedDB，通过报告 ID 关联。旧记录保留原口径，不会被改写成估算分贝，也无法恢复未曾保存的音频。报告与录音不会自动同步到其他浏览器或设备。",
            "Saving keeps up to 30 reports in this browser's localStorage, including time, duration, input information, statistics, notes, recent trend, estimate model and reference information. Optional audio is stored separately in IndexedDB, linked by report ID. Legacy records keep their original scale and cannot recover audio that was never saved. Reports and audio do not automatically sync to another device or browser.",
          ),
          t(
            "本机记录页可以逐条确认删除，并清理对应录音；保存第 31 条时会淘汰最早保存的记录及其录音。清除本站数据也会删除报告与录音，浏览器还可能因空间紧张而回收存储，请先下载重要文件。容量不足或存储异常会提示，已有报告不会被静默覆盖；保存时可取消勾选录音，仅保存数据。",
            "Confirm individual deletions on the records page to remove a report and its audio. Saving a 31st record removes the earliest saved record and its audio. Clearing site data also removes reports and audio, and browsers may evict storage under pressure. Download important files first. Full or malformed storage is reported without silently overwriting existing reports; uncheck audio when saving to keep report data only.",
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
            "参考关系仅在当前页面停留期间使用，刷新后不自动沿用。摘要会保留它的来源和数值。本机记录中的输入签名用于检查可比性；导出文件不包含浏览器内部设备标识。导出后的文件由你自行保存和分享。",
            "A reference lasts only while this page remains open, though a saved summary keeps its source and value. Local input signatures help check comparability; exported files exclude the browser's internal device identifier. You control storage and sharing of exported files.",
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
