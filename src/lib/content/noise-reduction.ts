import { translations as t, type SiteContent } from "./types.ts";

export const noiseReduction: SiteContent = {
  id: "noise-reduction",
  slug: "knowledge/noise-reduction",
  kind: "article",
  updated: "2026-10-22",
  title: t(
    "降噪方法：让居家与办公环境更安静",
    "Noise reduction: practical steps for a quieter space",
    "降噪方法：讓居家與辦公環境更安靜",
  ),
  description: t(
    "先判断声源和传播路径，再选择吸音、隔音或减振。按卧室、家电、邻里与办公场景采取措施，用同条件观察比较调整前后的变化。",
    "Identify the source and sound path, choose absorption, sound insulation or vibration isolation, and compare changes in bedrooms, shared homes and workspaces under consistent conditions.",
    "先判斷聲源和傳播路徑，再選擇吸音、隔音或減振。按臥室、家電、鄰里與辦公情境採取措施，用同條件觀察比較調整前後的變化。",
  ),
  takeaway: t(
    "先让声源安静一点，再处理声音传来的路径。吸音减少室内反射，隔音减少声音穿过结构，减振处理机械振动；先找对问题，再买材料。",
    "Start with the source, then the path to the listener. Absorption reduces room reflections, sound insulation limits transmission, and vibration isolation addresses mechanical vibration. Identify the problem before buying materials.",
    "先讓聲源安靜一點，再處理聲音傳來的路徑。吸音減少室內反射，隔音減少聲音穿過結構，減振處理機械振動；先找對問題，再買材料。",
  ),
  sections: [
    {
      id: "identify",
      tocTitle: t("先找声源", "Find the source", "先找聲源"),
      title: t(
        "先听清：什么声音，在哪里，什么时候？",
        "Find out what, where and when",
        "先聽清：什麼聲音，在哪裡，什麼時候？",
      ),
      paragraphs: [
        t(
          "选一个实际受影响的位置，例如床头或办公座位，记下声音来源、发生时段和干扰方式。安全且能控制时，分别关闭设备或改变门窗状态，帮助缩小范围。不要只凭房间里的一次最高读数判断问题。",
          "Start where the disturbance matters, such as your bed or desk. Note the source, timing and effect. When safe and within your control, switch equipment off or change a window position to narrow down the source. One maximum reading does not explain the problem.",
          "選一個實際受影響的位置，例如床頭或辦公座位，記下聲音來源、發生時段和干擾方式。安全且能控制時，分別關閉裝置或改變門窗狀態，幫助縮小範圍。不要只憑房間裡的一次最高讀數判斷問題。",
        ),
      ],
      items: [
        t(
          "说话、电视、交通声：先查空气传播路径，如门窗、缝隙和通风口。",
          "Voices, television and traffic: investigate airborne paths through doors, windows, gaps and vents.",
          "說話、電視、交通聲：先查空氣傳播路徑，如門窗、縫隙和通風口。",
        ),
        t(
          "脚步、拖椅子、机器嗡振：可能经楼板、墙体或固定件传播，不能只处理空气中的声音。",
          "Footsteps, scraping chairs and machine vibration may travel through floors, walls or fixings as well as air.",
          "腳步、拖椅子、機器嗡振：可能經樓板、牆體或固定件傳播，不能只處理空氣中的聲音。",
        ),
        t(
          "同一房间里说话拖尾、回响明显：先考虑室内反射和混响。几种问题也可能同时存在。",
          "Speech that lingers or echoes in the room suggests reflections and reverberation. Several problems can coexist.",
          "同一房間裡說話拖尾、回響明顯：先考慮室內反射和殘響。幾種問題也可能同時存在。",
        ),
      ],
    },
    {
      id: "source",
      tocTitle: t("从声源着手", "Reduce noise at source", "從聲源著手"),
      title: t("先做能控制的调整", "Change what you can at the source", "先做能控制的調整"),
      paragraphs: [
        t(
          "能减少声源本身的声音，通常比让声音产生后再遮挡更直接。先检查设备状态、使用方式与摆放位置，再决定是否需要材料或施工。",
          "Reducing sound where it starts is often more direct than blocking it afterwards. Check equipment condition, operation and placement before choosing materials or construction work.",
          "能減少聲源本身的聲音，通常比讓聲音產生後再遮擋更直接。先檢查裝置狀態、使用方式與擺放位置，再決定是否需要材料或施工。",
        ),
      ],
      items: [
        t(
          "家电和风扇：按说明书维护、检查松动与异常声，在满足使用需求时尝试较安静的档位。设备异常交给维修人员处理。",
          "Appliances and fans: follow maintenance instructions, investigate rattles and use a quieter approved setting when it meets your needs. Have faults checked by a repairer.",
          "家電和風扇：按說明書維護、檢查鬆動與異常聲，在滿足使用需求時嘗試較安靜的檔位。裝置異常交給維修人員處理。",
        ),
        t(
          "音乐和低音：先降低播放音量及低音，避免让深夜播放影响邻居；需要时改用较低音量的个人耳机。",
          "Music and bass: turn down both volume and bass, avoid disturbing neighbours at night, and consider personal headphones at a lower listening level.",
          "音樂和低音：先降低播放音量及低音，避免讓深夜播放影響鄰居；需要時改用較低音量的個人耳機。",
        ),
        t(
          "设备和作息：尽量把嘈杂设备移离安静区域，协商维修、清洁或练习的时段与持续时间。移动设备时仍要遵守散热和安装要求。",
          "Equipment and timing: separate noisy equipment from quiet areas and agree on the timing and length of repairs, cleaning or practice. Keep required ventilation and installation clearances.",
          "裝置和作息：盡量把吵雜裝置移離安靜區域，協商維修、清潔或練習的時段與持續時間。移動裝置時仍要遵守散熱和安裝要求。",
        ),
      ],
    },
    {
      id: "methods",
      tocTitle: t("选对方法", "Choose the right method", "選對方法"),
      title: t(
        "吸音、隔音和减振，解决的问题不同",
        "Absorption, insulation and isolation do different jobs",
        "吸音、隔音和減振，解決的問題不同",
      ),
      paragraphs: [
        t(
          "先确认主要传播方式，再选相应措施。材料的名称或厚度，不能单独说明安装后的效果。",
          "Match the treatment to the main sound path. A material name or thickness alone does not establish installed performance.",
          "先確認主要傳播方式，再選相應措施。材料的名稱或厚度，不能單獨說明安裝後的效果。",
        ),
      ],
      table: {
        headers: [
          t("方法", "Method", "方法"),
          t("主要作用", "Main purpose", "主要作用"),
          t("选择时注意", "What to check", "選擇時注意"),
        ],
        rows: [
          [
            t("吸音", "Sound absorption", "吸音"),
            t(
              "地毯、布艺和合适的吸音材料可减少室内反射。",
              "Carpets, soft furnishings and suitable absorbers reduce room reflections.",
              "地毯、布藝和合適的吸音材料可減少室內反射。",
            ),
            t(
              "改善回响，不等于阻挡隔壁或楼上的声音。",
              "Less reverberation does not establish insulation from another room or floor.",
              "改善回響，不等於阻擋隔壁或樓上的聲音。",
            ),
          ],
          [
            t("隔音", "Sound insulation", "隔音"),
            t(
              "通过完整的门窗、墙体或楼板系统减少声音传递。",
              "Complete door, window, wall or floor systems limit sound transmission.",
              "透過完整的門窗、牆體或樓板系統減少聲音傳遞。",
            ),
            t(
              "查看整套结构、缝隙、连接和测试条件，不只看单件材料。",
              "Check the tested assembly, gaps, junctions and test conditions, rather than one material.",
              "檢視整套結構、縫隙、連接和測試條件，不只看單件材料。",
            ),
          ],
          [
            t("减振与隔振", "Vibration control", "減振與隔振"),
            t(
              "减少机器振动经支座、管道或地面传向其他位置。",
              "Reduce vibration passing through mounts, pipes or floors.",
              "減少機器振動經支座、管道或地面傳向其他位置。",
            ),
            t(
              "垫材与支座要匹配设备和载荷；不合适的支座可能加重振动。",
              "Match pads and mounts to the equipment and load; unsuitable mounts can worsen vibration.",
              "墊材與支座要匹配裝置和載荷；不合適的支座可能加重振動。",
            ),
          ],
        ],
      },
    },
    {
      id: "paths",
      tocTitle: t("门窗与传播路径", "Doors, windows and paths", "門窗與傳播路徑"),
      title: t("处理声音传来的路径", "Treat the path the sound takes", "處理聲音傳來的路徑"),
      paragraphs: [
        t(
          "外部声音主要从窗边传来时，可先检查闭合状态、密封条与框边缝隙。需要更换门窗时，比较包含玻璃、框、密封与安装的完整测试系统；不能仅凭“双层”或“隔音”字样承诺现场降低多少分贝。",
          "If outdoor sound is strongest at a window, inspect closure, seals and frame gaps first. For replacement doors or windows, compare tested assemblies including glazing, frame, seals and installation. A label such as “double glazed” does not predict a fixed reduction in your room.",
          "外部聲音主要從窗邊傳來時，可先檢查閉合狀態、密封條與框邊縫隙。需要更換門窗時，比較包含玻璃、框、密封與安裝的完整測試系統；不能僅憑「雙層」或「隔音」字樣承諾現場降低多少分貝。",
        ),
        t(
          "屏障主要影响直达声；在反射很多的房间，声音仍可能绕行。不要为了安静堵住必要通风、设备散热或逃生通道。涉及墙体、楼板、设备围挡或通风改造时，先确认权限并请专业人员设计。",
          "A barrier mainly affects direct sound; reflected sound can still reach you. Preserve ventilation, equipment cooling and escape routes. Get permission and professional design advice before altering walls, floors, equipment enclosures or ventilation.",
          "屏障主要影響直達聲；在反射很多的房間，聲音仍可能繞行。不要為了安靜堵住必要通風、裝置散熱或逃生通道。涉及牆體、樓板、裝置圍擋或通風改造時，先確認權限並請專業人員設計。",
        ),
      ],
    },
    {
      id: "scenarios",
      tocTitle: t("按场景尝试", "Try it in your setting", "按情境嘗試"),
      title: t("从一个具体困扰开始", "Start with one specific disturbance", "從一個具體困擾開始"),
      paragraphs: [
        t(
          "下面是排查起点，不是适用于所有房间的施工方案。",
          "These are starting points, rather than construction specifications for every room.",
          "下面是排查起點，不是適用於所有房間的施工方案。",
        ),
      ],
      table: {
        headers: [
          t("场景", "Setting", "情境"),
          t("先尝试", "First step", "先嘗試"),
          t("继续判断", "Then check", "繼續判斷"),
        ],
        rows: [
          [
            t("卧室临街", "Bedroom near traffic", "臥室臨街"),
            t(
              "比较开关窗后的干扰，检查闭合与密封。",
              "Compare disturbance with the window open and closed; inspect closure and seals.",
              "比較開關窗後的干擾，檢查閉合與密封。",
            ),
            t(
              "关窗有帮助时，还要安排合适的通风与温度控制。",
              "If closure helps, plan suitable ventilation and cooling too.",
              "關窗有幫助時，還要安排合適的通風與溫度控制。",
            ),
          ],
          [
            t("家电嗡振", "Appliance vibration", "家電嗡振"),
            t(
              "检查异常和安装状态，按厂商要求维护。",
              "Check for faults and installation issues, following manufacturer guidance.",
              "檢查異常和安裝狀態，按廠商要求維護。",
            ),
            t(
              "需要隔振时，请厂商或维修人员匹配支座。",
              "Ask the manufacturer or repairer to select suitable isolation mounts.",
              "需要隔振時，請廠商或維修人員匹配支座。",
            ),
          ],
          [
            t("楼上脚步或拖椅子", "Footsteps or chairs above", "樓上腳步或拖椅子"),
            t(
              "先沟通发生位置与时段；声源一侧的地毯和垫层可作为处理起点。",
              "Discuss location and timing; rugs and underlay at the source can be a starting point.",
              "先溝通發生位置與時段；聲源一側的地毯和墊層可作為處理起點。",
            ),
            t(
              "在自己天花板贴吸音泡棉，不能据此保证隔绝撞击声。",
              "Foam on your ceiling does not establish isolation from impact sound.",
              "在自己天花板貼吸音泡棉，不能據此保證隔絕撞擊聲。",
            ),
          ],
          [
            t("办公区回响", "Echo in a workspace", "辦公區回響"),
            t(
              "分开交谈与安静工作区域，评估合适的吸音处理。",
              "Separate conversation from quiet tasks and assess suitable absorption.",
              "分開交談與安靜工作區域，評估合適的吸音處理。",
            ),
            t(
              "需要语音隐私时，还要处理空间分隔与传声路径。",
              "Speech privacy also depends on separation and transmission paths.",
              "需要語音隱私時，還要處理空間分隔與傳聲路徑。",
            ),
          ],
        ],
      },
    },
    {
      id: "compare",
      tocTitle: t("比较前后变化", "Compare before and after", "比較前後變化"),
      title: t(
        "一次改一项，用同条件记录检验",
        "Change one thing and compare consistently",
        "一次改一項，用同條件記錄檢驗",
      ),
      paragraphs: [
        t(
          "网页适合辅助观察同条件下的变化。以下是本站的比较方法，不是隔声评级或建筑验收方法；浏览器自动处理和外部声源变化仍可能影响结果。",
          "The browser can help you observe changes under consistent conditions. This is a comparison method for this site, not an insulation rating or building acceptance test. Browser processing and changing outdoor sources can still affect the result.",
          "網頁適合輔助觀察同條件下的變化。以下是本站的比較方法，不是隔音評級或建築驗收方法；瀏覽器自動處理和外部聲源變化仍可能影響結果。",
        ),
      ],
      items: [
        t(
          "固定同一设备、浏览器、麦克风、摆放位置、朝向、输入设置和读数修正值。",
          "Keep the same device, browser, microphone, position, orientation, input settings and reading adjustment.",
          "固定同一裝置、瀏覽器、麥克風、擺放位置、朝向、輸入設定和讀數修正值。",
        ),
        t(
          "先记录原状态，再只调整一项；尽量使用相近的声源状态与观察时长。",
          "Record the original state, then change one thing. Keep the source condition and observation duration comparable.",
          "先記錄原狀態，再只調整一項；盡量使用相近的聲源狀態與觀察時長。",
        ),
        t(
          "条件允许时再恢复原状态重复观察，检查变化是否稳定，而不只挑最低的一次。",
          "When practical, return to the original state and repeat. Look for a consistent change rather than selecting the lowest result.",
          "條件允許時再恢復原狀態重複觀察，檢查變化是否穩定，而不只挑最低的一次。",
        ),
        t(
          "备注写清门窗、设备档位、时段和实际干扰。网页差值不能直接当成门窗隔声量，也不能证明法规合规或听力安全。",
          "Note windows, equipment settings, timing and experienced disturbance. A browser difference is not a door or window insulation value and cannot certify compliance or hearing safety.",
          "備註寫清門窗、裝置檔位、時段和實際干擾。網頁差值不能直接當成門窗隔音量，也不能證明法規合規或聽力安全。",
        ),
      ],
    },
    {
      id: "help",
      tocTitle: t("何时找专业人员", "When to get help", "何時找專業人員"),
      title: t(
        "持续困扰或涉及施工时，先评估再投入",
        "Get an assessment before major work",
        "持續困擾或涉及施工時，先評估再投入",
      ),
      paragraphs: [
        t(
          "低频嗡声、结构传声、持续睡眠干扰，或需要更换门窗、改造墙体楼板时，可请声学专业人员评估传播路径与完整方案。购买前要求说明适用声源、完整结构测试条件和现场验证方式，避免把单件材料的数字当成房间保证。",
          "For persistent rumble, structure-borne sound, sleep disturbance or major window, wall or floor work, an acoustic professional can assess the paths and overall design. Ask what source, tested assembly and on-site verification a proposal covers before committing to it.",
          "低頻嗡聲、結構傳聲、持續睡眠干擾，或需要更換門窗、改造牆體樓板時，可請聲學專業人員評估傳播路徑與完整方案。購買前要求說明適用聲源、完整結構測試條件和現場驗證方式，避免把單件材料的數字當成房間保證。",
        ),
        t(
          "如果面对的是强声或嘈杂作业，应先降低暴露、远离声源，并按场景使用合适的听力防护。职业场所需要由负责人结合实际暴露安排控制措施和专业评估。",
          "Around loud sound or noisy work, reduce exposure, move away and use suitable hearing protection. Workplace controls and assessments need to be arranged by those responsible for the actual exposure.",
          "如果面對的是強聲或吵雜作業，應先降低暴露、遠離聲源，並按情境使用合適的聽力防護。職業場所需要由負責人結合實際暴露安排控制措施和專業評估。",
        ),
      ],
    },
  ],
  sources: [
    {
      title: "Australian Government · Your Home: Noise control",
      url: "https://www.yourhome.gov.au/live-adapt/noise-control",
    },
    {
      title: "CDC/NIOSH · Implement Engineering Controls",
      url: "https://www.cdc.gov/niosh/noise/prevent/engineering.html",
    },
    {
      title: "UK HSE · Workplace design",
      url: "https://www.hse.gov.uk/noise/goodpractice/workplacedesign.htm",
    },
    {
      title: "EPA Victoria · Reduce noise from your home",
      url: "https://www.epa.vic.gov.au/reduce-noise-your-home",
    },
  ],
  related: [
    "hearing-protection",
    "noise-health",
    "phone-accuracy",
    "guide",
    "when-professional-meter",
  ],
};
