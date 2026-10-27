import { siteForLocale } from "@/lib/routing/sites";
import { localize } from "@/lib/i18n/text";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "../icon";
import { LanguageSwitch } from "../language-switch";
import { LanguageScript } from "../language-switch/language-script";
import { ThemeSwitch } from "../theme-switch";
import { ThemeScript } from "../theme-switch/theme-script";
import { SiteNavigation } from "./site-navigation";
import { contents, href, pagePath, sitePages } from "@/lib/routing/pages";
import type { Locale } from "@/features/sound-meter/types";
import styles from "./index.module.css";
import { localeSettings } from "@/lib/i18n/locales";
import { prepareLocale } from "@/lib/i18n/load-messages";
import { LocalizationBoundary } from "../localization-boundary";
import { SiteAnalytics } from "@/features/site-analytics";
import { analyticsNoticeEnabled, measurementId } from "@/features/site-analytics/model";

export async function SiteDocument({ children, locale }: { children: ReactNode; locale: Locale }) {
  const messages = await prepareLocale(locale);
  const site = siteForLocale(locale);
  const analytics = measurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const baidu = site.domain === "fenbeiceshi.com";
  const hasAnalytics = analytics !== null || baidu;
  const showAnalyticsNotice = analyticsNoticeEnabled(process.env.NEXT_PUBLIC_GA_SHOW_NOTICE);
  const available = sitePages.map((page) => `/${page.slug ? `${page.slug}/` : ""}`);
  const nav = [
    {
      id: "meter",
      label: localize(locale, "开始测量", "Measure", "開始測量"),
      icon: "mic",
    },
    {
      id: "decibel-chart",
      label: localize(locale, "分贝指南", "Decibel guide", "分貝指南"),
      icon: "chart-line",
    },
    {
      id: "knowledge",
      label: localize(locale, "知识与帮助", "Knowledge & help", "知識與幫助"),
      icon: "book-open",
    },
    {
      id: "records",
      label: localize(locale, "本机记录", "Records", "本機記錄"),
      icon: "save",
    },
  ] as const;
  return (
    <html
      lang={locale}
      dir={localeSettings[locale].direction}
      data-scroll-behavior="smooth"
      data-theme="light"
      suppressHydrationWarning
    >
      <body>
        <LanguageScript locale={locale} available={available} />
        <ThemeScript />
        <LocalizationBoundary locale={locale} messages={messages}>
          <a className={styles.skip} href="#main-content">
            {localize(locale, "跳到主要内容", "Skip to content", "跳到主要內容")}
          </a>
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <Link
                className={styles.brand}
                href={href("meter", locale)}
                aria-label={localize(locale, "分贝测试首页", "SoundMeterGo home", "分貝測試首頁")}
              >
                <span className={styles.brandMark}>
                  <Icon name="audio-lines" size={22} />
                </span>
                <span className={styles.brandText}>
                  <strong>{localize(locale, "分贝测试", "SoundMeterGo", "分貝測試")}</strong>
                  <small>
                    {localize(
                      locale,
                      "免费在线分贝测量",
                      "Measure sound around you",
                      "免費線上分貝測量",
                    )}
                  </small>
                </span>
              </Link>
              <SiteNavigation
                locale={locale}
                items={nav.map(({ id, label, icon }) => ({
                  label,
                  icon,
                  href: href(id, locale),
                  exact: id === "meter",
                  include:
                    id === "knowledge"
                      ? contents
                          .filter((content) => content.kind === "guide")
                          .map((content) => href(content.id, locale))
                      : undefined,
                  exclude: id === "knowledge" ? [href("decibel-chart", locale)] : undefined,
                }))}
                themeControl={<ThemeSwitch locale={locale} />}
                utilities={<LanguageSwitch locale={locale} available={available} />}
              />
            </div>
          </header>
          {hasAnalytics ? (
            <div id="analytics" className={styles.analyticsAnchor}>
              <SiteAnalytics
                locale={locale}
                id={analytics}
                baidu={baidu}
                privacyPath={pagePath("privacy", locale)}
                showNotice={showAnalyticsNotice}
              />
            </div>
          ) : null}
          <main id="main-content" className={styles.content}>
            {children}
          </main>
          <footer className={styles.footer}>
            <div className={styles.footerInner}>
              <div>
                <strong>{localize(locale, "分贝测试", "SoundMeterGo", "分貝測試")}</strong>
                <p>
                  {localize(
                    locale,
                    "看见声音变化，记下每次观察。",
                    "Observe sound. Keep the context.",
                    "看見聲音變化，記下每次觀察。",
                  )}
                </p>
                <small>© 2026 {site.domain}</small>
              </div>
              <nav aria-label={localize(locale, "页脚导航", "Footer", "頁尾導航")}>
                <Link href={href("guide", locale)}>
                  {localize(locale, "使用指南", "How to use", "使用指南")}
                </Link>
                <Link href={href("how-it-works", locale)}>
                  {localize(locale, "工作原理", "How it works", "工作原理")}
                </Link>
                <Link href={href("faq", locale)}>
                  {localize(locale, "常见问题", "FAQ", "常見問題")}
                </Link>
                <Link href={href("calibration", locale)}>
                  {localize(locale, "读数修正", "Adjust readings", "讀數修正")}
                </Link>
                <Link href={href("about", locale)}>
                  {localize(locale, "关于", "About", "關於")}
                </Link>
                <Link href={href("privacy", locale)}>
                  {localize(locale, "隐私说明", "Privacy", "隱私說明")}
                </Link>
                {hasAnalytics ? (
                  <Link href={`${href("privacy", locale)}#analytics`}>
                    {localize(locale, "统计设置", "Analytics settings", "統計設定")}
                  </Link>
                ) : null}
              </nav>
            </div>
            <p className={styles.footerNote}>
              {localize(
                locale,
                "浏览器声音观察工具，结果不替代认证声级测量。音频在你的设备上处理。",
                "Browser observations, not certified sound level measurements. Audio is processed on your device.",
                "瀏覽器聲音觀察工具，結果不替代認證聲級測量。音訊在你的裝置上處理。",
              )}
            </p>
          </footer>
        </LocalizationBoundary>
      </body>
    </html>
  );
}
