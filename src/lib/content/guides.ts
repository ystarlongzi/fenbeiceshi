import { translations as t, type SiteContent } from "./types.ts";

export const guides: SiteContent[] = [
  {
    id: "guide",
    slug: "guide",
    kind: "guide",
    updated: "2026-10-21",
    title: t("分贝测试怎么用？", "How do I use the decibel meter?", "分貝測試怎麼用？"),
    description: t(
      "开始测量、切换仪表、进入全屏，以及结束后保存报告的方法。",
      "How to start, change displays, use fullscreen and save a local observation summary.",
      "開始測量、切換儀表、進入全螢幕，以及結束後儲存報告的方法。",
    ),
    takeaway: t(
      "先固定设备和位置，再开始测量。看清模式与趋势，结束后保存条件，下一次比较才更有意义。",
      "Fix the input and position before starting. Check the scale, observe a trend and save the context for a useful comparison later.",
      "先固定裝置和位置，再開始測量。看清模式與趨勢，結束後儲存條件，下一次比較才更有意義。",
    ),
    sections: [
      {
        id: "start",
        title: t(
          "01 允许麦克风，开始观察",
          "01 Allow the microphone and begin",
          "01 允許麥克風，開始觀察",
        ),
        paragraphs: [
          t(
            "在首页点击开始测量，并回应浏览器的麦克风请求。工具不会在打开页面时主动访问麦克风。没有设备或权限未获得时，会给出相应提示；等待中也可以取消。",
            "Select Start measuring and respond to the microphone request. Opening the page does not activate the microphone. A missing input or denied access produces a message, and you can cancel a pending request.",
            "在首頁點選開始測量，並回應瀏覽器的麥克風請求。工具不會在開啟頁面時主動存取麥克風。沒有裝置或權限未獲得時，會給出相應提示；等待中也可以取消。",
          ),
        ],
      },
      {
        id: "mode",
        title: t("02 看懂估算读数", "02 Understand the estimate", "02 看懂估算讀數"),
        paragraphs: [
          t(
            "默认显示通用估算噪音分贝，并标注未校准。仪表、色带、趋势、平均值和最大最小值使用同一套估算；设备差异可能造成明显偏差。具备参考声级计时，可选用参考校准，替换通用偏移。",
            "The default is a generic noise estimate, labelled uncalibrated. The meter, colour scale, trend, mean, minimum and maximum share the same estimate. Device differences can cause substantial error. Optional reference calibration replaces the generic offset.",
            "預設顯示通用估算噪音分貝，並標註未校正。儀表、色帶、趨勢、平均值和最大最小值使用同一套估算；裝置差異可能造成明顯偏差。具備參考聲級計時，可選用參考校正，替換通用偏移。",
          ),
        ],
      },
      {
        id: "view",
        title: t(
          "03 选择合适的观察方式",
          "03 Choose a display that suits the task",
          "03 選擇合適的觀察方式",
        ),
        paragraphs: [
          t(
            "指针、数显和条形均显示估算噪音分贝。麦克风旁的小信号柱只反馈输入幅度与采集状态，不代表噪音级别。切换显示不会重启采集。全屏观察会收起站点内容和侧栏，同时保留单位、结束操作、统计与趋势；可用退出按钮或 Esc 返回。",
            "The dial, digital display and bars all show estimated noise. The small signal bars next to Microphone indicate input amplitude and capture status, not environmental noise levels. Switching displays does not restart capture. Fullscreen keeps the mode, finish control, statistics and trend; use Exit fullscreen or Esc to return.",
            "指針、數字顯示和條形均顯示估算噪音分貝。麥克風旁的小訊號柱只回饋輸入幅度與採集狀態，不代表噪音級別。切換顯示不會重啟採集。全螢幕觀察會收起站點內容和側欄，同時保留單位、結束操作、統計與趨勢；可用退出按鈕或 Esc 返回。",
          ),
          t(
            "仪表样式和同步录音在右侧设置区调整；手机端或全屏时，点击控制区“设置”打开右侧抽屉。",
            "Display style and audio recording are in the right-hand settings. On phones or in fullscreen, open Settings in the controls to reveal the drawer.",
            "儀表樣式和同步錄音在右側設定區調整；手機端或全螢幕時，點選控制區“設定”開啟右側抽屜。",
          ),
        ],
      },
      {
        id: "save",
        title: t("04 结束、保存与复测", "04 Finish, save and repeat", "04 結束、儲存與複測"),
        paragraphs: [
          t(
            "需要保留声音时，在开始前开启“同步录音”（默认关闭）。录音与真实测量一起开始，结束后可播放。点击“导出数据”打开报告弹框，有本次录音时可生成并下载 MP3，或下载单声道、16 位小端原始 PCM；录音区也保留下载入口。PCM 采样率标在界面与文件名中，导入播放器时需使用这些参数。单次录音最多 10 分钟，或在达到 64 MiB 采样上限时提前停止，测量继续。",
            "To keep the sound, turn on Record audio before starting (off by default). Recording starts with a real measurement and can be played after finishing. Open Export data: if this measurement has audio, the report dialog offers Create MP3 and Download PCM. Downloads also remain in the recording area. PCM is raw mono, signed 16-bit little-endian; use the sample rate shown in the interface and filename when importing it into a player. Recording stops after 10 minutes or at the 64 MiB sample limit; measurement continues.",
            "需要保留聲音時，在開始前開啟“同步錄音”（預設關閉）。錄音與真實測量一起開始，結束後可播放。點選“匯出資料”開啟報告彈框，有本次錄音時可生成並下載 MP3，或下載單聲道、16 位小端原始 PCM；錄音區也保留下載入口。PCM 取樣率標在介面與檔名中，匯入播放器時需使用這些引數。單次錄音最多 10 分鐘，或在達到 64 MiB 取樣上限時提前停止，測量繼續。",
          ),
          t(
            "音频不上传。点击“保存报告”时，有同次录音会默认勾选“随报告保存录音”，将原始 PCM 保存在当前浏览器的 IndexedDB 中；也可取消勾选，仅保存报告数据。录音总容量上限为 200 MiB，空间不足会提示并保留已有数据。未保存的录音在刷新、离开页面或开始新录音后会清除；“清除录音”只释放当前页音频，不删除已存报告的录音。页面切到后台或输入中断会停止采集；尾部采样不完整时会保留片段并提示。",
            "Audio is never uploaded. Save report selects Save audio with this report by default when matching audio is available, storing raw PCM in this browser's IndexedDB. Uncheck it to save report data only. Total audio is limited to 200 MiB; storage failures are reported and existing data is kept. Unsaved audio is cleared when you reload, leave or start a new recording. Clear audio releases page-held audio without deleting audio saved with reports. Capture stops when the page leaves the foreground or input ends; incomplete final samples are kept with a warning.",
            "音訊不上傳。點選“儲存報告”時，有同次錄音會預設勾選“隨報告儲存錄音”，將原始 PCM 儲存在當前瀏覽器的 IndexedDB 中；也可取消勾選，僅儲存報告資料。錄音總容量上限為 200 MiB，空間不足會提示並保留已有資料。未儲存的錄音在重新整理、離開頁面或開始新錄音後會清除；“清除錄音”只釋放當前頁音訊，不刪除已存報告的錄音。頁面切到背景或輸入中斷會停止採集；尾部取樣不完整時會保留片段並提示。",
          ),
          t(
            "结束后，麦克风音轨会停止。点击“保存报告”或“导出数据”时，可在“备注”中选填位置、距离和家电状态等测量条件；两处共用备注。可导出 CSV、Excel、PDF 或复制摘要；摘要包括统计、口径、备注与最近一段趋势，不包含录音。",
            "Finishing stops the microphone tracks. When saving or exporting, optionally note the position, distance and appliance state. Both dialogs share this note. Export CSV, Excel or PDF, or copy a text summary, with statistics, scale, context and the recent trend, without recorded audio.",
            "結束後，麥克風音軌會停止。點選“儲存報告”或“匯出資料”時，可在“備註”中選填位置、距離和家電狀態等測量條件；兩處共用備註。可匯出 CSV、Excel、PDF 或複製摘要；摘要包括統計、口徑、備註與最近一段趨勢，不包含錄音。",
          ),
          t(
            "记录最多保留最近 30 条，只在当前浏览器可见；删除或淘汰记录时会同时清理对应录音。比较记录时，输入设置、估算模型和校准口径需要一致；旧版相对记录继续显示原来的 dBFS，不能与通用估算混比；条件仍需由你核对。均值差不是家电独立声级，也不是窗户的隔声性能。",
            "Up to 30 recent records are kept in this browser. Deleting or replacing an old record also removes its audio. Comparisons require matching input settings, estimate models and calibration. Legacy relative records retain dBFS and cannot be mixed with generic estimates. You must also check the conditions. A mean difference is not an isolated appliance level or window insulation rating.",
            "記錄最多保留最近 30 條，只在當前瀏覽器可見；刪除或淘汰記錄時會同時清理對應錄音。比較記錄時，輸入設定、估算模型和校正口徑需要一致；舊版相對記錄繼續顯示原來的 dBFS，不能與通用估算混比；條件仍需由你核對。均值差不是家電獨立聲級，也不是窗戶的隔聲效能。",
          ),
          t(
            "在本机记录页点击某条记录的下载按钮，也会打开报告弹框，选择 CSV、Excel、PDF 或复制摘要；有已保存录音时，还可下载 PCM 或在本机生成 MP3。旧记录不会恢复未曾保存的录音。弹框内修改的备注仅用于本次导出，不会更改原记录。浏览器清理网站数据或回收存储时可能删除报告与录音，请下载重要文件留存。",
            "On the local records page, each download button opens the report dialog with CSV, Excel, PDF and Copy summary. Saved audio also offers PCM download and local MP3 creation. Audio that was never saved with an old record cannot be recovered. Note edits apply only to that export, leaving saved records unchanged. Clearing site data or browser storage eviction may remove reports and audio; download important files to keep them.",
            "在本機記錄頁點選某條記錄的下載按鈕，也會開啟報告彈框，選擇 CSV、Excel、PDF 或複製摘要；有已儲存錄音時，還可下載 PCM 或在本機生成 MP3。舊記錄不會恢復未曾儲存的錄音。彈框內修改的備註僅用於本次匯出，不會更改原記錄。瀏覽器清理網站資料或回收儲存時可能刪除報告與錄音，請下載重要檔案留存。",
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
    title: t(
      "有参考声级计，怎样校准？",
      "How do I calibrate with a reference meter?",
      "有參考聲級計，怎樣校正？",
    ),
    description: t(
      "使用参考声级计建立单点估算关系，了解输入要求、有效条件和参考校准的限制。",
      "Establish a single-point estimate with a reference sound level meter and understand its input requirements and limits.",
      "使用參考聲級計建立單點估算關係，瞭解輸入要求、有效條件和參考校正的限制。",
    ),
    takeaway: t(
      "参考校准是可选操作。默认通用估算不要求参考设备；有参考声级计时，可以用当前输入与参考读数建立偏移，替换通用估算假设。它不认证设备，也不自动实现 A 计权、频响补偿或法规测量。",
      "Reference calibration is optional. The default generic estimate does not require another device. A reference meter can establish an offset for the active input, replacing the generic assumption. This does not certify the device or implement A weighting, frequency correction or compliance measurement.",
      "參考校正是可選操作。預設通用估算不要求參考裝置；有參考聲級計時，可以用當前輸入與參考讀數建立偏移，替換通用估算假設。它不認證裝置，也不自動實現 A 計權、頻響補償或法規測量。",
    ),
    sections: [
      {
        id: "need",
        title: t("你需要哪些条件？", "What do you need?", "你需要哪些條件？"),
        paragraphs: [
          t(
            "使用适合当前声音范围、具备有效校准记录的参考声级计。两台设备应在接近的位置、相同方向观察稳定声源，避免遮挡、风吹和手持摩擦。不要把另一个未知准确度的网页数字作为可靠参考。",
            "Use a reference sound level meter suitable for the current range, with a valid calibration record. Observe a stable source in nearby positions and matching orientations, avoiding wind and handling noise. An unverified number from another webpage is not a reliable reference.",
            "使用適合當前聲音範圍、具備有效校正記錄的參考聲級計。兩臺裝置應在接近的位置、相同方向觀察穩定聲源，避免遮擋、風吹和手持摩擦。不要把另一個未知準確度的網頁數字作為可靠參考。",
          ),
        ],
      },
      {
        id: "steps",
        title: t("怎样输入参考读数？", "How do I enter a reference reading?", "怎樣輸入參考讀數？"),
        paragraphs: [
          t(
            "先开始一次真实测量，确认输入稳定且没有过载提示。在“测量设置”中开启“参考校准”，填写参考声级计读数与来源，再建立参考关系。手机或全屏时，先点击“设置”打开抽屉。工具接受 20–120 dB 的参考值，这只是输入范围，不代表已验证的测量量程。",
            "Begin a real measurement and confirm a stable input without an overload warning. Enable Reference calibration in Measurement settings, enter the reference reading and source, then set the reference. On a phone or in fullscreen, open Settings first. The accepted 20–120 dB range is an input constraint, not a validated measurement range.",
            "先開始一次真實測量，確認輸入穩定且沒有過載提示。在“測量設定”中開啟“參考校正”，填寫參考聲級計讀數與來源，再建立參考關係。手機或全螢幕時，先點選“設定”開啟抽屜。工具接受 20–120 dB 的參考值，這只是輸入範圍，不代表已驗證的測量量程。",
          ),
          t(
            "估算值由当前 dBFS 加上参考偏移得到。参考偏移会替换通用模型的 +100，应用于本次输入的仪表、色带、趋势、统计、记录和导出；不会在通用偏移上再次叠加。结果明确标为估算 dB，而不是 dBA。参考值、来源和时间随摘要保留。",
            "The estimate adds the reference offset to the current dBFS value. The reference offset replaces the generic +100 in the meter, scale, trend, statistics, records and exports; the two offsets are not added together. The result is labelled estimated dB, not dBA, and summaries keep the reference, source and time.",
            "估算值由當前 dBFS 加上參考偏移得到。參考偏移會替換通用模型的 +100，應用於本次輸入的儀表、色帶、趨勢、統計、記錄和匯出；不會在通用偏移上再次疊加。結果明確標為估算 dB，而不是 dBA。參考值、來源和時間隨摘要保留。",
          ),
        ],
      },
      {
        id: "validity",
        title: t(
          "什么时候需要重新校准？",
          "When do I need to calibrate again?",
          "什麼時候需要重新校正？",
        ),
        paragraphs: [
          t(
            "首版参考关系仅在当前页面停留期间保留；刷新后恢复通用估算。切换麦克风会清除参考，重新开始时也会核对输入与音频处理设置。即使设置看似一致，声源频谱、音量或系统自动处理变化仍可能影响估算。",
            "The reference lasts only while this page remains open; refreshing restores the generic estimate. Switching microphones clears it, and a new capture checks input and processing settings. Even matching settings cannot remove changes caused by source spectrum, level or system processing.",
            "首版參考關係僅在當前頁面停留期間保留；重新整理後恢復通用估算。切換麥克風會清除參考，重新開始時也會核對輸入與音訊處理設定。即使設定看似一致，聲源頻譜、音量或系統自動處理變化仍可能影響估算。",
          ),
        ],
      },
      {
        id: "limits",
        title: t(
          "一个偏移不能解决所有误差",
          "One offset cannot correct every error",
          "一個偏移不能解決所有誤差",
        ),
        paragraphs: [
          t(
            "单点关系不能验证整个频率和声级范围，也不能恢复削波信号。需要跨设备比较、标准测量、健康或法律判断时，请使用适合该任务的仪器和方法。你可以清除参考，恢复通用估算并继续观察同一输入的变化。",
            "A single point does not validate every frequency or level, or restore clipped input. For comparisons across devices, standardized measurements or health and legal decisions, use suitable instruments and methods. Clear the reference to restore generic estimates and continue observing changes in one input.",
            "單點關係不能驗證整個頻率和聲級範圍，也不能恢復削波訊號。需要跨裝置比較、標準測量、健康或法律判斷時，請使用適合該任務的儀器和方法。你可以清除參考，恢復通用估算並繼續觀察同一輸入的變化。",
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
    title: t("关于分贝测试", "About fenbeiceshi.com", "關於分貝測試"),
    description: t(
      "分贝测试的产品目的、方法、能力范围与使用说明。",
      "The purpose, methods and limits of this browser sound observation project.",
      "分貝測試的產品目的、方法、能力範圍與使用說明。",
    ),
    takeaway: t(
      "让一次声音观察更容易开始，也更容易正确理解。我们把模式、输入与方法放在数字旁，帮助你记录变化。",
      "Make an observation easier to start and easier to understand. The mode, input and method stay close to the number so you can record change in context.",
      "讓一次聲音觀察更容易開始，也更容易正確理解。我們把模式、輸入與方法放在數字旁，幫助你記錄變化。",
    ),
    sections: [
      {
        id: "purpose",
        title: t("为什么做这个工具", "Why this tool exists", "為什麼做這個工具"),
        paragraphs: [
          t(
            "当你在意房间、家电或工作位置的声音时，一个数字往往不够。分贝测试把估算噪音分贝、趋势、条件记录和本机摘要放在一起，让你可以在相同条件下再次观察。",
            "When you care about a room, an appliance or a workspace, one number is rarely enough. This tool brings together estimated noise levels, trends, context and local summaries for another observation under matching conditions.",
            "當你在意房間、家電或工作位置的聲音時，一個數字往往不夠。分貝測試把估算噪音分貝、趨勢、條件記錄和本機摘要放在一起，讓你可以在相同條件下再次觀察。",
          ),
        ],
      },
      {
        id: "method",
        title: t("方法保持可解释", "Keep the method understandable", "方法保持可解釋"),
        paragraphs: [
          t(
            "工具在浏览器本机处理麦克风输入，默认将 RMS dBFS 加上 100，提供标注未校准的粗略估算。这个通用偏移是产品假设，没有通过跨设备声学精度验证；可选参考校准会替换它。声音知识区说明公式、来源与使用限制。它不是经认证的声级计，不提供法定检测或个人健康结论。",
            "Microphone input is processed in your browser. The default adds 100 to RMS dBFS for a labelled, uncalibrated estimate. This generic offset is a product assumption without cross-device acoustic validation. Optional reference calibration replaces it. The guides explain the calculations, sources and limits. This is not a certified meter or a legal or personal health assessment.",
            "工具在瀏覽器本機處理麥克風輸入，預設將 RMS dBFS 加上 100，提供標註未校正的粗略估算。這個通用偏移是產品假設，沒有通過跨裝置聲學精度驗證；可選參考校正會替換它。聲音知識區說明公式、來源與使用限制。它不是經認證的聲級計，不提供法定檢測或個人健康結論。",
          ),
        ],
      },
      {
        id: "maintain",
        title: t("维护与使用说明", "Maintenance and guidance", "維護與使用說明"),
        paragraphs: [
          t(
            "分贝测试由 fenbeiceshi.com 项目维护。使用指南说明测量与本机摘要的操作方法，隐私说明介绍音频处理和数据保存方式。遇到设备兼容问题时，可先按声音知识区的麦克风排查说明检查浏览器权限与输入设置。",
            "The fenbeiceshi.com project maintains this tool. The user guide explains measurement and local summaries, and the privacy page describes audio processing and data storage. For device compatibility problems, start with the microphone troubleshooting guide to check browser permissions and input settings.",
            "分貝測試由 fenbeiceshi.com 專案維護。使用指南說明測量與本機摘要的操作方法，隱私說明介紹音訊處理和資料儲存方式。遇到裝置相容問題時，可先按聲音知識區的麥克風排查說明檢查瀏覽器權限與輸入設定。",
          ),
        ],
      },
    ],
    sources: [
      {
        title: t("分贝测试 · 使用指南", "FenbeiCeshi · User guide", "分貝測試 · 使用指南"),
        url: "https://fenbeiceshi.com/guide/",
      },
    ],
    related: ["guide", "privacy", "phone-accuracy"],
  },
  {
    id: "privacy",
    slug: "privacy",
    kind: "trust",
    updated: "2026-10-22",
    title: t(
      "你的声音，留在你的设备上",
      "Your audio stays on your device",
      "你的聲音，留在你的裝置上",
    ),
    description: t(
      "了解麦克风权限、音频本机处理、本机记录、参考校准和删除方式。",
      "Understand microphone access, on-device processing, local records, reference calibration and deletion.",
      "瞭解麥克風權限、音訊本機處理、本機記錄、參考校正和刪除方式。",
    ),
    takeaway: t(
      "本站不上传音频。同步录音默认关闭；开启后可播放、下载，并在保存报告时将录音留在当前浏览器。删除或淘汰记录时会清理关联录音；导出的数据摘要不包含音频。",
      "This tool never uploads audio. Recording is off by default. Optional audio can be played, downloaded and saved with reports in this browser. Deleting or replacing a record removes its audio; exported data summaries exclude audio.",
      "本站不上傳音訊。同步錄音預設關閉；開啟後可播放、下載，並在儲存報告時將錄音留在當前瀏覽器。刪除或淘汰記錄時會清理關聯錄音；匯出的資料摘要不包含音訊。",
    ),
    sections: [
      {
        id: "audio",
        title: t("麦克风与音频", "Microphone and audio", "麥克風與音訊"),
        paragraphs: [
          t(
            "点击开始后才请求麦克风权限。默认仅在浏览器内存中计算分贝，不录音；主动开启同步录音后，采样仍只在本机处理，结束后可播放、生成 MP3 或下载原始 PCM。音频不发送至服务器，编码器从本站加载，无需第三方音频服务。结束、离开前台或关闭页面时，采集会停止。浏览器是否记住授权由你的浏览器设置决定。",
            "Microphone access is requested only after Start. By default, samples are used only to calculate levels in browser memory. Optional recording stays on-device for playback, local MP3 encoding and raw PCM download after finishing. Audio is never sent to a server; the encoder is loaded from this site without a third-party audio service. Capture stops when you finish, leave the foreground or close the page. Your browser controls whether permission is remembered.",
            "點選開始後才請求麥克風權限。預設僅在瀏覽器記憶體中計算分貝，不錄音；主動開啟同步錄音後，取樣仍只在本機處理，結束後可播放、生成 MP3 或下載原始 PCM。音訊不傳送至伺服器，編碼器從本站載入，無需第三方音訊服務。結束、離開前臺或關閉頁面時，採集會停止。瀏覽器是否記住授權由你的瀏覽器設定決定。",
          ),
          t(
            "单次录音最多 10 分钟，并受 64 MiB 采样内存上限约束；到达上限会停止录音、保留片段，测量可继续。保存报告时可将同次原始 PCM、实际采样率及报告 ID 留在当前浏览器的 IndexedDB，录音总容量最多 200 MiB，不会自动删除其他报告的录音腾出空间。未保存的录音仍只暂存当前页面，刷新、离开或新录音会释放；“清除录音”也只清理页面副本。下载到设备的音频文件不会被这些操作或网站数据清理删除。CSV、Excel、PDF 与文字摘要均不嵌入音频。",
            "Each recording is limited to 10 minutes and 64 MiB of samples; reaching either limit keeps the audio while measurement continues. Saving a report can keep its raw PCM, actual sample rate and report ID in this browser's IndexedDB, with a total audio limit of 200 MiB. Audio from retained reports is not silently deleted to make space. Unsaved audio stays in the page and is released on reload, navigation or a new recording. Clear audio also clears only the page copy. Downloaded files are unaffected by these actions or clearing site data. CSV, Excel, PDF and text summaries do not embed audio.",
            "單次錄音最多 10 分鐘，並受 64 MiB 取樣記憶體上限約束；到達上限會停止錄音、保留片段，測量可繼續。儲存報告時可將同次原始 PCM、實際取樣率及報告 ID 留在當前瀏覽器的 IndexedDB，錄音總容量最多 200 MiB，不會自動刪除其他報告的錄音騰出空間。未儲存的錄音仍只暫存當前頁面，重新整理、離開或新錄音會釋放；“清除錄音”也只清理頁面副本。下載到裝置的音訊檔案不會被這些操作或網站資料清理刪除。CSV、Excel、PDF 與文字摘要均不嵌入音訊。",
          ),
          t(
            "MP3 编码使用本机运行的 LAME / lamejs 开源编码器，许可证、源码与替换说明见本站 /vendor/lamejs/NOTICE.txt。",
            "Local MP3 encoding uses the open-source LAME / lamejs encoder. License, source and replacement details are available at /vendor/lamejs/NOTICE.txt on this site.",
            "MP3 編碼使用本機執行的 LAME / lamejs 開源編碼器，許可證、原始碼與替換說明見本站 /vendor/lamejs/NOTICE.txt。",
          ),
        ],
      },
      {
        id: "records",
        title: t("本机报告与删除", "Local reports and deletion", "本機報告與刪除"),
        paragraphs: [
          t(
            "保存操作在当前浏览器的 localStorage 中保留最多 30 条报告数据，包括时间、时长、输入信息、统计、备注、最近趋势、估算模型及参考信息；选存录音另外保存在 IndexedDB，通过报告 ID 关联。旧记录保留原口径，不会被改写成估算分贝，也无法恢复未曾保存的音频。报告与录音不会自动同步到其他浏览器或设备。",
            "Saving keeps up to 30 reports in this browser's localStorage, including time, duration, input information, statistics, notes, recent trend, estimate model and reference information. Optional audio is stored separately in IndexedDB, linked by report ID. Legacy records keep their original scale and cannot recover audio that was never saved. Reports and audio do not automatically sync to another device or browser.",
            "儲存操作在當前瀏覽器的 localStorage 中保留最多 30 條報告資料，包括時間、時長、輸入資訊、統計、備註、最近趨勢、估算模型及參考資訊；選存錄音另外儲存在 IndexedDB，通過報告 ID 關聯。舊記錄保留原口徑，不會被改寫成估算分貝，也無法恢復未曾儲存的音訊。報告與錄音不會自動同步到其他瀏覽器或裝置。",
          ),
          t(
            "本机记录页可以逐条确认删除，并清理对应录音；保存第 31 条时会淘汰最早保存的记录及其录音。清除本站数据也会删除报告与录音，浏览器还可能因空间紧张而回收存储，请先下载重要文件。容量不足或存储异常会提示，已有报告不会被静默覆盖；保存时可取消勾选录音，仅保存数据。",
            "Confirm individual deletions on the records page to remove a report and its audio. Saving a 31st record removes the earliest saved record and its audio. Clearing site data also removes reports and audio, and browsers may evict storage under pressure. Download important files first. Full or malformed storage is reported without silently overwriting existing reports; uncheck audio when saving to keep report data only.",
            "本機記錄頁可以逐條確認刪除，並清理對應錄音；儲存第 31 條時會淘汰最早儲存的記錄及其錄音。清除本站資料也會刪除報告與錄音，瀏覽器還可能因空間緊張而回收儲存，請先下載重要檔案。容量不足或儲存異常會提示，已有報告不會被靜默覆蓋；儲存時可取消勾選錄音，僅儲存資料。",
          ),
          t(
            "手动选择的亮色或暗色主题会作为独立偏好保存在当前浏览器，仅用于恢复外观，不包含音频或观察摘要，也不上传至服务器。尚未选择时跟随系统外观；清除本站数据后会恢复这一默认行为。",
            "Your chosen light or dark theme is stored as a separate preference in this browser to restore the appearance. It contains no audio or observation summaries and is not uploaded. Before you choose, the site follows your system appearance; clearing site data restores that default.",
            "手動選擇的亮色或暗色主題會作為獨立偏好儲存在當前瀏覽器，僅用於恢復外觀，不包含音訊或觀察摘要，也不上傳至伺服器。尚未選擇時跟隨系統外觀；清除本站資料後會恢復這一預設行為。",
          ),
          t(
            "首次进入无语言前缀的页面时，本站在浏览器内读取语言列表，选择简体中文、繁体中文或英文。手动选择的语言会独立保存在当前浏览器的 localStorage，之后优先使用该偏好；明确带有 /en/ 或 /zh-tw/ 的链接仍按链接显示。清除本站数据后恢复自动识别。语言列表不上传，偏好不包含测量记录；浏览器禁止保存时会提示，本次选择仍可使用。",
            "When you first open a page without a language prefix, the site reads your browser's language list locally to choose Simplified Chinese, Traditional Chinese or English. A manual choice is stored separately in this browser's localStorage and takes priority on later visits. Explicit /en/ and /zh-tw/ links keep their language. Clearing site data restores automatic selection. The language list is not uploaded, and the preference contains no measurement records. If storage is blocked, a notice is shown and your choice still works for this visit.",
            "首次進入無語言前綴的頁面時，本站在瀏覽器內讀取語言清單，選擇簡體中文、繁體中文或英文。手動選擇的語言會獨立儲存在當前瀏覽器的 localStorage，之後優先使用該偏好；明確帶有 /en/ 或 /zh-tw/ 的連結仍按連結顯示。清除本站資料後恢復自動識別。語言清單不上傳，偏好不包含測量記錄；瀏覽器禁止儲存時會提示，本次選擇仍可使用。",
          ),
        ],
      },
      {
        id: "reference",
        title: t("参考关系与导出", "Reference data and exports", "參考關係與匯出"),
        paragraphs: [
          t(
            "参考关系仅在当前页面停留期间使用，刷新后不自动沿用。摘要会保留它的来源和数值。本机记录中的输入签名用于检查可比性；导出文件不包含浏览器内部设备标识。导出后的文件由你自行保存和分享。",
            "A reference lasts only while this page remains open, though a saved summary keeps its source and value. Local input signatures help check comparability; exported files exclude the browser's internal device identifier. You control storage and sharing of exported files.",
            "參考關係僅在當前頁面停留期間使用，重新整理後不自動沿用。摘要會保留它的來源和數值。本機記錄中的輸入簽名用於檢查可比性；匯出檔案不包含瀏覽器內部裝置標識。匯出後的檔案由你自行儲存和分享。",
          ),
        ],
      },
      {
        id: "network",
        title: t("页面请求与统计", "Page requests and analytics", "頁面請求與統計"),
        paragraphs: [
          t(
            "打开网站仍需要常规页面和资源请求；音频不上传不代表完全没有网络通信。当前工具没有接入广告、第三方访问分析、用户账户或云端记录服务。托管服务可能处理提供网页所需的连接信息与访问日志；若后续改变统计或数据处理方式，会更新本说明。",
            "Opening a website still involves normal page and asset requests; no audio uploads does not mean no network traffic. This version includes no ads, third-party analytics, accounts or cloud records. Hosting services may process connection data and access logs needed to serve pages. This notice will be updated if data processing changes.",
            "開啟網站仍需要常規頁面和資源請求；音訊不上傳不代表完全沒有網路通訊。當前工具沒有接入廣告、第三方存取分析、使用者賬戶或雲端記錄服務。託管服務可能處理提供網頁所需的連線資訊與存取日誌；若後續改變統計或資料處理方式，會更新本說明。",
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
