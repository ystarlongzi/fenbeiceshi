import { translations as t } from "../types.ts";
import type { SoundDetailDefinition } from "./types.ts";

export const homeDetails: SoundDetailDefinition[] = [
  {
    soundIds: ["home"],
    perception: t(
      "可以用普通家庭的室内背景声建立印象。门窗、通风和正在运行的电器，会一起改变房间里的声音。",
      "Think of everyday household background sound. Windows, ventilation and running appliances all contribute to what you hear in a room.",
      "可以用一般家庭的室內背景聲建立印象。門窗、通風和正在運轉的電器，會一起改變房間裡的聲音。",
    ),
    topic: t("普通家庭环境声", "Background noise at home", "一般家庭環境聲"),
    answer: t(
      "45–55 dB 来自 EPA 1979 年资料中的室内家庭环境示例。它可以帮助理解常见背景声，但不是当前住宅的标准限值，也不是每个家庭都应达到的范围。",
      "The 45–55 dB range comes from an indoor household example in a 1979 EPA publication. It helps describe background sound, but is neither a current residential limit nor a target every home should meet.",
      "45–55 dB 來自 EPA 1979 年資料中的室內家庭環境示例。它可以幫助理解常見背景聲，但不是現行住宅的標準限值，也不是每個家庭都應達到的範圍。",
    ),
    questions: [
      {
        question: t(
          "家里 45–55 分贝算吵吗？",
          "Is 45–55 dB noisy for a home?",
          "家裡 45–55 分貝算吵嗎？",
        ),
        answer: t(
          "做饭、走动或开着电器时，这种背景声未必让人在意；读书和睡觉时，感受可能不同。先看是哪种声音、持续多久，不必只盯着一个数字。",
          "During cooking, movement or appliance use, this background may not bother you. Reading or sleeping can feel different. Notice the source and how long it lasts, rather than watching only the number.",
          "煮飯、走動或開著電器時，這種背景聲未必讓人在意；讀書和睡覺時，感受可能不同。先看是哪種聲音、持續多久，不必只盯著一個數字。",
        ),
      },
      {
        question: t(
          "为什么开窗和关窗，声音能差这么多？",
          "Why can opening a window make such a difference?",
          "為什麼開窗和關窗，聲音能差這麼多？",
        ),
        answer: t(
          "窗外的车流、人声和施工声会进入房间。想比较窗户的影响，就把手机放在同一个地方，分别观察开窗和关窗时的一段声音。",
          "Traffic, voices and construction noise can enter through the window. To compare, leave the phone in one place and observe for a while with the window open and then closed.",
          "窗外的車流、人聲和施工聲會進入房間。想比較窗戶的影響，就把手機放在同一個地方，分別觀察開窗和關窗時的一段聲音。",
        ),
      },
    ],
    relatedSoundIds: ["library", "conversation"],
    relatedPageIds: ["guide", "phone-accuracy"],
  },
  {
    soundIds: ["dishwasher"],
    perception: t(
      "这是洗碗机运行声的参考范围。进水、清洗和排水是不同阶段，比较时要先对齐程序和观察位置。",
      "This range illustrates dishwasher operation. Filling, washing and draining are different stages, so match the programme and position before comparing.",
      "這是洗碗機運轉聲的參考範圍。進水、清洗和排水是不同階段，比較時要先對齊行程和觀察位置。",
    ),
    topic: t("洗碗机噪音", "Dishwasher noise", "洗碗機噪音"),
    answer: t(
      "CDC 给出的洗碗机示例为 45–65 dB。范围覆盖不同设备及运行情形，不能把 45 当成所有型号的待机值，或把 65 当成统一的产品上限。",
      "CDC gives 45–65 dB as a dishwasher example. The range covers differing equipment and operation; it does not make 45 a universal idle level or 65 a product limit.",
      "CDC 給出的洗碗機示例為 45–65 dB。範圍涵蓋不同裝置及運轉情形，不能把 45 當成所有型號的待機值，或把 65 當成統一的產品上限。",
    ),
    questions: [
      {
        question: t(
          "洗碗机晚上开会吵吗？",
          "Will a dishwasher disturb me at night?",
          "洗碗機晚上開會吵嗎？",
        ),
        answer: t(
          "要看机型、程序和它离卧室有多远。洗涤、进水和排水的声音也不一样，最好完整听过一个程序，再决定是否安排在夜里运行。",
          "It depends on the model, programme and distance from your bedroom. Washing, filling and draining sound different, so listen through a whole programme before choosing an overnight schedule.",
          "要看機型、程序和它離臥室有多遠。洗滌、進水和排水的聲音也不一樣，最好完整聽過一個程序，再決定是否安排在夜裡運轉。",
        ),
      },
      {
        question: t(
          "同一台洗碗机，为什么有时更响？",
          "Why is the same dishwasher louder sometimes?",
          "同一台洗碗機，為什麼有時更響？",
        ),
        answer: t(
          "程序、餐具摆法和运行阶段都可能改变声音。如果突然出现以前没有的碰撞声，先按说明书检查餐具有没有放稳。",
          "The programme, how dishes are loaded and the stage of the cycle can all change the sound. If a new rattling sound appears, check the loading instructions and whether anything is loose.",
          "程序、餐具擺法和運轉階段都可能改變聲音。如果突然出現以前沒有的碰撞聲，先按說明書檢查餐具有沒有放穩。",
        ),
      },
    ],
    relatedSoundIds: ["home", "washing-machine"],
    relatedPageIds: ["guide", "dbfs-spl"],
    extraSources: ["ccohs"],
  },
  {
    soundIds: ["dryer"],
    perception: t(
      "可以用干衣机的滚筒与风路运行声理解这组参考。比较两次运行时，负载和程序需要一起记录。",
      "A dryer’s drum and airflow help put this reference in context. Record the load and programme when comparing two runs.",
      "可以用乾衣機的滾筒與風路運轉聲理解這組參考。比較兩次運轉時，負載和行程需要一起記錄。",
    ),
    topic: t("干衣机噪音", "Clothes dryer noise", "乾衣機噪音"),
    answer: t(
      "51–66 dB 是 CDC/NIOSH 馆藏 1986 年工程教学资料 Table 2 的干衣机范围，测距为 0.9 米。它是历史教学参考，不是当前所有干衣机的性能范围。",
      "The 51–66 dB dryer range comes from Table 2 of a 1986 engineering teaching document in the CDC/NIOSH archive, at 0.9 metres. It is a historical reference, not a performance range for all current dryers.",
      "51–66 dB 是 CDC/NIOSH 館藏 1986 年工程教學資料 Table 2 的乾衣機範圍，測距為 0.9 公尺。它是歷史教學參考，不是現今所有乾衣機的性能範圍。",
    ),
    questions: [
      {
        question: t(
          "干衣机的声音忽大忽小，是怎么回事？",
          "Why does a dryer get louder and quieter?",
          "乾衣機的聲音忽大忽小，是怎麼回事？",
        ),
        answer: t(
          "衣物在滚筒里翻动，拉链和纽扣也可能碰到筒壁。可以先留意声音是否随着滚筒重复出现；突然新增的异响，按设备说明检查更合适。",
          "Clothes tumble, and zips or buttons can hit the drum. Notice whether the sound repeats with the drum. For a sudden new noise, follow the appliance’s troubleshooting instructions.",
          "衣物在滾筒裡翻動，拉鍊和鈕扣也可能碰到筒壁。可以先留意聲音是否隨著滾筒重複出現；突然新增的異音，按裝置說明檢查更合適。",
        ),
      },
      {
        question: t(
          "怎么比较两台干衣机谁更安静？",
          "How can I compare two dryers for noise?",
          "怎麼比較兩台乾衣機誰更安靜？",
        ),
        answer: t(
          "先看两台产品的噪音参数是不是按相同方法测的。在家比较时，尽量使用相近的衣物量、程序和观察距离，不要一台在空转、另一台装满衣服。",
          "Check that the published noise figures use the same test method. At home, keep the load, programme and distance similar; an empty drum and a full load are not a fair comparison.",
          "先看兩台產品的噪音參數是不是按相同方法測的。在家比較時，盡量使用相近的衣物量、程序和觀察距離，不要一台在空轉、另一台裝滿衣服。",
        ),
      },
    ],
    relatedSoundIds: ["washing-machine", "dishwasher"],
    relatedPageIds: ["guide"],
  },
  {
    soundIds: ["washing-machine"],
    perception: t(
      "这组洗衣机参考跨越几个量级。洗涤和脱水要分开比较，程序、负载与安装状态都很重要。",
      "This washing-machine range spans several level bands. Compare washing and spinning separately, with programme, load and installation in view.",
      "這組洗衣機參考跨越幾個量級。洗滌和脫水要分開比較，行程、負載與安裝狀態都很重要。",
    ),
    topic: t("洗衣机与脱水噪音", "Washing machine and spin noise", "洗衣機與脫水噪音"),
    answer: t(
      "47–72 dB 是 1986 年工程教学资料中、在 0.9 米处给出的洗衣机范围。洗涤和脱水不是同一工况，这组历史值不能用来直接诊断今天某台机器是否故障。",
      "The 47–72 dB washing-machine range is from a 1986 teaching document at 0.9 metres. Washing and spinning are different operating conditions, and the historical values cannot diagnose a current machine.",
      "47–72 dB 是 1986 年工程教學資料中、在 0.9 公尺處給出的洗衣機範圍。洗滌和脫水不是同一工況，這組歷史值不能用來直接診斷今天某台機器是否故障。",
    ),
    questions: [
      {
        question: t(
          "洗衣机脱水为什么比洗涤更吵？",
          "Why is spinning louder than washing?",
          "洗衣機脫水為什麼比洗滌更吵？",
        ),
        answer: t(
          "脱水时滚筒转得更快，振动和衣物分布也会影响声音。所以 47–72 分贝是一段范围，不能只拿最低值代表整个洗衣过程。",
          "The drum turns faster during spinning, and vibration and load balance affect the sound. That is why 47–72 dB is a range; the lowest number does not describe the whole cycle.",
          "脫水時滾筒轉得更快，振動和衣物分布也會影響聲音。所以 47–72 分貝是一段範圍，不能只拿最低值代表整個洗衣過程。",
        ),
      },
      {
        question: t(
          "洗衣机突然变吵，先看什么？",
          "What should I check if my washer suddenly gets louder?",
          "洗衣機突然變吵，先看什麼？",
        ),
        answer: t(
          "先按说明书暂停，检查衣物有没有堆在一边、机器是否放稳。再次比较时，要选同一个程序和阶段；洗涤声与高速脱水声放在一起比，容易误判。",
          "Pause it as directed in the manual and check for an uneven load or an unstable machine. Compare the same programme and stage next time; washing and high-speed spinning naturally sound different.",
          "先按說明書暫停，檢查衣物有沒有堆在一邊、機器是否放穩。再次比較時，要選同一個程序和階段；洗滌聲與高速脫水聲放在一起比，容易誤判。",
        ),
      },
    ],
    relatedSoundIds: ["dryer", "dishwasher"],
    relatedPageIds: ["guide"],
  },
  {
    soundIds: ["shaver"],
    perception: t(
      "这是电动剃须刀在一定距离下的运行声参考。它可以描述外部声音，却不能直接代表贴近头部使用时的耳部暴露。",
      "This reference describes an electric shaver from a stated distance. It is an external sound example, rather than an ear-exposure reading during use.",
      "這是電動刮鬍刀在一定距離下的運轉聲參考。它可以描述外部聲音，卻不能直接代表貼近頭部使用時的耳部暴露。",
    ),
    topic: t("电动剃须刀噪音", "Electric shaver noise", "電動刮鬍刀噪音"),
    answer: t(
      "47–69 dB 是 1986 年工程教学资料在 0.9 米处的电动剃须刀示例范围。这个距离下的环境参考，不能直接解释成贴近头部使用时的耳部暴露。",
      "The 47–69 dB electric-shaver example was reported at 0.9 metres in a 1986 teaching document. A reference at that distance cannot be treated as near-ear exposure during use.",
      "47–69 dB 是 1986 年工程教學資料在 0.9 公尺處的電動刮鬍刀示例範圍。這個距離下的環境參考，不能直接解釋成貼近頭部使用時的耳部暴露。",
    ),
    questions: [
      {
        question: t(
          "剃须刀靠近耳边，为什么听着特别响？",
          "Why does a shaver sound so loud near my ear?",
          "刮鬍刀靠近耳邊，為什麼聽著特別響？",
        ),
        answer: t(
          "因为你离声源很近。这里的资料是在约 0.9 米处测的，不能直接当成剃须时耳边听到的声音；也不用把麦克风贴上去追这个数字。",
          "You are very close to the source. This reference was measured at about 0.9 metres, so it does not describe the sound at your ear while shaving. There is no need to press a microphone against it to match the number.",
          "因為你離聲源很近。這裡的資料是在約 0.9 公尺處測的，不能直接當成刮鬍時耳邊聽到的聲音；也不用把麥克風貼上去追這個數字。",
        ),
      },
      {
        question: t(
          "不同档位的声音不一样，正常吗？",
          "Can different shaver settings sound different?",
          "不同檔位的聲音不一樣，正常嗎？",
        ),
        answer: t(
          "马达转速、刀头和使用状态都会影响声音。想看有没有变化，就在同一个位置、用同一个档位比较；出现新的异响时，再按说明书检查。",
          "Motor speed, the head and how it is being used can change the sound. Compare the same setting from the same spot, and check the manual if a new unusual noise appears.",
          "馬達轉速、刀頭和使用狀態都會影響聲音。想看有沒有變化，就在同一個位置、用同一個檔位比較；出現新的異音時，再按說明書檢查。",
        ),
      },
    ],
    relatedSoundIds: ["fridge", "hair-dryer"],
    relatedPageIds: ["phone-accuracy", "noise-health"],
  },
  {
    soundIds: ["vacuum"],
    perception: t(
      "吸尘器的声音在房间里通常比较突出。这组范围较宽，档位、吸头和观察位置会改变比较结果。",
      "A vacuum cleaner can stand out against a room’s background. The broad reference range needs to be read with setting, attachment and observation position.",
      "吸塵器的聲音在房間裡通常比較突出。這組範圍較寬，檔位、吸頭和觀察位置會改變比較結果。",
    ),
    topic: t("吸尘器噪音", "Vacuum cleaner noise", "吸塵器噪音"),
    answer: t(
      "62–85 dB 来自 1986 年工程教学资料的吸尘器范围，测距为 0.9 米。这个跨度不表示每台机器都会从 62 升到 85，也不是所有现代型号的共同规格。",
      "The 62–85 dB vacuum-cleaner range comes from a 1986 teaching document at 0.9 metres. It does not mean each cleaner rises from 62 to 85 or that all modern models share this specification.",
      "62–85 dB 來自 1986 年工程教學資料的吸塵器範圍，測距為 0.9 公尺。這個跨度不表示每台機器都會從 62 升到 85，也不是所有現代型號的共同規格。",
    ),
    questions: [
      {
        question: t(
          "吸尘器开到最大档，会更吵吗？",
          "Does the highest vacuum setting make more noise?",
          "吸塵器開到最大檔，會更吵嗎？",
        ),
        answer: t(
          "不少机型会，但也和吸头、地面及运行状态有关。比较时用同一个吸头、在同一块地面上切换档位，更容易看出区别。",
          "Many models do, but the head, floor and operating conditions matter too. Use the same head on the same floor when comparing settings.",
          "不少機型會，但也和吸頭、地面及運轉狀態有關。比較時用同一個吸頭、在同一塊地面上切換檔位，更容易看出區別。",
        ),
      },
      {
        question: t(
          "吸尘器越来越响，先检查哪里？",
          "What should I check if a vacuum gets noisier?",
          "吸塵器越來越響，先檢查哪裡？",
        ),
        answer: t(
          "先关机，并按说明书检查集尘盒、滤网和吸入口。堵塞或部件松动可能改变声音；噪音数字能帮助记录变化，但不能代替设备检查。",
          "Switch it off and follow the manual to check the dust container, filter and inlet. Blockages or loose parts can change the sound. A noise reading can record a change, but cannot diagnose the appliance.",
          "先關機，並按說明書檢查集塵盒、濾網和吸入口。堵塞或零件鬆動可能改變聲音；噪音數字能幫助記錄變化，但不能代替裝置檢查。",
        ),
      },
    ],
    relatedSoundIds: ["washing-machine", "traffic-inside-car"],
    relatedPageIds: ["guide", "noise-health"],
    extraSources: ["niosh"],
  },
  {
    soundIds: ["doorbell"],
    perception: t(
      "门铃是短暂而突出的提示声。它的音量设置和你站的位置，会影响听到的声音。",
      "A doorbell is a brief, prominent signal. Its volume setting and your position affect what you hear.",
      "門鈴是短暫而突出的提示聲。它的音量設定和你站的位置，會影響聽到的聲音。",
    ),
    topic: t("门铃声", "Doorbells", "門鈴聲"),
    answer: t(
      "WHO 把门铃列为约 80 dB 的示例，未指定统一型号、音量或测距。它提示门铃可能是明显的短声，不表示每个门铃在任何位置都会达到 80。",
      "WHO lists a doorbell at about 80 dB without a common model, volume setting or distance. It illustrates a noticeable brief sound, not a level every doorbell reaches everywhere.",
      "WHO 把門鈴列為約 80 dB 的示例，未指定統一型號、音量或測距。它提示門鈴可能是明顯的短聲，不表示每個門鈴在任何位置都會達到 80。",
    ),
    questions: [
      {
        question: t(
          "80 分贝的门铃会不会太响？",
          "Is an 80 dB doorbell too loud?",
          "80 分貝的門鈴會不會太響？",
        ),
        answer: t(
          "靠得很近时可能很明显，放在卧室附近或夜里响起也容易打扰人。合不合适，要结合安装位置、可调音量和家人的实际感受。",
          "It may be very noticeable nearby, especially beside a bedroom or at night. Consider where it is fitted, its volume settings and how the people at home feel about it.",
          "靠得很近時可能很明顯，放在臥室附近或夜裡響起也容易打擾人。合不合適，要結合安裝位置、可調音量和家人的實際感受。",
        ),
      },
      {
        question: t(
          "门铃只响几秒，也会打扰人吗？",
          "Can a doorbell disturb people even if it rings briefly?",
          "門鈴只響幾秒，也會打擾人嗎？",
        ),
        answer: t(
          "会。突然出现的声音，和一直存在的背景声，感受很不一样。可以试着调低音量或换个位置，再听听是否仍能清楚提醒到家人。",
          "Yes. A sudden ring can stand out much more than steady background sound. Try a lower volume or another position, then check that everyone can still hear the alert.",
          "會。突然出現的聲音，和一直存在的背景聲，感受很不一樣。可以試著調低音量或換個位置，再聽聽是否仍能清楚提醒到家人。",
        ),
      },
    ],
    relatedSoundIds: ["conversation", "horn"],
    relatedPageIds: ["guide", "dbfs-spl"],
  },
];
