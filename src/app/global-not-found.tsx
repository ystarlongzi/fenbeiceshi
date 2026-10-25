import Link from "next/link";
import { SiteDocument } from "@/components/site-document";
import styles from "./not-found.module.css";
import "./globals.css";
import { activeSite } from "@/lib/routing/sites";
import { localize } from "@/lib/i18n/text";

export const metadata = {
  title: `404 - ${activeSite.brand}`,
  robots: { index: false, follow: true },
};
export default function GlobalNotFound() {
  const locale = activeSite.primaryLocale;
  return (
    <SiteDocument locale={locale}>
      <div className={styles.page}>
        <span>404</span>
        <h1>{localize(locale, "这里还没有内容", "Page not found", "這裡還沒有內容")}</h1>
        <p>
          {localize(
            locale,
            "可以回到工具，开始一次声音观察。",
            "Return to the meter to start a sound check.",
            "可以回到工具，開始一次聲音觀察。",
          )}
        </p>
        <Link href="/">
          {localize(locale, "回到分贝测试", "Back to SoundMeterGo", "回到分貝測試")}
        </Link>
      </div>
    </SiteDocument>
  );
}
