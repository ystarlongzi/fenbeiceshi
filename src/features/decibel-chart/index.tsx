import { ContentPage } from "@/components/content-page";
import Link from "next/link";
import { LinkArrow } from "@/components/link-arrow";
import { href } from "@/lib/routing/pages";
import { soundBands } from "@/lib/content/sound-bands";
import { healthTeaser } from "@/lib/content/decibel-chart";
import { soundCategories, soundReferences, soundSources } from "@/lib/content/sound-references";
import { text } from "@/lib/content/types";
import type { Locale } from "@/features/sound-meter/types";
import { SoundReferenceList } from "./sound-reference-list";
import { SoundOverview } from "./sound-overview";
import { SoundSelectionProvider } from "./sound-explorer/selection";
import { ChartNotes } from "./chart-notes";
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
        sectionContent={{
          reading: (
            <>
              <ChartNotes locale={locale} />
              <aside id="health" className={styles.healthNote} aria-labelledby="chart-health-title">
                <h3 id="chart-health-title">{en ? "Noise and health" : "噪音与健康"}</h3>
                <p className={styles.healthDescription}>{text(healthTeaser, locale)}</p>
                <Link
                  id="exposure"
                  className={styles.healthLink}
                  href={href("noise-health", locale)}
                >
                  {en ? "Read about noise and health" : "了解噪音对健康的影响"}
                  <LinkArrow size={16} />
                </Link>
              </aside>
            </>
          ),
          levels: <SoundOverview locale={locale} />,
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
