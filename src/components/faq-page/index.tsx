import { faqGroups } from "@/lib/content/faq";
import { text } from "@/lib/content/types";
import type { Locale } from "@/features/sound-meter/types";
import { ContentPage } from "../content-page";
import { FaqList } from "../faq-list";
import styles from "./index.module.css";

export function FaqPage({ locale }: { locale: Locale }) {
  return (
    <ContentPage id="faq" locale={locale}>
      <div className={styles.groups}>
        {faqGroups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className={styles.group}
            aria-labelledby={`${group.id}-title`}
          >
            <header className={styles.header}>
              <h2 id={`${group.id}-title`} className={styles.title}>
                {text(group.title, locale)}
              </h2>
              <p className={styles.description}>{text(group.description, locale)}</p>
            </header>
            <FaqList items={group.questions} locale={locale} variant="grouped" />
          </section>
        ))}
      </div>
    </ContentPage>
  );
}
