import { isAdditionalLocale, type AdditionalLocale } from "./additional-locales.ts";
import type { Locale } from "./locales.ts";

export type Messages = Readonly<Record<string, string>>;
const catalogs = new Map<AdditionalLocale, Messages>();
const copies = new WeakMap<object, Map<Locale, unknown>>();

// 缓存只以语言为键保存固定词典，不保存请求语言、用户输入或浏览器数据。
export function registerMessages(locale: AdditionalLocale, messages: Messages) {
  const existing = catalogs.get(locale);
  for (const [source, translated] of Object.entries(messages)) {
    if (!source || typeof translated !== "string" || !translated.trim())
      throw new Error(`翻译内容为空：${locale}`);
    if (existing && Object.hasOwn(existing, source) && existing[source] !== translated)
      throw new Error(`翻译内容冲突：${locale} → ${source.slice(0, 80)}`);
  }
  catalogs.set(locale, Object.freeze({ ...existing, ...messages }));
}

export function translateEnglish(locale: Locale, source: string): string {
  if (!isAdditionalLocale(locale)) return source;
  const catalog = catalogs.get(locale);
  const translated = catalog && Object.hasOwn(catalog, source) ? catalog[source] : undefined;
  if (translated === undefined)
    throw new Error(`缺少已发布语言的翻译：${locale} → ${source.slice(0, 100)}`);
  return translated;
}

export function localizeCopy<T>(locale: Locale, source: T): T {
  if (typeof source === "string") return translateEnglish(locale, source) as T;
  if (!source || typeof source !== "object") return source;
  const cache = copies.get(source) ?? new Map<Locale, unknown>();
  if (cache.has(locale)) return cache.get(locale) as T;
  const result = Array.isArray(source)
    ? source.map((value) => localizeCopy(locale, value))
    : Object.fromEntries(
        Object.entries(source).map(([key, value]) => [key, localizeCopy(locale, value)]),
      );
  cache.set(locale, Object.freeze(result));
  copies.set(source, cache);
  return result as T;
}
