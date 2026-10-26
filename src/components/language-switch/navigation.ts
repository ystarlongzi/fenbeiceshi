import { locales } from "../../lib/i18n/locales.ts";

export const languageOptions = [
  ...locales.filter((locale) => locale !== "zh-CN" && locale !== "zh-TW"),
  "zh-CN",
  "zh-TW",
] as const;

export function linkedLanguageHref(destination: string, decoratedHref: string) {
  const url = new URL(destination);
  const decorated = new URL(decoratedHref);
  const linker = decorated.searchParams.get("_gl");
  if (url.origin === decorated.origin && url.pathname === decorated.pathname && linker)
    url.searchParams.set("_gl", linker);
  return url.href;
}

export function nextLanguageIndex(
  key: string,
  current: number,
  count: number,
  columns: number,
  rtl: boolean,
) {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  const horizontal = key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : 0;
  if (horizontal) return (current + horizontal * (rtl ? -1 : 1) + count) % count;
  if (key === "ArrowDown") return current + columns < count ? current + columns : current % columns;
  if (key === "ArrowUp")
    return current >= columns
      ? current - columns
      : current + Math.floor((count - 1 - current) / columns) * columns;
  return undefined;
}
