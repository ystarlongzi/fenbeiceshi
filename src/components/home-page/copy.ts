import type { IconName } from "../icon";
import type { Locale } from "@/lib/i18n/locales";

export function homeInstructions(locale: Locale) {
  const en = locale === "en";
  const scenes: {
    title: string;
    steps: [string, string];
    icon: IconName;
  }[] =
    locale === "zh-TW"
      ? [
          {
            title: "看看房間有多吵",
            steps: [
              "固定裝置和位置，測一段時間並儲存結果。",
              "在原處換個時段複測，備註門窗狀態與背景聲音後比較。",
            ],
            icon: "house",
          },
          {
            title: "比較一件家電的變化",
            steps: [
              "保持裝置、距離和設定不變，先測家電關閉時的聲音。",
              "開啟家電後測量相近時長，記錄檔位，再比較兩次結果。",
            ],
            icon: "audio-lines",
          },
          {
            title: "看看關窗前後的不同",
            steps: [
              "保持裝置與位置不變，先測開窗時的聲音並儲存。",
              "關窗後測量相近時長，再比較；同時記下車流等外部聲音的變化。",
            ],
            icon: "sliders-horizontal",
          },
        ]
      : en
        ? [
            {
              title: "Check your room's noise",
              steps: [
                "Keep the device in one place. Measure for a while, then save the result.",
                "Repeat there at another time. Note windows and background sounds before comparing.",
              ],
              icon: "house",
            },
            {
              title: "Compare an appliance",
              steps: [
                "Keep the device, distance and settings fixed. Measure with the appliance off.",
                "Switch it on and measure for a similar duration. Note its setting and compare the results.",
              ],
              icon: "audio-lines",
            },
            {
              title: "Compare open and closed windows",
              steps: [
                "Keep the device and position fixed. Measure with the window open and save the result.",
                "Close it and measure for a similar duration. Compare the results and note changes in outside sounds.",
              ],
              icon: "sliders-horizontal",
            },
          ]
        : [
            {
              title: "看看房间有多吵",
              steps: [
                "固定设备和位置，测一段时间并保存结果。",
                "在原处换个时段复测，备注门窗状态与背景声音后比较。",
              ],
              icon: "house",
            },
            {
              title: "比较一件家电的变化",
              steps: [
                "保持设备、距离和设置不变，先测家电关闭时的声音。",
                "开启家电后测量相近时长，记录档位，再比较两次结果。",
              ],
              icon: "audio-lines",
            },
            {
              title: "看看关窗前后的不同",
              steps: [
                "保持设备与位置不变，先测开窗时的声音并保存。",
                "关窗后测量相近时长，再比较；同时记下车流等外部声音的变化。",
              ],
              icon: "sliders-horizontal",
            },
          ];
  const steps =
    locale === "zh-TW"
      ? [
          { title: "開啟麥克風", body: "點選開始，並允許存取當前麥克風。" },
          { title: "觀察聲音變化", body: "檢視估算讀數，保持裝置、位置和輸入設定穩定。" },
          { title: "把條件一起記下", body: "結束後儲存本機摘要，在相同條件下再次觀察。" },
        ]
      : en
        ? [
            {
              title: "Start with your microphone",
              body: "Start measuring and allow access to your microphone.",
            },
            {
              title: "Observe the change",
              body: "Check the mode and keep your device and position steady.",
            },
            {
              title: "Keep the context",
              body: "Finish, save a local summary, and repeat under matching conditions.",
            },
          ]
        : [
            { title: "打开麦克风", body: "点击开始，并允许访问当前麦克风。" },
            { title: "观察声音变化", body: "查看估算读数，保持设备、位置和输入设置稳定。" },
            { title: "把条件一起记下", body: "结束后保存本机摘要，在相同条件下再次观察。" },
          ];
  return { scenes, steps };
}
