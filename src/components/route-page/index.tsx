import type { Locale } from "@/features/sound-meter/types";
import type { SitePage } from "@/lib/routing/pages";
import { ContentPage } from "../content-page";
import { KnowledgePage } from "../knowledge-page";
import { RecordsPanel } from "@/features/records";
import styles from "./index.module.css";

export function RoutePage({ page, locale }: { page: SitePage; locale: Locale }) {
  if (page.kind === "knowledge") return <KnowledgePage locale={locale} />;
  if (page.kind === "records")
    return (
      <div className={styles.records}>
        <p>{locale === "en" ? "YOUR OBSERVATIONS" : "每一次观察，都留下条件"}</p>
        <h1>{locale === "en" ? "Your local sound records" : "本机声音观察记录"}</h1>
        <RecordsPanel locale={locale} />
      </div>
    );
  return <ContentPage id={page.id} locale={locale} />;
}
