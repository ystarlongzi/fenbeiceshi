"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icon";
import type { Locale } from "@/features/sound-meter/types";
import { filterSounds, referenceLevel, type LookupSound } from "./filter";
import { SoundExplorer } from "../sound-explorer";
import { useSoundSelection } from "../sound-explorer/selection";
import styles from "./index.module.css";

export function SoundReferenceList({
  sounds,
  categories,
  locale,
}: {
  sounds: LookupSound[];
  categories: { id: string; label: string }[];
  locale: Locale;
}) {
  const en = locale === "en";
  const { selection, setSelection, range, invalid, band, value } = useSoundSelection();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = invalid ? [] : filterSounds(sounds, query, category, range);
  function reset() {
    setQuery("");
    setCategory("all");
    setSelection(null);
    inputRef.current?.focus();
  }
  return (
    <div className={styles.lookup}>
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
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label={en ? "Clear search" : "清空搜索"}
          >
            <Icon name="x" size={17} />
          </button>
        ) : null}
      </div>
      <p id="sound-query-help" className={styles.help}>
        {en
          ? "A number finds matching ranges. Add dB or dBA to filter by the source unit."
          : "数字可查找对应范围，加 dB 或 dBA 可限定来源单位。"}
      </p>
      <div
        className={styles.categories}
        role="group"
        aria-label={en ? "Sound category" : "声音类别"}
      >
        {[{ id: "all", label: en ? "All sounds" : "全部声音" }, ...categories].map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <details className={styles.exploreDetails}>
        <summary>
          {en ? "Explore with a slider" : "用滑块探索分贝"}
          <Icon name="chevron-down" size={16} />
        </summary>
        <SoundExplorer locale={locale} />
      </details>
      {query || category !== "all" || selection ? (
        <div className={styles.applied}>
          <span>
            {selection?.kind === "band" && band
              ? `${band.range} · ${band.title}`
              : invalid
                ? en
                  ? "Invalid decibel value"
                  : "分贝数值待修正"
                : value !== null
                  ? `${en ? "Value" : "数值"} ${value}`
                  : en
                    ? "All levels"
                    : "全部分贝范围"}
          </span>
          {selection ? (
            <button type="button" onClick={() => setSelection(null)}>
              {en ? "Clear level filter" : "清除分贝筛选"}
            </button>
          ) : null}
          <button type="button" onClick={reset}>
            {en ? "Reset all filters" : "重置全部筛选"}
          </button>
        </div>
      ) : null}
      <p
        id="sound-results"
        tabIndex={-1}
        className={styles.count}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {en
          ? `${matches.length} of ${sounds.length} sound references`
          : `找到 ${matches.length} / ${sounds.length} 项声音参考`}
      </p>
      {matches.length ? (
        <>
          <div className={styles.columns} aria-hidden="true">
            <span>{en ? "Sound" : "声音场景"}</span>
            <span>{en ? "Approx. level" : "参考分贝"}</span>
            <span>{en ? "Context & source" : "比较条件与来源"}</span>
          </div>
          <ul className={styles.results} aria-label={en ? "Sound references" : "声音参考结果"}>
            {matches.map((sound) => (
              <li key={sound.id} className={styles.soundRow} data-sound-id={sound.id}>
                <div className={styles.name}>
                  <strong>{sound.name}</strong>
                </div>
                <p className={styles.level}>
                  <span>
                    {en ? "~ " : "约 "}
                    {referenceLevel(sound)}
                  </span>
                </p>
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
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.empty}>
          <p>
            {en
              ? invalid
                ? "Open the slider controls to correct the decibel value, or reset the filters."
                : "No matching sounds. Try a shorter name, another level or all categories."
              : invalid
                ? "请展开滑块探索并修正分贝数值，或重置筛选。"
                : "没有找到匹配声音。试试缩短名称、更换分贝值，或查看全部类别。"}
          </p>
          <button type="button" onClick={reset}>
            {en ? "Reset lookup" : "重置查询"}
          </button>
        </div>
      )}
    </div>
  );
}
