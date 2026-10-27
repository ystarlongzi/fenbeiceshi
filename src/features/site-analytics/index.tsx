"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import { localize } from "@/lib/i18n/text";
import { Notice } from "@/components/notice";
import { analyticsEnabled } from "./model";
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
} from "./preference";
import { createAnalyticsRuntime } from "./runtime";
import styles from "./index.module.css";

export function SiteAnalytics({
  locale,
  id,
  privacyPath,
  showNotice,
}: {
  locale: Locale;
  id: string;
  privacyPath: string;
  showNotice: boolean;
}) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const runtime = useRef<ReturnType<typeof createAnalyticsRuntime> | null>(null);
  const settings = pathname === privacyPath;
  const enabled = analyticsEnabled(consent);

  useEffect(() => {
    if (!consent.ready) return;
    const tracking = (runtime.current ??= createAnalyticsRuntime(window, document, id));
    if (enabled) tracking.pageView(locale);
    else tracking.disable();
  }, [consent.ready, enabled, id, locale, pathname]);

  if (!consent.ready || (!settings && (!showNotice || (consent.choice !== null && !consent.error))))
    return null;
  return (
    <section
      className={`${styles.panel} ${settings ? styles.settings : styles.floating}`}
      aria-labelledby="analytics-title"
    >
      <div className={styles.copy}>
        <h2 id="analytics-title">
          {localize(locale, "网站访问统计", "Website analytics", "網站瀏覽統計")}
        </h2>
        <p>
          {localize(
            locale,
            "网站访问统计默认开启。Google Analytics 使用 Cookie 统计页面访问，帮助改进网站。音频、录音、读数和备注不会发送，你可随时关闭统计。",
            "Website analytics is on by default. Google Analytics uses cookies to measure page visits and help improve this site. Audio, recordings, readings and notes are never sent. You can turn analytics off at any time.",
            "網站瀏覽統計預設開啟。Google Analytics 使用 Cookie 統計頁面瀏覽，協助改善網站。音訊、錄音、讀數和備註不會傳送，你可隨時關閉統計。",
          )}{" "}
          {!settings ? (
            <a href={`${privacyPath}#network`}>
              {localize(locale, "隐私说明", "Privacy", "隱私說明")}
            </a>
          ) : null}
        </p>
      </div>
      <div className={styles.actions}>
        <button type="button" aria-pressed={enabled} onClick={() => setAnalyticsConsent("granted")}>
          {localize(locale, "允许统计", "Allow analytics", "允許統計")}
        </button>
        <button type="button" aria-pressed={!enabled} onClick={() => setAnalyticsConsent("denied")}>
          {localize(locale, "拒绝统计", "Reject analytics", "拒絕統計")}
        </button>
      </div>
      {consent.error ? (
        <Notice tone="warning" className={styles.notice} role="status">
          {localize(
            locale,
            "浏览器无法保存统计偏好，本次选择仅在当前页面生效。",
            "Your browser cannot save the analytics preference. This choice applies only to this page.",
            "瀏覽器無法儲存統計偏好，本次選擇僅在目前頁面生效。",
          )}
        </Notice>
      ) : null}
    </section>
  );
}
