import { languageHref, locales, localeSettings, type Locale } from "./locales.ts";
import { siteForLocale } from "../routing/sites.ts";

export const LANGUAGE_KEY = "fenbeiceshi:language:v1";
export const LANGUAGE_ONCE_PARAM = "language";
const LANGUAGE_EVENT = "fenbeiceshi:language-preference";

export function browserLanguage(
  languages: readonly string[],
  supported: readonly Locale[] = locales,
): Locale {
  for (const language of languages) {
    const parts = language.trim().toLowerCase().replaceAll("_", "-").split("-");
    if (parts[0] === "en" && supported.includes("en")) return "en";
    if (parts[0] !== "zh") continue;
    const target = parts.includes("hans")
      ? "zh-CN"
      : parts.includes("hant") || parts.some((part) => ["tw", "hk", "mo"].includes(part))
        ? "zh-TW"
        : "zh-CN";
    if (supported.includes(target)) return target;
  }
  return supported[0] ?? "zh-CN";
}

export function setLanguagePreference(locale: Locale): Error | null {
  if (!locales.includes(locale)) throw new RangeError("无效的语言偏好。");
  let error: Error | null = null;
  try {
    window.localStorage.setItem(LANGUAGE_KEY, locale);
    document.documentElement.dataset.languagePersistence = "available";
  } catch (cause) {
    document.documentElement.dataset.languagePersistence = "unavailable";
    error = new Error("当前语言可继续使用，但浏览器未能保存偏好。", { cause });
  }
  window.dispatchEvent(new Event(LANGUAGE_EVENT));
  return error;
}

export function getLanguagePersistenceError() {
  return document.documentElement.dataset.languagePersistence === "unavailable";
}

export function getServerLanguagePersistenceError() {
  return false;
}

export function subscribeLanguagePreference(listener: () => void) {
  window.addEventListener(LANGUAGE_EVENT, listener);
  return () => window.removeEventListener(LANGUAGE_EVENT, listener);
}

export function languageSelectionHref(
  location: Pick<Location, "pathname" | "search" | "hash">,
  target: Locale,
  available: readonly string[],
  persistent: boolean,
  current: Locale,
) {
  const params = new URLSearchParams(location.search);
  params.delete(LANGUAGE_ONCE_PARAM);
  // 跨域时把手动选择交给目标域保存；存储被禁用时也用此参数避免自动选择覆盖。
  if (!persistent || siteForLocale(current).origin !== siteForLocale(target).origin)
    params.set(LANGUAGE_ONCE_PARAM, target);
  const query = params.toString();
  return `${languageHref(location.pathname, target, available, current)}${query ? `?${query}` : ""}${location.hash}`;
}

export function languageBootstrap(locale: Locale, available: readonly string[]) {
  const encode = (value: unknown) => JSON.stringify(value).replaceAll("<", "\\u003c");
  return `(() => {
    const root = document.documentElement;
    const current = ${encode(locale)};
    const languages = ${encode(siteForLocale(locale).locales)};
    const paths = ${encode(available)};
    const prefixes = ${encode(Object.fromEntries(locales.map((language) => [language, localeSettings[language].prefix])))};
    const detect = ${browserLanguage.toString()};
    let saved = null;
    try {
      saved = window.localStorage.getItem(${encode(LANGUAGE_KEY)});
      root.dataset.languagePersistence = "available";
    } catch {
      root.dataset.languagePersistence = "unavailable";
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get(${encode(LANGUAGE_ONCE_PARAM)}) === current) {
      try {
        window.localStorage.setItem(${encode(LANGUAGE_KEY)}, current);
      } catch {
        root.dataset.languagePersistence = "unavailable";
      }
      return;
    }
    if (languages.length === 1 || current !== "zh-CN") return;
    const pathname = window.location.pathname;
    const path = pathname.endsWith("/") ? pathname : pathname + "/";
    if (!paths.includes(path)) return;
    const requested = navigator.languages && navigator.languages.length
      ? navigator.languages : [navigator.language || ""];
    const target = languages.includes(saved) ? saved : detect(requested, languages);
    if (target === current) return;
    const destination = prefixes[target] + path;
    params.delete(${encode(LANGUAGE_ONCE_PARAM)});
    const query = params.toString();
    window.location.replace(destination + (query ? "?" + query : "") + window.location.hash);
  })();`;
}
