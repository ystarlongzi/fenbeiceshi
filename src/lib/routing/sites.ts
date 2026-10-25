import type { Locale } from "../i18n/locales.ts";

export const sites = {
  fenbeiceshi: {
    origin: "https://fenbeiceshi.com",
    domain: "fenbeiceshi.com",
    brand: "分贝测试",
    locales: ["zh-CN", "zh-TW"],
    primaryLocale: "zh-CN",
    output: "out",
  },
  soundmetergo: {
    origin: "https://soundmetergo.com",
    domain: "soundmetergo.com",
    brand: "SoundMeterGo",
    locales: ["en"],
    primaryLocale: "en",
    output: "out-soundmetergo",
  },
} as const;

export type SiteId = keyof typeof sites;
const target = process.env.NEXT_PUBLIC_SITE_TARGET ?? "fenbeiceshi";
if (target !== "fenbeiceshi" && target !== "soundmetergo") throw new Error("站点构建目标无效。");
export const siteId: SiteId = target;
export const activeSite = sites[siteId];
export const siteLocales: readonly Locale[] = activeSite.locales;

export function siteForLocale(locale: Locale) {
  return locale === "en" ? sites.soundmetergo : sites.fenbeiceshi;
}
