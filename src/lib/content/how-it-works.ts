import { translations as t, type SiteContent } from "./types.ts";

export const howItWorks: SiteContent = {
  id: "how-it-works",
  slug: "how-it-works",
  kind: "guide",
  updated: "2026-10-25",
  title: t(
    "在线分贝仪的原理：网页怎么测出分贝？",
    "How Does an Online Decibel Meter Work?",
    "線上分貝計的原理：網頁怎麼測出分貝？",
  ),
  description: t(
    "网页为什么能显示分贝？从麦克风采集声音开始，用四个步骤看懂分贝估算、实时趋势和平均值是怎么来的，也了解为什么换一台手机读数会不同，以及手动修正有什么作用。",
    "How can a webpage measure decibels? Follow four simple steps from microphone input to estimated readings, live trends and averages, and learn why devices give different results.",
    "網頁為什麼能顯示分貝？從麥克風擷取聲音開始，用四個步驟看懂分貝估算、即時趨勢和平均值是怎麼來的，也瞭解為什麼換一台手機讀數會不同，以及手動修正有什麼作用。",
  ),
  takeaway: t(
    "麦克风把声音变成数字，网页计算一小段声音的能量，再换算成估算分贝。它能帮助观察变化；设备和设置会影响结果，不能把网页当作专业声级计。",
    "Your microphone turns sound into digital samples. The page calculates the energy of a short window and maps it to an estimated decibel reading. This helps you observe change, but devices and settings affect results, so it does not replace a professional sound level meter.",
    "麥克風把聲音變成數字，網頁計算一小段聲音的能量，再換算成估算分貝。它能幫助觀察變化；裝置和設定會影響結果，不能把網頁當作專業聲級計。",
  ),
  sections: [
    {
      id: "capture",
      title: t(
        "01 麦克风接收周围的声音",
        "01 Your microphone picks up nearby sound",
        "01 麥克風接收周圍的聲音",
      ),
      tocTitle: t("麦克风接收声音", "Pick up sound", "麥克風接收聲音"),
      paragraphs: [
        t(
          "点击“开始测量”并允许麦克风后，浏览器才能接收声音。麦克风和设备把声音转换为一串数字，网页读取这些数字，不会凭空知道房间里真实的声压。",
          "The browser receives sound only after you select Start measuring and allow microphone access. Your microphone and device turn it into digital samples. The page reads those samples; it does not directly know the room's actual sound pressure.",
          "點選“開始測量”並允許麥克風後，瀏覽器才能接收聲音。麥克風和裝置把聲音轉換為一串數字，網頁讀取這些數字，不會憑空知道房間裡真實的聲壓。",
        ),
        t(
          "输入来源是当前选中的麦克风。电脑正在播放的音乐，只有被麦克风拾取时才会反映在这里；本站不直接读取电脑内部音频，也不分析上传的音频文件。",
          "The input is your selected microphone. Music playing on a computer affects this reading when the microphone picks it up. This tool does not directly capture system audio or analyze uploaded audio files.",
          "輸入來源是當前選中的麥克風。電腦正在播放的音樂，只有被麥克風拾取時才會反映在這裡；本站不直接讀取電腦內部音訊，也不分析上傳的音訊檔案。",
        ),
      ],
    },
    {
      id: "calculate",
      title: t(
        "02 计算一小段声音的能量",
        "02 Calculate the energy of a short sound window",
        "02 計算一小段聲音的能量",
      ),
      tocTitle: t("计算声音能量", "Calculate energy", "計算聲音能量"),
      paragraphs: [
        t(
          "网页持续读取短时间内的采样，先看这段信号整体有多强，再转换为对数形式的电平。可以把它理解成：综合一小段声音，而不是只看某一个瞬间的波形尖点。计算中使用的“均方根（RMS）”描述的就是这种信号强弱。",
          "The page reads short windows of samples, calculates their overall energy and converts it to a logarithmic level. It considers a short stretch of sound rather than just one sharp point in the waveform. Root mean square, or RMS, describes this overall signal strength.",
          "網頁持續讀取短時間內的取樣，先看這段訊號整體有多強，再轉換為對數形式的電平。可以把它理解成：綜合一小段聲音，而不是隻看某一個瞬間的波形尖點。計算中使用的“均方根（RMS）”描述的就是這種訊號強弱。",
        ),
        t(
          "此时得到的是相对数字满幅的输入电平，称为 dBFS，还不是环境声压级。很小的信号或全零输入可能触及计算下限；界面的“≤”表示这一计算边界，不表示房间实际达到了对应声级。",
          "This produces an input level relative to digital full scale, called dBFS, rather than an environmental sound pressure level. Very small or zero input may reach the calculation floor. The ≤ marker identifies that calculation boundary, not the room's actual sound level.",
          "此時得到的是相對數字滿幅的輸入電平，稱為 dBFS，還不是環境聲壓級。很小的訊號或全零輸入可能觸及計算下限；介面的“≤”表示這一計算邊界，不表示房間實際達到了對應聲級。",
        ),
      ],
    },
    {
      id: "estimate",
      title: t(
        "03 换算为你看到的估算分贝",
        "03 Map the signal to an estimated decibel reading",
        "03 換算為你看到的估算分貝",
      ),
      tocTitle: t("换算估算分贝", "Estimate decibels", "換算估算分貝"),
      paragraphs: [
        t(
          "为了方便日常观察，本站默认在原始 RMS dBFS 上加 100，得到主仪表的估算值。例如原始输入为 −40 dBFS 时，显示约 60 dB。这个 +100 是公开的产品估算假设，不是适用于所有麦克风的声压换算常数，也没有经过跨设备声学精度验证。",
          "For everyday observation, the default adds 100 to raw RMS dBFS. An input of −40 dBFS therefore displays about 60 dB. This +100 is a disclosed product assumption, not a sound pressure conversion that works for every microphone, and it has not undergone cross-device acoustic accuracy validation.",
          "為了方便日常觀察，本站預設在原始 RMS dBFS 上加 100，得到主儀表的估算值。例如原始輸入為 −40 dBFS 時，顯示約 60 dB。這個 +100 是公開的產品估算假設，不是適用於所有麥克風的聲壓換算常數，也沒有經過跨裝置聲學精度驗證。",
        ),
        t(
          "在设置中开启读数修正，可在默认估算上实时加减 −50 至 +50 dB。例如默认显示 60 dB，修正 +5 后显示约 65 dB，修正 −5 后显示约 55 dB。修正会同步应用到仪表、统计和已有趋势，不改动原始采样或录音，也不代表专业校准、A 计权或准确度验证。",
          "Enable Adjust reading in settings to add or subtract −50 to +50 dB from the default estimate live. A default 60 dB becomes about 65 dB with +5, or 55 dB with −5. The meter, statistics and existing trend update together without changing raw samples or audio. This does not provide professional calibration, A weighting or validated accuracy.",
          "在設定中開啟讀數修正，可在預設估算上即時加減 −50 至 +50 dB。例如預設顯示 60 dB，修正 +5 後顯示約 65 dB，修正 −5 後顯示約 55 dB。修正會同步套用到儀表、統計和已有趨勢，不改動原始取樣或錄音，也不代表專業校正、A 計權或準確度驗證。",
        ),
      ],
    },
    {
      id: "display",
      title: t(
        "04 显示变化，并汇总本次结果",
        "04 Show changes and summarize the measurement",
        "04 顯示變化，並彙總本次結果",
      ),
      tocTitle: t("显示趋势与统计", "Show trends and statistics", "顯示趨勢與統計"),
      paragraphs: [
        t(
          "指针、数显、条形、色带、趋势和统计共用同一套估算，切换仪表不会重新开始测量。趋势图展示最近 60 秒的变化；最低、最高和平均值概括本次累计的有效采样窗口。",
          "The dial, digital and bar displays, colour scale, trend and statistics share the same estimate. Switching displays does not restart capture. The trend shows the latest 60 seconds; minimum, maximum and average summarize valid sample windows accumulated in this measurement.",
          "指針、數字顯示、條形、色帶、趨勢和統計共用同一套估算，切換儀表不會重新開始測量。趨勢圖展示最近 60 秒的變化；最低、最高和平均值概括本次累計的有效取樣視窗。",
        ),
        t(
          "平均分贝不是把屏幕上的数字直接相加再除。本站先平均采样能量，再换算成分贝；最高值是观察窗口的最高读数，不是专业峰值声压指标。这些抽样统计也不是连续积分的 LAeq。",
          "The average is not the arithmetic mean of the displayed decibel numbers. This tool averages sampled energy before converting it to decibels. The maximum is a window maximum rather than a professional peak sound pressure metric, and sampled statistics are not a continuously integrated LAeq.",
          "平均分貝不是把螢幕上的數字直接相加再除。本站先平均取樣能量，再換算成分貝；最高值是觀察視窗的最高讀數，不是專業峰值聲壓指標。這些抽樣統計也不是連續積分的 LAeq。",
        ),
      ],
    },
    {
      id: "limits",
      title: t(
        "为什么设备不同，读数也不同？",
        "Why do different devices give different readings?",
        "為什麼裝置不同，讀數也不同？",
      ),
      paragraphs: [
        t(
          "同样的声音，经过不同麦克风、增益和系统处理后，会变成不同大小的数字。距离、朝向、风吹和手持摩擦也会影响输入。网页会请求关闭自动增益、降噪和回声消除，但设备不一定按请求执行。",
          "The same sound can produce different digital samples through different microphones, gain settings and system processing. Distance, orientation, wind and handling noise also affect input. The page requests that gain control, noise reduction and echo cancellation be disabled, but devices may not honor those requests.",
          "同樣的聲音，經過不同麥克風、增益和系統處理後，會變成不同大小的數字。距離、朝向、風吹和手持摩擦也會影響輸入。網頁會請求關閉自動增益、降噪和回聲消除，但裝置不一定按請求執行。",
        ),
        t(
          "因此，更合适的用法是在同一设备、位置与设置下重复观察变化，并保存条件。仪表量程、颜色和警告线只帮助阅读估算，不代表已验证的测量范围、安全界限或超标判定。",
          "A useful approach is to repeat observations with the same device, position and settings, and save the context. The dial range, colours and warning lines help you read the estimate; they do not establish a validated measurement range, a safety boundary or a compliance result.",
          "因此，更合適的用法是在同一裝置、位置與設定下重複觀察變化，並儲存條件。儀表量程、顏色和警告線只幫助閱讀估算，不代表已驗證的測量範圍、安全界限或超標判定。",
        ),
      ],
    },
    {
      id: "privacy",
      title: t(
        "声音会被上传或保存吗？",
        "Is my audio uploaded or saved?",
        "聲音會被上傳或儲存嗎？",
      ),
      paragraphs: [
        t(
          "计算在本机浏览器中完成，音频不上传。录音默认关闭；主动开启同步录音后，可在结束时播放、下载，也可随报告保存在当前浏览器。单次录音有 10 分钟与 64 MiB 采样上限，保存录音总量最多 200 MiB。",
          "Calculations run in your browser and audio is never uploaded. Recording is off by default. If you enable it, you can play or download the audio after finishing and optionally save it with the report in this browser. Each recording is limited to 10 minutes and 64 MiB of samples, with a 200 MiB total limit for saved audio.",
          "計算在本機瀏覽器中完成，音訊不上傳。錄音預設關閉；主動開啟同步錄音後，可在結束時播放、下載，也可隨報告儲存在當前瀏覽器。單次錄音有 10 分鐘與 64 MiB 取樣上限，儲存錄音總量最多 200 MiB。",
        ),
        t(
          "点击结束或页面离开前台后，采集停止。没有保存的录音会在刷新、离开页面或新录音后清除；已保存的报告与录音按本机记录规则保留，不会自动同步到其他设备。",
          "Capture stops when you finish or the page leaves the foreground. Unsaved audio is cleared on reload, navigation or a new recording. Saved reports and audio follow the local retention rules and do not automatically sync to other devices.",
          "點選結束或頁面離開前臺後，採集停止。沒有儲存的錄音會在重新整理、離開頁面或新錄音後清除；已儲存的報告與錄音按本機記錄規則保留，不會自動同步到其他裝置。",
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
      title: "MDN · AnalyserNode.getFloatTimeDomainData",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatTimeDomainData",
    },
    {
      title: "CDC/NIOSH · Sound Level Meter App and its validation conditions",
      url: "https://www.cdc.gov/niosh/noise/about/app.html",
    },
  ],
  related: ["dbfs-spl", "phone-accuracy", "calibration", "faq"],
};
