import { localize } from "@/lib/i18n/text";
import { ContentPage } from "@/components/content-page";
import Link from "next/link";
import { LinkArrow } from "@/components/link-arrow";
import { href } from "@/lib/routing/pages";
import { soundBands } from "@/lib/content/sound-bands";
import { soundReferences, soundSources } from "@/lib/content/sound-references";
import { text } from "@/lib/content/types";
import type { Locale } from "@/features/sound-meter/types";
import { SoundReferenceList } from "./sound-reference-list";
import { ChartNotes } from "./chart-notes";
import styles from "./index.module.css";

export function DecibelChart({ locale }: { locale: Locale }) {
  return (
    <ContentPage
      id="decibel-chart"
      locale={locale}
      sectionContent={{
        reading: <ChartNotes locale={locale} />,
        health: (
          <div className={styles.healthLinks}>
            <Link
              id="exposure"
              className={styles.exposureLink}
              href={`${href("noise-health", locale)}#exposure`}
            >
              {localize(locale, "查看暴露时长参考", "Explore exposure time", "檢視暴露時長參考")}
              <LinkArrow size={16} />
            </Link>
            <Link className={styles.healthLink} href={`${href("noise-health", locale)}#effects`}>
              {localize(
                locale,
                "了解噪音对健康的影响",
                "Noise and health effects",
                "瞭解噪音對健康的影響",
              )}
              <LinkArrow size={16} />
            </Link>
          </div>
        ),
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
                  context: text(sound.context, locale),
                  min: sound.min,
                  max: sound.max,
                  unit: sound.unit,
                  searchText: `${sound.name.zh} ${sound.name.zhTW} ${sound.name.en}`,
                  sourceId: soundSources[sound.source].id,
                  sourceLabel: soundSources[sound.source].label,
                }))
                .sort((a, b) => a.min - b.min || a.max - b.max)}
            />
          </>
        ),
      }}
    />
  );
}
