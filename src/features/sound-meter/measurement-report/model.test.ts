import assert from "node:assert/strict";
import { inflateRawSync } from "node:zlib";
import test from "node:test";
import { makeCalibration } from "../../calibration/calibration.ts";
import { DEFAULT_ESTIMATE } from "../readings.ts";
import type { Measurement } from "../types.ts";
import { createReport, reportCsv, reportText, withMeasurementNote } from "./model.ts";
import { excelBlob } from "./excel.ts";

const sample: Measurement = {
  id: "report-test",
  startedAt: "2026-10-20T01:02:03.000Z",
  duration: 10000,
  stats: { count: 2, energy: 0.0002, min: -40, max: -40 },
  points: [{ time: 1000, value: -40 }],
  input: { label: "测试输入", signature: "private-device-id", processing: false },
  calibration: null,
  estimate: DEFAULT_ESTIMATE,
  note: "关窗，空调关闭",
  reason: "user",
};

// 独立读取 ZIP 目录及 DEFLATE 内容，验证实际 OOXML 文件而非只验证输入对象。
function unzip(buffer: Buffer) {
  const files = new Map<string, string>();
  let offset = buffer.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
  while (offset >= 0 && buffer.readUInt32LE(offset) === 0x02014b50) {
    const length = buffer.readUInt16LE(offset + 28);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + length);
    const size = buffer.readUInt32LE(offset + 20);
    const method = buffer.readUInt16LE(offset + 10);
    const local = buffer.readUInt32LE(offset + 42);
    const start = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
    const data = buffer.subarray(start, start + size);
    files.set(name, (method === 8 ? inflateRawSync(data) : data).toString("utf8"));
    offset += 46 + length + buffer.readUInt16LE(offset + 30) + buffer.readUInt16LE(offset + 32);
  }
  return files;
}

test("报告沿用读数投影，保存后编辑备注不改变原始结果", () => {
  const updated = withMeasurementNote(sample, "床头，窗户打开");
  assert.equal(sample.note, "关窗，空调关闭");
  assert.equal(updated.stats, sample.stats);
  assert.equal(updated.points, sample.points);
  assert.equal(withMeasurementNote(sample, "字".repeat(121)).note.length, 120);
  const report = createReport(updated, "zh-CN");
  assert.deepEqual(
    report.stats.map((stat) => stat.value),
    ["60.0", "60.0", "60.0"],
  );
  assert.equal(report.trend[0][1], 60);
  assert.ok(reportText(report).includes(updated.note));
  assert.ok(reportCsv(report).includes(updated.note));
  assert.equal(report.rows.find(([label]) => label === "备注")?.[1], updated.note);
  const english = createReport(updated, "en");
  assert.equal(english.rows.find(([label]) => label === "Notes")?.[1], updated.note);
  assert.ok(!JSON.stringify(report).includes(sample.input.signature));
  assert.equal(report.duration, "00:10");
});

test("繁体报告、CSV 和摘要保留原始读数、设备名与用户备注", () => {
  const traditional = createReport(sample, "zh-TW");
  const simplified = createReport(sample, "zh-CN");
  assert.equal(traditional.title, "本次測量報告");
  assert.deepEqual(
    traditional.stats.map((stat) => stat.value),
    simplified.stats.map((stat) => stat.value),
  );
  assert.deepEqual(traditional.trend, simplified.trend);
  assert.equal(traditional.input, sample.input.label);
  assert.equal(traditional.note, sample.note);
  assert.ok(reportText(traditional).includes("麥克風: 测试输入"));
  assert.ok(reportCsv(traditional).includes('"測量口徑","通用估算 · 未校正"'));
  assert.ok(reportCsv(traditional).includes(sample.note));
});

