import { dual as t, type SiteContent } from "./types.ts";

export const howItWorks: SiteContent = {
  id: "how-it-works",
  slug: "how-it-works",
  kind: "guide",
  updated: "2026-10-21",
  title: t("网页是怎么测分贝的？", "How does a browser measure decibels?"),
  description: t(
    "用四步看懂麦克风怎样把声音变成估算分贝、趋势和平均值，以及设备差异、校准与本机音频处理的作用。",
    "Follow four steps from microphone input to estimated decibels, trends and averages, with plain explanations of calibration, device differences and local audio processing.",
  ),
  takeaway: t(
    "麦克风把声音变成数字，网页计算一小段声音的能量，再换算成估算分贝。它能帮助观察变化；设备和设置会影响结果，不能把网页当作专业声级计。",
    "Your microphone turns sound into digital samples. The page calculates the energy of a short window and maps it to an estimated decibel reading. This helps you observe change, but devices and settings affect results, so it does not replace a professional sound level meter.",
  ),
  sections: [
    {
      id: "capture",
      title: t("01 麦克风接收周围的声音", "01 Your microphone picks up nearby sound"),
      tocTitle: t("麦克风接收声音", "Pick up sound"),
      paragraphs: [
        t(
          "点击“开始测量”并允许麦克风后，浏览器才能接收声音。麦克风和设备把声音转换为一串数字，网页读取这些数字，不会凭空知道房间里真实的声压。",
          "The browser receives sound only after you select Start measuring and allow microphone access. Your microphone and device turn it into digital samples. The page reads those samples; it does not directly know the room's actual sound pressure.",
        ),
        t(
          "输入来源是当前选中的麦克风。电脑正在播放的音乐，只有被麦克风拾取时才会反映在这里；本站不直接读取电脑内部音频，也不分析上传的音频文件。",
          "The input is your selected microphone. Music playing on a computer affects this reading when the microphone picks it up. This tool does not directly capture system audio or analyze uploaded audio files.",
        ),
      ],
    },
    {
      id: "calculate",
      title: t("02 计算一小段声音的能量", "02 Calculate the energy of a short sound window"),
      tocTitle: t("计算声音能量", "Calculate energy"),
      paragraphs: [
        t(
          "网页持续读取短时间内的采样，先看这段信号整体有多强，再转换为对数形式的电平。可以把它理解成：综合一小段声音，而不是只看某一个瞬间的波形尖点。计算中使用的“均方根（RMS）”描述的就是这种信号强弱。",
          "The page reads short windows of samples, calculates their overall energy and converts it to a logarithmic level. It considers a short stretch of sound rather than just one sharp point in the waveform. Root mean square, or RMS, describes this overall signal strength.",
        ),
        t(
          "此时得到的是相对数字满幅的输入电平，称为 dBFS，还不是环境声压级。很小的信号或全零输入可能触及计算下限；界面的“≤”表示这一计算边界，不表示房间实际达到了对应声级。",
          "This produces an input level relative to digital full scale, called dBFS, rather than an environmental sound pressure level. Very small or zero input may reach the calculation floor. The ≤ marker identifies that calculation boundary, not the room's actual sound level.",
        ),
      ],
    },
    {
      id: "estimate",
      title: t("03 换算为你看到的估算分贝", "03 Map the signal to an estimated decibel reading"),
      tocTitle: t("换算估算分贝", "Estimate decibels"),
      paragraphs: [
        t(
          "为了方便日常观察，本站默认在原始 RMS dBFS 上加 100，得到主仪表的估算值。例如原始输入为 −40 dBFS 时，显示约 60 dB。这个 +100 是公开的产品估算假设，不是适用于所有麦克风的声压换算常数，也没有经过跨设备声学精度验证。",
          "For everyday observation, the default adds 100 to raw RMS dBFS. An input of −40 dBFS therefore displays about 60 dB. This +100 is a disclosed product assumption, not a sound pressure conversion that works for every microphone, and it has not undergone cross-device acoustic accuracy validation.",
        ),
        t(
          "有合适的参考声级计时，可以用稳定声音建立当前输入的参考偏移，替换默认的 +100。它只调整显示尺度，不会自动修正全部频率、声级或系统处理误差，所以校准后仍标为“估算”，不是 dBA。",
          "With a suitable reference meter and stable sound, you can establish an offset for the current input to replace the default +100. It adjusts the display scale without correcting every frequency, level or processing error. Calibrated readings are still labelled estimates, not dBA.",
        ),
      ],
    },
    {
      id: "display",
      title: t("04 显示变化，并汇总本次结果", "04 Show changes and summarize the measurement"),
      tocTitle: t("显示趋势与统计", "Show trends and statistics"),
      paragraphs: [
        t(
          "指针、数显、条形、色带、趋势和统计共用同一套估算，切换仪表不会重新开始测量。趋势图展示最近 60 秒的变化；最低、最高和平均值概括本次累计的有效采样窗口。",
          "The dial, digital and bar displays, colour scale, trend and statistics share the same estimate. Switching displays does not restart capture. The trend shows the latest 60 seconds; minimum, maximum and average summarize valid sample windows accumulated in this measurement.",
        ),
        t(
          "平均分贝不是把屏幕上的数字直接相加再除。本站先平均采样能量，再换算成分贝；最高值是观察窗口的最高读数，不是专业峰值声压指标。这些抽样统计也不是连续积分的 LAeq。",
          "The average is not the arithmetic mean of the displayed decibel numbers. This tool averages sampled energy before converting it to decibels. The maximum is a window maximum rather than a professional peak sound pressure metric, and sampled statistics are not a continuously integrated LAeq.",
        ),
      ],
    },
    {
      id: "limits",
      title: t("为什么设备不同，读数也不同？", "Why do different devices give different readings?"),
      paragraphs: [
        t(
          "同样的声音，经过不同麦克风、增益和系统处理后，会变成不同大小的数字。距离、朝向、风吹和手持摩擦也会影响输入。网页会请求关闭自动增益、降噪和回声消除，但设备不一定按请求执行。",
          "The same sound can produce different digital samples through different microphones, gain settings and system processing. Distance, orientation, wind and handling noise also affect input. The page requests that gain control, noise reduction and echo cancellation be disabled, but devices may not honor those requests.",
        ),
        t(
          "因此，更合适的用法是在同一设备、位置与设置下重复观察变化，并保存条件。仪表量程、颜色和警告线只帮助阅读估算，不代表已验证的测量范围、安全界限或超标判定。",
          "A useful approach is to repeat observations with the same device, position and settings, and save the context. The dial range, colours and warning lines help you read the estimate; they do not establish a validated measurement range, a safety boundary or a compliance result.",
        ),
      ],
    },
    {
      id: "privacy",
      title: t("声音会被上传或保存吗？", "Is my audio uploaded or saved?"),
      paragraphs: [
        t(
          "计算在本机浏览器中完成，音频不上传。录音默认关闭；主动开启同步录音后，可在结束时播放、下载，也可随报告保存在当前浏览器。单次录音有 10 分钟与 64 MiB 采样上限，保存录音总量最多 200 MiB。",
          "Calculations run in your browser and audio is never uploaded. Recording is off by default. If you enable it, you can play or download the audio after finishing and optionally save it with the report in this browser. Each recording is limited to 10 minutes and 64 MiB of samples, with a 200 MiB total limit for saved audio.",
        ),
        t(
          "点击结束或页面离开前台后，采集停止。没有保存的录音会在刷新、离开页面或新录音后清除；已保存的报告与录音按本机记录规则保留，不会自动同步到其他设备。",
          "Capture stops when you finish or the page leaves the foreground. Unsaved audio is cleared on reload, navigation or a new recording. Saved reports and audio follow the local retention rules and do not automatically sync to other devices.",
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
