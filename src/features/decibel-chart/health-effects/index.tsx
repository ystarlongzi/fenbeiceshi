import type { Locale } from "@/features/sound-meter/types";
import { healthEffects } from "@/lib/content/health-effects";
import { text } from "@/lib/content/types";
import { Icon } from "@/components/icon";
import styles from "./index.module.css";

export function HealthEffects({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <div className={styles.effects}>
      {healthEffects.map((effect) => (
        <div key={effect.id} className={styles.effect} data-health-id={effect.id}>
          <details>
            <summary>
              <span className={styles.title}>{text(effect.title, locale)}</span>
              <span className={styles.summary}>{text(effect.summary, locale)}</span>
              <span className={styles.expand}>
                {en ? "Context & actions" : "了解背景与应对"}
                <Icon name="chevron-down" size={16} />
              </span>
            </summary>
            <div className={styles.detail}>
              <p>{text(effect.detail, locale)}</p>
              <p>
                <strong>{en ? "What you can do: " : "可以这样做："}</strong>
                {text(effect.action, locale)}
              </p>
            </div>
          </details>
          <a
            className={styles.source}
            href={effect.source.url}
            target="_blank"
            rel="noreferrer"
            aria-label={
              en
                ? `Source for ${text(effect.title, locale)}: ${effect.source.label}`
                : `${text(effect.title, locale)}的来源：${effect.source.label}`
            }
          >
            {effect.source.label}
            <Icon name="external-link" size={12} />
          </a>
        </div>
      ))}
    </div>
  );
}
