import { localize } from "../i18n/text.ts";
import type { Metadata } from "next";
import { contents, canonicalHref, pageById } from "../routing/pages.ts";
import { siteForLocale } from "../routing/sites.ts";
import { text } from "../content/types.ts";
import type { Locale } from "../../features/sound-meter/types.ts";
import { locales, localeSettings } from "../i18n/locales.ts";

export function pageMetadata(id: string, locale: Locale): Metadata {
  const page = pageById(id);
  const separator = page.kind === "home" ? " | " : " - ";
  const site = siteForLocale(locale);
  const title = `${text(page.title, locale)}${separator}${localize(locale, "分贝测试", "SoundMeterGo", "分貝測試")}`;
  const description = text(page.description, locale);
  const url = canonicalHref(id, locale);
  return {
    metadataBase: new URL(site.origin),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((language) => [language, canonicalHref(id, language)])),
        "x-default": canonicalHref(id, "en"),
      },
    },
    robots: { index: page.index, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: locale === "en" ? "SoundMeterGo" : site.brand,
      locale: localeSettings[locale].openGraph,
    },
    icons: { icon: "/favicon.svg" },
  };
}

export function breadcrumbData(id: string, locale: Locale) {
  const page = pageById(id);
  const items = [
    { name: localize(locale, "首页", "Home", "首頁"), item: canonicalHref("meter", locale) },
  ];
  const content = contents.find((item) => item.id === id);
  if (content && content.kind !== "trust")
    items.push({
      name: localize(locale, "知识与帮助", "Knowledge & help", "知識與幫助"),
      item: canonicalHref("knowledge", locale),
    });
  if (page.parentId)
    items.push({
      name: text(pageById(page.parentId).title, locale),
      item: canonicalHref(page.parentId, locale),
    });
  items.push({ name: text(page.title, locale), item: canonicalHref(id, locale) });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, ...item })),
  };
}
