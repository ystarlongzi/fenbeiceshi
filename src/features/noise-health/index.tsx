import { ContentPage } from "@/components/content-page";
import { DisclosureAnchors } from "@/components/disclosure-anchors";
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
          <>
            <ul>
              {exposureFactors.map((item, index) => (
                <li key={index}>{text(item, locale)}</li>
              ))}
            </ul>
            <details className={styles.occupation}>
              <summary>
                {en
                  ? "Occupational reference: 85 dBA and exposure time"
                  : "进一步理解：85 dBA 与职业暴露时长"}
                <Icon name="chevron-down" size={16} />
              </summary>
              <div id="exposure" className={styles.exposure}>
                <p>
                  {en
                    ? "NIOSH's workplace reference uses 85 dBA over eight hours, halving the duration for each 3 dBA increase. It does not set a bedroom noise target or a personal safety countdown."
                    : "NIOSH 的职业参考以 8 小时平均 85 dBA 为起点，每增加 3 dBA，参考时长减半。它既不是卧室噪音目标，也不是个人安全倒计时。"}
                </p>
                <ExposureExplorer locale={locale} />
                <a
                  className={styles.sourceLink}
                  href={healthSources.occupation.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {en ? "NIOSH: scope and reference" : "NIOSH：参考原文与适用范围"}
                  <Icon name="external-link" size={12} />
                </a>
              </div>
            </details>
            <DisclosureAnchors ids={["exposure"]} />
          </>
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
