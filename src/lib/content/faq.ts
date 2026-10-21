import { translations as t, type LocalizedText, type SiteContent } from "./types.ts";

export interface FaqItem {
  id: string;
  question: LocalizedText;
  answer: LocalizedText[];
  link: { pageId: string; hash?: string; label: LocalizedText };
}

export const faqGroups: {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  questions: FaqItem[];
}[] = [
  {
    id: "getting-started",
    title: t("开始使用", "Getting started", "開始使用"),
    description: t(
      "先确认设备和使用方式。",
      "Check your device and how to get started.",
      "先確認裝置和使用方式。",
    ),
    questions: [
      {
        id: "install",
        question: t(
          "需要下载 App、注册或付费吗？",
          "Do I need an app, an account or a payment?",
          "需要下載 App、註冊或付費嗎？",
        ),
        answer: [
          t(
            "不需要。当前工具可以直接在浏览器中免费使用，无需安装 App 或注册。点击“开始测量”后，才会请求麦克风权限；不授权也能阅读帮助和体验演示。",
            "No. The current tool is free to use in your browser without installing an app or creating an account. Microphone permission is requested only after you select Start measuring. You can read the help or try the demo without granting access.",
            "不需要。當前工具可以直接在瀏覽器中免費使用，無需安裝 App 或註冊。點選“開始測量”後，才會請求麥克風權限；不授權也能閱讀幫助和體驗演示。",
          ),
        ],
        link: {
          pageId: "guide",
          hash: "start",
          label: t("查看开始方法", "See how to start", "檢視開始方法"),
        },
      },
      {
        id: "devices",
        question: t(
          "手机和电脑都能测吗？",
          "Can I use a phone or a computer?",
          "手機和電腦都能測嗎？",
        ),
        answer: [
          t(
            "需要设备有可用麦克风，并且浏览器允许网页访问它。手机可先尝试系统浏览器，电脑可选择内置或外接麦克风。App 内置浏览器、系统权限和设备设置可能影响使用，不能保证所有组合都能正常采集。",
            "You need a working microphone and a browser that allows the page to access it. On a phone, try a system browser; on a computer, choose the built-in or an external microphone. In-app browsers, system permissions and device settings can affect capture, so support is not guaranteed for every combination.",
            "需要裝置有可用麥克風，並且瀏覽器允許網頁存取它。手機可先嚐試系統瀏覽器，電腦可選擇內建或外接麥克風。App 內建瀏覽器、系統權限和裝置設定可能影響使用，不能保證所有組合都能正常採集。",
          ),
        ],
        link: {
          pageId: "microphone-help",
          label: t("查看设备与权限排查", "Check device access", "檢視裝置與權限排查"),
        },
      },
    ],
  },
  {
    id: "accuracy",
    title: t("读数准不准", "Understanding accuracy", "讀數準不準"),
    description: t(
      "看清估算、校准和专业测量的区别。",
      "Understand estimates, calibration and professional measurements.",
      "看清估算、校正和專業測量的區別。",
    ),
    questions: [
      {
        id: "accuracy",
        question: t(
          "网页测分贝准吗？",
          "How accurate is a browser decibel meter?",
          "網頁測分貝準嗎？",
        ),
        answer: [
          t(
            "本站提供粗略的噪音分贝估算，方便在同一设备、位置和设置下观察变化。通用估算没有经过跨设备声学精度验证，我们不承诺固定误差范围。需要准确声压级或专业结论时，应使用适合该用途的仪器和方法。",
            "This tool provides a rough noise estimate for observing changes with the same device, position and settings. The generic estimate has not undergone cross-device acoustic accuracy validation, and we do not promise a fixed error range. For accurate sound pressure levels or professional conclusions, use appropriate instruments and methods.",
            "本站提供粗略的噪音分貝估算，方便在同一裝置、位置和設定下觀察變化。通用估算沒有經過跨裝置聲學精度驗證，我們不承諾固定誤差範圍。需要準確聲壓級或專業結論時，應使用適合該用途的儀器和方法。",
          ),
        ],
        link: {
          pageId: "phone-accuracy",
          label: t(
            "了解准确性与适用范围",
            "Read about accuracy and limits",
            "瞭解準確性與適用範圍",
          ),
        },
      },
      {
        id: "devices-differ",
        question: t(
          "为什么两台设备的读数不一样？",
          "Why do two devices show different readings?",
          "為什麼兩臺裝置的讀數不一樣？",
        ),
        answer: [
          t(
            "麦克风灵敏度、距离、朝向、保护壳和系统音频处理都会改变输入。即使两台设备放在一起，也可能给出不同估算；换设备后的数字不能直接与原记录比较。固定同一套设备和条件，再重复观察更有意义。",
            "Microphone sensitivity, distance, orientation, cases and system audio processing all affect the input. Two devices placed together can still give different estimates. Readings from a new device should not be directly compared with earlier records. Keep the device and conditions fixed for repeat observations.",
            "麥克風靈敏度、距離、朝向、保護殼和系統音訊處理都會改變輸入。即使兩臺裝置放在一起，也可能給出不同估算；換裝置後的數字不能直接與原記錄比較。固定同一套裝置和條件，再重複觀察更有意義。",
          ),
        ],
        link: {
          pageId: "dbfs-spl",
          hash: "chain",
          label: t(
            "了解设备如何影响读数",
            "See how devices affect readings",
            "瞭解裝置如何影響讀數",
          ),
        },
      },
      {
        id: "calibration",
        question: t(
          "开始前一定要校准吗？",
          "Do I have to calibrate before starting?",
          "開始前一定要校正嗎？",
        ),
        answer: [
          t(
            "不用。默认即可查看标注“未校准”的通用估算。有合适的参考声级计时，可选用参考校准调整当前设备的显示偏移。它不会修正全部设备误差；更换麦克风会清除参考，刷新页面后也会恢复通用估算。",
            "No. You can start with the default estimate, labelled uncalibrated. With a suitable reference sound level meter, optional calibration adjusts the display offset for your current input. It does not correct every device error. Switching microphones clears the reference, and reloading restores the generic estimate.",
            "不用。預設即可檢視標註“未校正”的通用估算。有合適的參考聲級計時，可選用參考校正調整當前裝置的顯示偏移。它不會修正全部裝置誤差；更換麥克風會清除參考，重新整理頁面後也會恢復通用估算。",
          ),
        ],
        link: {
          pageId: "calibration",
          label: t("查看校准方法", "Read the calibration guide", "檢視校正方法"),
        },
      },
      {
        id: "professional",
        question: t(
          "读数是 dBA 吗，能用来判断噪音超标吗？",
          "Are the readings dBA, and can they prove a noise violation?",
          "讀數是 dBA 嗎，能用來判斷噪音超標嗎？",
        ),
        answer: [
          t(
            "不是。本站显示“dB · 估算”，没有实现 A 计权，也不是认证声级测量。颜色、警告线和导出的报告都不能证明超标或给出个人安全结论。涉及投诉取证、职业评估等任务，需要符合用途的测量方法与适用依据。",
            "No. Readings are labelled estimated dB. The tool does not implement A weighting or certified sound level measurement. Colours, warning lines and exported reports do not prove a violation or establish personal safety. Formal evidence or occupational assessments require appropriate methods and applicable requirements.",
            "不是。本站顯示“dB · 估算”，沒有實現 A 計權，也不是認證聲級測量。顏色、警告線和匯出的報告都不能證明超標或給出個人安全結論。涉及投訴取證、職業評估等任務，需要符合用途的測量方法與適用依據。",
          ),
        ],
        link: {
          pageId: "phone-accuracy",
          hash: "choose",
          label: t(
            "判断什么时候需要专业测量",
            "Decide when professional measurement is needed",
            "判斷什麼時候需要專業測量",
          ),
        },
      },
    ],
  },
  {
    id: "microphone",
    title: t("麦克风与故障", "Microphone problems", "麥克風與故障"),
    description: t(
      "按实际提示检查权限和输入。",
      "Follow the message to check permissions and input.",
      "按實際提示檢查權限和輸入。",
    ),
    questions: [
      {
        id: "permission",
        question: t(
          "麦克风打不开，或一直在等待授权怎么办？",
          "What if microphone access fails or keeps waiting?",
          "麥克風打不開，或一直在等待授權怎麼辦？",
        ),
        answer: [
          t(
            "先检查地址栏的权限提示，并确认网站与系统都允许当前浏览器使用麦克风。一直等待时可以取消，再重新开始；App 内置浏览器可尝试改用系统浏览器。请使用 HTTPS 网站或本地 localhost，不要关闭浏览器安全保护。",
            "Check the browser's permission prompt and make sure both the site and operating system allow microphone access. You can cancel a pending request and start again. If using an in-app browser, try a system browser. Use HTTPS or local localhost; do not disable browser security.",
            "先檢查位址列的權限提示，並確認網站與系統都允許當前瀏覽器使用麥克風。一直等待時可以取消，再重新開始；App 內建瀏覽器可嘗試改用系統瀏覽器。請使用 HTTPS 網站或本地 localhost，不要關閉瀏覽器安全保護。",
          ),
        ],
        link: {
          pageId: "microphone-help",
          label: t("按提示排查麦克风", "Troubleshoot microphone access", "按提示排查麥克風"),
        },
      },
      {
        id: "no-input",
        question: t(
          "已经允许麦克风，为什么还是没有读数？",
          "Why is there no reading after I allow microphone access?",
          "已經允許麥克風，為什麼還是沒有讀數？",
        ),
        answer: [
          t(
            "确认选中了需要的麦克风、设备没有静音或被系统禁用，并查看采集状态。外接麦克风移除后，可以选择默认麦克风重试；提示无法读取时，检查其他应用是否占用设备。未收到有效输入不会显示成一次成功测量，小信号柱很低也不能单独证明房间安静或设备损坏。",
            "Check that the intended microphone is selected, enabled and not muted, then read the capture status. If an external input was removed, retry with the default microphone. If it cannot be read, check whether another app is using it. Missing input is not shown as a successful measurement, and low signal bars alone do not establish a quiet room or a broken device.",
            "確認選中了需要的麥克風、裝置沒有靜音或被系統停用，並檢視採集狀態。外接麥克風移除後，可以選擇預設麥克風重試；提示無法讀取時，檢查其他應用是否佔用裝置。未收到有效輸入不會顯示成一次成功測量，小訊號柱很低也不能單獨證明房間安靜或裝置損壞。",
          ),
        ],
        link: {
          pageId: "microphone-help",
          hash: "input",
          label: t("检查没有信号的原因", "Check missing input", "檢查沒有訊號的原因"),
        },
      },
    ],
  },
  {
    id: "readings",
    title: t("看懂分贝数字", "Reading the numbers", "看懂分貝數字"),
    description: t(
      "理解零值、统计与常见声音参考。",
      "Understand zero, statistics and everyday sound references.",
      "理解零值、統計與常見聲音參考。",
    ),
    questions: [
      {
        id: "quiet",
        question: t(
          "房间很安静，为什么读数不是 0？",
          "Why isn't the reading zero in a quiet room?",
          "房間很安靜，為什麼讀數不是 0？",
        ),
        answer: [
          t(
            "安静不等于没有声音，麦克风和输入链路也会影响数字。本站还会把原始输入换算为粗略估算，因此不能用“是否归零”判断设备好坏。若出现“≤”标记，它表示计算下限，不代表房间实际达到了这个声级。",
            "Quiet does not mean no sound, and the microphone and input chain also affect the number. This tool maps the input to a rough estimate, so reaching zero is not a device test. A ≤ marker indicates a calculation floor, not the room's actual sound level.",
            "安靜不等於沒有聲音，麥克風和輸入鏈路也會影響數字。本站還會把原始輸入換算為粗略估算，因此不能用“是否歸零”判斷裝置好壞。若出現“≤”標記，它表示計算下限，不代表房間實際達到了這個聲級。",
          ),
        ],
        link: {
          pageId: "how-it-works",
          hash: "calculate",
          label: t(
            "了解声音怎样变成数字",
            "See how sound becomes a number",
            "瞭解聲音怎樣變成數字",
          ),
        },
      },
      {
        id: "statistics",
        question: t(
          "最低、最高和平均分贝分别是什么意思？",
          "What do minimum, maximum and average mean?",
          "最低、最高和平均分貝分別是什麼意思？",
        ),
        answer: [
          t(
            "它们概括本次测量已观察到的采样窗口：最低和最高是窗口读数的两端，平均值先对声音能量求平均，再换算成分贝。它们不是专业峰值或连续积分的 LAeq。趋势图保留最近 60 秒，统计则覆盖本次已累计的有效样本，两者时间范围不同。",
            "They summarize sample windows observed during this measurement. Minimum and maximum are the lowest and highest window readings; the average is calculated from energy before conversion to decibels. These are not professional peak or continuously integrated LAeq measurements. The trend shows the latest 60 seconds, while statistics cover accumulated valid samples from the session.",
            "它們概括本次測量已觀察到的取樣視窗：最低和最高是視窗讀數的兩端，平均值先對聲音能量求平均，再換算成分貝。它們不是專業峰值或連續積分的 LAeq。趨勢圖保留最近 60 秒，統計則覆蓋本次已累計的有效樣本，兩者時間範圍不同。",
          ),
        ],
        link: {
          pageId: "dbfs-spl",
          hash: "average",
          label: t("了解平均值怎么算", "See how the average is calculated", "瞭解平均值怎麼算"),
        },
      },
      {
        id: "sound-levels",
        question: t(
          "60、70、80 分贝大概有多响？",
          "How loud are 60, 70 or 80 decibels?",
          "60、70、80 分貝大概有多響？",
        ),
        answer: [
          t(
            "可以通过分贝对照表查找交谈、家电和交通等声音的参考范围。不同来源的测距、环境和单位可能不同，例子只帮助理解量级；不要把网页估算直接套入表格，判断自己的环境是否安全或超标。",
            "Use the decibel chart to look up reference ranges for conversation, appliances and traffic. Distance, surroundings and units differ between sources, so examples provide context rather than a direct comparison with your browser estimate or a safety or compliance decision.",
            "可以通過分貝對照表查詢交談、家電和交通等聲音的參考範圍。不同來源的測距、環境和單位可能不同，例子只幫助理解量級；不要把網頁估算直接套入表格，判斷自己的環境是否安全或超標。",
          ),
        ],
        link: {
          pageId: "decibel-chart",
          label: t("查找常见声音的分贝范围", "Look up everyday sounds", "查詢常見聲音的分貝範圍"),
        },
      },
    ],
  },
  {
    id: "measuring",
    title: t("怎样测和比较", "Measuring and comparing", "怎樣測和比較"),
    description: t(
      "保持条件一致，也了解持续测量的限制。",
      "Keep conditions consistent and understand continuous capture limits.",
      "保持條件一致，也瞭解持續測量的限制。",
    ),
    questions: [
      {
        id: "compare",
        question: t(
          "怎样比较家电开关或关窗前后的声音？",
          "How can I compare an appliance or open and closed windows?",
          "怎樣比較家電開關或關窗前後的聲音？",
        ),
        answer: [
          t(
            "固定设备、麦克风、距离、朝向和设置，分别观察两种状态，并在备注中记下条件；尽量重复几次，留意背景声是否改变。记录只有在输入与估算模型、校准偏移一致时才适合比较。两次读数相减不能直接当作家电独立声级或窗户隔声性能。",
            "Keep the device, microphone, distance, orientation and settings fixed. Observe each state, note the conditions and repeat while checking for background changes. Records need matching input, estimate model and calibration offset for comparison. Subtracting readings does not establish an appliance's isolated level or a window's sound insulation rating.",
            "固定裝置、麥克風、距離、朝向和設定，分別觀察兩種狀態，並在備註中記下條件；儘量重複幾次，留意背景聲是否改變。記錄只有在輸入與估算模型、校正偏移一致時才適合比較。兩次讀數相減不能直接當作家電獨立聲級或窗戶隔聲效能。",
          ),
        ],
        link: {
          pageId: "guide",
          hash: "save",
          label: t(
            "查看保存条件与复测方法",
            "Read about saving context and repeating",
            "檢視儲存條件與複測方法",
          ),
        },
      },
      {
        id: "background",
        question: t(
          "能锁屏、切到后台或整夜测量吗？",
          "Can I measure with the screen locked or overnight?",
          "能鎖定螢幕、切到背景或整夜測量嗎？",
        ),
        answer: [
          t(
            "当前版本在页面离开前台时停止采集，并保留已经取得的有效摘要，不支持后台或锁屏整夜监测。回到页面后需重新开始，并检查麦克风与校准状态。",
            "This version stops capture when the page leaves the foreground and keeps the valid summary collected so far. It does not support overnight background or lock-screen monitoring. Start again after returning and check the microphone and calibration status.",
            "當前版本在頁面離開前臺時停止採集，並保留已經取得的有效摘要，不支援背景或鎖定螢幕整夜監測。回到頁面後需重新開始，並檢查麥克風與校正狀態。",
          ),
        ],
        link: {
          pageId: "microphone-help",
          hash: "interrupted",
          label: t(
            "了解测量中断后的处理",
            "Read about interrupted capture",
            "瞭解測量中斷後的處理",
          ),
        },
      },
    ],
  },
  {
    id: "audio-records",
    title: t("录音、保存与导出", "Audio, saving and exports", "錄音、儲存與匯出"),
    description: t(
      "了解哪些数据会保留，以及怎样带走它们。",
      "See what is kept and how to download it.",
      "瞭解哪些資料會保留，以及怎樣帶走它們。",
    ),
    questions: [
      {
        id: "audio",
        question: t(
          "会录音或上传我的声音吗？",
          "Does the tool record or upload my audio?",
          "會錄音或上傳我的聲音嗎？",
        ),
        answer: [
          t(
            "录音默认关闭，音频在本机处理，不上传服务器。测量前主动开启“同步录音”后，结束时可播放或下载 MP3、PCM。保存报告时可选存同次录音，留在当前浏览器；未保存的录音在刷新、离开页面或新录音后清除。",
            "Recording is off by default. Audio is processed on your device and never uploaded. Turn on Record audio before measuring to play or download MP3 or PCM afterward. You can save matching audio with a report in this browser. Unsaved audio is cleared on reload, navigation or a new recording.",
            "錄音預設關閉，音訊在本機處理，不上傳伺服器。測量前主動開啟“同步錄音”後，結束時可播放或下載 MP3、PCM。儲存報告時可選存同次錄音，留在當前瀏覽器；未儲存的錄音在重新整理、離開頁面或新錄音後清除。",
          ),
        ],
        link: {
          pageId: "privacy",
          hash: "audio",
          label: t("查看音频与存储说明", "Read about audio and storage", "檢視音訊與儲存說明"),
        },
      },
      {
        id: "recording-limit",
        question: t(
          "为什么录音会自动停止，测量却还在继续？",
          "Why does recording stop while measurement continues?",
          "為什麼錄音會自動停止，測量卻還在繼續？",
        ),
        answer: [
          t(
            "单次录音最多 10 分钟，或达到 64 MiB 采样内存上限时提前停止。到达限制后保留已有片段，测量可以继续；这是录音限制，不是测量失败。当前浏览器保存的录音总量最多 200 MiB，空间不足会提示，不会自动删除其他报告的录音来腾出空间。",
            "A recording stops after 10 minutes or earlier at the 64 MiB sample limit. The captured audio is kept and measurement can continue; reaching this recording limit is not a measurement failure. Saved audio in this browser is limited to 200 MiB. Insufficient space is reported without deleting audio from other retained reports to make room.",
            "單次錄音最多 10 分鐘，或達到 64 MiB 取樣記憶體上限時提前停止。到達限制後保留已有片段，測量可以繼續；這是錄音限制，不是測量失敗。當前瀏覽器儲存的錄音總量最多 200 MiB，空間不足會提示，不會自動刪除其他報告的錄音來騰出空間。",
          ),
        ],
        link: {
          pageId: "guide",
          hash: "save",
          label: t(
            "了解录音限制与下载方法",
            "Read about recording limits and downloads",
            "瞭解錄音限制與下載方法",
          ),
        },
      },
      {
        id: "reports",
        question: t(
          "怎样保存结果，能导出哪些格式？",
          "How do I save results, and which formats can I export?",
          "怎樣儲存結果，能匯出哪些格式？",
        ),
        answer: [
          t(
            "结束真实测量后，“保存报告”把结果留在当前浏览器，“导出数据”可下载 CSV、Excel、PDF 或复制文字摘要；保存和导出时都可选填备注。有同次录音时，可另外下载 MP3、PCM，数据报告不包含音频。演示结果不能保存或导出为真实测量。",
            "After a real measurement, Save report keeps the result in this browser. Export data downloads CSV, Excel or PDF, or copies a text summary. Both allow an optional note. Matching audio can be downloaded separately as MP3 or PCM; data reports do not contain audio. Demo results cannot be saved or exported as real measurements.",
            "結束真實測量後，“儲存報告”把結果留在當前瀏覽器，“匯出資料”可下載 CSV、Excel、PDF 或複製文字摘要；儲存和匯出時都可選填備註。有同次錄音時，可另外下載 MP3、PCM，資料包告不包含音訊。演示結果不能儲存或匯出為真實測量。",
          ),
        ],
        link: {
          pageId: "guide",
          hash: "save",
          label: t("查看保存与导出的步骤", "See saving and export steps", "檢視儲存與匯出的步驟"),
        },
      },
      {
        id: "missing-records",
        question: t(
          "记录和录音会同步吗，为什么找不到了？",
          "Do records sync, and why might a record or its audio be missing?",
          "記錄和錄音會同步嗎，為什麼找不到了？",
        ),
        answer: [
          t(
            "不会自动同步。报告和选存录音只在保存它们的浏览器中可见，换设备、换浏览器或清除网站数据后可能找不到。最多保留 30 条报告，保存第 31 条会淘汰最早保存的报告及其录音；删除报告也会清理关联录音。没有随报告保存的录音，无法以后恢复。重要内容请先下载。",
            "Records do not sync automatically. Reports and saved audio are available only in the browser where they were saved, so changing devices, browsers or clearing site data can make them unavailable. Up to 30 reports are retained; saving a 31st removes the earliest saved report and its audio. Deleting a report also removes its audio. Audio not saved with a report cannot be recovered later. Download important files first.",
            "不會自動同步。報告和選存錄音只在儲存它們的瀏覽器中可見，換裝置、換瀏覽器或清除網站資料後可能找不到。最多保留 30 條報告，儲存第 31 條會淘汰最早儲存的報告及其錄音；刪除報告也會清理關聯錄音。沒有隨報告儲存的錄音，無法以後恢復。重要內容請先下載。",
          ),
        ],
        link: {
          pageId: "privacy",
          hash: "records",
          label: t(
            "了解本机记录与删除规则",
            "Read local storage and deletion rules",
            "瞭解本機記錄與刪除規則",
          ),
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
  title: t("分贝测试常见问题", "Decibel meter FAQ", "分貝測試常見問題"),
  description: t(
    "解答手机与电脑使用、测量准确性、麦克风故障、分贝读数、后台测量、录音和报告保存等常见问题。",
    "Answers about devices, accuracy, microphone access, readings, background capture, audio recording and saved reports.",
    "解答手機與電腦使用、測量準確性、麥克風故障、分貝讀數、背景測量、錄音和報告儲存等常見問題。",
  ),
  takeaway: t(
    "从你遇到的问题开始。每个回答先说明怎么做，再提供详细方法；测量结果是估算，音频在本机处理。",
    "Start with the question you have. Each answer gives a practical explanation and a link to more detail. Readings are estimates, and audio is processed on your device.",
    "從你遇到的問題開始。每個回答先說明怎麼做，再提供詳細方法；測量結果是估算，音訊在本機處理。",
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
