import type { Locale } from "./locales.ts";

export interface LocalizedText {
  zh: string;
  en: string;
  zhTW: string;
}

export function localize(locale: Locale, zh: string, en: string, zhTW: string): string {
  return locale === "en" ? en : locale === "zh-TW" ? zhTW : zh;
}

export const translations = (zh: string, en: string, zhTW: string): LocalizedText => ({
  zh,
  en,
  zhTW,
});
export const text = (value: LocalizedText, locale: Locale): string =>
  localize(locale, value.zh, value.en, value.zhTW);
