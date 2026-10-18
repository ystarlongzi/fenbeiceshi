"use client";

import type { Locale } from "@/features/sound-meter/types";
import { useSoundSelection } from "./selection";
import styles from "./index.module.css";

export function SoundExplorer({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const { selection, setSelection, band, value, invalid } = useSoundSelection();
  const raw = selection?.kind === "value" ? selection.raw : "";
  const colon = en ? ": " : "：";
  const description =
    selection?.kind === "band" && band
      ? `${en ? "Selected band" : "已选分段"}${colon}${band.range} · ${band.title}`
      : value !== null
        ? `${en ? "Reference value" : "参考数值"}${colon}${value} · ${band?.title ?? ""}`
        : en
          ? "All levels · enter a number or move the slider to explore"
          : "全部分贝范围 · 输入数值或拖动滑块开始探索";

  function change(raw: string) {
    setSelection(raw ? { kind: "value", raw } : null);
  }

  return (
    <div className={styles.explorer}>
      <label htmlFor="sound-level-input">
        {en ? "Explore by decibel value" : "按分贝数值探索"}
      </label>
      <div className={styles.controls}>
        <input
          id="sound-level-input"
          type="number"
          inputMode="numeric"
          min={0}
          max={160}
          step={1}
          value={raw}
          placeholder={en ? "e.g. 60" : "如 60"}
          onChange={(event) => change(event.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby="sound-level-help"
        />
        <div className={styles.slider}>
          <input
            id="sound-level-range"
            type="range"
            min={0}
            max={160}
            step={1}
            value={value ?? band?.min ?? 0}
            aria-label={en ? "Explore decibel value with the slider" : "拖动滑块探索分贝数值"}
            aria-describedby="sound-level-help"
            onChange={(event) => change(event.target.value)}
          />
          <div className={styles.ticks} aria-hidden="true">
            <span>0</span>
            <span>80</span>
            <span>160</span>
          </div>
        </div>
      </div>
      <p
        className={styles.selection}
        data-selected={!!band}
        style={
          band
            ? {
                backgroundColor: `var(--band-${band.tone}-surface)`,
                color: `var(--band-${band.tone}-ink)`,
              }
            : undefined
        }
      >
        {invalid
          ? en
            ? "Invalid value · no matches shown"
            : "数值无效 · 暂不显示匹配结果"
          : description}
      </p>
      <p id="sound-level-help" className={invalid ? styles.error : styles.help}>
        {invalid
          ? en
            ? "Enter a whole number from 0 to 160."
            : "请输入 0–160 之间的整数。"
          : en
            ? "Matches source numbers in dB and dBA without converting units. Sound name and category filters can be combined."
            : "按来源数值匹配，保留 dB / dBA，不作单位换算；可与声音名称及类别组合筛选。"}
      </p>
    </div>
  );
}
