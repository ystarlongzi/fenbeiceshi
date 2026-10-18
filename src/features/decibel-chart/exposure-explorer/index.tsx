"use client";

import { useState } from "react";
import type { Locale } from "@/features/sound-meter/types";
import { readLevel } from "../sound-explorer/model";
import { exposureMinutes } from "./model";
import styles from "./index.module.css";

export function ExposureExplorer({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const [raw, setRaw] = useState("85");
  const level = readLevel(raw, 85, 100);
  const minutes = level === null ? null : exposureMinutes(level);
  const rounded = minutes === null ? null : Math.round(minutes);
  const hours = rounded === null ? 0 : Math.floor(rounded / 60);
  const rest = rounded === null ? 0 : rounded % 60;
  const duration =
    rounded === null
      ? "—"
      : [
          hours ? (en ? `${hours} ${hours === 1 ? "hour" : "hours"}` : `${hours} 小时`) : "",
          rest ? (en ? `${rest} ${rest === 1 ? "minute" : "minutes"}` : `${rest} 分钟`) : "",
        ]
          .filter(Boolean)
          .join(" ");

  return (
    <div className={styles.explorer}>
      <h3>{en ? "Explore the occupational reference" : "职业暴露关系演示"}</h3>
      <p className={styles.help}>
        {en
          ? "Manually explore 85–100 dBA. Each increase of 3 dBA halves the reference duration."
          : "手动选择 85–100 dBA，观察每增加 3 dBA 时参考时长减半的关系。"}
      </p>
      <label htmlFor="exposure-level-input">
        {en ? "Example occupational level (dBA)" : "职业声级示例（dBA）"}
      </label>
      <div className={styles.controls}>
        <input
          id="exposure-level-input"
          type="number"
          inputMode="numeric"
          min={85}
          max={100}
          step={1}
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          aria-invalid={level === null || undefined}
          aria-describedby="exposure-input-help"
        />
        <input
          id="exposure-level-range"
          type="range"
          min={85}
          max={100}
          step={1}
          value={level ?? 85}
          onChange={(event) => setRaw(event.target.value)}
          aria-label={
            en ? "Explore occupational level with the slider" : "拖动滑块选择职业声级示例"
          }
          aria-describedby="exposure-input-help"
        />
      </div>
      <p id="exposure-input-help" className={level === null ? styles.error : styles.help}>
        {level === null
          ? en
            ? "Enter a whole number from 85 to 100 dBA."
            : "请输入 85–100 dBA 之间的整数。"
          : en
            ? "Occupational reference only. This does not use the meter's uncalibrated estimate."
            : "仅用于职业参考关系演示，不读取仪表的未校准估算值。"}
      </p>
      <div className={styles.result}>
        <span>{en ? "Approximate daily reference duration" : "对应每日参考时长（约）"}</span>
        <output
          id="exposure-duration"
          htmlFor="exposure-level-input exposure-level-range"
          aria-live="polite"
          aria-atomic="true"
        >
          {duration}
        </output>
      </div>
      <p className={styles.help}>
        {en
          ? "This is not a personal safety countdown. Mixed exposures, impulses and individual susceptibility need separate assessment."
          : "该结果不是个人安全倒计时；混合暴露、冲击声和个人差异需要单独评估。"}
      </p>
    </div>
  );
}
