import { localize } from "../i18n/text.ts";
import type { Metadata } from "next";
import { href, pageById, SITE_URL } from "../routing/pages.ts";
import { text } from "../content/types.ts";
import type { Locale } from "../../features/sound-meter/types.ts";
import { locales, localeSettings } from "../i18n/locales.ts";

export function pageMetadata(id: string, locale: Locale): Metadata {
  const page = pageById(id);
  const title = `${text(page.title, locale)} - ${localize(locale, "分贝测试", "fenbeiceshi.com", "分貝測試")}`;
  const description = text(page.description, locale);
  const url = SITE_URL + href(id, locale);
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((language) => [language, SITE_URL + href(id, language)])),
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
      locale: localeSettings[locale].openGraph,
    },
    icons: { icon: "/favicon.svg" },
  };
}

export function breadcrumbData(id: string, locale: Locale) {
  const page = pageById(id);
  const items = [
    { name: localize(locale, "首页", "Home", "首頁"), item: SITE_URL + href("meter", locale) },
  ];
  if (page.slug.startsWith("knowledge/"))
    items.push({
      name: localize(locale, "声音知识", "Guides", "聲音知識"),
      item: SITE_URL + href("knowledge", locale),
    });
  if (page.parentId)
    items.push({
      name: text(pageById(page.parentId).title, locale),
      item: SITE_URL + href(page.parentId, locale),
    });
  items.push({ name: text(page.title, locale), item: SITE_URL + href(id, locale) });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, ...item })),
  };
}
