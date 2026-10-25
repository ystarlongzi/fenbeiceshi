import { translations as t } from "../types.ts";
import type { SoundDetailDefinition } from "./types.ts";

export const equipmentDetails: SoundDetailDefinition[] = [
  {
    soundIds: ["drill"],
    perception: t(
      "手持电钻是较强设备声的参考。空转与实际钻孔是不同工况，材料、负载和位置也会改变声音。",
      "A hand drill is an example of strong equipment noise. Free running and drilling are different conditions, with material, load and position also affecting the sound.",
      "手持電鑽是較強裝置聲的參考。空轉與實際鑽孔是不同運轉條件，材料、負載和位置也會改變聲音。",
    ),
    topic: t("手持电钻声", "Hand drill noise", "手持電鑽聲"),
    answer: t(
      "98 dB 来自 NIOSH 声级计 App 用户指南第 13 页的手持电钻示例。它是一个声音量级参考，原列表没有给出测距、材料或负载，不代表所有电钻的固定输出。",
      "The 98 dB hand-drill example appears on page 13 of the NIOSH Sound Level Meter App manual. Its list gives no distance, material or load, so it is a level reference rather than a fixed output for all drills.",
      "98 dB 來自 NIOSH 聲級計 App 使用者指南第 13 頁的手持電鑽示例。它是一個聲音量級參考，原列表沒有給出測距、材料或負載，不代表所有電鑽的固定輸出。",
    ),
    questions: [
      {
        question: t(
          "电钻空转不太响，钻墙为什么突然很吵？",
          "Why does drilling sound much louder than running the drill freely?",
          "電鑽空轉不太響，鑽牆為什麼突然很吵？",
        ),
        answer: t(
          "钻头碰到材料后，工具和墙体的振动都会参与发声。空转、钻木头和钻墙不能直接当作同一种声音来比。",
          "Once the bit meets the material, vibration from the tool and the wall contributes to the sound. Running freely, drilling wood and drilling a wall are different situations.",
          "鑽頭碰到材料後，工具和牆體的振動都會參與發聲。空轉、鑽木頭和鑽牆不能直接當作同一種聲音來比。",
        ),
      },
      {
        question: t(
          "隔着一堵墙，为什么还能听到钻孔声？",
          "Why can I hear drilling through a wall?",
          "隔著一堵牆，為什麼還能聽到鑽孔聲？",
        ),
        answer: t(
          "钻孔声不只通过空气传播，振动也可能沿墙体传过来。离工具远一点未必就完全听不到；记录时写下所在房间和作业时间，会更有参考价值。",
          "Sound travels through air, and vibration can also travel through the building. Being farther from the drill does not mean silence. Note your room and when drilling happens to give the reading context.",
          "鑽孔聲不只透過空氣傳播，振動也可能沿牆體傳過來。離工具遠一點未必就完全聽不到；記錄時寫下所在房間和作業時間，會更有參考價值。",
        ),
      },
    ],
    relatedSoundIds: ["chainsaw", "jackhammer"],
    relatedPageIds: ["noise-health", "guide"],
  },
  {
    soundIds: ["hair-dryer", "thunder"],
    perception: t(
      "吹风机与雷声都出现在 100 这个数值上，但声音的持续方式与单位不同。它们适合帮助认识量级，不能直接当作等效声音。",
      "Hair dryers and thunder both appear at 100, but their timing and unit labels differ. They help illustrate a level without becoming equivalent measurements.",
      "吹風機與雷聲都出現在 100 這個數值上，但聲音的持續方式與單位不同。它們適合幫助認識量級，不能直接當作等效聲音。",
    ),
    topic: t("吹风机与雷声", "Hair dryers and thunder", "吹風機與雷聲"),
    answer: t(
      "WHO 的吹风机示例为 100 dB；NPS 在拱门国家公园的雷声示例为 100 dBA。两个数字相同，但来源单位、持续方式与环境不同，不能当成同一次测量条件下的等效声音。",
      "WHO lists a hair dryer at 100 dB; NPS lists thunder in Arches National Park at 100 dBA. Matching numbers do not make them equivalent measurements: units, timing and surroundings differ.",
      "WHO 的吹風機示例為 100 dB；NPS 在拱門國家公園的雷聲示例為 100 dBA。兩個數字相同，但來源單位、持續方式與環境不同，不能當成同一次量測條件下的等效聲音。",
    ),
    questions: [
      {
        question: t(
          "吹风机和雷声都是 100 分贝，听感一样吗？",
          "Do a dryer and thunder sound alike at 100 dB?",
          "吹風機和雷聲都是 100 分貝，聽感一樣嗎？",
        ),
        answer: t(
          "不一样。吹风机通常持续运行，雷声可能突然出现；这里两条资料还分别使用 dB 和 dBA。相同的数字，不代表声音或测量条件完全相同。",
          "No. A dryer usually runs steadily, while thunder can be sudden. These sources also use different labels, dB and dBA. The same number does not mean identical sound or measurement conditions.",
          "不一樣。吹風機通常持續運轉，雷聲可能突然出現；這裡兩條資料還分別使用 dB 和 dBA。相同的數字，不代表聲音或量測條件完全相同。",
        ),
      },
      {
        question: t(
          "吹风机换个档位，声音会小一些吗？",
          "Can a different dryer setting reduce the noise?",
          "吹風機換個檔位，聲音會小一些嗎？",
        ),
        answer: t(
          "有可能，但要看具体机型。可以按说明书选用较低档位，比较同一位置的声音；不要把麦克风贴近出风口，气流本身也会影响读数。",
          "It may, depending on the model. Follow its instructions and compare a lower setting from the same spot. Keep the microphone away from the outlet, where airflow can distort the reading.",
          "有可能，但要看具體機型。可以按說明書選用較低檔位，比較同一位置的聲音；不要把麥克風貼近出風口，氣流本身也會影響讀數。",
        ),
      },
    ],
    relatedSoundIds: ["shaver", "fireworks"],
    relatedPageIds: ["noise-health", "dbfs-spl"],
    extraSources: ["ccohs"],
  },
  {
    soundIds: ["chainsaw"],
    perception: t(
      "链锯运行可以形成很突出的设备声。启动、空载和切割需要分别看，不能用一个参考值概括所有工况。",
      "A running chainsaw can be a prominent equipment sound. Starting, idling and cutting need separate treatment rather than one number for every condition.",
      "鏈鋸運轉可以形成很突出的裝置聲。啟動、空載和切割需要分別看，不能用一個參考值概括所有運轉條件。",
    ),
    topic: t("链锯声", "Chainsaw noise", "鏈鋸聲"),
    answer: t(
      "108 dB 是 NIOSH 声级计 App 用户指南第 13 页的链锯示例，原列表未说明统一距离或负载。它不是所有链锯的产品参数，也不是操作人员耳边的固定声级。",
      "The NIOSH Sound Level Meter App manual gives a chainsaw example of 108 dB on page 13, without a common distance or load. It is neither a specification for every chainsaw nor a fixed level at an operator's ear.",
      "108 dB 是 NIOSH 聲級計 App 使用者指南第 13 頁的鏈鋸示例，原列表未說明統一距離或負載。它不是所有鏈鋸的產品參數，也不是操作人員耳邊的固定聲級。",
    ),
    questions: [
      {
        question: t(
          "链锯空转和锯木头，声音差在哪？",
          "Why does a chainsaw sound different while cutting?",
          "鏈鋸空轉和鋸木頭，聲音差在哪？",
        ),
        answer: t(
          "切割时的负载、木材和操作方式都会改变声音。108 分贝是资料中的一个示例，不能代表所有链锯在所有时候的声音。",
          "The cutting load, timber and how the saw is used all change the sound. The 108 dB figure is one reference, not a constant level for every chainsaw.",
          "切割時的負載、木材和操作方式都會改變聲音。108 分貝是資料中的一個示例，不能代表所有鏈鋸在所有時候的聲音。",
        ),
      },
      {
        question: t(
          "离链锯远一点，就不用戴耳罩了吗？",
          "Can I skip hearing protection if I move farther from a chainsaw?",
          "離鏈鋸遠一點，就不用戴耳罩了嗎？",
        ),
        answer: t(
          "不能只按距离决定。是否需要听力防护，还要看实际声音、作业时间和现场要求；不要因为手机读数较低，就摘掉原本需要的防护。",
          "Distance alone is not enough to decide. The actual level, time spent there and the worksite’s requirements matter. Do not remove required protection just because a phone reading seems low.",
          "不能只按距離決定。是否需要聽力防護，還要看實際聲音、作業時間和現場要求；不要因為手機讀數較低，就摘掉原本需要的防護。",
        ),
      },
    ],
    relatedSoundIds: ["drill", "jackhammer"],
    relatedPageIds: ["noise-health", "phone-accuracy"],
  },
  {
    soundIds: ["jet"],
    perception: t(
      "这条军用喷气飞机参考对应离地约一百米的飞越。高度、航迹和观察位置，是理解这种强声的重要条件。",
      "This military-jet reference concerns a flyover about one hundred metres above ground. Height, flight path and observation position are important to its interpretation.",
      "這條軍用噴氣飛機參考對應離地約一百公尺的飛越。高度、航跡和觀察位置，是理解這種強聲的重要條件。",
    ),
    topic: t("军用喷气飞机飞越声", "Military jet flyovers", "軍用噴射機飛越聲"),
    answer: t(
      "NPS 的 120 dBA 示例是离地约 100 米的军用喷气飞机飞越，来自 Yukon-Charley Rivers 的公园声景资料。高度和飞越情形是参考的一部分，不能省略。",
      "NPS's 120 dBA example is a military jet flying about 100 metres above ground in its Yukon-Charley Rivers soundscape reference. Height and flyover conditions are part of the example and must be retained.",
      "NPS 的 120 dBA 示例是離地約 100 公尺的軍用噴射機飛越，來自 Yukon-Charley Rivers 的公園聲景資料。高度和飛越情形是參考的一部分，不能省略。",
    ),
    questions: [
      {
        question: t(
          "飞机飞得高，地面上就一定不响吗？",
          "Does a high-flying aircraft always sound quiet on the ground?",
          "飛機飛得高，地面上就一定不響嗎？",
        ),
        answer: t(
          "不一定。机型、飞行状态和你与航线的位置都会影响声音。这里的资料带有飞行高度条件，不能直接套到每一次飞越。",
          "No. Aircraft type, flight conditions and your position relative to the route all matter. This reference includes an altitude condition and does not describe every flyover.",
          "不一定。機型、飛行狀態和你與航線的位置都會影響聲音。這裡的資料帶有飛行高度條件，不能直接套到每一次飛越。",
        ),
      },
      {
        question: t(
          "手机显示 120+，声音就只有 120 分贝吗？",
          "Does 120+ on the phone mean the sound stops at 120 dB?",
          "手機顯示 120+，聲音就只有 120 分貝嗎？",
        ),
        answer: t(
          "不是。120+ 是本站显示刻度的终点，不是对真实声音上限的判断。手机麦克风也有能力限制；需要测强声时，应使用合适的专业设备。",
          "No. It is the end of this site’s display scale, not a limit on the real sound. Phone microphones also have limits. Measuring intense sound needs suitable professional equipment.",
          "不是。120+ 是本站顯示刻度的終點，不是對真實聲音上限的判斷。手機麥克風也有能力限制；需要測強聲時，應使用合適的專業裝置。",
        ),
      },
    ],
    relatedSoundIds: ["airplane", "thunder"],
    relatedPageIds: ["noise-health", "dbfs-spl"],
  },
  {
    soundIds: ["jackhammer"],
    perception: t(
      "风镐属于很强的施工作业声参考。施工点的位置、运行阶段与观察距离，都应连同读数一起记录。",
      "A jackhammer illustrates very strong construction sound. Record work location, operating stage and observation distance alongside a reading.",
      "風鎬屬於很強的施工作業聲參考。施工點的位置、運轉階段與觀察距離，都應連同讀數一起記錄。",
    ),
    topic: t("风镐与施工噪音", "Jackhammers and construction noise", "風鎬與施工噪音"),
    answer: t(
      "WHO 把风镐列为约 130 dB 的高声级示例，未给出统一测距或工况。它说明这类设备可能产生很强的声音，不是所有施工位置都应出现的固定数值。",
      "WHO lists a jackhammer at about 130 dB without a common distance or operating condition. It illustrates potentially intense equipment sound, not a fixed reading at every construction location.",
      "WHO 把風鎬列為約 130 dB 的高聲級示例，未給出統一測距或工況。它說明這類裝置可能產生很強的聲音，不是所有施工位置都應出現的固定數值。",
    ),
    questions: [
      {
        question: t(
          "施工声断断续续，怎么记录才有用？",
          "How can I record construction noise that keeps stopping and starting?",
          "施工聲斷斷續續，怎麼記錄才有用？",
        ),
        answer: t(
          "除了数字，也记下什么时候开始、每次大约多久、停了多久，以及你所在的位置。这样更容易看出它是偶尔几下，还是长时间反复作业。",
          "Alongside readings, note start times, how long each burst and pause lasts, and where you are. This shows whether it was a few isolated bursts or repeated work over a long period.",
          "除了數字，也記下什麼時候開始、每次大約多久、停了多久，以及你所在的位置。這樣更容易看出它是偶爾幾下，還是長時間反覆作業。",
        ),
      },
      {
        question: t(
          "关窗后施工声还是很响，可以怎么办？",
          "What if construction is still loud with the windows closed?",
          "關窗後施工聲還是很響，可以怎麼辦？",
        ),
        answer: t(
          "先试试离施工方向更远的房间，减少在强声附近停留。手机记录能帮助描述变化；如果需要正式的噪音结论，还应找合适的专业测量服务。",
          "Try a room farther from the work and spend less time near loud sound. Phone records can describe changes; a formal noise assessment needs an appropriate professional service.",
          "先試試離施工方向更遠的房間，減少在強聲附近停留。手機記錄能幫助描述變化；如果需要正式的噪音結論，還應找合適的專業量測服務。",
        ),
      },
    ],
    relatedSoundIds: ["drill", "chainsaw"],
    relatedPageIds: ["noise-health"],
    extraSources: ["niosh"],
  },
  {
    soundIds: ["airplane"],
    perception: t(
      "飞机起飞是极强声音的参考场景。机场附近的外部观察与机舱内部不同，距离和位置尤其重要。",
      "Aircraft takeoff is a reference for exceptionally intense sound. An external observation near an airport differs from the cabin, making distance and position important.",
      "飛機起飛是極強聲音的參考場景。機場附近的外部觀察與機艙內部不同，距離和位置尤其重要。",
    ),
    topic: t("飞机起飞的声音", "Aircraft takeoff noise", "飛機起飛的聲音"),
    answer: t(
      "WHO 把飞机起飞列为约 140 dB 的示例，但未统一测距。这个数值不能解释成乘客在机舱内听到的声级，也不是所有机场观察点的固定读数。",
      "WHO lists aircraft takeoff at about 140 dB without a common measurement distance. This is not a passenger-cabin level or a fixed reading at every airport observation point.",
      "WHO 把飛機起飛列為約 140 dB 的示例，但未統一測距。這個數值不能解釋成乘客在機艙內聽到的聲級，也不是所有機場觀察點的固定讀數。",
    ),
    questions: [
      {
        question: t(
          "飞机起飞 140 分贝，机舱里也是这样吗？",
          "Does a 140 dB take-off example mean 140 dB inside the cabin?",
          "飛機起飛 140 分貝，機艙裡也是這樣嗎？",
        ),
        answer: t(
          "不是。这个例子不能直接代表机舱。机舱内的座位、飞行阶段和声音来源不同，需要另外查看相应的测量资料。",
          "No. The example does not describe the cabin. Seating position, flight stage and sound sources inside are different and need their own measurements.",
          "不是。這個例子不能直接代表機艙。機艙內的座位、飛行階段和聲音來源不同，需要另外查看相應的量測資料。",
        ),
      },
      {
        question: t(
          "为什么每次飞机起飞，听起来都不一样？",
          "Why does each take-off sound different?",
          "為什麼每次飛機起飛，聽起來都不一樣？",
        ),
        answer: t(
          "机型、运行状态、距离和朝向都可能不同。比较前先记下站在哪里、飞机离你多远；不用为了接近资料里的数字，主动靠近飞机或机场作业区。",
          "Aircraft type, operating conditions, distance and direction can differ. Note where you are and roughly how far away the aircraft is. Do not approach aircraft or airport working areas to match a number.",
          "機型、運作狀態、距離和朝向都可能不同。比較前先記下站在哪裡、飛機離你多遠；不用為了接近資料裡的數字，主動靠近飛機或機場作業區。",
        ),
      },
    ],
    relatedSoundIds: ["jet", "fireworks"],
    relatedPageIds: ["noise-health", "phone-accuracy"],
  },
];
