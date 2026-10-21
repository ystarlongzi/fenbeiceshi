import { articles } from "../content/articles.ts";
import { guides } from "../content/guides.ts";
import { faq } from "../content/faq.ts";
import { howItWorks } from "../content/how-it-works.ts";
import { dual, text, type Dual } from "../content/types.ts";
import type { Locale } from "../../features/sound-meter/types.ts";

export const SITE_URL = "https://fenbeiceshi.com";
export const contents = [...guides, howItWorks, faq, ...articles];
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
      "使用麦克风查看估算噪音分贝，切换指针、数显与条形，进入全屏并保存本机摘要。默认通用估算，参考校准可选，设备差异会影响结果。",
      "View estimated noise levels, switch between dial, digital and bar displays, use fullscreen and save local summaries. Generic estimates by default, with optional reference calibration and device-dependent results.",
    ),
    index: true,
  },
  {
    id: "knowledge",
    slug: "knowledge",
    kind: "knowledge",
    title: dual("分贝知识与使用帮助", "Decibel guides and help"),
    description: dual(
      "了解网页怎么测分贝、读数准不准，查询常见声音，找到测量方法与使用问题的答案。",
      "Learn how browser readings work, check accuracy, look up everyday sounds and find practical measurement help.",
    ),
    index: true,
  },
  {
    id: "records",
    slug: "records",
    kind: "records",
    title: dual("我的测量记录", "My measurement records"),
    description: dual(
      "查看、导出、删除与比较保存在当前浏览器的测量结果。",
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
