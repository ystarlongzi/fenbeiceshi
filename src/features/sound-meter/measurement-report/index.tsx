"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Icon } from "@/components/icon";
import { getRecordingCopy } from "../../audio-recording/copy";
import type { useAudioRecording } from "../../audio-recording/use-audio-recording";
import type { saveRecord } from "../../records/mutations";
import { useStoredRecording } from "../../records/use-stored-recording";
import { WorkbenchDialog } from "../workbench-dialog";
import { getMeterCopy } from "../copy";
import type { Locale, Measurement } from "../types";
import { localeSettings } from "@/lib/i18n/locales";
import { getReportCopy } from "./copy";
import { createReport, reportText } from "./model";
import { exportReport, type FileFormat } from "./export";
import { AudioReportActions } from "./audio-actions";
import styles from "./index.module.css";

const STAT_ICONS = ["arrow-down", "arrow-up", "audio-lines"] as const;

export function MeasurementReportDialog({
  record,
  locale,
  note,
  noteHint,
  recording: liveRecording,
  onNoteChange,
  onSave,
  onClose,
  returnFocus,
}: {
  record: Measurement;
  locale: Locale;
  note: string;
  noteHint?: string;
  recording?: ReturnType<typeof useAudioRecording>;
  onNoteChange: (note: string) => void;
  onSave?: (includeAudio: boolean) => ReturnType<typeof saveRecord>;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  const copy = getReportCopy(locale);
  const meter = getMeterCopy(locale);
  const report = createReport(record, locale);
  // 上次录音会保留到新录音开始，报告只允许下载同一次测量的音频。
  const liveClip = liveRecording?.clip?.measurementId === record.id ? liveRecording.clip : null;
  const stored = useStoredRecording(record.id, !onSave && !liveClip ? record.recording : undefined);
  const recording = liveClip ? liveRecording : stored;
  const clip = recording?.clip?.measurementId === record.id ? recording.clip : null;
  const audio = getRecordingCopy(locale);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const actions = useRef<HTMLDivElement>(null);
  const saveAction = useRef<HTMLButtonElement>(null);
  const saveAttempt = useRef(false);
  const lastAction = useRef<FileFormat | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (pending) return;
    if (lastAction.current)
      actions.current
        ?.querySelector<HTMLButtonElement>(`[data-format="${lastAction.current}"]`)
        ?.focus();
    else if (saveAttempt.current) {
      saveAction.current?.focus();
      saveAttempt.current = false;
    }
  }, [pending]);

  async function download(format: FileFormat) {
    lastAction.current = format;
    setPending(true);
    setError(false);
    setFeedback(copy.preparing);
    try {
      await exportReport(report, format);
      setFeedback(copy.downloading);
    } catch (cause) {
      console.error("测量报告生成失败。", format, cause);
      setError(true);
      setFeedback(copy.exportError);
    } finally {
      setPending(false);
    }
  }

  async function copySummary() {
    setManualCopy(null);
    setError(false);
    const text = reportText(report);
    try {
      await navigator.clipboard.writeText(text);
      setFeedback(copy.copied);
    } catch {
      setError(true);
      setManualCopy(text);
      setFeedback(copy.copyError);
    }
  }

  async function save() {
    if (!onSave || pending) return;
    saveAttempt.current = true;
    setPending(true);
    setError(false);
    setFeedback("");
    try {
      const code = await onSave(includeAudio);
      if (!mounted.current) return;
      if (!code) onClose();
      else {
        setError(true);
        setFeedback(meter[code]);
      }
    } catch (cause) {
      console.error("保存报告失败。", cause);
      if (mounted.current) {
        setError(true);
        setFeedback(meter.saveError);
      }
    } finally {
      if (mounted.current) setPending(false);
    }
  }

  return (
    <WorkbenchDialog
      open
      title={onSave ? copy.saveTitle : copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      returnFocus={returnFocus}
    >
      <p className={styles.context}>
        {report.mode} · {report.unit}
      </p>
      <p className={styles.date}>
        <time dateTime={record.startedAt}>
          {new Date(record.startedAt).toLocaleString(localeSettings[locale].date)}
        </time>
        <span>
          {copy.durationLabel} {report.duration}
        </span>
      </p>
      <dl className={styles.stats}>
        {report.stats.map((stat, index) => (
          <div key={stat.label}>
            <dt>
              <Icon name={STAT_ICONS[index]} size={14} />
              <span>{stat.label}</span>
            </dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
      <label className={styles.note}>
        {copy.note}
        <textarea
          rows={2}
          maxLength={120}
          value={note}
          onChange={(event) => {
            onNoteChange(event.target.value);
            setFeedback("");
            setManualCopy(null);
          }}
          placeholder={meter.notePlaceholder}
          readOnly={pending}
        />
        <span>
          {noteHint ?? copy.noteHint} {note.length}/120
        </span>
      </label>
      {onSave ? (
        <form
          className={styles.save}
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <p>{copy.saveHint}</p>
          {liveClip ? (
            <label className={styles.saveAudio}>
              <input
                type="checkbox"
                checked={includeAudio}
                disabled={pending}
                onChange={(event) => setIncludeAudio(event.target.checked)}
              />
              <span>
                {copy.saveAudio}
                <small>{copy.saveAudioHint}</small>
              </span>
            </label>
          ) : null}
          {pending ? (
            <p role="status">{copy.saving}</p>
          ) : (
            <button ref={saveAction} type="submit">
              <Icon name="save" size={16} />
              {meter.save}
            </button>
          )}
        </form>
      ) : (
        <>
          <p className={styles.notice}>
            <Icon name="circle-alert" size={16} className={styles.noticeIcon} />
            <span>{report.notice}</span>
          </p>
          {pending ? null : (
            <div
              ref={actions}
              className={styles.actions}
              data-audio={!!clip}
              aria-label={copy.export}
            >
              {(["csv", "excel", "pdf", "copy"] as const).map((format) => (
                <button
                  type="button"
                  key={format}
                  data-format={format}
                  onClick={() => (format === "copy" ? void copySummary() : void download(format))}
                >
                  <span>
                    {format === "copy" ? null : <Icon name="download" size={16} />}
                    {copy[format]}
                  </span>
                  <small>{copy[`${format}Hint`]}</small>
                </button>
              ))}
              {clip && recording ? (
                <AudioReportActions clip={clip} recording={recording} locale={locale} />
              ) : null}
            </div>
          )}
          {clip ? <p className={styles.audioHint}>{copy.audioHint}</p> : null}
          <div className={styles.audioStatus} role="status">
            {!liveClip && record.recording && stored.status === "loading" ? (
              <p data-tone="info">{copy.loadingAudio}</p>
            ) : null}
            {!liveClip && record.recording && stored.status === "missing" ? (
              <p>{copy.audioMissing}</p>
            ) : null}
            {!liveClip && record.recording && stored.status === "error" ? (
              <p data-error="true">{copy.audioReadError}</p>
            ) : null}
            {clip?.limited ? <p>{audio.limited}</p> : null}
            {clip?.interrupted ? <p>{audio.interrupted}</p> : null}
            {clip && recording?.mp3.phase === "error" ? (
              <p data-error="true">{audio.encodeError}</p>
            ) : null}
            {liveRecording?.measurementId === record.id && liveRecording.phase === "finishing" ? (
              <p data-tone="info">{audio.finishing}</p>
            ) : null}
          </div>
        </>
      )}
      <p className={styles.feedback} role="status" data-error={error}>
        {feedback}
      </p>
      {manualCopy !== null ? (
        <label className={styles.note}>
          {copy.manualCopy}
          <textarea
            readOnly
            rows={6}
            value={manualCopy}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      ) : null}
    </WorkbenchDialog>
  );
}
