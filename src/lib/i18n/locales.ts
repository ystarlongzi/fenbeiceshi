import { siteForLocale } from "../routing/sites.ts";

export const locales = ["zh-CN", "zh-TW", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeSettings = {
  "zh-CN": {
    prefix: "",
    label: "简体中文",
    openGraph: "zh_CN",
    date: "zh-CN",
  },
  "zh-TW": {
    prefix: "/zh-tw",
    label: "繁體中文",
    openGraph: "zh_TW",
    date: "zh-TW",
  },
  en: {
    prefix: "",
    label: "English",
    openGraph: "en_US",
    date: "en-GB",
  },
} as const satisfies Record<Locale, object>;

export function localePrefix(locale: Locale) {
  return localeSettings[locale].prefix;
}

export function languageHref(
  pathname: string,
  target: Locale,
  available: readonly string[],
  current: Locale,
) {
  const prefix = localePrefix(current);
  const hasPrefix = prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`));
  const base = (hasPrefix ? pathname.slice(prefix.length) : pathname) || "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  const origin = siteForLocale(target).origin;
  const path = `${localePrefix(target)}${normalized}`;
  const destination = available.includes(normalized) ? path : `${localePrefix(target)}/`;
  return siteForLocale(current).origin === origin ? destination : origin + destination;
}
