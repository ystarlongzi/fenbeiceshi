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
    prefix: "/en",
    label: "English",
    openGraph: "en_US",
    date: "en-GB",
  },
} as const satisfies Record<Locale, object>;

export function localePrefix(locale: Locale) {
  return localeSettings[locale].prefix;
}

export function languageHref(pathname: string, target: Locale, available: readonly string[]) {
  const prefix = locales
    .map(localePrefix)
    .find((value) => value && (pathname === value || pathname.startsWith(`${value}/`)));
  const base = (prefix ? pathname.slice(prefix.length) : pathname) || "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  const path = `${localePrefix(target)}${normalized}`;
  return available.includes(path) ? path : `${localePrefix(target)}/`;
}
