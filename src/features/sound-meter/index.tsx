"use client";

import { localePrefix } from "@/lib/i18n/locales";
import { localize } from "@/lib/i18n/text";

import { useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { EMPTY_RECORDS, getRecords, watchRecords } from "@/features/records/storage";
import { saveRecord } from "@/features/records/mutations";
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
import { WorkbenchDialog } from "./workbench-dialog";
import { MeasurementReportDialog } from "./measurement-report";
import { reportCopy } from "./measurement-report/copy";
import { withMeasurementNote } from "./measurement-report/model";
import { RecordingResult } from "../audio-recording/recording-result";
import { currentBasis, displayFrame, measurementBasis } from "./readings";
import type { Locale, MeterView } from "./types";
import styles from "./index.module.css";

export function SoundMeter({ locale }: { locale: Locale }) {
  const copy = meterCopy[locale];
  const meter = useSoundMeter();
  const [view, setView] = useState<MeterView>("gauge");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resultDialog, setResultDialog] = useState<"save" | "export" | null>(null);
  const [reference, setReference] = useState({ enabled: false, value: "60", source: "" });
  const root = useRef<HTMLDivElement>(null);
  const exportAction = useRef<HTMLButtonElement>(null);
  const focus = useFocusMode(root);
  const records = useSyncExternalStore(watchRecords, getRecords, () => EMPTY_RECORDS);
  const prefix = localePrefix(locale);
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
  const existing = records.records.find((record) => record.id === meter.result?.id);
  const result = meter.result
    ? withMeasurementNote({ ...meter.result, recording: existing?.recording }, meter.note)
    : null;
  const saved = Boolean(
    result &&
    records.records.some((record) => record.id === result.id && record.note === result.note),
  );
  const stateLabel = {
    idle: copy.ready,
    requesting: copy.requesting,
    running: copy.live,
    demo: copy.demo,
    finished: copy.finished,
    error: copy.error,
  }[meter.status];

  async function save(includeAudio: boolean): ReturnType<typeof saveRecord> {
    if (!result) return "saveError";
    const clip = meter.recording.clip;
    const error = await saveRecord(
      result,
      includeAudio && clip?.measurementId === result.id ? clip : undefined,
    );
    meter.setMessage(error || "saved");
    return error;
  }

  const settingsProps = {
    locale,
    meter,
    view,
    onViewChange: setView,
    reference,
    onReferenceChange: setReference,
  };

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
            ) : meter.recording.phase === "finishing" ? (
              <span className={styles.captureNote} role="status">
                {localize(
                  locale,
                  "正在整理本机录音…",
                  "Preparing local recording…",
                  "正在整理本機錄音…",
                )}
              </span>
            ) : (
              <button
                type="button"
                className={styles.primary}
                onClick={() => {
                  setResultDialog(null);
                  void meter.start();
                }}
              >
                <Icon name="mic" size={18} />
                {meter.status === "finished" ? copy.restart : copy.start}
              </button>
            )}
            {result ? (
              <>
                {saved ? (
                  <span className={styles.captureNote}>
                    <Icon name="circle-check" size={15} />
                    {copy.savedAlready}
                  </span>
                ) : meter.recording.phase === "finishing" ? null : (
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => setResultDialog("save")}
                  >
                    <Icon name="save" size={16} />
                    {copy.save}
                  </button>
                )}
                <button
                  type="button"
                  ref={exportAction}
                  className={styles.secondary}
                  onClick={() => setResultDialog("export")}
                >
                  <Icon name="download" size={16} />
                  {reportCopy[locale].export}
                </button>
              </>
            ) : busy ? (
              <span className={styles.captureNote}>
                {requesting ? copy.waitHint : demo ? copy.demoNoSave : copy.privacy}
              </span>
            ) : null}
            <button
              type="button"
              className={`${styles.secondary} ${styles.settingsButton}`}
              aria-haspopup="dialog"
              onClick={() => setSettingsOpen(true)}
            >
              <Icon name="sliders-horizontal" size={16} />
              {localize(locale, "设置", "Settings", "設定")}
            </button>
          </div>
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
      </div>
      <div className={styles.settingsSlot}>
        <MeterSettings {...settingsProps} />
      </div>
      <WorkbenchDialog
        open={settingsOpen}
        title={copy.settings}
        closeLabel={reportCopy[locale].close}
        drawer
        onClose={() => setSettingsOpen(false)}
      >
        <MeterSettings {...settingsProps} inDrawer />
      </WorkbenchDialog>
      {result && resultDialog ? (
        <MeasurementReportDialog
          key={`${result.id}-${resultDialog}`}
          record={result}
          locale={locale}
          note={meter.note}
          recording={meter.recording}
          onNoteChange={meter.setNote}
          onSave={resultDialog === "save" ? save : undefined}
          onClose={() => setResultDialog(null)}
          returnFocus={exportAction}
        />
      ) : null}
    </div>
  );
}
