"use client";

import { useState } from "react";
import type { Locale } from "@/features/sound-meter/types";
import {
  durationParts,
  exposureMinutes,
  levelStep,
  maxLevel,
  minLevel,
  readLevel,
  referenceLevels,
} from "./model";
import styles from "./index.module.css";

export function ExposureExplorer({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const [raw, setRaw] = useState(String(minLevel));
  const level = readLevel(raw);
  const minutes = level === null ? null : exposureMinutes(level);

  return (
    <div className={styles.explorer}>
      <div className={styles.calculator}>
        <div className={styles.inputArea}>
          <label htmlFor="exposure-level-input">
            {en ? "Example sound level" : "输入声级示例"}
          </label>
          <div className={styles.number}>
            <input
              id="exposure-level-input"
              type="number"
              inputMode="decimal"
              min={minLevel}
              max={maxLevel}
              step={levelStep}
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              aria-invalid={level === null || undefined}
              aria-describedby="exposure-input-help exposure-scope"
            />
            <span>dBA</span>
          </div>
          <input
            id="exposure-level-range"
            className={styles.range}
            type="range"
            min={minLevel}
            max={maxLevel}
            step={levelStep}
            value={level ?? minLevel}
            onChange={(event) => setRaw(event.target.value)}
            aria-label={en ? "Adjust the example sound level" : "拖动滑块选择声级示例"}
            aria-valuetext={`${level ?? minLevel} dBA`}
            aria-describedby="exposure-input-help exposure-scope"
          />
          <div className={styles.scale} aria-hidden="true">
            <span>85</span>
            <span>100</span>
            <span>115 dBA</span>
          </div>
          <p id="exposure-input-help" className={level === null ? styles.error : styles.help}>
            {level === null
              ? en
                ? "Enter 85–115 dBA in steps of 0.5."
                : "请输入 85–115 dBA 之间的数值，步长为 0.5。"
              : en
                ? "Type a value or move the slider (85–115 dBA)."
                : "直接输入或拖动滑块（85–115 dBA）。"}
          </p>
        </div>
        <div className={styles.result}>
          <label htmlFor="exposure-duration">
            {en ? "Daily reference duration (approx.)" : "每日累计参考时长（约）"}
          </label>
          <output
            id="exposure-duration"
            htmlFor="exposure-level-input exposure-level-range"
            aria-live="polite"
            aria-atomic="true"
          >
            {minutes === null ? "—" : formatDuration(minutes, en)}
          </output>
          <p className={styles.help}>
            {en
              ? "Calculated for exposure at one constant level."
              : "按持续处于同一声级的情况推算。"}
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
              <strong>{formatDuration(exposureMinutes(value)!, en)}</strong>
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

function formatDuration(minutes: number, en: boolean): string {
  const parts = durationParts(minutes);
  return [
    parts.hours
      ? en
        ? `${parts.hours} ${parts.hours === 1 ? "hr" : "hrs"}`
        : `${parts.hours} 小时`
      : "",
    parts.minutes ? (en ? `${parts.minutes} min` : `${parts.minutes} 分钟`) : "",
    !parts.hours && parts.seconds ? (en ? `${parts.seconds} sec` : `${parts.seconds} 秒`) : "",
  ]
    .filter(Boolean)
    .join(" ");
}
