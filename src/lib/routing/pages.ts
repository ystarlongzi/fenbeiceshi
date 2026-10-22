import { articles } from "../content/articles.ts";
import { guides } from "../content/guides.ts";
import { faq } from "../content/faq.ts";
import { howItWorks } from "../content/how-it-works.ts";
import { translations, text, type LocalizedText } from "../content/types.ts";
import type { Locale } from "../../features/sound-meter/types.ts";
import { localePrefix } from "../i18n/locales.ts";

export const SITE_URL = "https://fenbeiceshi.com";
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
      "在线分贝测试与噪音观察工具",
      "Online Decibel Meter & Noise Observation Tool",
      "線上分貝測試與噪音觀察工具",
    ),
    description: translations(
      "使用麦克风查看估算噪音分贝，切换指针、数显与条形，进入全屏并保存本机摘要。默认通用估算，可选手动加减读数，设备差异会影响结果。",
      "View estimated noise levels, switch between dial, digital and bar displays, use fullscreen and save local summaries. Generic estimates by default, with optional manual adjustment and device-dependent results.",
      "使用麥克風檢視估算噪音分貝，切換指針、數字顯示與條形，進入全螢幕並儲存本機摘要。預設通用估算，可選手動加減讀數，裝置差異會影響結果。",
    ),
    index: true,
  },
  {
    id: "knowledge",
    slug: "knowledge",
    kind: "knowledge",
    title: translations(
      "知识与帮助：分贝读数与工具使用",
      "Knowledge & help: readings and the meter",
      "知識與幫助：分貝讀數與工具使用",
    ),
    description: translations(
      "查找使用指南、工作原理与常见问题，排查麦克风，并了解分贝读数、常见声音与噪音健康知识。",
      "Find the user guide, how the meter works and common questions, fix microphone access, and learn about decibel readings, everyday sounds and the health effects of noise.",
      "查詢使用指南、工作原理與常見問題，排查麥克風，並瞭解分貝讀數、常見聲音與噪音健康知識。",
    ),
    index: true,
  },
  {
    id: "records",
    slug: "records",
    kind: "records",
    title: translations("我的测量记录", "My measurement records", "我的測量記錄"),
    description: translations(
      "查看、导出、删除与比较保存在当前浏览器的测量结果。",
      "View, export, delete and compare observation summaries saved in this browser.",
      "檢視、匯出、刪除與比較儲存在當前瀏覽器的測量結果。",
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
  const slug = pageById(id).slug;
  return `${localePrefix(locale)}/${slug ? `${slug}/` : ""}`;
}

export function pageTitle(id: string, locale: Locale) {
  return text(pageById(id).title, locale);
}
export function findPage(slug: string) {
  return sitePages.find((page) => page.slug === slug);
}
