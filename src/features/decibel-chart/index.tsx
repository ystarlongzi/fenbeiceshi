import { ContentPage } from "@/components/content-page";
import { Icon } from "@/components/icon";
import {
  soundBands,
  soundCategories,
  soundReferences,
  soundSources,
} from "@/lib/content/sound-references";
import { text } from "@/lib/content/types";
import type { Locale } from "@/features/sound-meter/types";
import { SoundReferenceList } from "./sound-reference-list";
import styles from "./index.module.css";

export function DecibelChart({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const sounds = new Map(soundReferences.map((sound) => [sound.id, sound]));
  return (
    <ContentPage
      id="decibel-chart"
      locale={locale}
      sectionContent={{
        scale: (
          <a
            className={styles.sourceLink}
            href={soundSources.ccohs.url}
            target="_blank"
            rel="noreferrer"
          >
            {en ? "CCOHS: decibel scale and addition" : "CCOHS：分贝刻度与叠加说明"}
            <Icon name="external-link" size={13} />
          </a>
        ),
        exposure: (
          <a
            className={styles.sourceLink}
            href={soundSources.niosh.url}
            target="_blank"
            rel="noreferrer"
          >
            {en ? "NIOSH: occupational exposure reference" : "NIOSH：职业噪音暴露参考原文"}
            <Icon name="external-link" size={13} />
          </a>
        ),
        levels: (
          <figure className={styles.overview}>
            <ol>
              {soundBands.map((band) => (
                <li key={band.range} className={styles.band} data-tone={band.tone}>
                  <span className={styles.range}>
                    {band.range} <small>dB</small>
                  </span>
                  <strong>{text(band.title, locale)}</strong>
                  <span className={styles.examples}>
                    {band.examples
                      .map((id) => {
                        const sound = sounds.get(id);
                        if (!sound) throw new Error(`分贝分段缺少声音示例：${id}`);
                        return text(sound.name, locale);
                      })
                      .join(en ? " · " : "、")}
                  </span>
                </li>
              ))}
            </ol>
            <figcaption>
              {en
                ? "Illustrative bands; original units and conditions are listed below."
                : "分段仅作概览；原始单位、范围和条件见下方条目。"}
            </figcaption>
          </figure>
        ),
        reference: (
          <SoundReferenceList
            locale={locale}
            categories={soundCategories.map((category) => ({
              id: category.id,
              label: text(category.label, locale),
            }))}
            sounds={soundReferences
              .map((sound) => ({
                id: sound.id,
                category: sound.category,
                name: text(sound.name, locale),
                context: text(sound.context, locale),
                min: sound.min,
                max: sound.max,
                unit: sound.unit,
                searchText: `${sound.name.zh} ${sound.name.en}`,
                sourceId: soundSources[sound.source].id,
                sourceLabel: soundSources[sound.source].label,
              }))
              .sort((a, b) => a.min - b.min || a.max - b.max)}
          />
        ),
      }}
    />
  );
}
