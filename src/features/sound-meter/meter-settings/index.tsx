"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { meterCopy } from "../copy";
import type { Locale } from "../types";
import type { useSoundMeter } from "../use-sound-meter";
import { InputSignal } from "../input-signal";
import styles from "./index.module.css";

export function MeterSettings({
  locale,
  meter,
}: {
  locale: Locale;
  meter: ReturnType<typeof useSoundMeter>;
}) {
  const copy = meterCopy[locale];
  const calibrated = Boolean(meter.calibration);
  const prefix = locale === "en" ? "/en" : "";
  const [referenceValue, setReferenceValue] = useState("");
  const [source, setSource] = useState("");
  const running = meter.status === "running";
  const busy = running || meter.status === "demo" || meter.status === "requesting";
  return (
    <aside className={styles.aside} aria-label={copy.settings}>
      <div className={styles.asideTitle}>
        <Icon name="sliders-horizontal" size={18} />
        <h2>{copy.settings}</h2>
      </div>
      {meter.result ? <p className={styles.nextSettings}>{copy.nextSettings}</p> : null}
      <section className={styles.settingGroup}>
        <div className={styles.inputHeading}>
          <h3>
            <Icon name="mic" size={15} />
            {copy.microphone}
          </h3>
          <InputSignal frame={meter.frame} status={meter.status} copy={copy} />
        </div>
        <label className={styles.srOnly} htmlFor="input-device">
          {copy.microphone}
        </label>
        <select
          id="input-device"
          value={meter.deviceId}
          disabled={busy}
          onChange={(event) => meter.changeDevice(event.target.value)}
        >
          <option value="">{copy.defaultInput}</option>
          {meter.devices
            .filter((device) => device.deviceId !== "default")
            .map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || copy.microphone}
              </option>
            ))}
        </select>
        {meter.input ? <p className={styles.inputLabel}>{meter.input.label}</p> : null}
        <p>{copy.deviceHint}</p>
        {meter.input?.processing ? (
          <p className={styles.inputWarning}>{copy.inputProcessed}</p>
        ) : null}
      </section>
      <section className={styles.settingGroup}>
        <h3>
          <Icon name="sliders-horizontal" size={15} />
          {copy.calibration}
        </h3>
        <span className={styles.calibrationBadge} data-set={calibrated}>
          <i />
          {calibrated ? copy.calibrated : copy.notCalibrated}
        </span>
        <p>{copy.calibrationHint}</p>
        <details className={styles.calibrationDetails}>
          <summary>
            {copy.applyCalibration}
            <Icon name="chevron-down" size={14} />
          </summary>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              meter.calibrate(Number(referenceValue), source);
            }}
          >
            <label htmlFor="reference-level">
              {copy.referenceValue}
              <span className={styles.inputUnit}>
                <input
                  id="reference-level"
                  type="number"
                  min="20"
                  max="120"
                  step="0.1"
                  required
                  value={referenceValue}
                  onChange={(event) => setReferenceValue(event.target.value)}
                  placeholder="60.0"
                />
                <span>dB</span>
              </span>
            </label>
            <label htmlFor="reference-source">
              {copy.calibrationSource}
              <input
                id="reference-source"
                required
                maxLength={120}
                value={source}
                onChange={(event) => setSource(event.target.value)}
                placeholder={copy.sourcePlaceholder}
              />
            </label>
            <button type="submit" disabled={!running || !meter.frame || meter.frame.clipped}>
              {copy.applyCalibration}
            </button>
            <p>{copy.calibrationReady}</p>
          </form>
        </details>
        {meter.calibration ? (
          <button
            type="button"
            className={styles.textButton}
            disabled={!running}
            onClick={meter.clearCalibration}
          >
            {copy.clearCalibration}
          </button>
        ) : null}
        <Link href={`${prefix}/calibration/`} className={styles.helpLink}>
          {copy.calibrationHelp}
          <Icon name="arrow-right" size={13} />
        </Link>
        <p className={styles.sessionOnly}>{copy.sessionOnly}</p>
      </section>
      <section className={styles.settingGroup}>
        <h3>
          <Icon name="book-open" size={15} />
          {copy.note}
        </h3>
        <label htmlFor="observation-note" className={styles.srOnly}>
          {copy.note}
        </label>
        <textarea
          id="observation-note"
          maxLength={120}
          rows={3}
          value={meter.note}
          disabled={meter.status === "finished"}
          onChange={(event) => meter.setNote(event.target.value)}
          placeholder={copy.notePlaceholder}
        />
        <p>{copy.noteHint}</p>
      </section>
      <div className={styles.privacy}>
        <Icon name="shield-check" size={20} />
        <div>
          <strong>{copy.privacy}</strong>
          <p>{copy.privacyHint}</p>
          <Link href={`${prefix}/privacy/`}>
            {locale === "en" ? "Privacy details" : "了解隐私与本机数据"}
            <Icon name="arrow-right" size={12} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
