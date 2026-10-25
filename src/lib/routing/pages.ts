import { articles } from "../content/articles.ts";
import { guides } from "../content/guides.ts";
import { faq } from "../content/faq.ts";
import { howItWorks } from "../content/how-it-works.ts";
import { translations, text, type LocalizedText } from "../content/types.ts";
import type { Locale } from "../../features/sound-meter/types.ts";
import { localePrefix } from "../i18n/locales.ts";
import { activeSite, siteForLocale } from "./sites.ts";

export const SITE_URL = activeSite.origin;
export const contents = [...guides, howItWorks, faq, ...articles];
export interface SitePage {
  id: string;
  slug: string;
  parentId?: string;
  kind: "home" | "knowledge" | "records" | "content";
  title: LocalizedText;
  description: LocalizedText;
  index: boolean;
}

export const sitePages: SitePage[] = [
  {
    id: "meter",
    slug: "",
    kind: "home",
    title: translations(
      "免费在线分贝仪 - 手机噪音测试与实时 dB 测量",
      "Free Online Decibel Meter - Phone Noise Test & Live dB Readings",
      "免費線上分貝計 - 手機噪音測試與即時 dB 測量",
    ),
    description: translations(
      "免费在线分贝仪，手机或电脑打开网页就能测噪音，无需下载安装。实时显示估算分贝（dB）和噪音变化，看看房间、家电或周围环境有多吵，测完还能保存记录、导出报告。",
      "Free online decibel meter for your phone or computer. No download or installation. View estimated sound levels in dB and live noise changes, check rooms or appliances, and save readings or export a report.",
      "免費線上分貝計，手機或電腦開啟網頁就能測噪音，免下載安裝。即時顯示估算分貝（dB）和噪音變化，看看房間、家電或周圍環境有多吵，測完還能儲存記錄、匯出報告。",
    ),
    index: true,
  },
  {
    id: "knowledge",
    slug: "knowledge",
    kind: "knowledge",
    title: translations(
      "分贝知识与帮助：读数、用法和常见问题",
      "Decibel Meter Help and Noise Guides",
      "分貝知識與說明：讀數、用法和常見問題",
    ),
    description: translations(
      "分贝读数看不懂，或测量时遇到问题？这里整理了在线分贝仪使用方法、常见声音对照、麦克风排查、降噪与听力保护知识，也能找到噪音法规和工作场所标准，按你的问题查看相应说明。",
      "Need help with decibel readings or the online meter? Find setup guides, microphone fixes, everyday sound examples, noise reduction tips, hearing protection and noise rules.",
      "分貝讀數看不懂，或測量時遇到問題？這裡整理了線上分貝計使用方法、常見聲音對照、麥克風故障排除、降噪與聽力保護知識，也能找到噪音法規和工作場所標準，依你的問題查看相關說明。",
    ),
    index: true,
  },
  {
    id: "records",
    slug: "records",
    kind: "records",
    title: translations(
      "本机测量记录：查看与导出报告",
      "Saved Decibel Readings and Reports",
      "本機測量記錄：查看與匯出報告",
    ),
    description: translations(
      "查看保存在当前浏览器的分贝测试记录，回顾读数和备注，比较同条件下的声音变化。支持导出 CSV、Excel、PDF 报告，下载已保存的录音，也能删除不再需要的记录。",
      "Review decibel readings and notes saved in this browser, compare compatible results, and export CSV, Excel or PDF reports. Download saved audio or remove records you no longer need.",
      "查看儲存在目前瀏覽器的分貝測試記錄，回顧讀數和備註，比較相同條件下的聲音變化。支援匯出 CSV、Excel、PDF 報告，下載已儲存的錄音，也能刪除不再需要的記錄。",
    ),
    index: false,
  },
  ...contents.map((content): SitePage => ({
    id: content.id,
    slug: content.slug,
    parentId: content.parentId,
    kind: "content",
    title: content.title,
    description: content.description,
    index: true,
  })),
];

export function pageById(id: string): SitePage {
  const page = sitePages.find((item) => item.id === id);
  if (!page) throw new Error(`未注册页面：${id}`);
  return page;
}

export function href(id: string, locale: Locale): string {
  const path = pagePath(id, locale);
  return siteForLocale(locale).origin === SITE_URL ? path : siteForLocale(locale).origin + path;
}

export function pagePath(id: string, locale: Locale): string {
  const slug = pageById(id).slug;
  return `${localePrefix(locale)}/${slug ? `${slug}/` : ""}`;
}

export function canonicalHref(id: string, locale: Locale): string {
  return siteForLocale(locale).origin + pagePath(id, locale);
}

export function pageTitle(id: string, locale: Locale) {
  return text(pageById(id).title, locale);
}
export function findPage(slug: string) {
  return sitePages.find((page) => page.slug === slug);
}
