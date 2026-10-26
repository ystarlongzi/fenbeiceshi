import type { Locale } from "../../lib/i18n/locales.ts";

export const languageFlags = {
  "zh-CN": "cn",
  "zh-TW": "tw",
  en: "gb",
  es: "es",
  de: "de",
  fr: "fr",
  "pt-BR": "br",
  ru: "ru",
  it: "it",
  ko: "kr",
  ja: "jp",
  no: "no",
  sv: "se",
  da: "dk",
  nl: "nl",
  fi: "fi",
  el: "gr",
  pl: "pl",
  tr: "tr",
  id: "id",
  vi: "vn",
  cs: "cz",
  hu: "hu",
  sk: "sk",
  th: "th",
  ro: "ro",
  ar: "sa",
} as const satisfies Record<Locale, string>;

export function languageFlagPath(locale: Locale) {
  return `/vendor/flag-icons/4x3/${languageFlags[locale]}.svg`;
}
