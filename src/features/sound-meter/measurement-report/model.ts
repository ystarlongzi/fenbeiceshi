import { siteForLocale } from "../../../lib/routing/sites.ts";
import { publicSummary } from "../../records/storage.ts";
import { getMeterCopy } from "../copy.ts";
import { modeLabel } from "../mode-label.ts";
import { displayStats, formatReading, measurementBasis } from "../readings.ts";
import type { Locale, Measurement } from "../types.ts";
import { getReportCopy } from "./copy.ts";

export type ReportCell = string | number | boolean;
export type ReportRow = ReportCell[];

export function withMeasurementNote(record: Measurement, note: string): Measurement {
  return { ...record, note: note.slice(0, 120) };
}

export function createReport(record: Measurement, locale: Locale) {
  const summary = publicSummary(record);
  const copy = getReportCopy(locale);
  const meter = getMeterCopy(locale);
  const basis = measurementBasis(record);
  const stats = displayStats(record.stats, basis);
  const mode = modeLabel(basis, meter);
  const rounded = (value: number | null) => (value === null ? "" : Number(value.toFixed(1)));
  const rows: ReportRow[] = [
    [copy.started, summary.startedAt],
    [copy.duration, summary.durationMs],
    [copy.mode, mode],
    [copy.unit, summary.unit],
    [copy.minimum, rounded(summary.minimum)],
    [copy.maximum, rounded(summary.maximum)],
    [copy.average, rounded(summary.energyMean)],
    [copy.minimumFloor, summary.limits.minimumAtInputFloor],
    [copy.maximumFloor, summary.limits.maximumAtInputFloor],
    [copy.averageFloor, summary.limits.meanAtInputFloor],
    [copy.model, summary.model.id],
    [copy.offset, summary.model.offsetDb],
    [copy.samples, summary.sampledWindows],
    [copy.input, summary.inputLabel],
    [copy.conditions, summary.conditions],
    [copy.end, copy[summary.endReason]],
  ];
  if (summary.adjustment) rows.push([copy.adjustment, summary.adjustment.offsetDb]);
  if (summary.reference) {
    rows.push(
      [copy.reference, summary.reference.value],
      [copy.source, summary.reference.source],
      [copy.referenceTime, summary.reference.createdAt],
    );
  }
  rows.push([copy.noticeLabel, copy.notice], [copy.trendSheet, copy.trendHint]);

  return {
    title: copy.title,
    locale,
    domain: siteForLocale(locale).domain,
    fileName: `${locale === "zh-CN" || locale === "zh-TW" ? "fenbeiceshi" : "soundmetergo"}-${record.startedAt.replace(/[:.]/g, "-")}`,
    rows,
    trendHeaders: [copy.time, copy.level, copy.unit, copy.floor],
    trend: summary.recentTrend.map((point): ReportRow => [
      point.timeMs,
      rounded(point.level),
      summary.unit,
      point.atInputFloor,
    ]),
    stats: [
      { label: copy.minimum, value: formatReading(stats.minimum, stats.minimumAtFloor) },
      { label: copy.maximum, value: formatReading(stats.maximum, stats.maximumAtFloor) },
      { label: copy.average, value: formatReading(stats.average, stats.averageAtFloor) },
    ],
    mode,
    unit: basis.mode === "relative" ? "dBFS RMS" : meter.estimatedUnit,
    startedAt: record.startedAt,
    duration: formatReportDuration(summary.durationMs),
    input: summary.inputLabel,
    note: record.note,
    model: `${summary.model.id} (${summary.model.offsetDb} dB)`,
    reference: summary.reference,
    notice: copy.notice,
    trendHint: copy.trendHint,
  };
}

export type MeasurementReport = ReturnType<typeof createReport>;

export function formatReportDuration(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}

export function reportText(report: MeasurementReport) {
  return [
    report.title,
    report.domain,
    ...report.rows.map(([key, value]) => `${key}: ${value}`),
  ].join("\n");
}

export function reportCsv(report: MeasurementReport) {
  const copy = getReportCopy(report.locale);
  const escape = (value: ReportCell) => {
    let text = String(value);
    // CSV 的引号不能阻止表格软件执行公式，外部文本必须单独消除公式前缀。
    if (typeof value === "string" && /^[\s\uFEFF]*[=+\-@\t\r]/u.test(value)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return (
    "\uFEFF" +
    [
      [copy.field, copy.value, ...report.trendHeaders],
      ...report.rows.map((row) => [...row, "", "", "", ""]),
      ...report.trend.map((row) => ["", "", ...row]),
    ]
      .map((row) => row.map(escape).join(","))
      .join("\r\n")
  );
}
