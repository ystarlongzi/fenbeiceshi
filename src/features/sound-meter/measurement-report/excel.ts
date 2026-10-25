import type { Sheet } from "write-excel-file/universal";
import type { MeasurementReport, ReportRow } from "./model.ts";
import { getReportCopy } from "./copy.ts";
import { localeSettings } from "../../../lib/i18n/locales.ts";

export function reportSheets(report: MeasurementReport): Sheet<never>[] {
  const copy = getReportCopy(report.locale);
  const rightToLeft = localeSettings[report.locale].direction === "rtl";
  const header = (row: ReportRow) =>
    row.map((value) => ({
      value,
      wrap: true,
      fontWeight: "bold" as const,
      backgroundColor: "#EAF0E5",
    }));
  return [
    {
      sheet: copy.summarySheet,
      rightToLeft,
      columns: [{ width: 32 }, { width: 92 }],
      data: [
        header([copy.field, copy.value]),
        ...report.rows.map((row) => row.map((value) => ({ value, wrap: true }))),
      ],
    },
    {
      sheet: copy.trendSheet,
      rightToLeft,
      columns: [{ width: 34 }, { width: 16 }, { width: 24 }, { width: 24 }],
      data: [header(report.trendHeaders), ...report.trend],
    },
  ];
}

export async function excelBlob(report: MeasurementReport) {
  // 数据最多 600 个趋势点，使用通用入口避免额外的 Blob Worker 和 CSP 要求。
  const { default: writeExcelFile } = await import("write-excel-file/universal");
  return writeExcelFile(reportSheets(report)).toBlob();
}
