"use client";

import { useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import {
  EMPTY_RECORDS,
  downloadSummary,
  getRecords,
  saveRecord,
  watchRecords,
} from "@/features/records/storage";
import { meterCopy } from "./copy";
import { noiseGradient } from "./palette";
import { useSoundMeter } from "./use-sound-meter";
import { useFocusMode } from "./use-focus-mode";
import { MeterDisplay } from "./meter-display";
import { LevelScale } from "./level-scale";
import { NoiseLevelReference } from "./noise-level-reference";
import { SessionStats } from "./session-stats";
import { SoundTrend } from "./sound-trend";
import { MeterSettings } from "./meter-settings";
import { RecordingOptions } from "../audio-recording/recording-options";
import { RecordingResult } from "../audio-recording/recording-result";
import { currentBasis, displayFrame, measurementBasis } from "./readings";
import type { Locale, MeterView } from "./types";
import styles from "./index.module.css";

export function SoundMeter({ locale }: { locale: Locale }) {
  const copy = meterCopy[locale];
  const meter = useSoundMeter();
  const [view, setView] = useState<MeterView>("gauge");
  const root = useRef<HTMLDivElement>(null);
  const focus = useFocusMode(root);
  const records = useSyncExternalStore(watchRecords, getRecords, () => EMPTY_RECORDS);
  const prefix = locale === "en" ? "/en" : "";
  const demo = meter.status === "demo";
  const running = meter.status === "running";
  const requesting = meter.status === "requesting";
  const busy = running || demo || requesting;
  const basis = meter.result
    ? measurementBasis(meter.result)
    : currentBasis(demo ? null : meter.calibration);
  const frame = meter.frame ? displayFrame(meter.frame, basis) : null;
  const value = frame?.value ?? null;
  const calibrated = basis.mode === "reference-estimate";
  const saved = Boolean(
    meter.result && records.records.some((record) => record.id === meter.result?.id),
  );
  const stateLabel = {
    idle: copy.ready,
    requesting: copy.requesting,
    running: copy.live,
    demo: copy.demo,
    finished: copy.finished,
    error: copy.error,
  }[meter.status];

  function save() {
    if (!meter.result) return;
    const error = saveRecord(meter.result);
    meter.setMessage(error || "saved");
  }

  function exportResult() {
    if (!meter.result) return;
    try {
      downloadSummary(meter.result);
    } catch {
      meter.setMessage("exportError");
    }
  }

  return (
    <div
      ref={root}
      className={`${styles.workbench} ${focus.focused ? styles.focused : ""}`}
      style={{ "--noise-gradient": noiseGradient } as CSSProperties}
      role={focus.focused ? "dialog" : "region"}
      aria-modal={focus.focused || undefined}
      aria-labelledby="workspace-title"
      id="measure"
    >
      <div className={styles.main}>
        <div className={styles.toolbar}>
          <h2 id="workspace-title">
            <Icon name="audio-lines" size={18} />
            {copy.workspace}
          </h2>
          <div className={styles.toolbarActions}>
            <div className={styles.views} role="group" aria-label={copy.display}>
              {(["gauge", "digital", "bars"] as const).map((name) => (
                <button
                  type="button"
                  key={name}
                  aria-pressed={view === name}
                  onClick={() => setView(name)}
                >
                  {copy[name]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => void focus.toggle()}
              className={styles.fullscreen}
              aria-label={focus.focused ? copy.exitFullscreen : copy.fullscreen}
              title={focus.focused ? copy.exitFullscreen : copy.fullscreen}
              data-focus-exit={focus.focused ? "" : undefined}
            >
              <Icon name={focus.focused ? "minimize-2" : "maximize-2"} size={17} />
              <span>{focus.focused ? copy.exitFullscreen : copy.fullscreen}</span>
            </button>
          </div>
        </div>
        <div className={styles.surface} data-demo={demo}>
          <div className={styles.screenHeading}>
            <span className={styles.mode}>
              {demo ? copy.demoShort : calibrated ? copy.estimate : copy.generic}
            </span>
            <span className={styles.state} data-active={running || demo}>
              <i />
              {stateLabel}
            </span>
          </div>
          <MeterDisplay value={value} view={view} copy={copy} belowFloor={frame?.belowFloor} />
          <p className={styles.modeHint}>
            {demo
              ? copy.demoHint
              : frame?.belowFloor
                ? copy.floor
                : calibrated
                  ? copy.estimateHint
                  : copy.genericHint}
          </p>
          <div className={styles.controls}>
            {busy ? (
              <button
                type="button"
                className={`${styles.primary} ${running ? styles.stop : ""}`}
                onClick={() => meter.stop(requesting ? "cancelled" : "user")}
              >
                <Icon name={requesting ? "x" : "square"} size={16} />
                {requesting ? copy.cancel : demo ? copy.stopDemo : copy.stop}
              </button>
            ) : (
              <button
                type="button"
                className={styles.primary}
                disabled={meter.recording.phase === "finishing"}
                onClick={() => void meter.start()}
              >
                <Icon name="mic" size={18} />
                {meter.status === "finished" ? copy.restart : copy.start}
              </button>
            )}
            {!busy ? (
              <button
                type="button"
                className={styles.secondary}
                disabled={meter.recording.phase === "finishing"}
                onClick={meter.preview}
              >
                <Icon name="play" size={15} />
                {copy.preview}
              </button>
            ) : (
              <span className={styles.captureNote}>
                <Icon name="shield-check" size={14} />
                {requesting ? copy.waitHint : demo ? copy.demoNoSave : copy.privacy}
              </span>
            )}
          </div>
          <RecordingOptions locale={locale} recording={meter.recording} busy={busy} demo={demo} />
          {meter.frame?.clipped ? (
            <p className={styles.signalWarning}>
              <Icon name="circle-alert" size={14} />
              {copy.clipping}
            </p>
          ) : null}
          <LevelScale value={frame?.belowFloor ? null : value} copy={copy} />
          <NoiseLevelReference copy={copy} />
        </div>
        <div className={styles.announcements} aria-live="polite" aria-atomic="true">
          {focus.notice ? (
            <p>
              <Icon name="circle-alert" size={15} />
              {copy[focus.notice]}
            </p>
          ) : null}
          {meter.message ? (
            <p data-error={meter.status === "error"}>
              <Icon name={meter.message === "saved" ? "circle-check" : "circle-alert"} size={15} />
              {copy[meter.message]}
              {meter.status === "error" ? (
                <Link href={`${prefix}/knowledge/microphone-permission/`}>{copy.retryHelp}</Link>
              ) : null}
            </p>
          ) : null}
        </div>
        <SessionStats frame={frame} copy={copy} demo={demo} />
        <SoundTrend
          points={frame?.points || []}
          copy={copy}
          demo={demo}
          belowFloor={frame?.belowFloor}
        />
        <RecordingResult locale={locale} recording={meter.recording} />
        <div className={styles.resultActions}>
          <span>{demo ? copy.demoNoSave : meter.result ? copy.metadata : copy.resultHint}</span>
          <div>
            <button type="button" onClick={save} disabled={!meter.result || saved}>
              <Icon name="save" size={15} />
              {saved ? copy.savedAlready : copy.save}
            </button>
            <button type="button" onClick={exportResult} disabled={!meter.result}>
              <Icon name="download" size={15} />
              {copy.export}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.settingsSlot}>
        <MeterSettings locale={locale} meter={meter} />
      </div>
    </div>
  );
}
