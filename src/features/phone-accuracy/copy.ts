export const accuracyLinks = [
  {
    section: "purpose",
    pageId: "guide",
    hash: "start",
    label: { zh: "查看手机测噪音的操作步骤", zhTW: "查看手機測噪音的操作步驟" },
  },
  {
    section: "reference",
    pageId: "calibration",
    hash: "steps",
    label: { zh: "了解读数修正怎么用", zhTW: "瞭解讀數修正怎麼用" },
  },
  {
    section: "choose",
    pageId: "when-professional-meter",
    hash: "choose",
    label: { zh: "按用途选择声级计或专业检测", zhTW: "按用途選擇噪音計或專業檢測" },
  },
] as const;

export const accuracyAction = {
  title: { zh: "按同样的条件，再观察一次", zhTW: "按同樣的條件，再觀察一次" },
  description: {
    zh: "先固定设备、位置和输入设置，再比较声音变化。",
    zhTW: "先固定裝置、位置和輸入設定，再比較聲音變化。",
  },
  label: { zh: "开始测量", zhTW: "開始測量" },
} as const;
