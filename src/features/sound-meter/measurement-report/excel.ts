import type { Sheet } from "write-excel-file/universal";
import type { MeasurementReport, ReportRow } from "./model.ts";
import { reportCopy } from "./copy.ts";

export function reportSheets(report: MeasurementReport): Sheet<never>[] {
  const copy = reportCopy[report.locale];
  const header = (row: ReportRow) =>
    row.map((value) => ({ value, fontWeight: "bold" as const, backgroundColor: "#EAF0E5" }));
  return [
    {
      sheet: copy.summarySheet,
      columns: [{ width: 32 }, { width: 92 }],
      data: [header([copy.field, copy.value]), ...report.rows],
    },
    {
      sheet: copy.trendSheet,
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
