import { translations as t } from "../types.ts";
import type { SoundDetailDefinition } from "./types.ts";

export const leisureDetails: SoundDetailDefinition[] = [
  {
    soundIds: ["cinema"],
    perception: t(
      "电影院里的声音会随影片片段和座位变化。这组范围包含不同播放情境，不能把一个强烈片段当成整场电影的平均水平。",
      "Cinema sound varies by scene and seat. This broad range covers different situations; one loud passage is not the average of an entire film.",
      "電影院裡的聲音會隨影片片段和座位變化。這組範圍包含不同播放情境，不能把一個強烈片段當成整場電影的平均水準。",
    ),
    topic: t("电影院噪音", "Movie theater noise", "電影院噪音"),
    answer: t(
      "NIDCD 的电影院示例为 74–104 dBA。它保留了很宽的范围，不是所有电影全程保持的声级，也不是某个座位或影院的固定评级。",
      "NIDCD gives 74–104 dBA for a movie theatre. This broad reference is not a constant level throughout every film or a fixed rating for a seat or venue.",
      "NIDCD 的電影院示例為 74–104 dBA。它保留了很寬的範圍，不是所有電影全程保持的聲級，也不是某個座位或影院的固定評級。",
    ),
    questions: [
      {
        question: t(
          "电影里突然一声巨响，就代表整场都很吵吗？",
          "Does one loud movie effect mean the whole screening is loud?",
          "電影裡突然一聲巨響，就代表整場都很吵嗎？",
        ),
        answer: t(
          "不是。对白、音乐和音效的声音会变化，某一下的高值不代表整场。想记录感受，可以同时写下片段、座位和大约听了多久。",
          "No. Dialogue, music and effects change throughout a film. One loud moment does not describe the whole screening. Note the scene, seat and roughly how long you were there.",
          "不是。對白、音樂和音效的聲音會變化，某一下的高值不代表整場。想記錄感受，可以同時寫下片段、座位和大約聽了多久。",
        ),
      },
      {
        question: t(
          "看电影觉得太响，可以怎么做？",
          "What if a movie feels too loud?",
          "看電影覺得太響，可以怎麼做？",
        ),
        answer: t(
          "可以先离开影厅休息，或向工作人员反映。需要时使用合适的耳塞；不要为了拍到一个分贝数字，勉强留在让耳朵不舒服的位置。",
          "Take a quiet break outside or tell the staff. Use suitable earplugs when needed, and do not stay somewhere uncomfortable just to capture a reading.",
          "可以先離開影廳休息，或向工作人員反映。需要時使用合適的耳塞；不要為了拍到一個分貝數字，勉強留在讓耳朵不舒服的位置。",
        ),
      },
    ],
    relatedSoundIds: ["sports", "concert"],
    relatedPageIds: ["noise-health", "guide"],
  },
  {
    soundIds: ["sports", "headphones"],
    perception: t(
      "体育赛事与最大音量耳机都出现在这组较强声音参考中。场馆环境和耳部暴露的位置不同，要分别理解。",
      "Sporting events and headphones at maximum volume both appear in this high-level range. A venue observation and exposure at the ear are different contexts.",
      "體育賽事與最大音量耳機都出現在這組較強聲音參考中。場館環境和耳部暴露的位置不同，要分別理解。",
    ),
    topic: t(
      "体育赛事与最大音量耳机",
      "Sports events and headphones at full volume",
      "體育賽事與最大音量耳機",
    ),
    answer: t(
      "NIDCD 将体育赛事及最大音量耳机等声音列在 94–110 dBA 范围。数值范围相同，不表示场馆环境与耳机在耳部形成的声音可以用同一种外部测法比较。",
      "NIDCD lists sporting events and headphones at maximum volume among sounds at 94–110 dBA. A shared range does not make venue sound and headphone sound at the ear measurable by the same external method.",
      "NIDCD 將體育賽事及最大音量耳機等聲音列在 94–110 dBA 範圍。數值範圍相同，不表示場館環境與耳機在耳部形成的聲音可以用同一種外部測法比較。",
    ),
    questions: [
      {
        question: t(
          "耳机一定要开到最大，才会到这个范围吗？",
          "Does this range only apply to headphones at maximum volume?",
          "耳機一定要開到最大，才會到這個範圍嗎？",
        ),
        answer: t(
          "这里引用的耳机例子明确写了“最大音量”。平时听到多少，还和耳机、音量设置及佩戴有关；不需要开到最大来验证，先调低音量更有帮助。",
          "The headphone example specifically refers to maximum volume. Your own exposure also depends on the headphones, setting and fit. Do not turn them up to test it; start by lowering the volume.",
          "這裡引用的耳機例子明確寫了「最大音量」。平時聽到多少，還和耳機、音量設定及配戴有關；不需要開到最大來驗證，先調低音量更有幫助。",
        ),
      },
      {
        question: t(
          "球赛和耳机分贝一样，听起来也一样吗？",
          "Will a game and headphones sound the same at the same level?",
          "球賽和耳機分貝一樣，聽起來也一樣嗎？",
        ),
        answer: t(
          "不一定。欢呼、扩音器和耳机音乐的音色与起伏都不同，听了多久也很重要。手机放在耳机旁测到的声音，也不等于耳朵里真正听到的声音。",
          "Not necessarily. Cheering, PA systems and headphone music differ in tone and timing, and listening duration matters too. A phone beside the headphones does not measure what reaches your ear.",
          "不一定。歡呼、擴音器和耳機音樂的音色與起伏都不同，聽了多久也很重要。手機放在耳機旁測到的聲音，也不等於耳朵裡真正聽到的聲音。",
        ),
      },
    ],
    relatedSoundIds: ["cinema", "concert"],
    relatedPageIds: ["noise-health", "phone-accuracy"],
    extraSources: ["who"],
  },
  {
    soundIds: ["concert"],
    perception: t(
      "摇滚音乐会和夜店的扩声可以帮助理解这组量级。扬声器距离、场地和节目都会影响实际听到的声音。",
      "Amplified sound at rock concerts and nightclubs helps illustrate this range. Speaker distance, venue and programme affect what you hear.",
      "搖滾音樂會和夜店的擴聲可以幫助理解這組量級。揚聲器距離、場地和節目都會影響實際聽到的聲音。",
    ),
    topic: t("摇滚演唱会与夜店", "Rock concerts and nightclubs", "搖滾演唱會與夜店"),
    answer: t(
      "CDC 把摇滚音乐会或夜店列为 95–115 dB 的参考。场地、节目、扩声与站立位置不同，不能把这段范围当成所有活动的固定值。",
      "CDC lists rock concerts or nightclubs at 95–115 dB. Venue, programme, amplification and position vary; the range is not a fixed level for every event.",
      "CDC 把搖滾音樂會或夜店列為 95–115 dB 的參考。場地、節目、擴音與站立位置不同，不能把這段範圍當成所有活動的固定值。",
    ),
    questions: [
      {
        question: t(
          "去音乐会，站哪里能少受点噪音？",
          "Where can I stand to reduce noise at a concert?",
          "去音樂會，站哪裡能少受點噪音？",
        ),
        answer: t(
          "尽量远离音箱，并在合适的时候去安静处休息。场地和扩声方式不同，没有一个通用的“安全座位”；耳朵不舒服时，先离开强声位置。",
          "Stay away from speakers and take quiet breaks when you can. Venues and sound systems vary, so there is no universal safe seat. Move away from loud sound if your ears feel uncomfortable.",
          "盡量遠離音箱，並在合適的時候去安靜處休息。場地和擴音方式不同，沒有一個通用的「安全座位」；耳朵不舒服時，先離開強聲位置。",
        ),
      },
      {
        question: t(
          "戴了耳塞，就能一直待在音箱旁吗？",
          "Can I stay beside a speaker all night if I wear earplugs?",
          "戴了耳塞，就能一直待在音箱旁嗎？",
        ),
        answer: t(
          "不能这样保证。耳塞是否合适、有没有戴好，以及听了多久都会影响保护效果。耳塞、距离和休息要一起考虑，不能只靠其中一项。",
          "No. Protection depends on the earplugs, fit and how long you stay. Combine hearing protection with distance and quiet breaks rather than relying on one measure alone.",
          "不能這樣保證。耳塞是否合適、有沒有戴好，以及聽了多久都會影響保護效果。耳塞、距離和休息要一起考慮，不能只靠其中一項。",
        ),
      },
    ],
    relatedSoundIds: ["sports", "cinema"],
    relatedPageIds: ["noise-health"],
    extraSources: ["nidcd"],
  },
  {
    soundIds: ["fireworks"],
    perception: t(
      "烟花属于强烈、短促的冲击声参考。瞬间声响与整段平均声级是不同指标，查看时要分开。",
      "Fireworks illustrate intense, brief impulse sounds. A momentary event and a whole-period average are different measures and need separate interpretation.",
      "煙花屬於強烈、短促的衝擊聲參考。瞬間聲響與整段平均聲級是不同指標，檢視時要分開。",
    ),
    topic: t("烟花表演声", "Fireworks shows", "煙火表演聲"),
    answer: t(
      "NIDCD 的烟花表演示例为 140–160 dBA。这是短促强声的参考，不能当成整场表演的持续平均值，也不能外推到所有烟花、爆竹或任意观众距离。",
      "NIDCD gives 140–160 dBA for a fireworks show. This brief, intense sound reference is not a continuous average for the whole show, nor a level for all fireworks, firecrackers or spectator distances.",
      "NIDCD 的煙花表演示例為 140–160 dBA。這是短促強聲的參考，不能當成整場表演的持續平均值，也不能外推到所有煙花、鞭炮或任意觀眾距離。",
    ),
    questions: [
      {
        question: t(
          "看烟花离远一点，真的有帮助吗？",
          "Does watching fireworks from farther away help?",
          "看煙花離遠一點，真的有幫助嗎？",
        ),
        answer: t(
          "有帮助。不要靠近燃放点，也不要越过现场划定的区域；还应按现场安排做好听力防护。距离有帮助，但不能只凭距离保证不会伤耳。",
          "Yes. Stay away from the firing area, keep behind the event’s boundaries and follow its hearing-protection advice. Distance helps, but it cannot guarantee protection on its own.",
          "有幫助。不要靠近施放點，也不要越過現場劃定的區域；還應按現場安排做好聽力防護。距離有幫助，但不能只憑距離保證不會傷耳。",
        ),
      },
      {
        question: t(
          "为什么手机没录到最响的那一下？",
          "Why did my phone miss the loudest bang?",
          "為什麼手機沒錄到最響的那一下？",
        ),
        answer: t(
          "烟花声很短，手机麦克风和声音处理可能跟不上或超出能力范围。没显示出很高的数字，不代表现场就不响；手机网页不适合测这种瞬间强声的峰值。",
          "The burst is brief, and the microphone or processing may miss it or reach its limits. A modest reading does not prove the sound was quiet. A phone webpage is not suitable for measuring these intense peaks.",
          "煙花聲很短，手機麥克風和聲音處理可能跟不上或超出能力範圍。沒顯示出很高的數字，不代表現場就不響；手機網頁不適合測這種瞬間強聲的峰值。",
        ),
      },
    ],
    relatedSoundIds: ["thunder", "horn"],
    relatedPageIds: ["noise-health", "phone-accuracy"],
  },
];
