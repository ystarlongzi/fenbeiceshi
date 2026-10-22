import { translations as t, type SiteContent } from "./types.ts";

export const chinaNoiseStandards: SiteContent = {
  id: "china-noise-standards",
  slug: "knowledge/china-noise-standards",
  kind: "article",
  updated: "2026-10-22",
  title: t(
    "噪音法规：中国大陆标准与处理方式",
    "Noise regulations: mainland China standards and next steps",
    "噪音法規：中國大陸標準與處理方式",
  ),
  description: t(
    "区分环境质量、噪声排放与职业接触标准，了解中国大陆现行噪音法规、施工与装修规则，以及遇到噪音困扰时的处理步骤。",
    "Understand mainland China's noise rules, distinguish environmental and workplace standards, and find practical steps for construction noise, renovation and neighbourhood disturbances.",
    "區分環境品質、噪音排放與職業暴露標準，瞭解中國大陸現行噪音法規、施工與裝修規則，以及遇到噪音困擾時的處理步驟。",
  ),
  takeaway: t(
    "判断噪音问题，要先确认地区、声源、标准适用对象和测量条件，再看数字。本文介绍中国大陆规则；简体、繁体与英文版本均为同一范围，不代表台湾或其他地区法规。",
    "Start with the jurisdiction, source, regulated activity and measurement conditions before comparing numbers. All three language versions cover mainland China; they do not describe Taiwan's or other jurisdictions' laws.",
    "判斷噪音問題，要先確認地區、聲源、標準適用對象和量測條件，再看數字。本文介紹中國大陸規則；簡體、繁體與英文版本均為同一範圍，不代表臺灣或其他地區法規。",
  ),
  sections: [
    {
      id: "current-law",
      tocTitle: t("现行法律", "Current law", "現行法律"),
      title: t(
        "先确认法律版本和适用地区",
        "Check the current law and jurisdiction",
        "先確認法律版本和適用地區",
      ),
      paragraphs: [
        t(
          "截至 2026 年 10 月 22 日，《中华人民共和国生态环境法典》已于 2026 年 8 月 15 日施行，原《中华人民共和国噪声污染防治法》同时废止。网上仍有大量旧法解读，查阅时应回到现行法典及当地配套规定。",
          "As checked on 22 October 2026, the Ecological and Environmental Code took effect on 15 August 2026, repealing the standalone Noise Pollution Prevention and Control Law. Check older explanations against the current Code and local rules.",
          "截至 2026 年 10 月 22 日，《中华人民共和国生态环境法典》已於 2026 年 8 月 15 日施行，原《中华人民共和国噪声污染防治法》同時廢止。網路上仍有大量舊法解讀，查閱時應回到現行法典及當地配套規定。",
        ),
        t(
          "法典第 547 条的噪声污染定义，涉及超过噪声排放标准，或者未依法采取防控措施，并干扰他人正常生活、工作和学习。不能把所有问题都简化成“手机测到多少分贝才受理”。",
          "Article 547 covers interference with normal life, work or study involving exceeded emission standards or failure to take legally required control measures. A phone reading alone does not determine whether a complaint has a basis.",
          "法典第 547 條的噪音污染定義，涉及超過噪音排放標準，或者未依法採取防控措施，並干擾他人正常生活、工作和學習。不能把所有問題都簡化成「手機測到多少分貝才受理」。",
        ),
      ],
    },
    {
      id: "choose-standard",
      tocTitle: t("先选对标准", "Choose the right standard", "先選對標準"),
      title: t(
        "环境质量、声源排放和职业接触回答不同问题",
        "Different standards answer different questions",
        "環境品質、聲源排放和職業暴露回答不同問題",
      ),
      paragraphs: [
        t(
          "同样写着分贝，不代表测量位置、时间口径或监管对象相同。先按下面的对象查找，再阅读标准范围和测量方法。",
          "Values expressed in decibels can refer to different locations, time periods and regulated activities. Identify the relevant category, then read its scope and measurement method.",
          "同樣寫著分貝，不代表量測位置、時間基準或管理對象相同。先按下面的對象查詢，再閱讀標準範圍和量測方法。",
        ),
      ],
      table: {
        headers: [
          t("要判断的问题", "Question", "要判斷的問題"),
          t("主要文本", "Main text", "主要文本"),
          t("适用重点", "Scope to check", "適用重點"),
        ],
        rows: [
          [
            t("区域声环境质量", "Area sound environment", "區域聲環境品質"),
            t(
              "GB 3096—2008《声环境质量标准》",
              "GB 3096—2008: environmental quality",
              "GB 3096—2008《声环境质量标准》",
            ),
            t(
              "按声环境功能区及昼夜等条件评价环境质量，不是所有声源的统一排放限值。",
              "Assesses environmental quality by designated functional area and time; it is not a universal source-emission limit.",
              "按聲環境功能區及日夜等條件評估環境品質，不是所有聲源的統一排放限值。",
            ),
          ],
          [
            t("工业企业厂界排放", "Industrial boundary emissions", "工業企業廠界排放"),
            t(
              "GB 12348—2008《工业企业厂界环境噪声排放标准》",
              "GB 12348—2008: industrial boundary noise",
              "GB 12348—2008《工业企业厂界环境噪声排放标准》",
            ),
            t(
              "评价适用工业企业的厂界噪声，不能直接替代住宅室内评价。",
              "Applies to relevant industrial boundary emissions, rather than a general indoor residential assessment.",
              "評估適用工業企業的廠界噪音，不能直接取代住宅室內評估。",
            ),
          ],
          [
            t("营业设备、设施排放", "Commercial equipment emissions", "營業設備、設施排放"),
            t(
              "GB 22337—2008《社会生活环境噪声排放标准》",
              "GB 22337—2008: community noise emissions",
              "GB 22337—2008《社会生活环境噪声排放标准》",
            ),
            t(
              "针对营业性文化娱乐场所、商业经营活动中的设备设施；不把一切邻里生活声都套入此表。",
              "Covers equipment and facilities in commercial entertainment and business activities, rather than every household disturbance.",
              "針對營業性文化娛樂場所、商業經營活動中的設備設施；不把一切鄰里生活聲都套入此表。",
            ),
          ],
          [
            t("建筑施工排放", "Construction emissions", "建築施工排放"),
            t(
              "GB 12523—2025《建筑施工噪声排放标准》",
              "GB 12523—2025: construction noise emissions",
              "GB 12523—2025《建筑施工噪声排放标准》",
            ),
            t(
              "适用施工场界等规定位置与条件；已交付使用建筑的室内装修不属于其建筑施工定义。",
              "Uses specified construction-boundary and other assessment conditions; its construction definition excludes interior renovation in completed, delivered buildings.",
              "適用施工場界等規定位置與條件；已交付使用建築的室內裝修不屬於其建築施工定義。",
            ),
          ],
          [
            t("劳动者职业接触", "Worker exposure", "勞工職業暴露"),
            t(
              "GBZ 2.2—2007《工作场所有害因素职业接触限值 第2部分：物理因素》",
              "GBZ 2.2—2007: occupational exposure to physical agents",
              "GBZ 2.2—2007《工作场所有害因素职业接触限值 第2部分：物理因素》",
            ),
            t(
              "关注作业人员的职业接触，不能拿 85 dB(A) 判断卧室或邻里噪音是否合规。",
              "Assesses workers' exposure; its 85 dB(A) value does not establish whether bedroom or neighbourhood noise complies.",
              "關注作業人員的職業暴露，不能拿 85 dB(A) 判斷臥室或鄰里噪音是否合規。",
            ),
          ],
        ],
      },
    },
    {
      id: "conditions",
      tocTitle: t("数字的适用条件", "Conditions behind a value", "數字的適用條件"),
      title: t(
        "没有适用于所有房间的一个分贝数",
        "There is no single limit for every room",
        "沒有適用於所有房間的一個分貝數",
      ),
      paragraphs: [
        t(
          "查询环境标准时，先查看当地公布的声环境功能区划；不能只因“这里是住宅”就自行认定为某一类区。还要核对测点在场界、户外还是室内，测量时段与时长，以及背景噪声、门窗和运行工况等要求。",
          "Look up the locally published sound-environment zoning rather than assigning a class simply because a site contains homes. Check boundary, outdoor or indoor locations, assessment duration, background noise, windows and operating conditions.",
          "查詢環境標準時，先檢視當地公布的聲環境功能區劃；不能只因「這裡是住宅」就自行認定為某一類區。還要核對測點在場界、戶外還是室內，量測時段與時長，以及背景噪音、門窗和運轉條件等要求。",
        ),
        t(
          "等效声级描述一段时间的声音能量，最大声级和峰值另有含义；dB(A)、dB(C) 与网页显示的通用估算也不能互换。对照表中的熟悉声音只帮助理解量级，不能作为法定检测结果。",
          "An equivalent level represents sound energy over a period; maximum and peak levels have different meanings. A-weighted, C-weighted and generic browser estimates are not interchangeable. Familiar-sound examples are context, rather than compliance measurements.",
          "等效聲級描述一段時間的聲音能量，最大聲級和峰值另有含義；dB(A)、dB(C) 與網頁顯示的通用估算也不能互換。對照表中的熟悉聲音只幫助理解量級，不能作為法定檢測結果。",
        ),
      ],
    },
    {
      id: "construction",
      tocTitle: t("施工与装修", "Construction and renovation", "施工與裝修"),
      title: t(
        "工地夜间施工与邻居装修要分别查看",
        "Check construction and household renovation separately",
        "工地夜間施工與鄰居裝修要分別檢視",
      ),
      paragraphs: [
        t(
          "GB 12523—2025 自 2026 年 1 月 1 日实施，替代 2011 版。表 1 的昼间 70、夜间 55 dB(A) 是规定条件下的施工场界等效声级限值，并非床边瞬时读数的统一限值；标准另有夜间最大声级及特定测点要求。抢修、抢险施工的排放管理不适用该标准。",
          "GB 12523—2025 replaced the 2011 edition on 1 January 2026. Its Table 1 gives daytime 70 and night-time 55 dB(A) equivalent levels under specified construction-boundary conditions, with additional maximum-level and location provisions. These are not bedside instantaneous limits. Emergency repair and rescue emissions are outside its scope.",
          "GB 12523—2025 自 2026 年 1 月 1 日實施，取代 2011 版。表 1 的日間 70、夜間 55 dB(A) 是規定條件下的施工場界等效聲級限值，並非床邊瞬時讀數的統一限值；標準另有夜間最大聲級及特定測點要求。搶修、搶險施工的排放管理不適用該標準。",
        ),
        t(
          "法典第 572 条对噪声敏感建筑物集中区域的夜间噪声施工设禁令及例外；特殊需要连续施工涉及证明与公告。该条夜间一般为 22:00 至次日 06:00，设区的市级以上政府可另定连续八小时。已交付建筑的室内装修还须查当地规定的作业时间，不能仅靠施工场界数值判断。",
          "Code Article 572 restricts noisy night construction in designated noise-sensitive areas, with exceptions and certification/public-notice provisions. Night normally means 22:00–06:00; qualifying local governments may set another eight-hour period. Renovation in delivered buildings also requires checking local working-hour rules.",
          "法典第 572 條對噪音敏感建築物集中區域的夜間噪音施工設禁令及例外；特殊需要連續施工涉及證明與公告。該條夜間一般為 22:00 至次日 06:00，設區的市級以上政府可另定連續八小時。已交付建築的室內裝修還須查當地規定的作業時間，不能僅靠施工場界數值判斷。",
        ),
      ],
    },
    {
      id: "respond",
      tocTitle: t("遇到困扰怎么办", "Respond to a disturbance", "遇到困擾怎麼辦"),
      title: t(
        "按声源找管理方，清楚描述发生了什么",
        "Describe the source and contact the responsible service",
        "按聲源找管理方，清楚描述發生了什麼",
      ),
      paragraphs: [
        t(
          "法典按职责划分监管，社会生活噪声也有劝阻、调解和报告安排。具体受理部门取决于声源与当地分工，不能一律认定为公安或生态环境部门。",
          "The Code distributes responsibilities and provides for mediation and reporting of community disturbances. The correct authority depends on the source and local allocation of duties.",
          "法典按職責劃分管理，社會生活噪音也有勸阻、調解和通報安排。具體受理部門取決於聲源與當地分工，不能一律認定為公安或生態環境部門。",
        ),
      ],
      items: [
        t(
          "记录日期、开始与结束时间、地点、疑似声源及反复发生的规律，说明对休息或正常活动的影响。",
          "Note dates, start and end times, location, suspected source, recurrence and how normal activities are affected.",
          "記錄日期、開始與結束時間、地點、疑似聲源及反覆發生的規律，說明對休息或正常活動的影響。",
        ),
        t(
          "适合沟通时，向声源管理方说明具体问题和可调整的时间；小区内也可先联系物业、业委会或社区协助。",
          "Where appropriate, describe the issue and possible timing changes to the source operator. Property management or community services may help with residential disputes.",
          "適合溝通時，向聲源管理方說明具體問題和可調整的時間；社區內也可先聯絡物業、業主委員會或社區協助。",
        ),
        t(
          "持续未解决时，通过当地政府公布的政务服务或投诉渠道确认责任部门，提交具体情况并保留受理信息。",
          "If it persists, use locally published government service or complaint channels to identify the responsible department, submit details and keep the case reference.",
          "持續未解決時，透過當地政府公布的政務服務或申訴管道確認責任部門，提交具體情況並保留受理資訊。",
        ),
        t(
          "涉及判断排放是否超标时，询问适用标准和合规测量安排；请相关部门或符合要求的检测机构确认。",
          "For a formal emission assessment, ask which standard and measurement procedure apply and seek the relevant authority or a suitably qualified testing service.",
          "涉及判斷排放是否超標時，詢問適用標準和合規量測安排；請相關部門或符合要求的檢測機構確認。",
        ),
      ],
    },
    {
      id: "browser-limits",
      tocTitle: t("网页记录的边界", "Limits of browser records", "網頁記錄的界線"),
      title: t(
        "网页适合观察变化，不能据此认定违法",
        "Use the browser to observe changes",
        "網頁適合觀察變化，不能據此認定違法",
      ),
      paragraphs: [
        t(
          "本站默认是未经专业校准的通用噪音估算，手动修正也不能补齐频率计权、时间响应、量程、设备检定和规定测点等条件。浏览器显示的峰值不等于标准规定的声压峰值，导出报告也不因此成为法定检测报告。",
          "This site provides an uncalibrated generic noise estimate. Manual adjustment cannot supply the required frequency weighting, time response, range, instrument verification or measurement locations. Its displayed peak is not a standard-defined peak sound-pressure measurement, and an export is not a statutory test report.",
          "本站預設是未經專業校準的通用噪音估算，手動修正也不能補齊頻率加權、時間響應、量程、設備檢定和規定測點等條件。瀏覽器顯示的峰值不等於標準規定的聲壓峰值，匯出報告也不因此成為法定檢測報告。",
        ),
        t(
          "若用于个人观察，可同时备注设备、位置、门窗状态和声源运行情况，帮助回忆变化。正式评价应按适用标准实施；工作中的职业接触另看下方中美欧对比，改善声音环境则可继续阅读降噪方法。",
          "For personal observations, note the device, position, window state and source operation to explain changes. Formal assessment needs the applicable procedure. See the workplace comparison for occupational exposure, or the noise-reduction guide for practical improvements.",
          "若用於個人觀察，可同時備註裝置、位置、門窗狀態和聲源運轉情況，幫助回想變化。正式評估應按適用標準實施；工作中的職業暴露另看下方中美歐對比，改善聲音環境則可繼續閱讀降噪方法。",
        ),
      ],
    },
  ],
  sources: [
    {
      title:
        "生态环境部：《中华人民共和国生态环境法典》第 547、548、553、563、572、594、595、599、1242 条",
      url: "https://www.mee.gov.cn/ywgz/fgbz/fl/202603/t20260313_1146496.shtml",
    },
    {
      title: "生态环境部：GB 3096—2008《声环境质量标准》",
      url: "https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/wlhj/shjzlbz/200809/t20080917_128815.shtml",
    },
    {
      title: "生态环境部：GB 12348—2008《工业企业厂界环境噪声排放标准》",
      url: "https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/wlhj/hjzspfbz/200809/t20080918_128936.shtml",
    },
    {
      title: "生态环境部：GB 22337—2008《社会生活环境噪声排放标准》",
      url: "https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/wlhj/hjzspfbz/200809/t20080918_128937.htm",
    },
    {
      title: "生态环境部：GB 12523—2025《建筑施工噪声排放标准》及原文",
      url: "https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/wlhj/hjzspfbz/202512/t20251211_1137517.shtml",
    },
    {
      title: "中国疾控中心职业卫生所：现行有效的职业卫生标准目录（截至 2026 年 2 月 28 日）",
      url: "https://niohp.chinacdc.cn/sndt/202511/t20251128_313733.htm",
    },
  ],
  related: ["workplace-noise-standards", "noise-reduction", "phone-accuracy", "decibel-chart"],
};
