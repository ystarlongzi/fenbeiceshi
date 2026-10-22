import { translations as t, type SiteContent } from "./types.ts";

export const workplaceNoiseStandards: SiteContent = {
  id: "workplace-noise-standards",
  slug: "knowledge/workplace-noise-standards",
  kind: "article",
  updated: "2026-10-22",
  title: t(
    "工作场所噪声标准：中国、美国与欧盟对比",
    "Workplace noise limits: China, the US and the EU",
    "工作場所噪音標準：中國、美國與歐盟對比",
  ),
  description: t(
    "对比中国 GBZ 2.2、美国 OSHA 与 NIOSH、欧盟 2003/10/EC 的职业噪声限值、行动值、时间基准与峰值口径，避免把不同标准直接混用。",
    "Compare China's GBZ 2.2, US OSHA and NIOSH, and EU Directive 2003/10/EC. Understand exposure limits, action values, averaging periods and peak measurements before comparing numbers.",
    "對比中國 GBZ 2.2、美國 OSHA 與 NIOSH、歐盟 2003/10/EC 的職業噪音限值、行動值、時間基準與峰值定義，避免把不同標準直接混用。",
  ),
  takeaway: t(
    "中国的 85、美国 OSHA 的 90 和欧盟的 87 dB(A)，分别带有不同的时间基准、法定角色与防护条件，不能只排数字判断宽严。NIOSH 的 85 dBA 是推荐限值，应与美国联邦法规分开阅读。",
    "China's 85, OSHA's 90 and the EU's 87 dB(A) have different reference periods, legal roles and hearing-protection conditions. Comparing the numbers alone is misleading. NIOSH's 85 dBA is a recommendation, distinct from US federal law.",
    "中國的 85、美國 OSHA 的 90 和歐盟的 87 dB(A)，分別帶有不同的時間基準、法定角色與防護條件，不能只排數字判斷寬嚴。NIOSH 的 85 dBA 是建議限值，應與美國聯邦法規分開閱讀。",
  ),
  sections: [
    {
      id: "scope",
      tocTitle: t("先看适用范围", "Scope first", "先看適用範圍"),
      title: t(
        "这里比较劳动者职业暴露，不能用来判断卧室噪音",
        "These values concern worker exposure",
        "這裡比較勞工職業暴露，不能用來判斷臥室噪音",
      ),
      paragraphs: [
        t(
          "本文截至 2026 年 10 月 22 日核验：中国指中国大陆 GBZ 2.2—2007；美国主要讨论 OSHA 联邦一般工业标准 29 CFR 1910.95，并单列 NIOSH 建议；欧盟讨论 2003/10/EC 指令的最低要求，实际执行还要查成员国转化法规。",
          "Checked on 22 October 2026: China refers to mainland China's GBZ 2.2—2007. The US comparison uses federal OSHA general-industry rule 29 CFR 1910.95, with NIOSH advice listed separately. EU values are minimum requirements under Directive 2003/10/EC; national implementing laws also matter.",
          "本文截至 2026 年 10 月 22 日核驗：中國指中國大陸 GBZ 2.2—2007；美國主要討論 OSHA 聯邦一般工業標準 29 CFR 1910.95，並單列 NIOSH 建議；歐盟討論 2003/10/EC 指令的最低要求，實際執行還要查會員國轉化法規。",
        ),
        t(
          "美国建筑等行业有其他规则，州计划也可能采用不同要求；欧盟成员国可以更严格。这些职业值不是居住舒适度、环境排放或每个人的安全保证，相关问题另看噪音法规与健康文章。",
          "Other US industries, including construction, have separate rules, and state-plan requirements may differ. EU countries may be more protective. Occupational values are not residential comfort criteria, environmental emission limits or guarantees for every individual.",
          "美國建築等產業有其他規則，州計畫也可能採用不同要求；歐盟會員國可以更嚴格。這些職業值不是居住舒適度、環境排放或每個人的安全保證，相關問題另看噪音法規與健康文章。",
        ),
      ],
    },
    {
      id: "comparison",
      tocTitle: t("限值与行动值对照", "Limits and action values", "限值與行動值對照"),
      title: t(
        "先分清限值、行动值和推荐值",
        "Distinguish limits, action values and recommendations",
        "先分清限值、行動值和建議值",
      ),
      paragraphs: [
        t(
          "下表用于阅读各自制度，不构成同一测量结果的直接换算。dB(A) 与 dBA 都表示 A 计权，但时间平均、剂量算法和防护处理仍需分别核对。",
          "Use the table to understand each system, rather than convert one reading directly between them. Both dB(A) and dBA indicate A weighting; averaging, dose calculation and protection rules still differ.",
          "下表用於閱讀各自制度，不構成同一量測結果的直接換算。dB(A) 與 dBA 都表示 A 加權，但時間平均、劑量算法和防護處理仍需分別核對。",
        ),
      ],
      table: {
        headers: [
          t("依据与范围", "Basis and scope", "依據與範圍"),
          t("主要数值与性质", "Main values and roles", "主要數值與性質"),
          t("时间与防护条件", "Time and protection conditions", "時間與防護條件"),
        ],
        rows: [
          [
            t(
              "中国大陆 GBZ 2.2—2007，第 11 节",
              "Mainland China: GBZ 2.2—2007, section 11",
              "中國大陸 GBZ 2.2—2007，第 11 節",
            ),
            t(
              "85 dB(A)：噪声职业接触限值。",
              "85 dB(A): occupational exposure limit.",
              "85 dB(A)：噪音職業暴露限值。",
            ),
            t(
              "每周 5 天、每天 8 小时；其他工时按规定归一化为 8 小时或每周 40 小时等效声级。",
              "Five 8-hour days per week; other schedules use the specified 8-hour or 40-hour-week equivalent level.",
              "每週 5 天、每天 8 小時；其他工時按規定歸一化為 8 小時或每週 40 小時等效聲級。",
            ),
          ],
          [
            t(
              "美国 OSHA，联邦一般工业",
              "US OSHA: federal general industry",
              "美國 OSHA，聯邦一般工業",
            ),
            t(
              "90 dBA：8 小时容许暴露限值；85 dBA：听力保护计划的行动值。",
              "90 dBA: 8-hour permissible exposure limit; 85 dBA: hearing-conservation action level.",
              "90 dBA：8 小時容許暴露限值；85 dBA：聽力保護計畫的行動值。",
            ),
            t(
              "5 dB 交换率；85 dBA 行动值按未扣除听力防护衰减的 8 小时 TWA 判断。",
              "5 dB exchange rate; the 85 dBA action level uses an 8-hour TWA without deducting hearing-protector attenuation.",
              "5 dB 交換率；85 dBA 行動值按未扣除聽力防護衰減的 8 小時 TWA 判斷。",
            ),
          ],
          [
            t(
              "美国 NIOSH，预防建议",
              "US NIOSH: prevention recommendation",
              "美國 NIOSH，預防建議",
            ),
            t(
              "85 dBA：8 小时推荐暴露限值（REL），不是 OSHA 法定 PEL。",
              "85 dBA: 8-hour recommended exposure limit (REL), distinct from OSHA's legal PEL.",
              "85 dBA：8 小時建議暴露限值（REL），不是 OSHA 法定 PEL。",
            ),
            t(
              "3 dB 交换率，每增加 3 dB，达到同一建议剂量的时间减半。",
              "3 dB exchange rate: every 3 dB increase halves the time for the same recommended dose.",
              "3 dB 交換率，每增加 3 dB，達到同一建議劑量的時間減半。",
            ),
          ],
          [
            t("欧盟 2003/10/EC 指令", "EU Directive 2003/10/EC", "歐盟 2003/10/EC 指令"),
            t(
              "80 / 85 dB(A)：较低 / 较高暴露行动值；87 dB(A)：暴露限值。",
              "80 / 85 dB(A): lower / upper exposure action values; 87 dB(A): exposure limit value.",
              "80 / 85 dB(A)：較低 / 較高暴露行動值；87 dB(A)：暴露限值。",
            ),
            t(
              "日暴露 LEX,8h 归一化至 8 小时；87 限值计入防护衰减，80 / 85 行动值不计入。",
              "Daily LEX,8h is normalized to 8 hours; the 87 limit accounts for protector attenuation, while the 80 / 85 action values do not.",
              "日暴露 LEX,8h 歸一化至 8 小時；87 限值計入防護衰減，80 / 85 行動值不計入。",
            ),
          ],
        ],
      },
    },
    {
      id: "china",
      tocTitle: t("中国的时间基准", "China's reference periods", "中國的時間基準"),
      title: t(
        "中国 85 dB(A) 要连同工时和等效声级一起读",
        "Read China's 85 dB(A) with the work schedule",
        "中國 85 dB(A) 要連同工時和等效聲級一起讀",
      ),
      paragraphs: [
        t(
          "GBZ 2.2—2007 第 11.2.1 条与表 9 规定：每周工作 5 天、每天 8 小时，稳态噪声限值为 85 dB(A)，非稳态噪声以等效声级评价。每周 5 天但每天不等于 8 小时，计算 8 小时等效声级；每周不等于 5 天，计算每周 40 小时等效声级，限值均为 85 dB(A)。",
          "Section 11.2.1 and Table 9 set 85 dB(A) for five 8-hour working days, using an equivalent level for non-steady noise. For five-day weeks with different daily hours, calculate the 8-hour equivalent level; for other weekly schedules, calculate the 40-hour-week equivalent level. The limit remains 85 dB(A).",
          "GBZ 2.2—2007 第 11.2.1 條與表 9 規定：每週工作 5 天、每天 8 小時，穩態噪音限值為 85 dB(A)，非穩態噪音以等效聲級評估。每週 5 天但每天不等於 8 小時，計算 8 小時等效聲級；每週不等於 5 天，計算每週 40 小時等效聲級，限值均為 85 dB(A)。",
        ),
        t(
          "第 11.3 条指定按 GBZ/T 189.8 的方法测量。短暂看到低于 85，或者把整天读数做普通算术平均，都不能代替职业接触评价。脉冲噪声还有第 11.2.2 条与表 10 的独立要求。",
          "Section 11.3 specifies measurement under GBZ/T 189.8. A brief reading below 85, or a simple arithmetic average of readings, cannot replace occupational assessment. Impulsive noise also has separate requirements in section 11.2.2 and Table 10.",
          "第 11.3 條指定按 GBZ/T 189.8 的方法量測。短暫看到低於 85，或者把整天讀數做普通算術平均，都不能取代職業暴露評估。脈衝噪音還有第 11.2.2 條與表 10 的獨立要求。",
        ),
      ],
    },
    {
      id: "us",
      tocTitle: t("OSHA 与 NIOSH", "OSHA and NIOSH", "OSHA 與 NIOSH"),
      title: t(
        "美国 90 与 85 分别承担什么角色？",
        "Why do US sources mention both 90 and 85?",
        "美國 90 與 85 分別承擔什麼角色？",
      ),
      paragraphs: [
        t(
          "OSHA 的 90 dBA / 8 小时来自一般工业标准表 G-16；达到 85 dBA 的 8 小时 TWA 行动值时，就涉及听力保护计划，不能等到超过 90 才关注。NIOSH 则以 85 dBA / 8 小时和 3 dB 交换率提出预防建议。",
          "OSHA Table G-16 sets 90 dBA for 8 hours. Its hearing-conservation programme is triggered at an 85 dBA 8-hour TWA, before the PEL is exceeded. NIOSH recommends 85 dBA for 8 hours with a 3 dB exchange rate.",
          "OSHA 的 90 dBA / 8 小時來自一般工業標準表 G-16；達到 85 dBA 的 8 小時 TWA 行動值時，就涉及聽力保護計畫，不能等到超過 90 才關注。NIOSH 則以 85 dBA / 8 小時和 3 dB 交換率提出預防建議。",
        ),
        t(
          "例如持续稳定在 100 dBA，OSHA 表 G-16 列的是 2 小时，而 NIOSH 的关系对应 15 分钟。这只展示两套制度的差异，不是给个人安排的“安全停留时间”；混合声级、冲击声和具体工作条件还要单独评价。",
          "For a constant 100 dBA, OSHA Table G-16 lists 2 hours, while the NIOSH relationship gives 15 minutes. This illustrates the different systems, rather than a personal safe-stay time. Mixed levels, impulses and actual working conditions require assessment.",
          "例如持續穩定在 100 dBA，OSHA 表 G-16 列的是 2 小時，而 NIOSH 的關係對應 15 分鐘。這只展示兩套制度的差異，不是給個人安排的「安全停留時間」；混合聲級、衝擊聲和具體工作條件還要單獨評估。",
        ),
      ],
    },
    {
      id: "eu",
      tocTitle: t("欧盟行动与防护", "EU action and protection", "歐盟行動與防護"),
      title: t(
        "欧盟 87 dB(A) 不表示可以忽略较低行动值",
        "The EU's 87 dB(A) limit does not replace action values",
        "歐盟 87 dB(A) 不表示可以忽略較低行動值",
      ),
      paragraphs: [
        t(
          "指令第 3、5、6、8 条把评估、源头控制、信息培训与防护安排联系起来：超过较低行动值时提供听力防护用品，达到或超过较高行动值时须使用。判断行动值时不扣除防护衰减；判断暴露限值时才计入工人实际获得的衰减。",
          "Articles 3, 5, 6 and 8 link assessment, source control, training and protection. Protectors must be available above the lower action value and used at or above the upper value. Action values exclude protector attenuation; the limit considers the protection actually received.",
          "指令第 3、5、6、8 條把評估、源頭控制、資訊訓練與防護安排連結起來：超過較低行動值時提供聽力防護用品，達到或超過較高行動值時須使用。判斷行動值時不扣除防護衰減；判斷暴露限值時才計入勞工實際獲得的衰減。",
        ),
        t(
          "第 3 条允许在有充分理由、符合规定条件并由成员国作出安排时采用周暴露评价，不能自行用安静日抵消高噪声工作日。也不能把耳塞包装标称直接从网页读数中相减，得到所谓合规值。",
          "Article 3 permits weekly assessment only under justified, specified conditions and Member State arrangements. Quiet days cannot simply be used to offset noisy shifts at will. Subtracting an earplug packaging rating from a browser estimate does not establish compliance.",
          "第 3 條允許在有充分理由、符合規定條件並由會員國作出安排時採用週暴露評估，不能自行用安靜日抵銷高噪音工作日。也不能把耳塞包裝標稱直接從網頁讀數中相減，得到所謂合規值。",
        ),
      ],
    },
    {
      id: "peaks",
      tocTitle: t("峰值不能混用", "Keep peak metrics separate", "峰值不能混用"),
      title: t(
        "冲击声还要看峰值和次数，不能只看平均",
        "Impulses need separate peak assessment",
        "衝擊聲還要看峰值和次數，不能只看平均",
      ),
      paragraphs: [
        t(
          "中国 GBZ 2.2 表 10 同时约束工作日脉冲次数与声压级峰值，原表单位为 dB(A)：不超过 100 次对应 140，超过 100 至 1,000 次对应 130，超过 1,000 至 10,000 次对应 120。不可只摘出“140”当作所有冲击声的统一上限。",
          "China's Table 10 pairs daily impulse counts with peak levels, labelled dB(A) in the original: up to 100 impulses, 140; over 100 to 1,000, 130; over 1,000 to 10,000, 120. The number 140 alone does not represent the whole requirement.",
          "中國 GBZ 2.2 表 10 同時約束工作日脈衝次數與聲壓級峰值，原表單位為 dB(A)：不超過 100 次對應 140，超過 100 至 1,000 次對應 130，超過 1,000 至 10,000 次對應 120。不可只摘出「140」當作所有衝擊聲的統一上限。",
        ),
        t(
          "OSHA 1910.95 对冲击或脉冲噪声写有不应超过 140 dB 峰值声压级的条款，不把它改写为 dBA 或 dBC。欧盟采用 C 计权峰值：较低行动值 135、较高行动值 137、限值 140 dB(C)，分别与每日 A 计权暴露值配套。三者不能仅因数字相近而视为同一指标。",
          "OSHA 1910.95 states that impact or impulse noise should not exceed 140 dB peak sound-pressure level; do not relabel it dBA or dBC. EU C-weighted peak values are 135, 137 and 140 dB(C) for lower action, upper action and limit respectively. These are distinct from daily A-weighted exposure.",
          "OSHA 1910.95 對衝擊或脈衝噪音寫有不應超過 140 dB 峰值聲壓級的條款，不把它改寫為 dBA 或 dBC。歐盟採用 C 加權峰值：較低行動值 135、較高行動值 137、限值 140 dB(C)，分別與每日 A 加權暴露值配套。三者不能僅因數字相近而視為同一指標。",
        ),
      ],
    },
    {
      id: "assessment",
      tocTitle: t("如何评估与行动", "Assessment and action", "如何評估與行動"),
      title: t(
        "用合适的测量和控制流程处理职业噪声",
        "Assess exposure and control the source",
        "用合適的量測和控制流程處理職業噪音",
      ),
      paragraphs: [
        t(
          "请职业卫生或安全人员确认辖区、行业、班次、声源与冲击声情况，使用满足相应标准的声级计或个体噪声剂量计，获得有代表性的暴露结果。应先评估低噪设备、维护、隔声、吸声、减振及作业安排，再结合实际暴露配置听力防护、培训和适用的听力监测。",
          "Have occupational health or safety staff identify the jurisdiction, industry, shifts, sources and impulses. Use suitable sound-level meters or personal dosimeters for representative exposure assessment. Consider quieter equipment, maintenance, enclosures, absorption, vibration control and work arrangements, alongside verified hearing protection, training and applicable hearing surveillance.",
          "請職業衛生或安全人員確認管轄地區、產業、班次、聲源與衝擊聲情況，使用滿足相應標準的聲級計或個人噪音劑量計，取得有代表性的暴露結果。應先評估低噪音設備、維護、隔音、吸音、減振及作業安排，再結合實際暴露配置聽力防護、訓練和適用的聽力監測。",
        ),
        t(
          "本站通用估算与手动修正不提供标准要求的 A/C 计权、职业剂量或合规峰值评价，不能据此认定达标或计算防护后的耳内声级。健康文章中的 NIOSH 时长演示只解释稳定声级与时间的关系，不替代检测或个人防护方案。",
          "The site's generic estimate and manual adjustment do not provide standard-compliant A/C weighting, occupational dose or peak assessment. They cannot establish compliance or protected levels at the ear. The NIOSH time illustration in our health article explains a constant-level relationship, rather than a test or personal protection plan.",
          "本站通用估算與手動修正不提供標準要求的 A/C 加權、職業劑量或合規峰值評估，不能據此認定達標或計算防護後的耳內聲級。健康文章中的 NIOSH 時長示範只解釋穩定聲級與時間的關係，不取代檢測或個人防護方案。",
        ),
      ],
    },
  ],
  sources: [
    {
      title: "中国疾控中心职业卫生所：现行有效的职业卫生标准目录（截至 2026 年 2 月 28 日）",
      url: "https://niohp.chinacdc.cn/sndt/202511/t20251128_313733.htm",
    },
    {
      title: "GBZ 2.2—2007 第 11 节、表 9 与表 10（上海科技大学环境安全与健康处所存原文 PDF）",
      url: "https://ehs.shanghaitech.edu.cn/_upload/article/files/88/7f/4d66b7a04d2fb7defcd2917fb368/a6ee5442-447a-4b74-9d40-ec2626a4bf79.pdf",
    },
    {
      title: "OSHA: 29 CFR 1910.95 — Occupational noise exposure",
      url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95",
    },
    {
      title: "OSHA: occupational noise standards and industry scope",
      url: "https://www.osha.gov/noise/standards",
    },
    { title: "OSHA: State Plans", url: "https://www.osha.gov/stateplans" },
    {
      title: "NIOSH: Understand Noise Exposure",
      url: "https://www.cdc.gov/niosh/noise/prevent/understand.html",
    },
    {
      title: "EU-OSHA: Directive 2003/10/EC — noise",
      url: "https://osha.europa.eu/en/legislation/directives/82",
    },
    {
      title:
        "Directive 2003/10/EC, Articles 2–6 and 8 (Official Journal text reproduced by Spain's BOE)",
      url: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2003-80227",
    },
  ],
  related: ["china-noise-standards", "hearing-protection", "noise-health", "noise-reduction"],
};
