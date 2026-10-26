"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import { localize } from "@/lib/i18n/text";
import { Notice } from "@/components/notice";
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
}: {
  locale: Locale;
  id: string;
  privacyPath: string;
}) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const runtime = useRef<ReturnType<typeof createAnalyticsRuntime> | null>(null);
  const settings = pathname === privacyPath;

  useEffect(() => {
    const tracking = (runtime.current ??= createAnalyticsRuntime(window, document, id));
    if (consent.choice === "granted") tracking.pageView(locale);
    else tracking.disable();
  }, [consent.choice, id, locale, pathname]);

  if (!consent.ready || (!settings && consent.choice !== null && !consent.error)) return null;
  return (
    <section className={styles.panel} aria-labelledby="analytics-title">
      <div className={styles.copy}>
        <h2 id="analytics-title">
          {localize(locale, "网站访问统计", "Website analytics", "網站瀏覽統計")}
        </h2>
        <p>
          {localize(
            locale,
            "允许 Google Analytics 使用 Cookie 统计页面访问，帮助我们改进网站？音频、录音、读数和备注不会发送。你可随时在隐私说明中更改选择。",
            "Allow Google Analytics cookies to measure page visits and help improve this site? Audio, recordings, readings and notes are never sent. You can change your choice in Privacy at any time.",
            "允許 Google Analytics 使用 Cookie 統計頁面瀏覽，協助我們改善網站？音訊、錄音、讀數和備註不會傳送。你可隨時在隱私說明中變更選擇。",
          )}
        </p>
        {!settings ? (
          <a href={`${privacyPath}#network`}>
            {localize(locale, "隐私说明", "Privacy", "隱私說明")}
          </a>
        ) : null}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          aria-pressed={consent.choice === "granted"}
          onClick={() => setAnalyticsConsent("granted")}
        >
          {localize(locale, "允许统计", "Allow analytics", "允許統計")}
        </button>
        <button
          type="button"
          aria-pressed={consent.choice === "denied"}
          onClick={() => setAnalyticsConsent("denied")}
        >
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