test("参考估算、历史相对记录与输入下限不混用或伪造精度", () => {
  const calibrated = createReport(
    { ...sample, calibration: makeCalibration(-40, 75, "参考声级计", sample.input.signature) },
    "en",
  );
  assert.equal(calibrated.stats[2].value, "75.0");
  assert.equal(calibrated.trend[0][1], 75);
  assert.ok(reportText(calibrated).includes("reference-offset-v1"));
  const legacy = createReport({ ...sample, estimate: undefined }, "en");
  assert.equal(legacy.unit, "dBFS RMS");
  assert.equal(legacy.stats[2].value, "−40.0");
  const floor = createReport(
    {
      ...sample,
      stats: { count: 1, energy: 0, min: -100, max: -100 },
      points: [{ time: 1000, value: -100 }],
    },
    "zh-CN",
  );
  assert.equal(floor.stats[2].value, "≤0.0");
  assert.equal(floor.trend[0][3], true);
  assert.ok(reportCsv(floor).includes('"平均值位于输入下限","true"'));
  assert.throws(() => createReport({ ...sample, duration: NaN }, "en"), RangeError);
  assert.throws(() => createReport({ ...sample, reason: "cancelled" }, "en"), RangeError);
});

test("CSV 保留中文、引号及换行，防止备注与设备名被当作公式", () => {
  const report = createReport(
    {
      ...sample,
      note: '=HYPERLINK("https://example.invalid","中文")\n第二行',
      input: { ...sample.input, label: "  +SUM(1,2)" },
    },
    "zh-CN",
  );
  const csv = reportCsv(report);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes('"\'=HYPERLINK(""https://example.invalid"",""中文"")\n第二行"'));
  assert.ok(csv.includes('"\'  +SUM(1,2)"'));
  assert.ok(csv.includes('"1000","60","estimated dB","false"'));
  const relative = reportCsv(createReport({ ...sample, estimate: undefined }, "en"));
  assert.ok(relative.includes('"1000","-40","dBFS RMS","false"'));
});

test("Excel 为真实双工作表 OOXML，数值可计算且外部文本不会成为公式", async () => {
  const report = createReport({ ...sample, note: '=1+1 中文 <>&"\n换行' }, "zh-CN");
  const blob = await excelBlob(report);
  const buffer = Buffer.from(await blob.arrayBuffer());
  assert.equal(buffer.readUInt32LE(0), 0x04034b50);
  const files = unzip(buffer);
  assert.ok(files.has("[Content_Types].xml"));
  assert.ok(files.get("xl/workbook.xml")?.includes("测量摘要"));
  assert.ok(files.get("xl/workbook.xml")?.includes("最近趋势"));
  const strings = files.get("xl/sharedStrings.xml") ?? "";
  assert.ok(strings.includes("=1+1 中文 &lt;&gt;&amp;"));
  assert.ok(!strings.includes("private-device-id"));
  const summary = files.get("xl/worksheets/sheet1.xml") ?? "";
  const trend = files.get("xl/worksheets/sheet2.xml") ?? "";
  assert.ok(summary.includes("<v>60</v>"));
  assert.ok(trend.includes("<v>1000</v>"));
  assert.ok(trend.includes("<v>60</v>"));
  assert.ok(!summary.includes("<f>"));
  assert.ok(!trend.includes("<f>"));
});

test("已保存的参考与历史相对记录导出保留原口径，临时备注不写回原记录", async () => {
  const reference = {
    ...sample,
    calibration: makeCalibration(-40, 75, "参考声级计", sample.input.signature),
  };
  const legacy = { ...sample, estimate: undefined, note: "" };

  for (const record of [reference, legacy]) {
    const original = structuredClone(record);
    const report = createReport(withMeasurementNote(record, "仅用于此次导出的备注"), "en");
    const files = unzip(Buffer.from(await (await excelBlob(report)).arrayBuffer()));
    const strings = files.get("xl/sharedStrings.xml") ?? "";
    const summary = files.get("xl/worksheets/sheet1.xml") ?? "";
    const trend = files.get("xl/worksheets/sheet2.xml") ?? "";
    const value = record.calibration ? 75 : -40;

    assert.deepEqual(record, original);
    assert.equal(report.stats[2].value, record.calibration ? "75.0" : "−40.0");
    assert.ok(strings.includes("仅用于此次导出的备注"));
    assert.ok(strings.includes(record.calibration ? "reference-offset-v1" : "relative-rms-v1"));
    assert.ok(strings.includes(record.calibration ? "estimated dB" : "dBFS RMS"));
    assert.ok(summary.includes(`<v>${value}</v>`));
    assert.ok(trend.includes(`<v>${value}</v>`));
    assert.ok(!strings.includes(sample.input.signature));
  }
});
