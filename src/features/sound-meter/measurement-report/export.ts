import type { MeasurementReport } from "./model.ts";
import { reportCsv } from "./model.ts";

export type FileFormat = "csv" | "excel" | "pdf";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  // 移动浏览器可能延后读取 Blob，下载触发后再延时回收 URL。
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export async function exportReport(report: MeasurementReport, format: FileFormat) {
  let blob: Blob;
  if (format === "csv") {
    blob = new Blob([reportCsv(report)], { type: "text/csv;charset=utf-8" });
  } else if (format === "excel") {
    const { excelBlob } = await import("./excel");
    blob = await excelBlob(report);
  } else {
    const { pdfBlob } = await import("./pdf");
    blob = await pdfBlob(report);
  }
  downloadBlob(blob, `${report.fileName}.${format === "excel" ? "xlsx" : format}`);
}
