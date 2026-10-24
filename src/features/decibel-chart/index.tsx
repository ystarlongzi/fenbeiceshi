import { localize } from "@/lib/i18n/text";
import { ContentPage } from "@/components/content-page";
import { href } from "@/lib/routing/pages";
import { soundBands } from "@/lib/content/sound-bands";
import { soundReferences } from "@/lib/content/sound-references";
import { detailForSound } from "@/lib/content/decibel-details";
import { referenceRange } from "@/lib/content/sound-reference-format";
import { text } from "@/lib/content/types";
import type { Locale } from "@/features/sound-meter/types";
import { SoundReferenceList } from "./sound-reference-list";
import { ChartNotes } from "./chart-notes";
import { HealthReference } from "./health-reference";
import styles from "./index.module.css";

export function DecibelChart({ locale }: { locale: Locale }) {
  return (
    <ContentPage
      id="decibel-chart"
      locale={locale}
      sectionContent={{
        reading: <ChartNotes locale={locale} />,
        health: <HealthReference locale={locale} />,
        levels: (
          <>
            {/* 兼容已发布的数值说明锚点，定位到统一声音对照。 */}
            <span id="numbers" className={styles.anchor} aria-hidden="true" />
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
                  context: text(sound.description ?? sound.context, locale),
                  min: sound.min,
                  max: sound.max,
                  unit: sound.unit,
                  searchText: `${sound.name.zh} ${sound.name.zhTW} ${sound.name.en}`,
                  readingLink: {
                    href: href(detailForSound(sound.id).content.id, locale),
                    label: localize(
                      locale,
                      `了解 ${referenceRange(sound)} 分贝`,
                      `About ${referenceRange(sound)} dB`,
                      `瞭解 ${referenceRange(sound)} 分貝`,
                    ),
                  },
                }))
                .sort((a, b) => a.min - b.min || a.max - b.max)}
            />
          </>
        ),
      }}
    />
  );
}
