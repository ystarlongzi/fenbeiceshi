import type { MeasurementReport } from "./model.ts";
import { reportCopy } from "./copy.ts";

export function wrapReportText(value: string, measure: (text: string) => number, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  const segments = new Intl.Segmenter(undefined, { granularity: "word" }).segment(
    value.replace(/\s+/g, " ").trim(),
  );
  for (const { segment } of segments) {
    const parts = measure(segment) > maxWidth ? Array.from(segment) : [segment];
    for (const part of parts) {
      if (line && measure(line + part) > maxWidth) {
        lines.push(line.trimEnd());
        line = part.trimStart();
      } else line += part;
    }
  }
  if (line) lines.push(line.trimEnd());
  return lines;
}

export function drawReport(report: MeasurementReport) {
  const scale = 2;
  const width = 794;
  const height = 1123;
  const pages: HTMLCanvasElement[] = [];
  function newPage() {
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("无法创建报告绘图上下文。");
    context.scale(scale, scale);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.textBaseline = "top";
    pages.push(canvas);
    return context;
  }
  let ctx = newPage();
  const copy = reportCopy[report.locale];
  const font = 'system-ui, -apple-system, "Microsoft YaHei", sans-serif';
  const text = (value: string, x: number, y: number, size = 14, color = "#253c2e") => {
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
  };
  const paragraph = (value: string, y: number, size = 14, color = "#56645b") => {
    ctx.font = `${size}px ${font}`;
    const lines = wrapReportText(value, (line) => ctx.measureText(line).width, width - 96);
    let top = y;
    if (top + lines.length * size * 1.65 > height - 70) {
      ctx = newPage();
      top = 48;
    }
    for (const line of lines) {
      text(line, 48, top, size, color);
      top += size * 1.65;
    }
    return top;
  };
  text("fenbeiceshi.com", 48, 38, 14, "#61745d");
  text(report.title, 48, 70, 28);
  text(report.mode, 48, 116, 16);
  text(report.startedAt, 48, 148, 13, "#56645b");
  text(`${copy.durationLabel}: ${report.duration}    ${report.unit}`, 48, 172);
  ctx.fillStyle = "#edf2e8";
  ctx.fillRect(48, 213, width - 96, 108);
  report.stats.forEach((stat, index) => {
    const left = 64 + index * 230;
    text(stat.label, left, 232, 13);
    text(stat.value, left, 264, 32);
  });
  let y = paragraph(`${copy.input}: ${report.input}`, 350);
  y = paragraph(`${copy.model}: ${report.model}`, y + 12, 13);
  if (report.reference) {
    y = paragraph(
      `${copy.reference}: ${report.reference.value} · ${report.reference.source}`,
      y + 12,
    );
  }
  text(copy.conditions, 48, y + 24, 16);
  y = paragraph(report.note || copy.none, y + 58);
  const paragraphHeight = (value: string, size: number) => {
    ctx.font = `${size}px ${font}`;
    return (
      wrapReportText(value, (line) => ctx.measureText(line).width, width - 96).length * size * 1.65
    );
  };
  const trendBlockHeight =
    65 + 155 + 38 + paragraphHeight(report.trendHint, 13) + 24 + paragraphHeight(report.notice, 14);
  if (y + trendBlockHeight > height - 70) {
    ctx = newPage();
    y = 20;
  }
  text(copy.trendSheet, 48, y + 30, 16);
  const chartTop = y + 65;
  const chartHeight = 155;
  const chartWidth = width - 120;
  ctx.strokeStyle = "#d6ded3";
  ctx.lineWidth = 1;
  const points = report.trend.map((row) => ({ time: Number(row[0]), level: Number(row[1]) }));
  const relative = report.unit === "dBFS RMS";
  const minimum = Math.min(relative ? -100 : 0, ...points.map((point) => point.level));
  const maximum = Math.max(relative ? 0 : 120, ...points.map((point) => point.level));
  for (let step = 0; step <= 3; step += 1) {
    const lineY = chartTop + (step / 3) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(60, lineY);
    ctx.lineTo(60 + chartWidth, lineY);
    ctx.stroke();
    text((maximum - (step / 3) * (maximum - minimum)).toFixed(0), 48, lineY + 2, 12);
  }
  const firstTime = points[0]?.time ?? 0;
  const span = Math.max(1, (points.at(-1)?.time ?? firstTime) - firstTime);
  ctx.strokeStyle = "#486a39";
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = 60 + ((point.time - firstTime) / span) * chartWidth;
    const pointY = chartTop + ((maximum - point.level) / (maximum - minimum)) * chartHeight;
    if (index === 0) ctx.moveTo(x, pointY);
    else ctx.lineTo(x, pointY);
  });
  ctx.stroke();
  text(`${(firstTime / 1000).toFixed(1)} s`, 60, chartTop + chartHeight + 9, 12);
  text(`${((firstTime + span) / 1000).toFixed(1)} s`, width - 110, chartTop + chartHeight + 9, 12);
  y = paragraph(report.trendHint, chartTop + chartHeight + 38, 13);
  paragraph(report.notice, y + 24, 14);
  return pages.map((page, index) => {
    ctx = page.getContext("2d")!;
    text(`fenbeiceshi.com · ${index + 1} / ${pages.length}`, 48, height - 42, 12, "#56645b");
    return page.toDataURL("image/jpeg", 0.94);
  });
}

export async function pdfFromImages(images: string[]) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.setProperties({ title: "Noise observation · fenbeiceshi.com", creator: "fenbeiceshi.com" });
  images.forEach((image, index) => {
    if (index > 0) pdf.addPage();
    pdf.addImage(image, "JPEG", 0, 0, 210, 297);
  });
  return pdf.output("blob");
}

export async function pdfBlob(report: MeasurementReport) {
  await document.fonts.ready;
  // 本机字体先绘制再嵌入，避免上传备注或额外下载完整中文字库。
  return pdfFromImages(drawReport(report));
}
