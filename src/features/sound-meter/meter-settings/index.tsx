"use client";

import { useId } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { LinkArrow } from "@/components/link-arrow";
import { NumberInput } from "@/components/number-input";
import { numberIssue, readNumber } from "@/components/number-input/model";
import { Switch } from "@/components/switch";
import { RecordingOptions } from "../../audio-recording/recording-options";
import { meterCopy } from "../copy";
import type { Locale, MeterView } from "../types";
import type { useSoundMeter } from "../use-sound-meter";
import { InputSignal } from "../input-signal";
import { DeviceSelect } from "./device-select";
import styles from "./index.module.css";

export type ReferenceDraft = { enabled: boolean; value: string; source: string };

const referenceBounds = { min: 20, max: 120, step: 0.1, required: true };

export function MeterSettings({
  locale,
  meter,
  view,
  onViewChange,
  reference,
  onReferenceChange,
  inDrawer = false,
}: {
  locale: Locale;
  meter: ReturnType<typeof useSoundMeter>;
  view: MeterView;
  onViewChange: (view: MeterView) => void;
  reference: ReferenceDraft;
  onReferenceChange: (draft: ReferenceDraft) => void;
  inDrawer?: boolean;
}) {
  const copy = meterCopy[locale];
  const id = useId();
  const prefix = locale === "en" ? "/en" : "";
  const running = meter.status === "running";
  const demo = meter.status === "demo";
  const busy = running || demo || meter.status === "requesting";
  const value = readNumber(reference.value) ?? NaN;
  const referenceInvalid = numberIssue(reference.value, referenceBounds) !== null;
  const canCalibrate =
    running &&
    meter.frame &&
    !meter.frame.clipped &&
    meter.frame.value > -90 &&
    meter.frame.value <= 0 &&
    !referenceInvalid &&
    reference.source.trim().length > 0;

  return (
    <aside className={styles.aside} aria-label={copy.settings}>
      {inDrawer ? null : (
        <div className={styles.asideTitle}>
          <Icon name="sliders-horizontal" size={18} />
          <h2>{copy.settings}</h2>
        </div>
      )}
      <section className={styles.settingGroup}>
        <div className={styles.inputHeading}>
          <h3>
            <Icon name="mic" size={15} />
            {copy.microphone}
          </h3>
          <InputSignal frame={meter.frame} status={meter.status} copy={copy} />
        </div>
        <DeviceSelect
          devices={meter.devices}
          value={meter.deviceId}
          disabled={busy}
          label={copy.microphone}
          defaultLabel={copy.defaultInput}
          onChange={(deviceId) => {
            if (deviceId === meter.deviceId) return;
            meter.changeDevice(deviceId);
            onReferenceChange({ ...reference, enabled: false });
          }}
        />
        {meter.input ? <p className={styles.inputLabel}>{meter.input.label}</p> : null}
        <p>{copy.deviceHint}</p>
        {meter.input?.processing ? (
          <p className={styles.inputWarning}>{copy.inputProcessed}</p>
        ) : null}
      </section>
      <section className={styles.settingGroup}>
        <h3>{copy.display}</h3>
        <div className={styles.views} role="group" aria-label={copy.display}>
          {(["gauge", "digital", "bars"] as const).map((name) => (
            <button
              type="button"
              key={name}
              aria-pressed={view === name}
              onClick={() => onViewChange(name)}
            >
              <svg viewBox="0 0 64 40" aria-hidden="true" focusable="false">
                {name === "gauge" ? (
                  <>
                    <path d="M9 32a23 23 0 0 1 46 0" />
                    <path d="m32 30 12-15M15 29h4m1-15 3 4m9-9v5m12 0-3 4m8 11h-4" />
                    <circle cx="32" cy="30" r="2" />
                  </>
                ) : name === "digital" ? (
                  <text x="32" y="29" textAnchor="middle">
                    56.2
                  </text>
                ) : (
                  <>
                    <path d="M12 31V22m8 9V15m8 16V9m8 22V13m8 18V5m8 26V18" strokeWidth="5" />
                    <path d="M10 36h44" />
                  </>
                )}
              </svg>
              <span>{copy[name]}</span>
            </button>
          ))}
        </div>
      </section>
      <section className={styles.settingGroup}>
        <RecordingOptions locale={locale} recording={meter.recording} busy={busy} demo={demo} />
      </section>
      <section className={styles.settingGroup}>
        <Switch
          checked={reference.enabled}
          onCheckedChange={(enabled) => {
            if (!enabled) meter.clearCalibration();
            onReferenceChange({ ...reference, enabled });
          }}
          describedBy={`${id}-calibration-hint`}
          controls={reference.enabled ? `${id}-calibration-form` : undefined}
          setting="calibration"
        >
          <Icon name="sliders-horizontal" size={15} />
          {copy.calibration}
        </Switch>
        <p id={`${id}-calibration-hint`}>{copy.calibrationHint}</p>
        {reference.enabled ? (
          <form
            id={`${id}-calibration-form`}
            className={styles.calibrationForm}
            onSubmit={(event) => {
              event.preventDefault();
              if (canCalibrate) meter.calibrate(value, reference.source);
            }}
          >
            <label htmlFor={`${id}-reference`}>{copy.referenceValue}</label>
            <div className={styles.referenceControls}>
              <input
                type="range"
                className={styles.referenceRange}
                min="20"
                max="120"
                step="0.1"
                value={Number.isFinite(value) ? Math.max(20, Math.min(120, value)) : 60}
                aria-label={copy.referenceValue + (locale === "en" ? " slider" : "滑块")}
                onChange={(event) => onReferenceChange({ ...reference, value: event.target.value })}
              />
              <NumberInput
                id={`${id}-reference`}
                label={copy.referenceValue}
                locale={locale}
                {...referenceBounds}
                value={reference.value}
                onValueChange={(next) => onReferenceChange({ ...reference, value: next })}
                suffix="dB"
                className={styles.referenceNumber}
                aria-describedby={`${id}-calibration-hint${referenceInvalid ? ` ${id}-reference-error` : ""}`}
              />
            </div>
            {referenceInvalid ? (
              <p id={`${id}-reference-error`} className={styles.referenceError} role="status">
                {locale === "en"
                  ? "Enter 20–120 dB in steps of 0.1."
                  : "请输入 20–120 dB 之间的数值，步长为 0.1。"}
              </p>
            ) : null}
            <label htmlFor={`${id}-source`}>
              {copy.calibrationSource}
              <input
                id={`${id}-source`}
                className={styles.sourceInput}
                required
                maxLength={120}
                value={reference.source}
                onChange={(event) =>
                  onReferenceChange({ ...reference, source: event.target.value })
                }
                placeholder={copy.sourcePlaceholder}
              />
            </label>
            {canCalibrate ? <button type="submit">{copy.applyCalibration}</button> : null}
            <p>{copy.calibrationReady}</p>
          </form>
        ) : null}
        <Link href={`${prefix}/calibration/`} className={styles.helpLink}>
          {copy.calibrationHelp}
          <LinkArrow size={13} />
        </Link>
        <p className={styles.sessionOnly}>{copy.sessionOnly}</p>
      </section>
    </aside>
  );
}
