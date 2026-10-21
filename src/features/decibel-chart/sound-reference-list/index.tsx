"use client";

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
  const en = locale === "en";
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = filterSounds(sounds, query);
  const groups = groupSounds(matches, bands);
  function reset() {
    setQuery("");
    inputRef.current?.focus();
  }
  return (
    <div id="reference" className={styles.lookup}>
      <label className={styles.label} htmlFor="sound-query">
        {en ? "Search by sound or decibel level" : "按声音或分贝值查找"}
      </label>
      <div className={styles.search}>
        <input
          id="sound-query"
          ref={inputRef}
          type="search"
          maxLength={100}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={en ? "Try refrigerator, conversation or 60" : "例如：冰箱、交谈、60"}
          aria-describedby="sound-query-help"
        />
        {query ? (
          <button type="button" onClick={reset} aria-label={en ? "Clear search" : "清空搜索"}>
            <Icon name="x" size={17} />
          </button>
        ) : null}
      </div>
      <p id="sound-query-help" className={styles.help}>
        {en
          ? "Sounds are grouped by the start of their source range; full ranges may cross bands. Open a sound for its context and source."
          : "按参考范围起点分组，跨档条目保留完整范围；点开声音查看条件与来源。"}
      </p>
      <div id="sound-results">
        <p className={styles.count} role="status" aria-live="polite" aria-atomic="true">
          {en
            ? `${matches.length} of ${sounds.length} sound references`
            : `找到 ${matches.length} / ${sounds.length} 项声音参考`}
        </p>
        {matches.length ? (
          <ol
            className={styles.bands}
            aria-label={en ? "Sounds by level band" : "按分贝分段的声音"}
          >
            {groups.map(({ band, sounds: items }) => (
              <li key={band.tone} className={styles.band} data-band-tone={band.tone}>
                <div className={styles.bandHeader}>
                  <h3 id={`sound-band-${band.tone}`}>
                    {band.range} <small>dB</small>
                  </h3>
                  <p>{band.title}</p>
                </div>
                <p className={styles.feeling} data-band-description={band.tone}>
                  {band.description}
                </p>
                <ul className={styles.sounds} aria-labelledby={`sound-band-${band.tone}`}>
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
                            {en ? "~ " : "约 "}
                            {referenceLevel(sound)}
                          </strong>
                          <Icon name="chevron-down" size={14} />
                        </summary>
                        <p className={styles.context}>
                          {sound.context}
                          <a
                            href={`#${sound.sourceId}`}
                            aria-label={
                              en
                                ? `Source: ${sound.sourceLabel} for ${sound.name}`
                                : `${sound.name}的来源：${sound.sourceLabel}`
                            }
                          >
                            {sound.sourceLabel}
                            <Icon name="arrow-down" size={12} />
                          </a>
                        </p>
                      </details>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.empty}>
            <p>
              {en
                ? "No matching sounds. Try a shorter name or another decibel value."
                : "没有找到匹配声音。试试缩短名称或更换分贝值。"}
            </p>
            <button type="button" onClick={reset}>
              {en ? "Show all sounds" : "查看全部声音"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
