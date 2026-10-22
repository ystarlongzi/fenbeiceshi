import { translations as t } from "../types.ts";
import type { SoundDetailDefinition } from "./types.ts";

export const speechTrafficDetails: SoundDetailDefinition[] = [
  {
    soundIds: ["conversation"],
    perception: t(
      "日常说话是理解这组量级的直接参照。说话距离、人数和房间背景变化，同一次交谈也会有不同读数。",
      "Everyday speech is a familiar reference for this range. Distance, number of speakers and room background can change readings within one conversation.",
      "日常說話是理解這組量級的直接參照。說話距離、人數和房間背景變化，同一次交談也會有不同讀數。",
    ),
    topic: t("正常交谈与说话距离", "Conversation and speaking distance", "一般交談與說話距離"),
    answer: t(
      "NIDCD 把正常交谈列为 60–70 dBA。这里保留完整范围与 A 计权单位，不能把所有人的正常说话都固定为 60 或 70。",
      "NIDCD lists normal conversation at 60–70 dBA. The full range and A-weighted unit matter; normal speech is not a fixed 60 or 70 for every person.",
      "NIDCD 把一般交談列為 60–70 dBA。這裡保留完整範圍與 A 計權單位，不能把所有人的正常說話都固定為 60 或 70。",
    ),
    questions: [
      {
        question: t(
          "正常聊天为什么有时会超过 70 分贝？",
          "Why can conversation go above 70 dB?",
          "正常聊天為什麼有時會超過 70 分貝？",
        ),
        answer: t(
          "说话声音大小、离手机多近、是不是很多人在一起聊，都会影响结果。60–70 分贝是帮助理解正常交谈的参考，不是每句话都要落在这里。",
          "How loudly people speak, how close the phone is and how many people are talking all affect the result. The 60–70 dB range is an example, not a limit every sentence must fit.",
          "說話聲音大小、離手機多近、是不是很多人在一起聊，都會影響結果。60–70 分貝是幫助理解正常交談的參考，不是每句話都要落在這裡。",
        ),
      },
      {
        question: t(
          "隔着门还能听清说话，就说明分贝很高吗？",
          "Does hearing speech through a door mean it is very loud?",
          "隔著門還能聽清說話，就說明分貝很高嗎？",
        ),
        answer: t(
          "不一定。能不能听清，也和门缝、房间背景声、说话内容有关。想比较隔音效果，可以固定位置，观察关门前后的变化。",
          "Not necessarily. Gaps around the door, background noise and the speech itself matter too. To compare, stay in one place and observe the change when the door closes.",
          "不一定。能不能聽清，也和門縫、房間背景聲、說話內容有關。想比較隔音效果，可以固定位置，觀察關門前後的變化。",
        ),
      },
    ],
    relatedSoundIds: ["whisper", "restaurant"],
    relatedPageIds: ["calibration", "guide"],
  },
  {
    soundIds: ["restaurant"],
    perception: t(
      "可以用较热闹餐厅里的整体环境声理解这组范围。人流、测点与室内声学条件需要放在一起看。",
      "Think of the overall sound in a busy restaurant. Occupancy, measurement position and room acoustics all belong in the comparison.",
      "可以用較熱鬧餐廳裡的整體環境聲理解這組範圍。來客數、量測位置與室內聲學條件需要放在一起看。",
    ),
    topic: t("餐厅人声与环境背景", "Restaurant voices and background sound", "餐廳人聲與環境背景"),
    answer: t(
      "65–75 dB 来自 EPA 1979 年资料的餐厅示例。它描述特定资料中的环境范围，不是所有餐厅的现行评级，也不保证在这个范围内一定适合交谈。",
      "The 65–75 dB restaurant example comes from a 1979 EPA publication. It is an environmental reference, not a current rating for every restaurant or a guarantee of easy conversation within that range.",
      "65–75 dB 來自 EPA 1979 年資料的餐廳示例。它描述特定資料中的環境範圍，不是所有餐廳的現行評級，也不保證在這個範圍內一定適合交談。",
    ),
    questions: [
      {
        question: t(
          "餐厅里要提高嗓门说话，算吵吗？",
          "Is a restaurant noisy if I have to raise my voice?",
          "餐廳裡要提高嗓門說話，算吵嗎？",
        ),
        answer: t(
          "至少说明声音已经影响交谈了。人多、背景音乐和餐具碰撞会叠在一起；先换到离音箱和厨房远一点的位置，看看是否更容易说话。",
          "It shows that noise is getting in the way of conversation. Voices, music and clattering dishes add together. Try a seat farther from speakers and the kitchen and see whether talking becomes easier.",
          "至少說明聲音已經影響交談了。人多、背景音樂和餐具碰撞會疊在一起；先換到離音箱和廚房遠一點的位置，看看是否更容易說話。",
        ),
      },
      {
        question: t(
          "同一家餐厅，为什么有的位置特别吵？",
          "Why are some seats in the same restaurant much noisier?",
          "同一家餐廳，為什麼有的位置特別吵？",
        ),
        answer: t(
          "靠近音箱、厨房出入口或人群的位置，声音往往更突出；墙面反射也会改变感受。比较座位时，尽量选相近的客流时段。",
          "Speakers, kitchen doors and nearby groups can make some seats noisier. Reflections from walls also matter. Compare seats at similar levels of occupancy.",
          "靠近音箱、廚房出入口或人群的位置，聲音往往更突出；牆面反射也會改變感受。比較座位時，盡量選相近的客流時段。",
        ),
      },
    ],
    relatedSoundIds: ["conversation", "home"],
    relatedPageIds: ["guide", "noise-health"],
    extraSources: ["ccohs"],
  },
  {
    soundIds: ["street-traffic"],
    perception: t(
      "这是道路旁车流声的参考，距离是重要条件。路边观察和坐在车内，听到的声音并不是同一回事。",
      "This is a roadside traffic reference, where distance is important. Hearing traffic by the road differs from hearing it inside a car.",
      "這是道路旁車流聲的參考，距離是重要條件。路邊觀察和坐在車內，聽到的聲音並不是同一回事。",
    ),
    topic: t(
      "高速公路车流与道路距离",
      "Freeway traffic and distance from the road",
      "高速公路車流與道路距離",
    ),
    answer: t(
      "70–75 dB 是 EPA 1979 年资料中距高速公路正常车流 50 英尺、约 15 米的参考。它不是路边任何距离的通用值，也不是车内或关窗后的室内读数。",
      "The 70–75 dB reference is from a 1979 EPA example of normal freeway traffic at 50 feet, about 15 metres. It does not apply at every roadside distance or describe inside a car or a room with closed windows.",
      "70–75 dB 是 EPA 1979 年資料中距高速公路一般車流 50 英尺、約 15 公尺的參考。它不是路邊任何距離的通用值，也不是車內或關窗後的室內讀數。",
    ),
    questions: [
      {
        question: t(
          "晚上车少了，为什么车声反而更明显？",
          "Why can traffic stand out more when there are fewer cars at night?",
          "晚上車少了，為什麼車聲反而更明顯？",
        ),
        answer: t(
          "因为其他背景声也变小了。一辆车经过时，声音和安静背景的反差更大，不一定代表它比白天更响。",
          "Other background sounds become quieter too. A passing vehicle then contrasts more sharply with the quiet, even if that vehicle is no louder than during the day.",
          "因為其他背景聲也變小了。一輛車經過時，聲音和安靜背景的反差更大，不一定代表它比白天更響。",
        ),
      },
      {
        question: t(
          "关窗后还听得到车声，怎么比较变化？",
          "How can I compare traffic noise before and after closing a window?",
          "關窗後還聽得到車聲，怎麼比較變化？",
        ),
        answer: t(
          "把手机放稳在同一个地方，在车流相近时各观察一段时间。不要拿一次卡车经过的最高值，去比另一段没有车经过的安静时刻。",
          "Leave the phone in the same spot and observe for a while under similar traffic conditions. Comparing one passing truck with a quiet gap in traffic can be misleading.",
          "把手機放穩在同一個地方，在車流相近時各觀察一段時間。不要拿一次卡車經過的最高值，去比另一段沒有車經過的安靜時刻。",
        ),
      },
    ],
    relatedSoundIds: ["traffic-inside-car", "motorcycle"],
    relatedPageIds: ["guide"],
  },
  {
    soundIds: ["motorcycle"],
    perception: t(
      "摩托车或越野车的声音会随负载和经过距离改变。这个较宽的范围，更适合连同车辆状态一起理解。",
      "Motorcycle or dirt-bike sound changes with engine load and passing distance. Read this broad range alongside the vehicle’s operating state.",
      "摩托車或越野車的聲音會隨負載和經過距離改變。這個較寬的範圍，更適合連同車輛狀態一起理解。",
    ),
    topic: t(
      "摩托车、越野车与经过条件",
      "Motorcycles, dirt bikes and passing conditions",
      "機車、越野車與經過條件",
    ),
    answer: t(
      "NIDCD 给出的摩托车和越野车示例为 80–110 dBA。范围较宽，不能把其中任一端点当成所有车型、转速或距离下的固定声音。",
      "NIDCD gives 80–110 dBA for motorcycles and dirt bikes. This broad range does not make either endpoint a fixed level for every model, engine speed or distance.",
      "NIDCD 給出的機車和越野車示例為 80–110 dBA。範圍較寬，不能把其中任一端點當成所有車型、轉速或距離下的固定聲音。",
    ),
    questions: [
      {
        question: t(
          "为什么摩托车的分贝范围这么宽？",
          "Why is the motorcycle range so wide?",
          "為什麼摩托車的分貝範圍這麼寬？",
        ),
        answer: t(
          "车型、速度、加速状态和距离都可能不同。80–110 分贝不是每辆车固定的声音，也不表示一辆车经过时会一直那么响。",
          "The vehicle, speed, acceleration and distance can all differ. The 80–110 dB range is not a fixed rating for every motorcycle, or a constant level throughout a pass-by.",
          "車型、速度、加速狀態和距離都可能不同。80–110 分貝不是每輛車固定的聲音，也不表示一輛車經過時會一直那麼響。",
        ),
      },
      {
        question: t(
          "只经过一辆车，也可能觉得很吵吗？",
          "Can one passing motorcycle still seem very noisy?",
          "只經過一輛車，也可能覺得很吵嗎？",
        ),
        answer: t(
          "会，尤其是突然加速、离得近，或周围本来很安静时。记录时写下经过的时间和大致距离，比只保存一个最高数字更容易看懂。",
          "Yes, particularly during sudden acceleration, nearby, or against a quiet background. Note when it passed and roughly how far away it was, rather than saving only a maximum reading.",
          "會，尤其是突然加速、離得近，或周圍本來很安靜時。記錄時寫下經過的時間和大致距離，比只儲存一個最高數字更容易看懂。",
        ),
      },
    ],
    relatedSoundIds: ["street-traffic", "horn"],
    relatedPageIds: ["guide", "noise-health"],
  },
  {
    soundIds: ["traffic-inside-car"],
    perception: t(
      "可以用繁忙交通中的车内声音理解这个参考。车内位置、车窗状态和外部车流，都应作为观察条件记录。",
      "This reference concerns sound inside a car in heavy traffic. Record position, window state and surrounding traffic as part of the observation.",
      "可以用繁忙交通中的車內聲音理解這個參考。車內位置、車窗狀態和外部車流，都應作為觀察條件記錄。",
    ),
    topic: t(
      "繁忙交通中的车内声与职业参考",
      "In-car traffic sound and occupational references",
      "繁忙交通中的車內聲與職業參考",
    ),
    answer: t(
      "WHO 把繁忙交通中的车内声音列为约 85 dB。这是车内场景示例，既不是道路边的统一读数，也不能直接当成 NIOSH 的 85 dBA 职业暴露指标。",
      "WHO lists heavy traffic inside a car at about 85 dB. This is an in-car example, not a universal roadside reading or an automatic equivalent of NIOSH's 85 dBA occupational exposure metric.",
      "WHO 把繁忙交通中的車內聲音列為約 85 dB。這是車內場景示例，既不是道路邊的統一讀數，也不能直接當成 NIOSH 的 85 dBA 職業暴露指標。",
    ),
    questions: [
      {
        question: t(
          "车里测到 85 分贝，就说明车有问题吗？",
          "Does 85 dB inside a car mean something is wrong?",
          "車裡測到 85 分貝，就說明車有問題嗎？",
        ),
        answer: t(
          "不能只凭这个数字判断。路面、车速、开窗和通风都会改变声音；想看有没有异常，就在相近路况和车速下比较，并留意有没有新出现的异响。",
          "One number cannot diagnose the car. Road surface, speed, windows and ventilation all affect the sound. Compare similar driving conditions and notice any new unusual noise.",
          "不能只憑這個數字判斷。路面、車速、開窗和通風都會改變聲音；想看有沒有異常，就在相近路況和車速下比較，並留意有沒有新出現的異音。",
        ),
      },
      {
        question: t(
          "关上车窗，就一定会安静很多吗？",
          "Will closing the car windows always make it much quieter?",
          "關上車窗，就一定會安靜很多嗎？",
        ),
        answer: t(
          "通常能减少一部分外面的声音，但轮胎、发动机和通风声还在。比较时让乘客操作设备，驾驶员保持专心驾驶。",
          "It can reduce outside sound, but tyres, the engine and ventilation still contribute. Let a passenger handle the device so the driver can concentrate on driving.",
          "通常能減少一部分外面的聲音，但輪胎、引擎和通風聲還在。比較時讓乘客操作裝置，駕駛保持專心開車。",
        ),
      },
    ],
    relatedSoundIds: ["street-traffic", "vacuum"],
    relatedPageIds: ["noise-health", "phone-accuracy"],
    extraSources: ["niosh"],
  },
  {
    soundIds: ["horn"],
    perception: t(
      "汽车喇叭是突出的短时声音。这条参考带有五米测距，距离改变后，不能沿用同一个数值。",
      "A car horn is a prominent short sound. This reference specifies five metres; changing distance means the same number cannot simply be carried over.",
      "汽車喇叭是突出的短時聲音。這條參考帶有五公尺測距，距離改變後，不能沿用同一個數值。",
    ),
    topic: t(
      "汽车喇叭与五米测距条件",
      "Car horns and the five-metre reference",
      "汽車喇叭與五公尺測距條件",
    ),
    answer: t(
      "WHO 的汽车喇叭示例为 105 dB，并明确写出距喇叭 5 米。距离是这条参考的一部分，不能省去后当成贴近喇叭或车内的读数。",
      "WHO's car-horn example is 105 dB at five metres. Distance is part of the reference; omitting it would incorrectly turn the example into a close-up or in-car reading.",
      "WHO 的汽車喇叭示例為 105 dB，並明確寫出距喇叭 5 公尺。距離是這條參考的一部分，不能省去後當成貼近喇叭或車內的讀數。",
    ),
    questions: [
      {
        question: t(
          "为什么喇叭离远一点，就没那么刺耳？",
          "Why is a horn less harsh farther away?",
          "為什麼喇叭離遠一點，就沒那麼刺耳？",
        ),
        answer: t(
          "声音会随距离和周围环境变化。这里的 105 分贝是五米处的资料示例，不能直接代表车内或所有路口；没必要靠近喇叭复现它。",
          "Distance and surroundings change what reaches you. This 105 dB example is reported at five metres; it does not describe every junction or the inside of a car. Do not approach a horn to reproduce it.",
          "聲音會隨距離和周圍環境變化。這裡的 105 分貝是五公尺處的資料示例，不能直接代表車內或所有路口；沒必要靠近喇叭重現它。",
        ),
      },
      {
        question: t(
          "喇叭只响一下，就不会伤耳吗？",
          "Is one short horn blast harmless?",
          "喇叭只響一下，就不會傷耳嗎？",
        ),
        answer: t(
          "不能这样保证。很强的突发声也可能伤耳，离得近时更应避开；不要等到耳朵疼才拉开距离。",
          "There is no such guarantee. A sufficiently intense burst can harm hearing, especially nearby. Move away without waiting for pain.",
          "不能這樣保證。很強的突發聲也可能傷耳，離得近時更應避開；不要等到耳朵痛才拉開距離。",
        ),
      },
    ],
    relatedSoundIds: ["traffic-inside-car", "siren"],
    relatedPageIds: ["noise-health", "guide"],
  },
  {
    soundIds: ["siren"],
    perception: t(
      "警笛接近、经过和远离时，声音会明显变化。一次经过的最高读数，不代表整段时间的环境声。",
      "A siren changes as it approaches, passes and moves away. The maximum from one pass does not describe the whole observation period.",
      "警笛接近、經過和遠離時，聲音會明顯變化。一次經過的最高讀數，不代表整段時間的環境聲。",
    ),
    topic: t("警笛经过与短时强声", "Passing sirens and brief loud events", "警笛經過與短時強聲"),
    answer: t(
      "NIDCD 的警笛示例为 110–129 dBA。声源接近、经过和远离时，观察条件持续改变，这个范围不是所有警笛或所有距离下的固定读数。",
      "NIDCD gives a siren example of 110–129 dBA. Conditions change as the source approaches, passes and recedes; the range is not a fixed reading for every siren or distance.",
      "NIDCD 的警笛示例為 110–129 dBA。聲源接近、經過和遠離時，觀察條件持續改變，這個範圍不是所有警笛或所有距離下的固定讀數。",
    ),
    questions: [
      {
        question: t(
          "警笛经过时，怎么让耳朵舒服一点？",
          "What can I do when a loud siren passes?",
          "警笛經過時，怎麼讓耳朵舒服一點？",
        ),
        answer: t(
          "在不影响通行和自身安全的前提下，离声源远一些，减少不必要的停留。不要为了测分贝追着车辆走；经常接触强声时，考虑合适的听力防护。",
          "When it is safe, increase your distance and avoid lingering nearby. Do not follow the vehicle to measure it. If loud sound is a regular part of your day, use appropriate hearing protection.",
          "在不影響通行和自身安全的前提下，離聲源遠一些，減少不必要的停留。不要為了測分貝追著車輛走；經常接觸強聲時，考慮合適的聽力防護。",
        ),
      },
      {
        question: t(
          "警笛只响一会儿，记录最高值就够了吗？",
          "Is a maximum reading enough to describe a passing siren?",
          "警笛只響一會兒，記錄最高值就夠了嗎？",
        ),
        answer: t(
          "最好也记下响了多久、经过几次和大致距离。只看一个最高值，看不出它是偶尔经过，还是一段时间里反复出现。",
          "Also note how long it lasted, how often it passed and roughly how far away it was. A maximum alone cannot show whether it was a one-off or repeated throughout the period.",
          "最好也記下響了多久、經過幾次和大致距離。只看一個最高值，看不出它是偶爾經過，還是一段時間裡反覆出現。",
        ),
      },
    ],
    relatedSoundIds: ["horn", "motorcycle"],
    relatedPageIds: ["noise-health", "phone-accuracy"],
  },
];
