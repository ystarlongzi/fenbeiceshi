import { translations as t } from "../types.ts";
import type { SoundDetailDefinition } from "./types.ts";

export const quietDetails: SoundDetailDefinition[] = [
  {
    soundIds: ["breathing"],
    perception: t(
      "非常轻的声音，可以用正常呼吸来理解。需要很安静的背景，才容易注意到这一级别的声音。",
      "A very faint sound, illustrated by normal breathing. You need a very quiet background to notice sounds at this level.",
      "非常輕的聲音，可以用正常呼吸來理解。需要很安靜的背景，才容易注意到這個等級的聲音。",
    ),
    topic: t("呼吸声与极轻背景声", "Breathing and very quiet backgrounds", "呼吸聲與極輕背景聲"),
    answer: t(
      "WHO 把正常呼吸列为约 10 dB 的声音示例。它帮助理解很轻的声音，不代表所有呼吸、所有房间或手机都能测到这个值。",
      "WHO lists normal breathing as an example at about 10 dB. This illustrates a very faint sound; it is not a fixed level for every breath or room, or a promise that a phone can measure it.",
      "WHO 把正常呼吸列為約 10 dB 的聲音示例。它幫助理解很輕的聲音，不代表所有呼吸、所有房間或手機都能測到這個值。",
    ),
    questions: [
      {
        question: t("10 分贝能听见吗？", "Can you hear 10 dB?", "10 分貝能聽見嗎？"),
        answer: t(
          "在很安静的地方，有些很轻的声音才容易被注意到，比如近处的呼吸声。周围一旦有风扇、车声或说话声，它们就容易被盖住。",
          "Very faint sounds, such as breathing nearby, are easier to notice in a very quiet place. A fan, traffic or conversation can easily cover them up.",
          "在很安靜的地方，有些很輕的聲音才容易被注意到，比如近處的呼吸聲。周圍一旦有風扇、車聲或說話聲，它們就容易被蓋過。",
        ),
      },
      {
        question: t(
          "手机显示 10 分贝，房间就真的这么安静吗？",
          "Does 10 dB on my phone mean the room is that quiet?",
          "手機顯示 10 分貝，房間就真的這麼安靜嗎？",
        ),
        answer: t(
          "不一定。很安静时，手机自身的麦克风噪声也会影响结果。先确认麦克风正在收音；要测清这样低的声音，需要适合低声级测量的设备。",
          "Not necessarily. In a very quiet room, the microphone’s own noise can affect the reading. Check that it is picking up sound; measuring such low levels accurately needs suitable equipment.",
          "不一定。很安靜時，手機本身的麥克風雜訊也會影響結果。先確認麥克風正在收音；要測清這樣低的聲音，需要適合低聲級量測的裝置。",
        ),
      },
    ],
    relatedSoundIds: ["leaves", "whisper"],
    relatedPageIds: ["phone-accuracy", "dbfs-spl"],
  },
  {
    soundIds: ["leaves"],
    perception: t(
      "细小的自然背景声，可以用树叶沙沙声建立印象。风况和观察位置变化，听到的声音也会变化。",
      "Think of a faint natural background, such as rustling leaves. Wind and observation position change what you hear.",
      "細小的自然背景聲，可以用樹葉沙沙聲建立印象。風況和觀察位置變化，聽到的聲音也會變化。",
    ),
    topic: t(
      "树叶声与安静户外环境",
      "Rustling leaves and quiet outdoor settings",
      "樹葉聲與安靜戶外環境",
    ),
    answer: t(
      "NPS 把峡谷地国家公园的树叶沙沙声列为 20 dBA 的示例。这是带地点条件的自然声音参考，原文单位是 dBA，并非所有树叶声的固定值。",
      "NPS gives rustling leaves in Canyonlands National Park as a 20 dBA example. This is a location-specific reference in dBA, not a fixed rating for all rustling leaves.",
      "NPS 把峽谷地國家公園的樹葉沙沙聲列為 20 dBA 的示例。這是帶地點條件的自然聲音參考，原文單位是 dBA，並非所有樹葉聲的固定值。",
    ),
    questions: [
      {
        question: t(
          "树叶声真的只有 20 分贝吗？",
          "Are rustling leaves always 20 dB?",
          "樹葉聲真的只有 20 分貝嗎？",
        ),
        answer: t(
          "不是。这是国家公园资料中的一个例子，原单位是 dBA。风大风小、树叶多少、站得远近，都可能让听到的声音不同。",
          "No. This is one national park example, originally reported in dBA. Wind, foliage and where you stand all change what you hear.",
          "不是。這是國家公園資料中的一個例子，原單位是 dBA。風大風小、樹葉多少、站得遠近，都可能讓聽到的聲音不同。",
        ),
      },
      {
        question: t(
          "户外明明很安静，手机为什么还显示很高？",
          "Why is my phone reading high when it seems quiet outside?",
          "戶外明明很安靜，手機為什麼還顯示很高？",
        ),
        answer: t(
          "先留意有没有风直吹麦克风。风吹到麦克风上会产生额外的声音，附近的脚步、鸟叫和车声也可能被一起收进去。",
          "Check for wind hitting the microphone. It can create extra noise, and the phone may also pick up footsteps, birds or distant traffic.",
          "先留意有沒有風直吹麥克風。風吹到麥克風上會產生額外的聲音，附近的腳步、鳥叫和車聲也可能被一起收進去。",
        ),
      },
    ],
    relatedSoundIds: ["breathing", "whisper"],
    relatedPageIds: ["guide", "dbfs-spl"],
    extraSources: ["ccohs"],
  },
  {
    soundIds: ["whisper"],
    perception: t(
      "接近轻声耳语的量级。它是某个声源的参考，不能直接代表整间房间都同样安静。",
      "A level illustrated by soft whispering. It describes a particular sound, rather than how quiet an entire room is.",
      "接近輕聲耳語的量級。它是某個聲源的參考，不能直接代表整間房間都同樣安靜。",
    ),
    topic: t("轻声耳语与安静房间", "Whispers and quiet rooms", "輕聲耳語與安靜房間"),
    answer: t(
      "WHO 把轻声耳语列为约 30 dB。耳语靠近耳边、隔着一段距离或处在不同背景中，并不会始终对应同一个读数。",
      "WHO lists soft whispering at about 30 dB. A whisper beside an ear, across a room or against a different background will not always produce the same reading.",
      "WHO 把輕聲耳語列為約 30 dB。耳語靠近耳邊、隔著一段距離或處在不同背景中，並不會始終對應同一個讀數。",
    ),
    questions: [
      {
        question: t(
          "30 分贝适合睡觉吗？",
          "Is 30 dB quiet enough for sleep?",
          "30 分貝適合睡覺嗎？",
        ),
        answer: t(
          "这是比较轻的声音，但能不能睡好不只看数字。声音是否突然出现、有没有嗡嗡声，以及你对声音有多敏感，都会影响感受。",
          "It is a fairly quiet level, but sleep is about more than a number. Sudden sounds, a persistent hum and your own sensitivity can all make a difference.",
          "這是比較輕的聲音，但能不能睡好不只看數字。聲音是否突然出現、有沒有嗡嗡聲，以及你對聲音有多敏感，都會影響感受。",
        ),
      },
      {
        question: t(
          "轻声说话就一定是 30 分贝吗？",
          "Is whispering always 30 dB?",
          "輕聲說話就一定是 30 分貝嗎？",
        ),
        answer: t(
          "不一定。贴近耳边说话和隔着一段距离说话，听起来会差很多。30 分贝只是一个帮助理解轻声耳语的例子。",
          "No. A whisper beside your ear can sound very different from one across the room. The 30 dB figure is simply an example of soft whispering.",
          "不一定。貼近耳邊說話和隔著一段距離說話，聽起來會差很多。30 分貝只是一個幫助理解輕聲耳語的例子。",
        ),
      },
    ],
    relatedSoundIds: ["leaves", "library"],
    relatedPageIds: ["guide", "phone-accuracy"],
    extraSources: ["ccohs"],
  },
  {
    soundIds: ["library", "fridge"],
    perception: t(
      "图书馆和冰箱运转都可以帮助理解这个量级。一个是环境背景，一个是电器声音，听感仍与距离和周围声音有关。",
      "A library and a humming refrigerator both help illustrate this level. One is a setting and the other an appliance; distance and background still matter.",
      "圖書館和冰箱運轉都可以幫助理解這個量級。一個是環境背景，一個是電器聲音，聽感仍與距離和周圍聲音有關。",
    ),
    topic: t("图书馆与冰箱运转声", "Libraries and refrigerator hum", "圖書館與冰箱運轉聲"),
    answer: t(
      "WHO 的图书馆示例和 CDC 的冰箱运转示例都约为 40 dB。它们说明一种较轻的声音量级，不表示两种声音的音色、持续方式或干扰感相同。",
      "WHO's library example and CDC's refrigerator example are both around 40 dB. They illustrate a relatively quiet level, without implying the same tone, timing or degree of disturbance.",
      "WHO 的圖書館示例和 CDC 的冰箱運轉示例都約為 40 dB。它們說明一種較輕的聲音量級，不表示兩種聲音的音色、持續方式或干擾感相同。",
    ),
    questions: [
      {
        question: t(
          "卧室 40 分贝会不会吵？",
          "Is 40 dB too noisy for a bedroom?",
          "臥室 40 分貝會不會吵？",
        ),
        answer: t(
          "白天可能不太明显，夜深人静时却可能让人在意。尤其是冰箱启停、滴答声或突然的声响；是否影响睡觉，还得看声音本身和你的感受。",
          "It may blend into the daytime background but stand out at night. Fridge cycles, ticking or sudden sounds can be especially noticeable. Whether it disturbs sleep depends on the sound and on you.",
          "白天可能不太明顯，夜深人靜時卻可能讓人在意。尤其是冰箱啟停、滴答聲或突然的聲響；是否影響睡覺，還得看聲音本身和你的感受。",
        ),
      },
      {
        question: t(
          "冰箱标着 40 分贝，为什么家里听着还是响？",
          "Why does a fridge rated at 40 dB still sound loud at home?",
          "冰箱標著 40 分貝，為什麼家裡聽著還是響？",
        ),
        answer: t(
          "家里的距离、墙面和摆放位置，可能和产品测试时不同；压缩机启动时也会更明显。先看标签说明是在什么条件下测的，再在同一位置比较运行和停机时的声音。",
          "Your distance, the walls and where the fridge stands may differ from the product test. Compressor starts can also stand out. Check the label’s test conditions and compare running and idle periods from the same spot.",
          "家裡的距離、牆面和擺放位置，可能和產品測試時不同；壓縮機啟動時也會更明顯。先看標籤說明是在什麼條件下測的，再在同一位置比較運轉和停機時的聲音。",
        ),
      },
    ],
    relatedSoundIds: ["home", "whisper"],
    relatedPageIds: ["guide", "phone-accuracy"],
    extraSources: ["ccohs"],
  },
];
