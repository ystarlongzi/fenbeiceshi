import { localize } from "@/lib/i18n/text";
import type { Locale } from "@/features/sound-meter/types";
import type { SitePage } from "@/lib/routing/pages";
import { ContentPage } from "../content-page";
import { KnowledgePage } from "../knowledge-page";
import { FaqPage } from "../faq-page";
import { RecordsPanel } from "@/features/records";
import { DecibelChart } from "@/features/decibel-chart";
import { NoiseHealthArticle } from "@/features/noise-health";
import styles from "./index.module.css";

export function RoutePage({ page, locale }: { page: SitePage; locale: Locale }) {
  if (page.kind === "knowledge") return <KnowledgePage locale={locale} />;
  if (page.id === "decibel-chart") return <DecibelChart locale={locale} />;
  if (page.id === "noise-health") return <NoiseHealthArticle locale={locale} />;
  if (page.id === "faq") return <FaqPage locale={locale} />;
  if (page.kind === "records")
    return (
      <div className={styles.records}>
        <header className={styles.recordsHeader}>
          <p className={styles.eyebrow}>
            {localize(
              locale,
              "每一次观察，都留下条件",
              "YOUR OBSERVATIONS",
              "每一次觀察，都留下條件",
            )}
          </p>
          <h1>{localize(locale, "我的测量记录", "My measurement records", "我的測量記錄")}</h1>
          <p className={styles.intro}>
            {localize(
              locale,
              "回看已保存的摘要，或选择两次同条件观察，比较声音的变化。",
              "Revisit saved summaries, or compare two observations made under the same conditions.",
              "回看已儲存的摘要，或選擇兩次同條件觀察，比較聲音的變化。",
            )}
          </p>
        </header>
        <RecordsPanel locale={locale} />
      </div>
    );
  return <ContentPage id={page.id} locale={locale} />;
}
