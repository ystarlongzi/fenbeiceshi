import { translations as t, type SiteContent } from "./types.ts";

export const decibelUnits: SiteContent = {
  id: "db-dba",
  slug: "knowledge/db-vs-dba",
  kind: "article",
  updated: "2026-11-23",
  title: t(
    "分贝是什么？dB、dBA、dBC、dBZ 的区别",
    "Decibels Explained: dB, dBA, dBC and dBZ",
    "分貝是什麼？dB、dBA、dBC、dBZ 的區別",
  ),
  description: t(
    "dB、dBA、dBC 和 dBZ 分别是什么意思？用表格理解 A、C、Z 频率计权，了解 B、D、G 的用途，分清 dB SPL 与 dBFS，并说明为什么不同口径的分贝不能直接换算或比较。",
    "What do dB, dBA, dBC and dBZ mean? Compare A, C and Z frequency weightings, learn where B, D and G fit, and distinguish sound pressure from digital input levels before comparing readings.",
    "dB、dBA、dBC 和 dBZ 分別是什麼意思？用表格理解 A、C、Z 頻率加權，瞭解 B、D、G 的用途，分清 dB SPL 與 dBFS，並說明為什麼不同定義的分貝不能直接換算或比較。",
  ),
  takeaway: t(
    "分贝 dB 用对数表示一个量与参考量的比值。A、C、Z 说明怎样处理不同频率，SPL、FS 说明采用什么参考基准。比较两个读数前，先核对这些标记和测量条件。",
    "Decibels express a ratio to a reference on a logarithmic scale. A, C and Z describe frequency weighting; SPL and FS describe the reference. Check these markings and the measurement conditions before comparing readings.",
    "分貝 dB 用對數表示一個量與參考量的比值。A、C、Z 說明怎樣處理不同頻率，SPL、FS 說明採用什麼參考基準。比較兩個讀數前，先核對這些標記和量測條件。",
  ),
  sections: [
    {
      id: "decibel",
      tocTitle: t("分贝的含义", "What does dB mean?", "分貝的含義"),
      title: t("分贝 dB 表示什么？", "What does dB mean?", "分貝 dB 表示什麼？"),
      paragraphs: [
        t(
          "声音的强弱变化范围很大，分贝用对数刻度把这种变化写成更方便阅读的数字。在声学中，声压级、声功率级等都可以用 dB 表示，所以只看到“dB”还不能完整判断测量的是什么。",
          "Sound varies over a wide range. A logarithmic decibel scale makes that range easier to express. Sound pressure level and sound power level can both be expressed in dB, so the unit alone does not fully identify what was measured.",
          "聲音的強弱變化範圍很大，分貝用對數刻度把這種變化寫成更方便閱讀的數字。在聲學中，聲壓級、聲功率級等都可以用 dB 表示，所以只看到「dB」還不能完整判斷量測的是什麼。",
        ),
        t(
          "分贝数字翻倍，不代表听起来就响一倍。理解声音大小可以先看生活场景；需要比较记录时，再确认参考基准、频率计权、统计时段、距离与设备。",
          "Doubling a decibel number does not mean twice the perceived loudness. Everyday examples can help explain sound levels. To compare records, also check the reference, frequency weighting, measurement period, distance and equipment.",
          "分貝數字加倍，不代表聽起來就響一倍。理解聲音大小可以先看生活情境；需要比較記錄時，再確認參考基準、頻率加權、統計時段、距離與裝置。",
        ),
      ],
    },
    {
      id: "a-c-z",
      tocTitle: t("A／C／Z 对照", "How do dBA, dBC and dBZ differ?", "A／C／Z 對照"),
      title: t(
        "dBA、dBC、dBZ 有什么区别？",
        "How do dBA, dBC and dBZ differ?",
        "dBA、dBC、dBZ 有什麼區別？",
      ),
      paragraphs: [
        t(
          "频率计权会调整不同频率对总读数的贡献。A、C、Z 是噪音测量中常见的三种方式，通常写作 dB(A)、dB(C)、dB(Z)，也常简写为 dBA、dBC、dBZ。",
          "Frequency weighting changes how different frequencies contribute to an overall reading. A, C and Z are common in noise measurement, written as dB(A), dB(C) and dB(Z), or as dBA, dBC and dBZ.",
          "頻率加權會調整不同頻率對總讀數的貢獻。A、C、Z 是噪音量測中常見的三種方式，通常寫作 dB(A)、dB(C)、dB(Z)，也常簡寫為 dBA、dBC、dBZ。",
        ),
      ],
      table: {
        headers: [t("标记", "Marking", "標記"), t("含义与用途", "Meaning and use", "含義與用途")],
        rows: [
          [
            t("dB(A) / dBA", "dB(A) / dBA", "dB(A) / dBA"),
            t(
              "A 计权对低频衰减较多，常用于环境和职业噪音评价。它近似考虑人耳的频率敏感度，不能完整表示每个人的实际听感。",
              "A weighting substantially reduces low-frequency contributions. It is common in environmental and occupational noise assessment, but does not fully describe every listener's perception.",
              "A 加權對低頻衰減較多，常用於環境和職業噪音評估。它近似考慮人耳的頻率敏感度，不能完整表示每個人的實際聽感。",
            ),
          ],
          [
            t("dB(C) / dBC", "dB(C) / dBC", "dB(C) / dBC"),
            t(
              "C 计权比 A 计权保留更多低频成分，常用于峰值声压测量。读数仍要结合峰值、平均等具体测量方式理解。",
              "C weighting retains more low-frequency content than A weighting and is often used for peak sound pressure measurements. Check whether a result is a peak or an average.",
              "C 加權比 A 加權保留更多低頻成分，常用於峰值聲壓量測。讀數仍要結合峰值、平均等具體量測方式理解。",
            ),
          ],
          [
            t("dB(Z) / dBZ", "dB(Z) / dBZ", "dB(Z) / dBZ"),
            t(
              "Z 代表零频率计权，在规定频带内目标响应平直。它保留该频带内的频率成分，不按 A 或 C 曲线调整，常用于声源与频谱分析。",
              "Z means zero frequency weighting, with a flat target response within a specified frequency band. It is used when that flat weighting is needed, including sound-source and spectrum analysis.",
              "Z 代表零頻率加權，在規定頻帶內目標響應平直。它保留該頻帶內的頻率成分，不依 A 或 C 曲線調整，常用於聲源與頻譜分析。",
            ),
          ],
        ],
      },
    },
    {
      id: "conversion",
      tocTitle: t("计权能否换算", "Can dBA be converted directly to dBZ?", "加權能否換算"),
      title: t(
        "dBA 能直接换算成 dBZ 吗？",
        "Can dBA be converted directly to dBZ?",
        "dBA 能直接換算成 dBZ 嗎？",
      ),
      paragraphs: [
        t(
          "没有通用的固定加减值。计权差异随频率变化：对单一频率，1000 Hz 时 A 与 Z 的标称修正都是 0 dB；63 Hz 时 A 为 −26.2 dB，Z 仍为 0 dB。这些是滤波曲线的修正量，不是实际房间的读数。",
          "There is no universal fixed offset. For a single frequency, nominal A and Z corrections are both 0 dB at 1000 Hz. At 63 Hz, A is −26.2 dB and Z is 0 dB. These are filter corrections, not room measurements.",
          "沒有通用的固定加減值。加權差異隨頻率變化：對單一頻率，1000 Hz 時 A 與 Z 的標稱修正都是 0 dB；63 Hz 時 A 為 −26.2 dB，Z 仍為 0 dB。這些是濾波曲線的修正量，不是實際房間的讀數。",
        ),
        t(
          "日常声音通常混合了多个频率。只有一个总分贝数时，无法还原各频率的能量；要重新计算其他计权结果，需要足够的频谱数据或合适的测量系统。比较时还要保持参考量、统计方式与时段一致。",
          "Everyday sound usually contains many frequencies. One overall number cannot recover their individual energies. Recalculation needs sufficient spectral data or a suitable measurement system, with the same reference, statistic and measurement period.",
          "日常聲音通常混合了多個頻率。只有一個總分貝數時，無法還原各頻率的能量；要重新計算其他加權結果，需要足夠的頻譜資料或合適的量測系統。比較時還要保持參考量、統計方式與時段一致。",
        ),
      ],
    },
    {
      id: "other-weightings",
      tocTitle: t("B／D／G 用途", "What about B, D and G weightings?", "B／D／G 用途"),
      title: t(
        "还有 B、D、G 计权吗？",
        "What about B, D and G weightings?",
        "還有 B、D、G 加權嗎？",
      ),
      paragraphs: [],
      items: [
        t(
          "B 计权：较早使用的频率计权，在日常噪音评价中较少见，旧资料或部分仪器上仍可能出现。",
          "B weighting is an older frequency weighting, uncommon in everyday noise assessment but still found in older documents or some instruments.",
          "B 加權：較早使用的頻率加權，在日常噪音評估中較少見，舊資料或部分儀器上仍可能出現。",
        ),
        t(
          "D 计权：历史上用于飞机噪音测量。相应的 IEC 60537 已撤销，不能把它当作现行航空噪音评价的一般要求。",
          "D weighting was used for aircraft noise measurement. IEC 60537 has been withdrawn; it is not a general requirement for current aircraft noise assessment.",
          "D 加權：歷史上用於飛機噪音量測。相應的 IEC 60537 已撤銷，不能把它當作現行航空噪音評估的一般要求。",
        ),
        t(
          "G 计权：面向次声测量，见 ISO 7196。它用于特定的低频范围，不能代替普通环境噪音的 A 计权结果。",
          "G weighting addresses infrasound measurement, as described in ISO 7196. It concerns a particular low-frequency range and does not replace an A-weighted environmental noise result.",
          "G 加權：面向次聲量測，見 ISO 7196。它用於特定的低頻範圍，不能代替一般環境噪音的 A 加權結果。",
        ),
      ],
    },
    {
      id: "references",
      tocTitle: t("SPL 与 FS", "What do dB SPL and dBFS describe?", "SPL 與 FS"),
      title: t(
        "dB SPL、dBFS 又表示什么？",
        "What do dB SPL and dBFS describe?",
        "dB SPL、dBFS 又表示什麼？",
      ),
      paragraphs: [
        t(
          "SPL、FS 说明参考基准，A、C、Z 说明频率计权，这是读数的两个方面。声压级也可以采用 A、C 或 Z 计权，不能只看是否写了 SPL 就推断其计权方式。",
          "SPL and FS identify references; A, C and Z identify frequency weightings. These describe different aspects of a reading. A sound pressure level can use A, C or Z weighting, so SPL alone does not identify the weighting.",
          "SPL、FS 說明參考基準，A、C、Z 說明頻率加權，這是讀數的兩個方面。聲壓級也可以採用 A、C 或 Z 加權，不能只看是否寫了 SPL 就推斷其加權方式。",
        ),
      ],
      table: {
        headers: [t("标记", "Marking", "標記"), t("参考基准", "Reference", "參考基準")],
        rows: [
          [
            t("dB SPL", "dB SPL", "dB SPL"),
            t(
              "声压级。空气声通常以 20 µPa 为参考声压，需要结合测量方法和计权理解。",
              "Sound pressure level. Airborne sound normally uses a reference pressure of 20 µPa; the measurement method and weighting must also be specified.",
              "聲壓級。空氣聲通常以 20 µPa 為參考聲壓，需要結合量測方法和加權理解。",
            ),
          ],
          [
            t("dBFS", "dBFS", "dBFS"),
            t(
              "相对于数字满幅的信号电平。它描述数字输入的强弱，单凭这个值不能知道房间的实际声压级。",
              "Signal level relative to digital full scale. It describes digital input strength; that value alone does not establish a room's sound pressure level.",
              "相對於數位滿刻度的訊號電平。它描述數位輸入的強弱，單憑這個值不能知道房間的實際聲壓級。",
            ),
          ],
        ],
      },
    },
    {
      id: "this-tool",
      tocTitle: t("本站估算口径", "What does this tool's estimated dB mean?", "本站估算定義"),
      title: t(
        "本站的估算 dB 属于哪一种？",
        "What does this tool's estimated dB mean?",
        "本站的估算 dB 屬於哪一種？",
      ),
      paragraphs: [
        t(
          "本站把麦克风的数字输入映射为未经专业校准的估算分贝，没有把它标作 dBA、dBC 或经过验证的 dBZ。没有加入 A、C 滤波，并不能证明麦克风和整条输入链路具有合格的 Z 计权响应。",
          "This tool maps digital microphone input to an estimate without professional calibration. It does not claim dBA, dBC or validated dBZ. Omitting A and C filters does not establish a compliant Z-weighted response for the microphone and input chain.",
          "本站把麥克風的數位輸入對應為未經專業校正的估算分貝，沒有把它標作 dBA、dBC 或經過驗證的 dBZ。沒有加入 A、C 濾波，並不能證明麥克風和整條輸入鏈路具有合格的 Z 加權響應。",
        ),
        t(
          "手动修正只会整体加减估算值，不会补偿各频率的响应。日常比较请保持同一设备与条件；需要按某种计权、职业要求或法规标准测量时，使用适合用途的专业仪器或检测服务。",
          "Manual adjustment shifts the estimate without correcting its frequency response. Keep the same device and conditions for everyday comparisons. Use suitable professional equipment or services when a particular weighting, occupational requirement or regulatory method is needed.",
          "手動修正只會整體加減估算值，不會補償各頻率的響應。日常比較請保持同一裝置與條件；需要依某種加權、職業要求或法規標準量測時，使用適合用途的專業儀器或檢測服務。",
        ),
      ],
    },
  ],
  sources: [
    {
      title: "UNSW Physics · What is a decibel?",
      url: "https://www.animations.physics.unsw.edu.au/jw/dB.htm",
    },
    {
      title: "NPL · Sound Pressure Level and Intensity Level",
      url: "https://resource.npl.co.uk/acoustics/techguides/concepts/spl.html",
    },
    {
      title: "Cirrus Research · A, C & Z Frequency Weightings",
      url: "https://cirrusresearch.com/what-are-a-c-z-frequency-weightings/",
    },
    {
      title: "NTi Audio · Frequency-Weightings for Sound Level Measurements",
      url: "https://www.nti-audio.com/en/support/know-how/frequency-weightings-for-sound-level-measurements",
    },
    {
      title: "Massport · Noise Technical Appendix (historical B weighting)",
      url: "https://www.massport.com/sites/default/files/2023-10/ea_deir_cd-version_volume-ii.pdf",
    },
    {
      title: "IEC 60537:1976 · Aircraft noise (D-weighting), withdrawn",
      url: "https://webstore.iec.ch/en/publication/16531",
    },
    {
      title: "ISO 7196:1995 · Infrasound frequency weighting",
      url: "https://www.iso.org/standard/13813.html",
    },
    {
      title: "MDN · Web Audio API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
    },
  ],
  related: ["decibel-chart", "dbfs-spl", "phone-accuracy", "when-professional-meter"],
};

export const decibelUnitsAction = {
  title: t("把分贝放回生活场景", "Put decibels in context", "把分貝放回生活情境"),
  description: t(
    "继续查看常见声音的参考范围，并留意原始单位与比较条件。",
    "Explore reference ranges for everyday sounds, keeping their original units and comparison conditions in view.",
    "繼續檢視常見聲音的參考範圍，並留意原始單位與比較條件。",
  ),
  label: t("查看分贝对照表", "See the decibel chart", "檢視分貝對照表"),
};
