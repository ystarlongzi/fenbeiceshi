import { ContentPage } from "@/components/content-page";
import Link from "next/link";
import { LinkArrow } from "@/components/link-arrow";
import { href } from "@/lib/routing/pages";
import { soundBands } from "@/lib/content/sound-bands";
import { healthTeaser } from "@/lib/content/decibel-chart";
import { soundReferences, soundSources } from "@/lib/content/sound-references";
import { text } from "@/lib/content/types";
import type { Locale } from "@/features/sound-meter/types";
import { SoundReferenceList } from "./sound-reference-list";
import { ChartNotes } from "./chart-notes";
import styles from "./index.module.css";

export function DecibelChart({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
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
              <Link id="exposure" className={styles.healthLink} href={href("noise-health", locale)}>
                {en ? "Read about noise and health" : "了解噪音对健康的影响"}
                <LinkArrow size={16} />
              </Link>
            </aside>
          </>
        ),
        levels: (
          <SoundReferenceList
            locale={locale}
            bands={soundBands.map((band) => ({
              min: band.min,
              max: band.max,
              range: band.range,
              tone: band.tone,
              title: text(band.title, locale),
              description: text(band.description, locale),
            }))}
            sounds={soundReferences
              .map((sound) => ({
                id: sound.id,
                emoji: sound.emoji,
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
