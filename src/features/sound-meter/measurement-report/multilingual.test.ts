import assert from "node:assert/strict";
import test from "node:test";
import { additionalLocales } from "../../../lib/i18n/additional-locales.ts";
import { prepareLocale } from "../../../lib/i18n/load-messages.ts";
import { DEFAULT_ESTIMATE } from "../readings.ts";
import type { Measurement } from "../types.ts";
import { createReport, reportCsv, reportText } from "./model.ts";
import { excelBlob, reportSheets } from "./excel.ts";

test("24 种新语言报告保持原始数值、设备名和备注，并生成有效 Excel；阿拉伯语使用 RTL", async () => {
  const record: Measurement = {
    id: "multilingual-report",
    startedAt: "2026-10-25T01:00:00.000Z",
    duration: 1000,
    stats: { count: 1, energy: 0.0001, min: -40, max: -40 },
    points: [{ time: 1000, value: -40 }],
    input: { label: "Device 用户设备", signature: "private-input", processing: false },
    calibration: null,
    estimate: DEFAULT_ESTIMATE,
    note: "备注 <>& العربية 日本語",
    reason: "user",
  };
  const before = structuredClone(record);
  const english = createReport(record, "en");
  for (const locale of additionalLocales) {
    await prepareLocale(locale);
    const report = createReport(record, locale);
    assert.equal(report.domain, "soundmetergo.com", locale);
    assert.ok(report.fileName.startsWith("soundmetergo-"), locale);
    assert.equal(report.input, record.input.label, locale);
    assert.equal(report.note, record.note, locale);
    assert.deepEqual(report.trend, english.trend, locale);
    assert.deepEqual(
      report.stats.map((stat) => stat.value),
      english.stats.map((stat) => stat.value),
      locale,
    );
    assert.ok(reportText(report).includes(record.note), locale);
    assert.ok(reportCsv(report).includes(record.note), locale);
    assert.ok(!JSON.stringify(report).includes(record.input.signature), locale);
    for (const sheet of reportSheets(report)) {
      assert.ok(sheet.sheet && sheet.sheet.length <= 31, locale);
      assert.doesNotMatch(sheet.sheet!, /[\\/?*\[\]:]/, locale);
      assert.equal(sheet.rightToLeft, locale === "ar", locale);
    }
    const buffer = Buffer.from(await (await excelBlob(report)).arrayBuffer());
    assert.equal(buffer.readUInt32LE(0), 0x04034b50, locale);
  }
  assert.deepEqual(record, before);
});
