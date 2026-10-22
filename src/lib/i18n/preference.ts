import { languageHref, locales, localeSettings, type Locale } from "./locales.ts";

export const LANGUAGE_KEY = "fenbeiceshi:language:v1";
export const LANGUAGE_ONCE_PARAM = "language";
const LANGUAGE_EVENT = "fenbeiceshi:language-preference";

export function browserLanguage(languages: readonly string[]): Locale {
  for (const language of languages) {
    const parts = language.trim().toLowerCase().replaceAll("_", "-").split("-");
    if (parts[0] === "en") return "en";
    if (parts[0] !== "zh") continue;
    if (parts.includes("hans")) return "zh-CN";
    if (parts.includes("hant") || parts.some((part) => ["tw", "hk", "mo"].includes(part)))
      return "zh-TW";
    return "zh-CN";
  }
  return "zh-CN";
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
) {
  const params = new URLSearchParams(location.search);
  params.delete(LANGUAGE_ONCE_PARAM);
  // 存储被禁用时，将本次选择留在链接中，避免简体页面再次被自动识别覆盖。
  if (!persistent) params.set(LANGUAGE_ONCE_PARAM, target);
  const query = params.toString();
  return `${languageHref(location.pathname, target, available)}${query ? `?${query}` : ""}${location.hash}`;
}

export function languageBootstrap(locale: Locale, available: readonly string[]) {
  const encode = (value: unknown) => JSON.stringify(value).replaceAll("<", "\\u003c");
  return `(() => {
    const root = document.documentElement;
    const current = ${encode(locale)};
    const languages = ${encode(locales)};
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
      root.dataset.languagePersistence = "unavailable";
      return;
    }
    if (current !== "zh-CN") return;
    const pathname = window.location.pathname;
    const path = pathname.endsWith("/") ? pathname : pathname + "/";
    if (!paths.includes(path)) return;
    const requested = navigator.languages && navigator.languages.length
      ? navigator.languages : [navigator.language || ""];
    const target = languages.includes(saved) ? saved : detect(requested);
    if (target === current) return;
    const translated = prefixes[target] + path;
    const destination = paths.includes(translated) ? translated : prefixes[target] + "/";
    params.delete(${encode(LANGUAGE_ONCE_PARAM)});
    const query = params.toString();
    window.location.replace(destination + (query ? "?" + query : "") + window.location.hash);
  })();`;
}
