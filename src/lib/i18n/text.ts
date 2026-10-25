import type { Locale } from "./locales.ts";
import { translateEnglish } from "./messages.ts";

export interface LocalizedText {
  zh: string;
  en: string;
  zhTW: string;
}

export function localize(locale: Locale, zh: string, en: string, zhTW: string): string {
  if (locale === "zh-CN") return zh;
  if (locale === "zh-TW") return zhTW;
  return translateEnglish(locale, en);
}

export function formatLocalized(
  locale: Locale,
  zh: string,
  en: string,
  zhTW: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return localize(locale, zh, en, zhTW).replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (_, key: string) => {
    if (!Object.hasOwn(values, key)) throw new Error(`翻译参数缺失：${key}`);
    return String(values[key]);
  });
}

export const translations = (zh: string, en: string, zhTW: string): LocalizedText => ({
  zh,
  en,
  zhTW,
});
export const text = (value: LocalizedText, locale: Locale): string =>
  localize(locale, value.zh, value.en, value.zhTW);
