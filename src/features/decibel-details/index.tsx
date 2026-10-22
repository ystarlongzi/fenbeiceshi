import Link from "next/link";
import type { CSSProperties } from "react";
import { ContentPage } from "@/components/content-page";
import { Icon } from "@/components/icon";
import { LinkArrow } from "@/components/link-arrow";
import { detailForLevel, type SoundDetail } from "@/lib/content/decibel-details";
import { levelComparisons } from "@/lib/content/decibel-details/comparison";
import { readingBand, soundBands } from "@/lib/content/sound-bands";
import { soundSources, type SoundReference } from "@/lib/content/sound-references";
import { referenceLevel, referenceRange } from "@/lib/content/sound-reference-format";
import { text } from "@/lib/content/types";
import { href } from "@/lib/routing/pages";
import { localize } from "@/lib/i18n/text";
import type { Locale } from "@/features/sound-meter/types";
import styles from "./index.module.css";

export function SoundDetailPage({ detail, locale }: { detail: SoundDetail; locale: Locale }) {
  const range = referenceRange(detail.sounds[0]);
  return (
    <ContentPage
      id={detail.content.id}
      locale={locale}
      className={styles.article}
      heading={localize(
        locale,
        `${range} 分贝有多大？`,
        `How loud is ${range} dB?`,
        `${range} 分貝有多大？`,
      )}
      overview={<SoundOverview detail={detail} locale={locale} />}
      sectionClasses={{
        examples: `${styles.chapter} ${styles.examplesSection}`,
        context: `${styles.chapter} ${styles.comparisonSection}`,
        hearing: `${styles.chapter} ${styles.hearing}`,
        question: styles.chapter,
      }}
      sectionContent={{
        examples: (
          <ul className={styles.examples}>
            {detail.sounds.map((sound) => (
              <li key={sound.id} data-detail-sound-id={sound.id}>
                <div className={styles.heading}>
                  <strong>
                    <span className={styles.emoji} aria-hidden="true">
                      {sound.emoji}
                    </span>
                    {text(sound.name, locale)}
                  </strong>
                  <span className={styles.exampleLevel}>
                    {localize(locale, "约 ", "~ ", "約 ")}
                    {referenceLevel(sound)}
                  </span>
                </div>
                <p>
                  {text(sound.context, locale)} <SourceLink sound={sound} />
                </p>
              </li>
            ))}
          </ul>
        ),
        context: <SoundComparison detail={detail} locale={locale} />,
        hearing: (
          <div className={styles.healthLinks}>
            <Link href={`${href("noise-health", locale)}#effects`}>
              {localize(locale, "了解噪音与健康", "Explore noise and health", "瞭解噪音與健康")}
              <LinkArrow size={15} />
            </Link>
            <Link href={`${href("noise-health", locale)}#exposure`}>
              {localize(
                locale,
                "查看职业暴露时长参考",
                "View occupational exposure guidance",
                "檢視職業暴露時長參考",
              )}
              <LinkArrow size={15} />
            </Link>
          </div>
        ),
        question: (
          <div>
            {detail.questions.map((item) => (
              <div key={item.id} id={item.id} className={styles.question} data-detail-question="">
                <h3>{text(item.question, locale)}</h3>
                <p>{text(item.answer, locale)}</p>
                {item.id === "browser" ? (
                  <Link className={styles.guideLink} href={href("guide", locale)}>
                    {localize(
                      locale,
                      "看看怎么测更好比较",
                      "Tips for comparing readings",
                      "看看怎麼測更好比較",
                    )}
                    <LinkArrow size={15} />
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        ),
      }}
    />
  );
}

function SoundOverview({ detail, locale }: { detail: SoundDetail; locale: Locale }) {
  const sound = detail.sounds[0];
  const start = readingBand(sound.min);
  const end = readingBand(sound.max);
  if (!start || !end) throw new Error(`声音详情缺少量级分组：${detail.key}`);
  const bandLabel =
    start === end
      ? text(start.title, locale)
      : localize(
          locale,
          `${text(start.title, locale)}至${text(end.title, locale)}`,
          `${text(start.title, locale)} to ${text(end.title, locale)}`,
          `${text(start.title, locale)}至${text(end.title, locale)}`,
        );
  const accent = start === end ? `var(--noise-${start.tone}-ink)` : "var(--brand)";
  return (
    <section
      className={styles.overview}
      style={{ "--detail-tone": accent } as CSSProperties}
      aria-label={localize(locale, "先看结论", "At a glance", "先看結論")}
      data-detail-overview=""
    >
      <div className={styles.readout}>
        <span className={styles.readoutLabel}>
          {localize(locale, "参考声级", "Reference level", "參考聲級")}
        </span>
        <div className={styles.valueLine}>
          <strong>{referenceRange(sound)}</strong>
          <span>{[...new Set(detail.sounds.map((item) => item.unit))].join(" / ")}</span>
        </div>
        <span className={styles.bandLabel}>{bandLabel}</span>
        <div className={styles.ruler} aria-hidden="true">
          {soundBands.map((band) => (
            <span
              key={band.tone}
              style={{
                flexGrow: band.max - band.min,
                backgroundColor: `var(--band-${band.tone}-surface)`,
                opacity: band.min <= sound.max && band.max > sound.min ? 1 : 0.22,
              }}
            />
          ))}
        </div>
      </div>
      <div className={styles.summary}>
        <p className={styles.kicker}>
          {localize(locale, "直观感受", "What it is like", "直觀感受")}
        </p>
        <p className={styles.conclusion}>{text(detail.content.takeaway, locale)}</p>
        <p className={styles.scope}>
          {localize(locale, "对应场景：", "Sound examples: ", "對應情境：")}
          {detail.sounds
            .map((item) => text(item.name, locale))
            .join(localize(locale, "、", " · ", "、"))}
        </p>
        <p className={styles.scope}>
          {localize(
            locale,
            "档位帮助认识量级，不能据此判定舒适度或安全时长。",
            "Bands describe approximate levels; they do not establish comfort or a safe duration.",
            "檔位幫助認識量級，不能據此判定舒適度或安全時長。",
          )}
        </p>
      </div>
    </section>
  );
}

function SoundComparison({ detail, locale }: { detail: SoundDetail; locale: Locale }) {
  return (
    <>
      <div className={styles.comparison}>
        <table>
          <caption className={styles.visuallyHidden}>
            {localize(
              locale,
              "同一声音调高或调低后的近似对比，以本页为 1 倍参照",
              "Approximate changes to the same sound, with this page's level as 1",
              "同一聲音調高或調低後的近似對比，以本頁為 1 倍參照",
            )}
          </caption>
          <thead>
            <tr>
              <th scope="col">{localize(locale, "声级（分贝）", "Level (dB)", "聲級（分貝）")}</th>
              <th scope="col">
                {localize(locale, "体感响度（约）", "Loudness (approx.)", "體感響度（約）")}
              </th>
              <th scope="col">{localize(locale, "声音能量", "Sound energy", "聲音能量")}</th>
            </tr>
          </thead>
          <tbody>
            {levelComparisons(detail.sounds[0]).map((row) => {
              const target = row.offset === 0 ? undefined : detailForLevel(row);
              return (
                <tr
                  key={row.offset}
                  data-level-change={row.offset}
                  data-current-reference={row.offset === 0 ? "" : undefined}
                >
                  <th scope="row">
                    {target ? (
                      <Link
                        className={styles.comparisonLevel}
                        href={href(target.content.id, locale)}
                      >
                        {referenceRange(row)}
                      </Link>
                    ) : (
                      <strong className={styles.comparisonLevel}>{referenceRange(row)}</strong>
                    )}
                    <span className={styles.changeLabel}>
                      {row.offset === 0
                        ? localize(locale, "本页参考", "This page", "本頁參考")
                        : row.offset < 0
                          ? localize(
                              locale,
                              `低 ${-row.offset} 分贝`,
                              `${-row.offset} dB lower`,
                              `低 ${-row.offset} 分貝`,
                            )
                          : localize(
                              locale,
                              `高 ${row.offset} 分贝`,
                              `${row.offset} dB higher`,
                              `高 ${row.offset} 分貝`,
                            )}
                    </span>
                  </th>
                  <td className={styles.multiplier}>{`×${row.loudness}`}</td>
                  <td className={styles.multiplier}>{`×${row.energy}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={styles.comparisonNote}>
        {localize(
          locale,
          "这是同一声音改变音量的近似对比，测法和单位保持一致。实际听感也与音调、背景和个人有关，不能用来直接比较不同场景的声音。",
          "These are approximate changes to the same sound, with the same units and measurement method. Pitch, background and the listener also matter; the table does not compare different real-world sources.",
          "這是同一聲音改變音量的近似對比，測法和單位保持一致。實際聽感也與音調、背景和個人有關，不能用來直接比較不同情境的聲音。",
        )}{" "}
        <a href={`#${soundSources.nidcdLoudness.id}`}>NIDCD</a>
        {" · "}
        <a href={`#${soundSources.ccohs.id}`}>CCOHS</a>
      </p>
    </>
  );
}

function SourceLink({ sound }: { sound: SoundReference }) {
  const source = soundSources[sound.source];
  return (
    <a className={styles.sourceLink} href={`#${source.id}`}>
      {source.label}
      <Icon name="arrow-down" size={12} />
    </a>
  );
}
