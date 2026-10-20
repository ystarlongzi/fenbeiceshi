"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Icon } from "@/components/icon";
import type { saveRecord } from "../../records/storage";
import { WorkbenchDialog } from "../workbench-dialog";
import { meterCopy } from "../copy";
import type { Locale, Measurement } from "../types";
import { reportCopy } from "./copy";
import { createReport, reportText } from "./model";
import { exportReport, type FileFormat } from "./export";
import styles from "./index.module.css";

const STAT_ICONS = ["arrow-down", "arrow-up", "audio-lines"] as const;

export function MeasurementReportDialog({
  record,
  locale,
  note,
  noteHint,
  onNoteChange,
  onSave,
  onClose,
  returnFocus,
}: {
  record: Measurement;
  locale: Locale;
  note: string;
  noteHint?: string;
  onNoteChange: (note: string) => void;
  onSave?: () => ReturnType<typeof saveRecord>;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  const copy = reportCopy[locale];
  const meter = meterCopy[locale];
  const report = createReport(record, locale);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const actions = useRef<HTMLDivElement>(null);
  const lastAction = useRef<FileFormat | null>(null);

  useEffect(() => {
    if (!pending && lastAction.current)
      actions.current
        ?.querySelector<HTMLButtonElement>(`[data-format="${lastAction.current}"]`)
        ?.focus();
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
          {new Date(record.startedAt).toLocaleString(locale === "en" ? "en-GB" : "zh-CN")}
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
            const code = onSave();
            if (!code) onClose();
            else {
              setError(true);
              setFeedback(meter[code]);
            }
          }}
        >
          <p>{copy.saveHint}</p>
          <button type="submit">
            <Icon name="save" size={16} />
            {meter.save}
          </button>
        </form>
      ) : (
        <>
          <p className={styles.notice}>
            <Icon name="circle-alert" size={16} className={styles.noticeIcon} />
            <span>{report.notice}</span>
          </p>
          {pending ? null : (
            <div ref={actions} className={styles.actions} aria-label={copy.export}>
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
            </div>
          )}
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
