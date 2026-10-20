"use client";

import { useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { LinkArrow } from "@/components/link-arrow";
import { text } from "@/lib/content/types";
import { meterCopy } from "../sound-meter/copy";
import { formatDuration } from "../sound-meter/level";
import { displayStats, formatReading, measurementBasis } from "../sound-meter/readings";
import { readingColor } from "../sound-meter/palette";
import type { Locale, Measurement } from "../sound-meter/types";
import { EMPTY_RECORDS, compareRecords, deleteRecord, getRecords, watchRecords } from "./storage";
import styles from "./index.module.css";
import { recordBand } from "./level";
import { RecordExportDialog } from "./record-export-dialog";

export function RecordsPanel({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const copy = meterCopy[locale];
  const en = locale === "en";
  const state = useSyncExternalStore(watchRecords, getRecords, () => EMPTY_RECORDS);
  const [picked, setPicked] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [reportRecord, setReportRecord] = useState<Measurement | null>(null);
  const exportAction = useRef<HTMLButtonElement | null>(null);
  const prefix = locale === "en" ? "/en" : "";
  const records = compact ? state.records.slice(0, 3) : state.records;
  const empty = !records.length && !state.error;
  const selected = picked.filter((id) => state.records.some((record) => record.id === id));
  const pair = state.records
    .filter((record) => selected.includes(record.id))
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  const difference = pair.length === 2 ? compareRecords(pair[0], pair[1]) : null;
  const date = (record: Measurement) =>
    new Intl.DateTimeFormat(locale, {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(record.startedAt));

  function remove(id: string) {
    const error = deleteRecord(id);
    setConfirm(null);
    if (error) setMessage(copy[error]);
    else {
      setPicked((items) => items.filter((item) => item !== id));
      setMessage(null);
    }
  }

  return (
    <section
      className={`${styles.panel} ${compact ? styles.compact : styles.workspace}`}
      aria-label={copy.records}
    >
      {compact || !empty ? (
        <div className={styles.heading}>
          <div>
            <h2>
              <Icon name="save" size={17} />
              {copy.records}
              <span>{state.records.length}</span>
            </h2>
            <p>{compact ? copy.noAudio : copy.recordsHint}</p>
          </div>
          {compact ? (
            <Link href={`${prefix}/records/`}>
              {copy.allRecords}
              <LinkArrow size={14} />
            </Link>
          ) : records.length ? (
            <Link className={styles.newObservation} href={`${prefix}/#measure`}>
              <Icon name="mic" size={16} />
              {en ? "New observation" : "开始新的观察"}
            </Link>
          ) : null}
        </div>
      ) : null}
      {!compact && records.length ? (
        <div className={styles.selection}>
          <p>{copy.compareHint}</p>
          <span role="status">
            {en ? `${selected.length} of 2 selected` : `已选 ${selected.length} / 2`}
          </span>
        </div>
      ) : null}
      {state.error ? (
        <p className={styles.notice} role="status">
          <Icon name="circle-alert" size={16} />
          {copy[state.error]}
        </p>
      ) : null}
      {message ? (
        <p className={styles.notice} role="status">
          {message}
        </p>
      ) : null}
      {empty ? (
        <div className={styles.empty}>
          <Icon name="audio-lines" size={compact ? 20 : 32} />
          {!compact ? <h2>{en ? "No saved records yet" : "还没有保存的观察"}</h2> : null}
          <p>{copy.saveFirst}</p>
          {!compact ? (
            <>
              <Link href={`${prefix}/#measure`}>
                {copy.start}
                <LinkArrow size={14} />
              </Link>
              <p className={styles.emptyPrivacy}>{copy.recordsHint}</p>
            </>
          ) : null}
        </div>
      ) : (
        <div className={styles.rows}>
          {records.map((record) => {
            const basis = measurementBasis(record);
            return (
              <article
                key={record.id}
                className={styles.row}
                data-selected={!compact && selected.includes(record.id) ? "true" : undefined}
              >
                {!compact ? (
                  <input
                    type="checkbox"
                    checked={selected.includes(record.id)}
                    disabled={selected.length >= 2 && !selected.includes(record.id)}
                    aria-label={`${copy.compare}: ${date(record)}`}
                    onChange={(event) =>
                      setPicked(
                        event.target.checked
                          ? [...selected, record.id]
                          : selected.filter((item) => item !== record.id),
                      )
                    }
                  />
                ) : null}
                <div className={styles.recordContext}>
                  <strong>{record.note || date(record)}</strong>
                  <p>
                    {record.note ? (
                      <>
                        {date(record)}
                        <span>·</span>
                      </>
                    ) : null}
                    {formatDuration(record.duration)}
                    <span>·</span>
                    {basis.mode === "reference-estimate"
                      ? copy.calibrated
                      : basis.mode === "generic-estimate"
                        ? copy.generic
                        : copy.relative}
                  </p>
                  {!compact ? <small>{record.input.label}</small> : null}
                </div>
                <RecordReading record={record} locale={locale} />
                {!compact ? (
                  <div
                    className={styles.rowActions}
                    data-confirming={confirm === record.id ? "true" : undefined}
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        exportAction.current = event.currentTarget;
                        setReportRecord(record);
                      }}
                      aria-label={`${copy.export}: ${date(record)}`}
                      aria-haspopup="dialog"
                      title={copy.export}
                    >
                      <Icon name="download" size={16} />
                    </button>
                    {confirm === record.id ? (
                      <div className={styles.confirm}>
                        <span>{copy.confirmDelete}?</span>
                        <button type="button" onClick={() => remove(record.id)}>
                          {copy.confirmDelete}
                        </button>
                        <button type="button" onClick={() => setConfirm(null)}>
                          {copy.keep}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        aria-label={`${copy.delete}: ${date(record)}`}
                        onClick={() => setConfirm(record.id)}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
      {!compact && records.length ? (
        <p className={styles.levelHint}>{copy.estimateScaleHint}</p>
      ) : null}
      {!compact && pair.length === 2 ? (
        <div className={styles.comparison} role="status">
          <span>{copy.difference}</span>
          {difference === null ? (
            <p>{copy.incompatible}</p>
          ) : (
            <>
              <strong>
                {difference > 0 ? "+" : ""}
                {difference.toFixed(1)}
                <small>dB</small>
              </strong>
              <p>{copy.differenceHint}</p>
              <p>
                {date(pair[0])} → {date(pair[1])}
              </p>
            </>
          )}
        </div>
      ) : null}
      {reportRecord ? (
        <RecordExportDialog
          key={reportRecord.id}
          record={reportRecord}
          locale={locale}
          onClose={() => setReportRecord(null)}
          returnFocus={exportAction}
        />
      ) : null}
    </section>
  );
}

function RecordReading({ record, locale }: { record: Measurement; locale: Locale }) {
  const copy = meterCopy[locale];
  const basis = measurementBasis(record);
  const stats = displayStats(record.stats, basis);
  const band = recordBand(stats.average, basis.mode, stats.averageAtFloor);
  const description =
    basis.mode === "relative"
      ? copy.relative
      : stats.averageAtFloor
        ? copy.recordBelowFloor
        : band
          ? text(band.title, locale)
          : null;
  return (
    <div
      className={styles.mean}
      data-level={band?.tone}
      style={
        {
          "--record-color": band ? readingColor(stats.average, "ink") : undefined,
          "--record-tag-surface": band ? `var(--band-${band.tone}-surface)` : undefined,
          "--record-tag-ink": band ? `var(--band-${band.tone}-ink)` : undefined,
        } as CSSProperties
      }
    >
      <strong>{formatReading(stats.average, stats.averageAtFloor)}</strong>
      <span>{basis.mode === "relative" ? "dBFS" : copy.estimatedUnit}</span>
      <div className={styles.readingMeta}>
        <small>{copy.average}</small>
        {description ? <span className={styles.levelTag}>{description}</span> : null}
      </div>
    </div>
  );
}
