import { ContentPage } from "@/components/content-page";
import { decibelUnitsAction } from "@/lib/content/decibel-units";
import { text } from "@/lib/content/types";
import { href } from "@/lib/routing/pages";
import type { Locale } from "@/features/sound-meter/types";
import styles from "./index.module.css";

export function DecibelUnitsPage({ locale }: { locale: Locale }) {
  return (
    <ContentPage
      id="db-dba"
      locale={locale}
      sectionClasses={{ "a-c-z": styles.comparison, references: styles.comparison }}
      cta={{
        title: text(decibelUnitsAction.title, locale),
        description: text(decibelUnitsAction.description, locale),
        href: href("decibel-chart", locale),
        label: text(decibelUnitsAction.label, locale),
      }}
    />
  );
}
