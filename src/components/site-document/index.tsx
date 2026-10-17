import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "../icon";
import { LanguageSwitch } from "../language-switch";
import { ThemeSwitch } from "../theme-switch";
import { ThemeScript } from "../theme-switch/theme-script";
import { NavigationLink } from "./navigation-link";
import { href, sitePages } from "@/lib/routing/pages";
import type { Locale } from "@/features/sound-meter/types";
import styles from "./index.module.css";

export function SiteDocument({ children, locale }: { children: ReactNode; locale: Locale }) {
  const english = locale === "en";
  const nav = [
    { id: "meter", label: english ? "Measure" : "开始测量", icon: "mic", optional: true },
    { id: "knowledge", label: english ? "Guides" : "声音知识", icon: "book-open", optional: false },
    {
      id: "guide",
      label: english ? "How to use" : "使用指南",
      icon: "circle-check",
      optional: true,
    },
    { id: "records", label: english ? "Records" : "本机记录", icon: "save", optional: false },
  ] as const;
  const other = english ? "zh-CN" : "en";
  return (
    <html lang={locale} data-scroll-behavior="smooth" data-theme="light" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <a className={styles.skip} href="#main-content">
          {english ? "Skip to content" : "跳到主要内容"}
        </a>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link
              className={styles.brand}
              href={href("meter", locale)}
              aria-label={english ? "fenbeiceshi.com home" : "分贝测试首页"}
            >
              <span className={styles.brandMark}>
                <Icon name="audio-lines" size={22} />
              </span>
              <span className={styles.brandText}>
                <strong>{english ? "FenbeiCeshi" : "分贝测试"}</strong>
                <small>fenbeiceshi.com</small>
              </span>
            </Link>
            <div className={styles.navigation}>
              <nav aria-label={english ? "Main navigation" : "主导航"}>
                {nav.map((item) => (
                  <NavigationLink
                    key={item.id}
                    className={item.optional ? styles.optionalNav : undefined}
                    href={href(item.id, locale)}
                    exact={item.id === "meter"}
                  >
                    <Icon name={item.icon} size={15} />
                    {item.label}
                  </NavigationLink>
                ))}
              </nav>
              <div className={styles.utilities}>
                <ThemeSwitch locale={locale} />
                <LanguageSwitch
                  locale={locale}
                  available={sitePages.map((page) => href(page.id, other))}
                  className={styles.language}
                />
              </div>
            </div>
          </div>
        </header>
        <main id="main-content" className={styles.content}>
          {children}
        </main>
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div>
              <strong>{english ? "FenbeiCeshi" : "分贝测试"}</strong>
              <p>{english ? "Observe sound. Keep the context." : "看见声音变化，记下每次观察。"}</p>
              <small>© 2026 fenbeiceshi.com</small>
            </div>
            <nav aria-label={english ? "Footer" : "页脚导航"}>
              <Link href={href("guide", locale)}>{english ? "How to use" : "使用指南"}</Link>
              <Link href={href("calibration", locale)}>{english ? "Calibration" : "参考校准"}</Link>
              <Link href={href("about", locale)}>{english ? "About" : "关于"}</Link>
              <Link href={href("privacy", locale)}>{english ? "Privacy" : "隐私说明"}</Link>
              <a href="https://github.com/ystarlongzi/fenbeiceshi" target="_blank" rel="noreferrer">
                GitHub
                <Icon name="external-link" size={12} />
              </a>
            </nav>
          </div>
          <p className={styles.footerNote}>
            {english
              ? "Browser observations, not certified sound level measurements. Audio is processed on your device."
              : "浏览器声音观察工具，结果不替代认证声级测量。音频在你的设备上处理。"}
          </p>
        </footer>
      </body>
    </html>
  );
}
