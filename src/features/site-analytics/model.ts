export const ANALYTICS_HOSTS = ["fenbeiceshi.com", "soundmetergo.com"] as const;
export const ANALYTICS_CONSENT_KEY = "fenbeiceshi:analytics-consent:v1";
export type AnalyticsConsent = "granted" | "denied" | null;

export function measurementId(value: string | undefined): string | null {
  if (!value) return null;
  if (!/^G-[A-Z0-9]{6,20}$/.test(value))
    throw new Error("NEXT_PUBLIC_GA_MEASUREMENT_ID 必须是有效的 G- 衡量 ID。");
  return value;
}

export function parseConsent(value: string | null): AnalyticsConsent {
  return value === "granted" || value === "denied" ? value : null;
}

// 统计只接受正式域名；查询、锚点及未知地址不进入事件参数。
export function analyticsLocation(value: string): string | null {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.port ||
      !ANALYTICS_HOSTS.some((host) => host === url.hostname)
    )
      return null;
    return `${url.origin}${url.pathname}`;
  } catch {
    return null;
  }
}

export function analyticsReferrer(value: string): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return analyticsLocation(value) ?? url.origin;
  } catch {
    return "";
  }
}
