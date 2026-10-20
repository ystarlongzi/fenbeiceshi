"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Icon } from "@/components/icon";
import { recordingCopy } from "../../audio-recording/copy";
import { recordingFilename } from "../../audio-recording/pcm";
import type { useAudioRecording } from "../../audio-recording/use-audio-recording";
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
  recording,
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
  onSave?: () => ReturnType<typeof saveRecord>;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  const copy = reportCopy[locale];
  const meter = meterCopy[locale];
  const report = createReport(record, locale);
  // 上次录音会保留到新录音开始，报告只允许下载同一次测量的音频。
  const clip = recording?.clip?.measurementId === record.id ? recording.clip : null;
  const audio = recordingCopy[locale];
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const actions = useRef<HTMLDivElement>(null);
  const pcmAction = useRef<HTMLAnchorElement>(null);
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
                <>
                  {recording.mp3.url ? (
                    <a href={recording.mp3.url} download={recordingFilename(clip, "mp3")}>
                      <span>
                        <Icon name="download" size={16} />
                        {audio.mp3Ready}
                      </span>
                      <small>{copy.mp3Hint}</small>
                    </a>
                  ) : recording.mp3.phase === "encoding" ? (
                    <div className={styles.encoding} role="status">
                      <span>{audio.encoding}</span>
                      <small>{copy.mp3Hint}</small>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        recording.createMp3();
                        pcmAction.current?.focus();
                      }}
                    >
                      <span>
                        <Icon name="download" size={16} />
                        {audio.mp3}
                      </span>
                      <small>{copy.mp3Hint}</small>
                    </button>
                  )}
                  <a ref={pcmAction} href={clip.pcmUrl} download={recordingFilename(clip, "pcm")}>
                    <span>
                      <Icon name="download" size={16} />
                      {audio.pcm}
                    </span>
                    <small>{clip.sampleRate} Hz · mono · s16le</small>
                  </a>
                </>
              ) : null}
            </div>
          )}
          {clip ? <p className={styles.audioHint}>{copy.audioHint}</p> : null}
          <div className={styles.audioStatus} role="status">
            {clip?.limited ? <p>{audio.limited}</p> : null}
            {clip?.interrupted ? <p>{audio.interrupted}</p> : null}
            {clip && recording?.mp3.phase === "error" ? (
              <p data-error="true">{audio.encodeError}</p>
            ) : null}
            {recording?.measurementId === record.id && recording.phase === "finishing" ? (
              <p>{audio.finishing}</p>
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
