import { articles } from "../content/articles.ts";
import { guides } from "../content/guides.ts";
import { dual, text, type Dual } from "../content/types.ts";
import type { Locale } from "../../features/sound-meter/types.ts";

export const SITE_URL = "https://fenbeiceshi.com";
export const contents = [...guides, ...articles];
export interface SitePage {
  id: string;
  slug: string;
  kind: "home" | "knowledge" | "records" | "content";
  title: Dual;
  description: Dual;
  index: boolean;
}

export const sitePages: SitePage[] = [
  {
    id: "meter",
    slug: "",
    kind: "home",
    title: dual("在线分贝测试与噪音观察工具", "Online Decibel Meter & Noise Observation Tool"),
    description: dual(
      "使用麦克风观察声音变化，切换指针、数显与电平条，进入全屏并保存本机摘要。未校准显示相对 dBFS，参考校准后查看估算声级。",
      "Observe sound changes, switch between dial, digital and level displays, use fullscreen and save local summaries. Relative dBFS by default; estimates require a reference.",
    ),
    index: true,
  },
  {
    id: "knowledge",
    slug: "knowledge",
    kind: "knowledge",
    title: dual("声音知识与测量方法", "Sound Measurement Guides"),
    description: dual(
      "理解读数、参考校准与麦克风权限，按问题找到适合的声音观察方法。",
      "Understand sound readings, reference calibration and microphone permissions with practical guides.",
    ),
    index: true,
  },
  {
    id: "records",
    slug: "records",
    kind: "records",
    title: dual("本机观察记录", "Local Observation Records"),
    description: dual(
      "查看、导出、删除与比较当前浏览器保存的声音观察摘要。",
      "View, export, delete and compare observation summaries saved in this browser.",
    ),
    index: false,
  },
  ...contents.map((content): SitePage => ({
    id: content.id,
    slug: content.slug,
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
  return `${locale === "en" ? "/en" : ""}/${slug ? `${slug}/` : ""}`;
}

export function pageTitle(id: string, locale: Locale) {
  return text(pageById(id).title, locale);
}
export function findPage(slug: string) {
  return sitePages.find((page) => page.slug === slug);
}
