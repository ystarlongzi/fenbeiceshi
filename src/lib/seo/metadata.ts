import type { Metadata } from "next";
import { href, pageById, SITE_URL } from "../routing/pages.ts";
import { text } from "../content/types.ts";
import type { Locale } from "../../features/sound-meter/types.ts";

export function pageMetadata(id: string, locale: Locale): Metadata {
  const page = pageById(id);
  const title = `${text(page.title, locale)} - ${locale === "en" ? "fenbeiceshi.com" : "分贝测试"}`;
  const description = text(page.description, locale);
  const url = SITE_URL + href(id, locale);
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "zh-CN": SITE_URL + href(id, "zh-CN"),
        en: SITE_URL + href(id, "en"),
        "x-default": SITE_URL + href(id, "zh-CN"),
      },
    },
    robots: { index: page.index, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "fenbeiceshi.com",
      locale: locale === "en" ? "en_US" : "zh_CN",
    },
    icons: { icon: "/favicon.svg" },
  };
}

export function breadcrumbData(id: string, locale: Locale) {
  const page = pageById(id);
  const items = [
    { name: locale === "en" ? "Home" : "首页", item: SITE_URL + href("meter", locale) },
  ];
  if (page.slug.startsWith("knowledge/"))
    items.push({
      name: locale === "en" ? "Guides" : "声音知识",
      item: SITE_URL + href("knowledge", locale),
    });
  items.push({ name: text(page.title, locale), item: SITE_URL + href(id, locale) });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, ...item })),
  };
}
