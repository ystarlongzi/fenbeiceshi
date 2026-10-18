"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { LinkArrow } from "@/components/link-arrow";
import { meterCopy } from "../sound-meter/copy";
import { formatDuration } from "../sound-meter/level";
import { displayStats, formatReading, measurementBasis } from "../sound-meter/readings";
import type { Locale, Measurement } from "../sound-meter/types";
import {
  EMPTY_RECORDS,
  compareRecords,
  deleteRecord,
  downloadSummary,
  getRecords,
  watchRecords,
} from "./storage";
import styles from "./index.module.css";

export function RecordsPanel({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const copy = meterCopy[locale];
  const state = useSyncExternalStore(watchRecords, getRecords, () => EMPTY_RECORDS);
  const [picked, setPicked] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const prefix = locale === "en" ? "/en" : "";
  const records = compact ? state.records.slice(0, 3) : state.records;
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

  function exportRecord(record: Measurement) {
    try {
      downloadSummary(record);
    } catch {
      setMessage(copy.exportError);
    }
  }

  return (
    <section
      className={`${styles.panel} ${compact ? styles.compact : ""}`}
      aria-label={copy.records}
    >
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
        ) : (
          <span className={styles.compareHint}>{copy.compareHint}</span>
        )}
      </div>
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
      {!records.length && !state.error ? (
        <div className={styles.empty}>
          <Icon name="audio-lines" size={20} />
          <p>{copy.saveFirst}</p>
          {!compact ? (
            <Link href={`${prefix}/#measure`}>
              {copy.start}
              <LinkArrow size={14} />
            </Link>
          ) : null}
        </div>
      ) : (
        <div className={styles.rows}>
          {records.map((record) => {
            const basis = measurementBasis(record);
            const stats = displayStats(record.stats, basis);
            return (
              <article key={record.id} className={styles.row}>
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
                    {date(record)}
                    <span>·</span>
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
                <div className={styles.mean}>
                  <strong>{formatReading(stats.average, stats.averageAtFloor)}</strong>
                  <span>{basis.mode === "relative" ? "dBFS" : copy.estimatedUnit}</span>
                  <small>{copy.average}</small>
                </div>
                {!compact ? (
                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      onClick={() => exportRecord(record)}
                      aria-label={`${copy.export}: ${date(record)}`}
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
      {!compact && pair.length === 2 ? (
        <div className={styles.comparison}>
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
    </section>
  );
}
