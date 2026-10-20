import { ContentPage } from "@/components/content-page";
import { Icon } from "@/components/icon";
import {
  exposureFactors,
  healthActions,
  healthImpacts,
  healthSources,
} from "@/lib/content/noise-health";
import { text } from "@/lib/content/types";
import { href } from "@/lib/routing/pages";
import type { Locale } from "@/features/sound-meter/types";
import { ExposureExplorer } from "./exposure-explorer";
import styles from "./index.module.css";

export function NoiseHealthArticle({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <ContentPage
      id="noise-health"
      locale={locale}
      cta={{
        title: en ? "Put sound levels in context" : "把声音量级放回日常场景",
        description: en
          ? "Compare everyday references while keeping their conditions and units in view."
          : "查找常见声音参考，同时保留来源单位与比较条件。",
        href: href("decibel-chart", locale),
        label: en ? "Open the decibel chart" : "回到分贝对照表",
      }}
      sectionContent={{
        exposure: (
          <>
            <ExposureExplorer locale={locale} />
            <a
              className={styles.sourceLink}
              href={healthSources.occupation.url}
              target="_blank"
              rel="noreferrer"
            >
              {en ? "NIOSH: reference and scope" : "NIOSH：参考原文与适用范围"}
              <Icon name="external-link" size={12} />
            </a>
          </>
        ),
        effects: (
          <div className={styles.impacts}>
            {healthImpacts.map((impact) => (
              <section
                key={impact.id}
                id={impact.id}
                className={styles.impact}
                data-health-id={impact.id}
              >
                <h3>{text(impact.title, locale)}</h3>
                {impact.paragraphs.map((paragraph, index) => (
                  <p key={index}>{text(paragraph, locale)}</p>
                ))}
                <div className={styles.sources}>
                  <span>{en ? "Sources:" : "依据："}</span>
                  {impact.sources.map((source) => (
                    <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                      <Icon name="external-link" size={12} />
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ),
        context: (
          <ul>
            {exposureFactors.map((item, index) => (
              <li key={index}>{text(item, locale)}</li>
            ))}
          </ul>
        ),
        actions: (
          <ol className={styles.steps}>
            {healthActions.map((action, index) => (
              <li key={index}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{text(action.title, locale)}</h3>
                  <p>{text(action.body, locale)}</p>
                </div>
              </li>
            ))}
          </ol>
        ),
        help: (
          <a
            className={styles.sourceLink}
            href={healthSources.hearing.url}
            target="_blank"
            rel="noreferrer"
          >
            {en ? "NIDCD: hearing loss and prevention" : "NIDCD：听力损伤与预防资料"}
            <Icon name="external-link" size={12} />
          </a>
        ),
      }}
    />
  );
}
