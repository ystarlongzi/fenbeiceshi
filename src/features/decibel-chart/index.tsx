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
import { SoundOverview } from "./sound-overview";
import { SoundSelectionProvider } from "./sound-explorer/selection";
import { ExposureExplorer } from "./exposure-explorer";
import { HealthEffects } from "./health-effects";
import styles from "./index.module.css";

export function DecibelChart({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const sounds = new Map(soundReferences.map((sound) => [sound.id, sound]));
  return (
    <SoundSelectionProvider
      bands={soundBands.map((band) => ({
        min: band.min,
        max: band.max,
        range: band.range,
        tone: band.tone,
        title: text(band.title, locale),
        examples: band.examples
          .map((id) => {
            const sound = sounds.get(id);
            if (!sound) throw new Error(`分贝分段缺少声音示例：${id}`);
            return text(sound.name, locale);
          })
          .join(en ? " · " : "、"),
      }))}
    >
      <ContentPage
        id="decibel-chart"
        locale={locale}
        className={styles.palette}
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
            <>
              <ExposureExplorer locale={locale} />
              <a
                className={styles.sourceLink}
                href={soundSources.niosh.url}
                target="_blank"
                rel="noreferrer"
              >
                {en ? "NIOSH: occupational exposure reference" : "NIOSH：职业噪音暴露参考原文"}
                <Icon name="external-link" size={13} />
              </a>
            </>
          ),
          levels: <SoundOverview locale={locale} />,
          health: <HealthEffects locale={locale} />,
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
    </SoundSelectionProvider>
  );
}
