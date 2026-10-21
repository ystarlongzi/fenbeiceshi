"use client";

import { Fragment, useState } from "react";
import { NumberInput } from "@/components/number-input";
import { readingColor } from "@/features/sound-meter/palette";
import type { Locale } from "@/features/sound-meter/types";
import { readingBand } from "@/lib/content/sound-bands";
import {
  defaultLevel,
  durationParts,
  exposureContext,
  exposureMinutes,
  levelStep,
  maxLevel,
  minLevel,
  readLevel,
  referenceLevels,
} from "./model";
import { exposureNotes } from "./copy";
import styles from "./index.module.css";

export function ExposureExplorer({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const [raw, setRaw] = useState(String(defaultLevel));
  const level = readLevel(raw);
  const band = readingBand(level);
  const color = readingColor(level, "ink");
  const minutes = level === null ? null : exposureMinutes(level);
  const note = exposureNotes[exposureContext(level)];

  return (
    <div className={styles.explorer}>
      <div className={styles.calculator}>
        <div className={styles.inputArea}>
          <label htmlFor="exposure-level-input">{en ? "Noise level" : "噪音水平"}</label>
          <NumberInput
            id="exposure-level-input"
            label={en ? "Noise level" : "噪音水平"}
            locale={locale}
            min={minLevel}
            max={maxLevel}
            step={levelStep}
            value={raw}
            onValueChange={setRaw}
            suffix="dBA"
            required
            className={styles.numberControl}
            aria-invalid={level === null || undefined}
            aria-describedby="exposure-input-help exposure-scope"
          />
          <input
            id="exposure-level-range"
            className={styles.range}
            type="range"
            min={minLevel}
            max={maxLevel}
            step={levelStep}
            value={level ?? defaultLevel}
            onChange={(event) => setRaw(event.target.value)}
            aria-label={en ? "Adjust noise level" : "拖动滑块选择噪音水平"}
            aria-valuetext={`${level ?? defaultLevel} dBA`}
            aria-describedby="exposure-input-help exposure-scope"
          />
          <div className={styles.scale} aria-hidden="true">
            <span>40</span>
            <span>85</span>
            <span>130 dBA</span>
          </div>
          <p id="exposure-input-help" className={level === null ? styles.error : styles.help}>
            {level === null
              ? en
                ? "Enter 40–130 dBA in steps of 0.5."
                : "请输入 40–130 dBA 之间的数值，步长为 0.5。"
              : en
                ? "Type a value or move the slider (40–130 dBA)."
                : "直接输入或拖动滑块（40–130 dBA）。"}
          </p>
        </div>
        <div className={styles.result}>
          <label htmlFor="exposure-duration">
            {en ? "Daily reference duration (approx.)" : "每日累计参考时长（约）"}
          </label>
          <div className={styles.duration}>
            <output
              id="exposure-duration"
              htmlFor="exposure-level-input exposure-level-range"
              aria-live="polite"
              aria-atomic="true"
              aria-describedby="exposure-note exposure-scope"
              style={{ color }}
            >
              {minutes === null ? "—" : renderDuration(minutes, en)}
            </output>
            {band ? (
              <span id="exposure-level-band" className={styles.band} style={{ color }}>
                {en ? band.title.en : band.title.zh}
              </span>
            ) : null}
          </div>
          <p id="exposure-note" className={styles.help} aria-live="polite" aria-atomic="true">
            {en ? note.en : note.zh}
          </p>
        </div>
      </div>
      <fieldset className={styles.presets}>
        <legend>{en ? "Compare common reference points" : "常用参考点，点击对比"}</legend>
        <div>
          {referenceLevels.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={level === value}
              onClick={() => setRaw(String(value))}
            >
              <span>{value} dBA</span>
              <strong>{renderDuration(exposureMinutes(value)!, en)}</strong>
            </button>
          ))}
        </div>
      </fieldset>
      <p id="exposure-scope" className={styles.scope}>
        {en
          ? "Occupational reference only; it does not use this site's meter estimate. This is not a personal safety countdown or a bedroom target. Mixed levels, impulses and individual susceptibility need separate assessment."
          : "仅用于职业参考，不读取本站仪表估算。该时长不是个人安全倒计时，也不是卧室噪音目标；混合声级、冲击声与个人差异需要单独评估。"}
      </p>
    </div>
  );
}

function renderDuration(minutes: number, en: boolean) {
  const parts = durationParts(minutes);
  const units = [
    [parts.hours, en ? (parts.hours === 1 ? "hr" : "hrs") : "小时"],
    [parts.minutes, en ? "min" : "分钟"],
    [parts.hours ? 0 : parts.seconds, en ? "sec" : "秒"],
  ] as const;
  return units
    .filter(([value]) => value > 0)
    .map(([value, unit], index) => (
      <Fragment key={unit}>
        {index > 0 ? " " : parts.comparison ? `${parts.comparison} ` : null}
        <span className={styles.durationPart}>
          {value} <span className={styles.durationUnit}>{unit}</span>
        </span>
      </Fragment>
    ));
}
