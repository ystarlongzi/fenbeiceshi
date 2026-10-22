"use client";

import { localePrefix } from "@/lib/i18n/locales";
import { localize } from "@/lib/i18n/text";

import { useId } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { LinkArrow } from "@/components/link-arrow";
import { NumberInput } from "@/components/number-input";
import { numberIssue } from "@/components/number-input/model";
import { Switch } from "@/components/switch";
import { adjustmentBounds } from "../../calibration/adjustment";
import { RecordingOptions } from "../../audio-recording/recording-options";
import { meterCopy } from "../copy";
import type { Locale, MeterView } from "../types";
import type { useSoundMeter } from "../use-sound-meter";
import { InputSignal } from "../input-signal";
import { DeviceSelect } from "./device-select";
import styles from "./index.module.css";

export function MeterSettings({
  locale,
  meter,
  view,
  onViewChange,
  inDrawer = false,
}: {
  locale: Locale;
  meter: ReturnType<typeof useSoundMeter>;
  view: MeterView;
  onViewChange: (view: MeterView) => void;
  inDrawer?: boolean;
}) {
  const copy = meterCopy[locale];
  const id = useId();
  const prefix = localePrefix(locale);
  const running = meter.status === "running";
  const demo = meter.status === "demo";
  const busy = running || demo || meter.status === "requesting";
  const { adjustment } = meter;
  const adjustmentInvalid = numberIssue(adjustment.draft, adjustmentBounds) !== null;
  const adjustmentLocked = demo || meter.status === "requesting" || meter.status === "finished";

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
          checked={adjustment.enabled}
          onCheckedChange={meter.enableAdjustment}
          disabled={adjustmentLocked}
          describedBy={`${id}-calibration-hint`}
          controls={adjustment.enabled ? `${id}-adjustment-controls` : undefined}
          setting="calibration"
        >
          <Icon name="sliders-horizontal" size={15} />
          {copy.calibration}
        </Switch>
        <p id={`${id}-calibration-hint`}>{copy.calibrationHint}</p>
        {adjustment.enabled ? (
          <div id={`${id}-adjustment-controls`} className={styles.adjustment}>
            <label htmlFor={`${id}-adjustment`}>{copy.adjustmentValue}</label>
            <div className={styles.referenceControls}>
              <input
                type="range"
                className={styles.referenceRange}
                min={adjustmentBounds.min}
                max={adjustmentBounds.max}
                step={adjustmentBounds.step}
                value={adjustment.offset}
                disabled={adjustmentLocked}
                aria-label={copy.adjustmentValue + localize(locale, "滑块", " slider", "滑桿")}
                onChange={(event) => meter.setAdjustmentDraft(event.target.value)}
              />
              <NumberInput
                id={`${id}-adjustment`}
                label={copy.adjustmentValue}
                locale={locale}
                {...adjustmentBounds}
                value={adjustment.draft}
                onValueChange={meter.setAdjustmentDraft}
                disabled={adjustmentLocked}
                suffix="dB"
                showStepper={false}
                className={styles.referenceNumber}
                aria-describedby={`${id}-calibration-hint${adjustmentInvalid ? ` ${id}-adjustment-error` : ""}`}
              />
            </div>
            {adjustmentInvalid ? (
              <p id={`${id}-adjustment-error`} className={styles.referenceError} role="status">
                {copy.adjustmentError}
              </p>
            ) : null}
          </div>
        ) : null}
        {adjustmentLocked ? (
          <p>
            {meter.status === "finished" ? copy.adjustmentFinished : copy.adjustmentUnavailable}
          </p>
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
