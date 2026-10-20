import type { Locale } from "@/features/sound-meter/types";
import type { SitePage } from "@/lib/routing/pages";
import { ContentPage } from "../content-page";
import { KnowledgePage } from "../knowledge-page";
import { RecordsPanel } from "@/features/records";
import { DecibelChart } from "@/features/decibel-chart";
import { NoiseHealthArticle } from "@/features/noise-health";
import styles from "./index.module.css";

export function RoutePage({ page, locale }: { page: SitePage; locale: Locale }) {
  if (page.kind === "knowledge") return <KnowledgePage locale={locale} />;
  if (page.id === "decibel-chart") return <DecibelChart locale={locale} />;
  if (page.id === "noise-health") return <NoiseHealthArticle locale={locale} />;
  if (page.kind === "records")
    return (
      <div className={styles.records}>
        <header className={styles.recordsHeader}>
          <p className={styles.eyebrow}>
            {locale === "en" ? "YOUR OBSERVATIONS" : "每一次观察，都留下条件"}
          </p>
          <h1>{locale === "en" ? "Your local sound records" : "本机声音观察记录"}</h1>
          <p className={styles.intro}>
            {locale === "en"
              ? "Revisit saved summaries, or compare two observations made under the same conditions."
              : "回看已保存的摘要，或选择两次同条件观察，比较声音的变化。"}
          </p>
        </header>
        <RecordsPanel locale={locale} />
      </div>
    );
  return <ContentPage id={page.id} locale={locale} />;
}
