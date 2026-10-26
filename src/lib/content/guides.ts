import { translations as t, type SiteContent } from "./types.ts";
import { activeSite } from "../routing/sites.ts";

export const guides: SiteContent[] = [
  {
    id: "guide",
    slug: "guide",
    kind: "guide",
    updated: "2026-10-25",
    title: t(
      "在线分贝仪怎么用？手机测噪音使用指南",
      "How to Use the Online Decibel Meter",
      "線上分貝計怎麼用？手機測噪音使用指南",
    ),
    description: t(
      "第一次用手机或电脑测噪音？跟着步骤允许麦克风、开始分贝测试，查看实时读数和声音变化。这里也介绍仪表切换、全屏、录音，以及测完后保存记录和导出报告的方法。",
      "New to measuring noise on your phone or computer? Learn how to start the online decibel meter, read the display, change views, record audio and save or export your results.",
      "第一次用手機或電腦測噪音？跟著步驟允許麥克風、開始分貝測試，查看即時讀數和聲音變化。這裡也介紹儀表切換、全螢幕、錄音，以及測完後儲存記錄和匯出報告的方法。",
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
            "默认显示未经专业校准的通用估算噪音分贝，标签为“通用估算 · 未修正”。仪表、色带、趋势、平均值和最大最小值使用同一套估算；设备差异可能造成明显偏差。有参考声级计时，可开启读数修正，直接加减当前估算；标签显示实际修正值，仪表、统计和趋势会一起更新。",
            "The default is a generic noise estimate without professional calibration, labelled Generic estimate · unadjusted. The meter, colour scale, trend, mean, minimum and maximum share the same estimate. Device differences can cause substantial error. Optional manual adjustment adds to or subtracts from this estimate, showing the applied offset in the badge and updating the meter, statistics and trend together.",
            "預設顯示未經專業校正的通用估算噪音分貝，標籤為「通用估算 · 未修正」。儀表、色帶、趨勢、平均值和最大最小值使用同一套估算；裝置差異可能造成明顯偏差。有參考聲級計時，可開啟讀數修正，直接加減目前估算；標籤顯示實際修正值，儀表、統計和趨勢會一起更新。",
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
            "记录最多保留最近 30 条，只在当前浏览器可见；删除或淘汰记录时会同时清理对应录音。比较记录时，输入设置、估算模型和修正值需要一致；旧版相对记录继续显示原来的 dBFS，不能与通用估算混比；条件仍需由你核对。均值差不是家电独立声级，也不是窗户的隔声性能。",
            "Up to 30 recent records are kept in this browser. Deleting or replacing an old record also removes its audio. Comparisons require matching input settings, estimate models and adjustment values. Legacy relative records retain dBFS and cannot be mixed with generic estimates. You must also check the conditions. A mean difference is not an isolated appliance level or window insulation rating.",
            "記錄最多保留最近 30 條，只在當前瀏覽器可見；刪除或淘汰記錄時會同時清理對應錄音。比較記錄時，輸入設定、估算模型和修正值需要一致；舊版相對記錄繼續顯示原來的 dBFS，不能與通用估算混比；條件仍需由你核對。均值差不是家電獨立聲級，也不是窗戶的隔聲效能。",
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
    updated: "2026-10-25",
    title: t(
      "分贝读数怎么调整？调高、调低与恢复默认",
      "How to Adjust a Decibel Meter Reading",
      "分貝讀數怎麼調整？調高、調低與恢復預設",
    ),
    description: t(
      "分贝读数偏高或偏低，应该怎么调？了解正数调高、负数调低的操作，用简单例子看懂读数修正何时生效、怎样恢复默认，以及如何与参考声级计对照。手动修正与专业校准的区别也在这里说明。",
      "Decibel reading too high or too low? Learn how to adjust it, restore the default and compare with a reference meter, with simple examples explaining what manual adjustment can and cannot do.",
      "分貝讀數偏高或偏低，應該怎麼調？瞭解正數調高、負數調低的操作，用簡單範例看懂讀數修正何時套用、怎樣恢復預設，以及如何與參考噪音計對照。手動修正與專業校正的區別也在這裡說明。",
    ),
    takeaway: t(
      "在“测量设置”中开启“读数修正”，从 0 dB 开始直接加减，不需要再点击应用。正数调高，负数调低；例如当前 60 dB，设置 +5 dB 后显示约 65 dB。手动修正仍是未校准估算。",
      "Enable Adjust reading in Measurement settings and add or subtract from 0 dB. Changes apply immediately, with no Apply button. Positive raises the reading; negative lowers it. For example, 60 dB becomes about 65 dB with +5 dB. This remains an uncalibrated estimate.",
      "在「測量設定」中開啟「讀數修正」，從 0 dB 開始直接加減，不需要再點選套用。正數調高，負數調低；例如目前 60 dB，設定 +5 dB 後顯示約 65 dB。手動修正仍是未校正估算。",
    ),
    sections: [
      {
        id: "need",
        title: t("什么时候需要调整？", "When should I adjust it?", "什麼時候需要調整？"),
        paragraphs: [
          t(
            "只想观察声音变化，可以保持默认的通用估算。有适合当前声音范围、具备有效校准记录的参考声级计时，可在接近的位置、相同朝向观察稳定声源，先输入 0，再用“参考读数 − 网页读数”计算修正值。例如网页 60 dB、参考仪器 65 dB，填写 +5；参考仪器 55 dB，则填写 −5。",
            "For observing changes, you can keep the default estimate. With a suitable reference sound level meter that has a valid calibration record, observe a stable source in nearby positions and matching orientations. Enter 0 first, then subtract the browser reading from the reference reading. If the browser shows 60 dB and the meter shows 65 dB, enter +5; if the meter shows 55 dB, enter −5.",
            "只想觀察聲音變化，可以保持預設的通用估算。有適合目前聲音範圍、具備有效校正記錄的參考聲級計時，可在接近的位置、相同朝向觀察穩定聲源，先輸入 0，再用「參考讀數 − 網頁讀數」計算修正值。例如網頁 60 dB、參考儀器 65 dB，填寫 +5；參考儀器 55 dB，則填寫 −5。",
          ),
          t(
            "安静的房间、另一个网页或常见声音对照表都不能提供可靠的校准值。没有参考依据时，不要为了匹配预期数字随意调整；单次对照也不能证明整个频率和声级范围都准确。",
            "A quiet room, another webpage or an everyday-sound chart is not a reliable calibration reference. Avoid adjusting merely to match an expected number. One comparison does not validate accuracy across all frequencies and levels.",
            "安靜的房間、另一個網頁或常見聲音對照表都不能提供可靠的校正值。沒有參考依據時，不要為了符合預期數字隨意調整；單次對照也不能證明整個頻率和聲級範圍都準確。",
          ),
        ],
      },
      {
        id: "steps",
        title: t("怎样直接加减读数？", "How do I change the reading?", "怎樣直接加減讀數？"),
        paragraphs: [
          t(
            "在测量设置中开启“读数修正”，拖动滑块、输入数值或使用键盘上下键。范围为 −50 至 +50 dB，步长 0.1。手机或全屏时先打开“设置”抽屉。开始前可以预设；测量中修改会立即生效，无需填写来源或点击应用。",
            "Enable Adjust reading in settings, then move the slider, enter a value or use the up and down arrow keys. The range is −50 to +50 dB in 0.1 steps. On phones or in fullscreen, open the Settings drawer first. You can preset it before starting; changes during measurement apply immediately without a source field or Apply button.",
            "在測量設定中開啟「讀數修正」，拖動滑桿、輸入數值或使用鍵盤上下鍵。範圍為 −50 至 +50 dB，步長 0.1。手機或全螢幕時先開啟「設定」抽屜。開始前可以預設；測量中修改會立即套用，無需填寫來源或點選套用。",
          ),
          t(
            "修正值始终加在通用估算上，而不是每次叠加到上次结果。例如从 +5 改成 +3，读数会比默认高 3 dB。当前仪表、色带、整次最低／最高／平均及已有趋势一起更新。输入为空、超范围或步长不符时会提示，并保留上次有效修正；输入 0 或关闭修正可恢复默认值。",
            "The adjustment always applies to the generic estimate, without accumulating previous edits. Changing +5 to +3 leaves the reading 3 dB above the default. The meter, scale, session minimum, maximum, mean and existing trend update together. Empty, out-of-range or off-step input shows an error and keeps the last valid adjustment. Enter 0 or switch adjustment off to restore the default.",
            "修正值始終加在通用估算上，而不是每次疊加到上次結果。例如從 +5 改成 +3，讀數會比預設高 3 dB。目前儀表、色帶、整次最低／最高／平均及已有趨勢一起更新。輸入為空、超出範圍或步長不符時會提示，並保留上次有效修正；輸入 0 或關閉修正可恢復預設值。",
          ),
        ],
      },
      {
        id: "validity",
        title: t("修正会保留多久？", "How long is the adjustment kept?", "修正會保留多久？"),
        paragraphs: [
          t(
            "修正仅在当前页面保留；刷新、切换麦克风或重新开始时发现输入设置改变，都会重置。演示和等待授权期间不能调整。测量结束后结果固定，需重新测量才能继续修改；保存和导出保留结束时的修正值、模型与统一换算后的统计和趋势，原始音频不变。历史参考校准记录仍保留原来的参考、来源与计算方式，不会改写为手动修正。",
            "The adjustment stays on this page only. Reloading, changing microphones or detecting changed input settings on restart resets it. Adjustment is unavailable during a demo or permission request. Finished results are fixed; start another measurement to edit again. Saving and exporting keep the final adjustment, model, statistics and trend; raw audio is unchanged. Legacy reference-calibrated records retain their original reference, source and calculation.",
            "修正僅在目前頁面保留；重新整理、切換麥克風或重新開始時發現輸入設定改變，都會重設。演示和等待授權期間不能調整。測量結束後結果固定，需重新測量才能繼續修改；儲存和匯出保留結束時的修正值、模型與統一換算後的統計和趨勢，原始音訊不變。歷史參考校正記錄仍保留原來的參考、來源與計算方式，不會改寫為手動修正。",
          ),
        ],
      },
      {
        id: "limits",
        title: t(
          "调过读数就准确了吗？",
          "Does adjustment make it accurate?",
          "調過讀數就準確了嗎？",
        ),
        paragraphs: [
          t(
            "手动加减只改变显示尺度，不修复削波，也不能消除麦克风频响、增益和系统处理误差。标签显示实际生效值，例如“手动修正 · +5.0 dB”；开启且设为 0 时显示“手动修正 · 0.0 dB”，关闭后恢复“通用估算 · 未修正”。单位仍为估算 dB，不是 dBA，也不代表专业校准。需要跨设备比较或专业测量时，请使用适合该任务的仪器和方法。",
            "Manual adjustment changes the display scale. It cannot repair clipping or remove microphone-response, gain or processing errors. The badge shows the applied value, such as Manually adjusted · +5.0 dB. Enabled at zero, it shows Manually adjusted · 0.0 dB; switching it off restores Generic estimate · unadjusted. The unit remains estimated dB, not dBA or professional calibration. Use suitable instruments and methods for cross-device comparisons or professional measurements.",
            "手動加減只改變顯示尺度，不修復削波，也不能消除麥克風頻率響應、增益和系統處理誤差。標籤顯示實際套用值，例如「手動修正 · +5.0 dB」；開啟且設為 0 時顯示「手動修正 · 0.0 dB」，關閉後恢復「通用估算 · 未修正」。單位仍為估算 dB，不是 dBA，也不代表專業校正。需要跨裝置比較或專業測量時，請使用適合該任務的儀器和方法。",
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
    updated: "2026-10-25",
    title: t(
      "关于本站：免费的在线分贝仪",
      "About This Free Online Decibel Meter",
      "關於本站：免費的線上分貝計",
    ),
    description: t(
      "了解分贝测试这款免费在线分贝仪：为什么做这个工具，网页怎样估算声音大小，以及测量、录音和本机记录适合怎样使用。这里也介绍维护方式和工具能力，帮助你了解本站。",
      "Meet SoundMeterGo, the free online decibel meter. Learn why it was built, how it estimates sound levels, what its recording and local reports offer, and how the project is maintained.",
      "瞭解分貝測試這款免費線上分貝計：為什麼製作這個工具，網頁怎樣估算聲音大小，以及測量、錄音和本機記錄適合怎樣使用。這裡也介紹維護方式和工具能力，幫助你瞭解本站。",
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
            "工具在浏览器本机处理麦克风输入，默认将 RMS dBFS 加上 100，提供未经专业校准的粗略估算。这个通用偏移是产品假设，没有通过跨设备声学精度验证；可选的读数修正在它的基础上实时加减。知识与帮助区说明公式、来源与使用限制。它不是经认证的声级计，不提供法定检测或个人健康结论。",
            "Microphone input is processed in your browser. The default adds 100 to RMS dBFS for an estimate without professional calibration. This generic offset is a product assumption without cross-device acoustic validation. Optional manual adjustment adds to or subtracts from it live. Knowledge & help explains the calculations, sources and limits. This is not a certified meter or a legal or personal health assessment.",
            "工具在瀏覽器本機處理麥克風輸入，預設將 RMS dBFS 加上 100，提供未經專業校正的粗略估算。這個通用偏移是產品假設，沒有通過跨裝置聲學精度驗證；選用的讀數修正在它的基礎上即時加減。知識與幫助區說明公式、來源與使用限制。它不是經認證的聲級計，不提供法定檢測或個人健康結論。",
          ),
        ],
      },
      {
        id: "maintain",
        title: t("维护与使用说明", "Maintenance and guidance", "維護與使用說明"),
        paragraphs: [
          t(
            "分贝测试由 fenbeiceshi.com 项目维护。使用指南说明测量与本机摘要的操作方法，隐私说明介绍音频处理和数据保存方式。遇到设备兼容问题时，可先按知识与帮助区的麦克风排查说明检查浏览器权限与输入设置。",
            "The SoundMeterGo project maintains this tool. The user guide explains measurement and local summaries, and the privacy page describes audio processing and data storage. For device compatibility problems, start with the microphone troubleshooting guide to check browser permissions and input settings.",
            "分貝測試由 fenbeiceshi.com 專案維護。使用指南說明測量與本機摘要的操作方法，隱私說明介紹音訊處理和資料儲存方式。遇到裝置相容問題時，可先按知識與幫助區的麥克風排查說明檢查瀏覽器權限與輸入設定。",
          ),
        ],
      },
    ],
    sources: [
      {
        title: t("分贝测试 · 使用指南", "SoundMeterGo · User guide", "分貝測試 · 使用指南"),
        url: `${activeSite.origin}/guide/`,
      },
    ],
    related: ["guide", "privacy", "phone-accuracy"],
  },
  {
    id: "privacy",
    slug: "privacy",
    kind: "trust",
    updated: "2026-10-25",
    title: t(
      "隐私说明：麦克风和录音会上传吗？",
      "Privacy: Does the Meter Upload My Audio?",
      "隱私說明：麥克風和錄音會上傳嗎？",
    ),
    description: t(
      "使用分贝测试时，麦克风什么时候开启，声音和录音会不会上传？了解音频在设备上的处理方式、报告和录音保存在哪里，以及怎样删除本机数据、管理权限和偏好设置。",
      "Does this decibel meter upload your audio? Find out when the microphone turns on, where reports and recordings are saved, and how to delete local data or manage permissions and preferences.",
      "使用分貝測試時，麥克風什麼時候開啟，聲音和錄音會不會上傳？瞭解音訊在裝置上的處理方式、報告和錄音儲存在哪裡，以及怎樣刪除本機資料、管理權限和偏好設定。",
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
            "保存操作在当前浏览器的 localStorage 中保留最多 30 条报告数据，包括时间、时长、输入信息、统计、备注、最近趋势、估算模型、手动修正值及历史参考信息；选存录音另外保存在 IndexedDB，通过报告 ID 关联。旧记录保留原口径，不会被改写成估算分贝，也无法恢复未曾保存的音频。报告与录音不会自动同步到其他浏览器或设备。",
            "Saving keeps up to 30 reports in this browser's localStorage, including time, duration, input information, statistics, notes, recent trend, estimate model, manual adjustment and legacy reference information. Optional audio is stored separately in IndexedDB, linked by report ID. Legacy records keep their original scale and cannot recover audio that was never saved. Reports and audio do not automatically sync to another device or browser.",
            "儲存操作在當前瀏覽器的 localStorage 中保留最多 30 條報告資料，包括時間、時長、輸入資訊、統計、備註、最近趨勢、估算模型、手動修正值及歷史參考資訊；選存錄音另外儲存在 IndexedDB，通過報告 ID 關聯。舊記錄保留原口徑，不會被改寫成估算分貝，也無法恢復未曾儲存的音訊。報告與錄音不會自動同步到其他瀏覽器或裝置。",
          ),
          t(
            "本机记录页可以逐条确认删除，并清理对应录音；保存第 31 条时会淘汰最早保存的记录及其录音。清除本站数据也会删除报告与录音，浏览器还可能因空间紧张而回收存储，请先下载重要文件。容量不足或存储异常会提示，已有报告不会被静默覆盖；保存时可取消勾选录音，仅保存数据。",
            "Confirm individual deletions on the records page to remove a report and its audio. Saving a 31st record removes the earliest saved record and its audio. Clearing site data also removes reports and audio, and browsers may evict storage under pressure. Download important files first. Full or malformed storage is reported without silently overwriting existing reports; uncheck audio when saving to keep report data only.",
            "本機記錄頁可以逐條確認刪除，並清理對應錄音；儲存第 31 條時會淘汰最早儲存的記錄及其錄音。清除本站資料也會刪除報告與錄音，瀏覽器還可能因空間緊張而回收儲存，請先下載重要檔案。容量不足或儲存異常會提示，已有報告不會被靜默覆蓋；儲存時可取消勾選錄音，僅儲存資料。",
          ),
          t(
            "主题提供“跟随系统、深色、浅色”。选择会作为独立偏好保存在当前浏览器，仅用于恢复外观，不包含音频或观察摘要，也不上传至服务器。默认或选择“跟随系统”时，页面随系统外观变化；选择深色或浅色后按该模式显示。清除本站数据后恢复跟随系统。",
            "The theme menu offers System, Dark and Light. Your choice is stored as a separate preference in this browser to restore the appearance. It contains no audio or observation summaries and is not uploaded. The default System option follows changes to your system appearance; Dark and Light keep their chosen mode. Clearing site data restores System.",
            "主題提供「跟隨系統、深色、淺色」。選擇會作為獨立偏好儲存在當前瀏覽器，僅用於恢復外觀，不包含音訊或觀察摘要，也不上傳至伺服器。預設或選擇「跟隨系統」時，頁面隨系統外觀變化；選擇深色或淺色後按該模式顯示。清除本站資料後恢復跟隨系統。",
          ),
          t(
            "本站在 fenbeiceshi.com 提供简体与繁体中文，在 soundmetergo.com 提供英文及其他国际语言。语言菜单会打开对应域名的同一页面。中文无前缀页面只在简体和繁体之间按手动偏好或浏览器语言选择，国际站按网址保持当前语言，不按语言强制跨域跳转。偏好分别保存在各域名的当前浏览器；语言列表和偏好不上传。浏览器禁止保存时会提示，并用链接参数保留本次选择。各域名的报告、录音和主题偏好不会自动共享，旧记录仍可回原域名下载。",
            "fenbeiceshi.com serves Simplified and Traditional Chinese; soundmetergo.com serves English and other international languages. The language menu opens the matching page on the appropriate domain. Automatic selection only switches between Chinese variants on unprefixed Chinese pages; the international site's language is determined by the URL. Language preferences, reports, recordings and theme settings are stored separately for each domain. The browser language list and preferences are not uploaded. If storage is blocked, a notice is shown and a URL parameter preserves your choice. Earlier records remain available to download on their original domain.",
            "本站在 fenbeiceshi.com 提供簡體與繁體中文，在 soundmetergo.com 提供英文及其他國際語言。語言選單會開啟對應網域的同一頁面。中文無前綴頁面只在簡體和繁體之間依手動偏好或瀏覽器語言選擇，國際站依網址保持目前語言，不依語言強制跨網域跳轉。偏好分別儲存在各網域的目前瀏覽器；語言清單和偏好不上傳。瀏覽器禁止儲存時會提示，並用連結參數保留本次選擇。各網域的報告、錄音和主題偏好不會自動共用，舊記錄仍可回原網域下載。",
          ),
        ],
      },
      {
        id: "reference",
        title: t("读数修正与导出", "Reading adjustments and exports", "讀數修正與匯出"),
        paragraphs: [
          t(
            "读数修正仅在当前页面使用，刷新后恢复默认估算。摘要保留结束时的手动修正值；旧参考校准报告继续保留原有来源和数值。本机记录中的输入签名用于检查可比性；导出文件不包含浏览器内部设备标识。导出后的文件由你自行保存和分享。",
            "Manual adjustment lasts only while this page remains open. Saved summaries keep the final adjustment; legacy reference-calibrated reports retain their source and value. Local input signatures help check comparability; exported files exclude the browser's internal device identifier. You control storage and sharing of exported files.",
            "讀數修正僅在目前頁面使用，重新整理後恢復預設估算。摘要保留結束時的手動修正值；舊參考校正報告繼續保留原有來源和數值。本機記錄中的輸入簽名用於檢查可比性；匯出檔案不包含瀏覽器內部裝置標識。匯出後的檔案由你自行儲存和分享。",
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
