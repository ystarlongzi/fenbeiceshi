import { localize } from "@/lib/i18n/text";
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
  return (
    <ContentPage
      id="noise-health"
      locale={locale}
      cta={{
        title: localize(
          locale,
          "把声音量级放回日常场景",
          "Put sound levels in context",
          "把聲音量級放回日常場景",
        ),
        description: localize(
          locale,
          "查找常见声音参考，同时保留来源单位与比较条件。",
          "Compare everyday references while keeping their conditions and units in view.",
          "查詢常見聲音參考，同時保留來源單位與比較條件。",
        ),
        href: href("decibel-chart", locale),
        label: localize(locale, "回到分贝对照表", "Open the decibel chart", "回到分貝對照表"),
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
              {localize(
                locale,
                "NIOSH：参考原文与适用范围",
                "NIOSH: reference and scope",
                "NIOSH：參考原文與適用範圍",
              )}
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
                <h3>
                  <span className={styles.emoji} aria-hidden="true">
                    {impact.emoji}
                  </span>
                  {text(impact.title, locale)}
                </h3>
                {impact.paragraphs.map((paragraph, index) => (
                  <p key={index}>{text(paragraph, locale)}</p>
                ))}
                <div className={styles.sources}>
                  <span>{localize(locale, "依据：", "Sources:", "依據：")}</span>
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
            {localize(
              locale,
              "NIDCD：听力损伤与预防资料",
              "NIDCD: hearing loss and prevention",
              "NIDCD：聽力損傷與預防資料",
            )}
            <Icon name="external-link" size={12} />
          </a>
        ),
      }}
    />
  );
}
