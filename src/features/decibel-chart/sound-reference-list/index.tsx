"use client";
import { localize } from "@/lib/i18n/text";

import { useRef, useState } from "react";
import { Icon } from "@/components/icon";
import type { Locale } from "@/features/sound-meter/types";
import {
  filterSounds,
  groupSounds,
  referenceLevel,
  type LookupBand,
  type LookupSound,
} from "./filter";
import styles from "./index.module.css";

export function SoundReferenceList({
  sounds,
  bands,
  locale,
}: {
  sounds: LookupSound[];
  bands: LookupBand[];
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const [openBands, setOpenBands] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = filterSounds(sounds, query);
  const groups = groupSounds(matches, bands);
  function search(value: string) {
    setQuery(value);
    setOpenBands(value.trim() ? bands.map((band) => band.tone) : []);
  }
  function toggleBand(tone: string, open: boolean) {
    setOpenBands((current) => {
      if (current.includes(tone) === open) return current;
      return open ? [...current, tone] : current.filter((item) => item !== tone);
    });
  }
  function reset() {
    search("");
    inputRef.current?.focus();
  }
  return (
    <div id="reference" className={styles.lookup}>
      <label className={styles.label} htmlFor="sound-query">
        {localize(
          locale,
          "按声音或分贝值查找",
          "Search by sound or decibel level",
          "按聲音或分貝值查詢",
        )}
      </label>
      <div className={styles.search}>
        <input
          id="sound-query"
          ref={inputRef}
          type="search"
          maxLength={100}
          value={query}
          onChange={(event) => search(event.target.value)}
          placeholder={localize(
            locale,
            "例如：冰箱、交谈、60",
            "Try refrigerator, conversation or 60",
            "例如：冰箱、交談、60",
          )}
          aria-describedby="sound-query-help"
        />
        {query ? (
          <button
            type="button"
            onClick={reset}
            aria-label={localize(locale, "清空搜索", "Clear search", "清空搜尋")}
          >
            <Icon name="x" size={17} />
          </button>
        ) : null}
      </div>
      <p id="sound-query-help" className={styles.help}>
        {localize(
          locale,
          "按参考范围起点分组，跨档条目保留完整范围；展开分段查看声音，点开声音查看比较条件及分贝详情入口。",
          "Sounds are grouped by the start of their source range; full ranges may cross bands. Expand a band to browse sounds, then open a sound for its conditions and a link to the full explanation.",
          "按參考範圍起點分組，跨檔條目保留完整範圍；展開分段檢視聲音，點開聲音檢視比較條件及分貝詳情入口。",
        )}
      </p>
      <div id="sound-results">
        <p className={styles.count} role="status" aria-live="polite" aria-atomic="true">
          {localize(
            locale,
            `找到 ${matches.length} / ${sounds.length} 项声音参考`,
            `${matches.length} of ${sounds.length} sound references`,
            `找到 ${matches.length} / ${sounds.length} 項聲音參考`,
          )}
        </p>
        {matches.length ? (
          <ol
            className={styles.bands}
            aria-label={localize(
              locale,
              "按分贝分段的声音",
              "Sounds by level band",
              "按分貝分段的聲音",
            )}
          >
            {groups.map(({ band, sounds: items }) => (
              <li key={band.tone} className={styles.band} data-band-tone={band.tone}>
                <details
                  className={styles.bandDisclosure}
                  data-band-disclosure={band.tone}
                  open={openBands.includes(band.tone)}
                  onToggle={(event) => {
                    if (event.target === event.currentTarget)
                      toggleBand(band.tone, event.currentTarget.open);
                  }}
                >
                  <summary className={styles.bandToggle}>
                    <h3 id={`sound-band-${band.tone}`}>
                      <span className={styles.bandHeader}>
                        <span>
                          {band.range} <small>dB</small>
                        </span>
                        <span className={styles.bandTitle}>{band.title}</span>
                        <Icon name="chevron-down" size={18} />
                      </span>
                      <span className={styles.feeling} data-band-description={band.tone}>
                        {band.description}
                      </span>
                    </h3>
                  </summary>
                  <ul
                    id={`sound-list-${band.tone}`}
                    className={styles.sounds}
                    aria-labelledby={`sound-band-${band.tone}`}
                  >
                    {items.map((sound) => (
                      <li key={sound.id}>
                        <details
                          className={styles.sound}
                          name={`sound-details-${band.tone}`}
                          data-sound-id={sound.id}
                          data-sound-band={band.tone}
                        >
                          <summary>
                            <span className={styles.name}>
                              <span className={styles.emoji} aria-hidden="true">
                                {sound.emoji}
                              </span>
                              {sound.name}
                            </span>
                            <strong className={styles.level}>
                              {localize(locale, "约 ", "~ ", "約 ")}
                              {referenceLevel(sound)}
                            </strong>
                            <Icon name="chevron-down" size={14} />
                          </summary>
                          <p className={styles.context}>
                            {sound.context}
                            {sound.readingLink ? (
                              <>
                                {" "}
                                <a href={sound.readingLink.href}>{sound.readingLink.label}</a>
                              </>
                            ) : null}
                          </p>
                        </details>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.empty}>
            <p>
              {localize(
                locale,
                "没有找到匹配声音。试试缩短名称或更换分贝值。",
                "No matching sounds. Try a shorter name or another decibel value.",
                "沒有找到匹配聲音。試試縮短名稱或更換分貝值。",
              )}
            </p>
            <button type="button" onClick={reset}>
              {localize(locale, "查看全部声音", "Show all sounds", "檢視全部聲音")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
