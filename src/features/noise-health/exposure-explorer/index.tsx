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
} from "./model";
import { exposureNotes, exposureReferences } from "./copy";
import styles from "./index.module.css";

export function ExposureExplorer({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const [raw, setRaw] = useState(String(defaultLevel));
  const level = readLevel(raw);
  const band = readingBand(level);
  const color = readingColor(level, "ink");
  const minutes = level === null ? null : exposureMinutes(level);
  const note = exposureNotes[exposureContext(level)];
  const inputDescription =
    level === null ? "exposure-input-error exposure-scope" : "exposure-scope";

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
            aria-describedby={inputDescription}
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
            aria-describedby={inputDescription}
          />
          <div className={styles.scale} aria-hidden="true">
            <span>40</span>
            <span>85</span>
            <span>130 dBA</span>
          </div>
          {level === null ? (
            <p id="exposure-input-error" className={styles.error}>
              {en
                ? "Enter 40–130 dBA in steps of 0.5."
                : "请输入 40–130 dBA 之间的数值，步长为 0.5。"}
            </p>
          ) : null}
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
        <legend>{en ? "Daily exposure reference" : "每日累计暴露参考"}</legend>
        <div>
          {exposureReferences.map(({ level: value, description }) => (
            <button
              key={value}
              type="button"
              aria-pressed={level === value}
              onClick={() => setRaw(String(value))}
            >
              <span className={styles.presetHeader} style={{ color: readingColor(value, "ink") }}>
                <span className={styles.levelBadge}>{value} dBA</span>
                <strong className={styles.timeBadge}>
                  {renderDuration(exposureMinutes(value)!, en)}
                </strong>
              </span>
              <span className={styles.presetDescription}>
                {en ? description.en : description.zh}
              </span>
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
