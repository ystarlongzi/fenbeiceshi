import { translations as t, type LocalizedText } from "../types.ts";
import type { SoundReference } from "../sound-references.ts";

export const browserLimit = t(
  "正常。手机麦克风、摆放位置和周围的声音都会影响读数。本站显示的是估算分贝，更适合比较同一位置开关窗、开关设备前后的变化。需要准确测量时，请使用经过校准的声级计。",
  "That can happen. Your phone's microphone, its position and nearby sounds all affect the reading. This site's estimate is more useful for comparing changes, such as opening a window or turning an appliance off, from the same spot. For accurate measurements, use a calibrated sound level meter.",
  "正常。手機麥克風、擺放位置和周圍的聲音都會影響讀數。本站顯示的是估算分貝，更適合比較同一位置開關窗、開關裝置前後的變化。需要準確量測時，請使用經過校正的聲級計。",
);

export function hearingGuidance(sounds: SoundReference[]): LocalizedText[] {
  const { min, max } = sounds[0];
  if (max <= 70)
    return [
      t(
        "如果声音确实这么轻，一般不容易伤害听力。但夜里持续的嗡嗡声或突然的声响，仍可能打扰休息。",
        "If the sound really is this quiet, hearing damage is generally unlikely. A steady hum or sudden sound at night can still disturb your rest.",
        "如果聲音確實這麼輕，一般不容易傷害聽力。但夜裡持續的嗡嗡聲或突然的聲響，仍可能打擾休息。",
      ),
      t(
        "如果觉得吵，先找出是哪种声音，再试着关窗、调低音量或换个位置。手机读数只作估算，不能只凭一个数字判断房间是否适合睡觉。",
        "If it bothers you, find the source and try closing a window, lowering its volume or moving. A phone estimate alone cannot tell you whether a room suits you for sleep.",
        "如果覺得吵，先找出是哪種聲音，再試著關窗、調低音量或換個位置。手機讀數只作估算，不能只憑一個數字判斷房間是否適合睡覺。",
      ),
    ];
  const answer =
    max < 85
      ? t(
          "是否伤耳，还要看听多久、是否经常听到。短暂经过和每天连续听好几个小时，情况不同；也不要只凭一次读数判断。",
          "It depends on how long and how often you hear it. A brief sound and hours of daily exposure are different, and one reading cannot tell the whole story.",
          "是否傷耳，還要看聽多久、是否經常聽到。短暫經過和每天連續聽好幾個小時，情況不同；也不要只憑一次讀數判斷。",
        )
      : sounds.some((sound) => sound.id === "fireworks")
        ? t(
            "有可能。烟花这类强烈的突发声，即使只响很短时间，也可能损伤听力，不必等到听着疼才避开。",
            "Yes. Intense bursts such as fireworks can damage hearing even when they are brief. Do not wait for pain before moving away.",
            "有可能。煙花這類強烈的突發聲，即使只響很短時間，也可能損傷聽力，不必等到聽著痛才避開。",
          )
        : min < 85
          ? t(
              "这个范围里，较高的声级尤其值得留意。长时间或反复接触较响的声音，可能损伤听力；不能把范围的低端和高端当成同一种情况。",
              "The louder end of this range deserves particular care. Long or repeated exposure to loud sound can damage hearing; the lower and upper ends are different situations.",
              "這個範圍裡，較高的聲級尤其值得留意。長時間或反覆接觸較響的聲音，可能損傷聽力；不能把範圍的低端和高端當成同一種情況。",
            )
          : t(
              "有可能，尤其是长时间或反复接触时。声音越响，越可能在更短时间内伤害听力，所以应先降低音量、离远一些，或缩短停留时间。",
              "Yes, especially with long or repeated exposure. Louder sound can damage hearing sooner, so lower the volume, move farther away or spend less time nearby.",
              "有可能，尤其是長時間或反覆接觸時。聲音越響，越可能在更短時間內傷害聽力，所以應先降低音量、離遠一些，或縮短停留時間。",
            );
  const action = sounds.some((sound) => sound.id === "headphones")
    ? t(
        "戴耳机时先调低音量，隔一段时间让耳朵休息；在球场等嘈杂场所，尽量远离音箱，需要时使用合适的耳塞或耳罩。这里的数字不能换成每个人都安全的收听时长。",
        "Turn headphones down and give your ears regular quiet breaks. At noisy events, stay away from speakers and use suitable earplugs or earmuffs when needed. These numbers cannot promise a safe listening time for everyone.",
        "戴耳機時先調低音量，隔一段時間讓耳朵休息；在球場等嘈雜場所，盡量遠離音箱，需要時使用合適的耳塞或耳罩。這裡的數字不能換成每個人都安全的聆聽時長。",
      )
    : t(
        "如果需要提高嗓门才能和身边的人说话，或耳朵觉得不舒服，先去安静一些的地方。无法避开强声时，使用合适的耳塞或耳罩；不要为了核对数字而靠近声源。",
        "If you need to raise your voice to speak to someone nearby, or your ears feel uncomfortable, move somewhere quieter. Use suitable earplugs or earmuffs when loud sound cannot be avoided, and do not move closer just to check a number.",
        "如果需要提高嗓門才能和身邊的人說話，或耳朵覺得不舒服，先去安靜一些的地方。無法避開強聲時，使用合適的耳塞或耳罩；不要為了核對數字而靠近聲源。",
      );
  return [answer, action];
}
