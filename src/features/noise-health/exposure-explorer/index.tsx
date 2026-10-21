"use client";
import { localize, text } from "@/lib/i18n/text";

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
          <label htmlFor="exposure-level-input">
            {localize(locale, "噪音水平", "Noise level", "噪音水平")}
          </label>
          <NumberInput
            id="exposure-level-input"
            label={localize(locale, "噪音水平", "Noise level", "噪音水平")}
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
            aria-label={localize(
              locale,
              "拖动滑块选择噪音水平",
              "Adjust noise level",
              "拖動滑桿選擇噪音水平",
            )}
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
              {localize(
                locale,
                "请输入 40–130 dBA 之间的数值，步长为 0.5。",
                "Enter 40–130 dBA in steps of 0.5.",
                "請輸入 40–130 dBA 之間的數值，步長為 0.5。",
              )}
            </p>
          ) : null}
        </div>
        <div className={styles.result}>
          <label htmlFor="exposure-duration">
            {localize(
              locale,
              "每日累计参考时长（约）",
              "Daily reference duration (approx.)",
              "每日累計參考時長（約）",
            )}
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
              {minutes === null ? "—" : renderDuration(minutes, locale)}
            </output>
            {band ? (
              <span id="exposure-level-band" className={styles.band} style={{ color }}>
                {text(band.title, locale)}
              </span>
            ) : null}
          </div>
          <p id="exposure-note" className={styles.help} aria-live="polite" aria-atomic="true">
            {text(note, locale)}
          </p>
        </div>
      </div>
      <fieldset className={styles.presets}>
        <legend>
          {localize(locale, "每日累计暴露参考", "Daily exposure reference", "每日累計暴露參考")}
        </legend>
        <div>
          {exposureReferences.map(({ level: value, description }) => (
            <button
              key={value}
              type="button"
              aria-pressed={level === value}
              onClick={() => setRaw(String(value))}
            >
              <span className={styles.presetHeader}>
                <span className={styles.levelBadge}>{value} dBA</span>
                <strong className={styles.timeBadge} style={{ color: readingColor(value, "ink") }}>
                  {renderDuration(exposureMinutes(value)!, locale)}
                </strong>
              </span>
              <span className={styles.presetDescription}>{text(description, locale)}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <p id="exposure-scope" className={styles.scope}>
        {localize(
          locale,
          "仅用于职业参考，不读取本站仪表估算。该时长不是个人安全倒计时，也不是卧室噪音目标；混合声级、冲击声与个人差异需要单独评估。",
          "Occupational reference only; it does not use this site's meter estimate. This is not a personal safety countdown or a bedroom target. Mixed levels, impulses and individual susceptibility need separate assessment.",
          "僅用於職業參考，不讀取本站儀表估算。該時長不是個人安全倒計時，也不是臥室噪音目標；混合聲級、衝擊聲與個人差異需要單獨評估。",
        )}
      </p>
    </div>
  );
}

function renderDuration(minutes: number, locale: Locale) {
  const parts = durationParts(minutes);
  const units = [
    [parts.hours, localize(locale, "小时", parts.hours === 1 ? "hr" : "hrs", "小時")],
    [parts.minutes, localize(locale, "分钟", "min", "分鐘")],
    [parts.hours ? 0 : parts.seconds, localize(locale, "秒", "sec", "秒")],
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
