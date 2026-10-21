import assert from "node:assert/strict";
import test from "node:test";
import { translations, localize, text } from "./text.ts";
import { meterCopy } from "../../features/sound-meter/copy.ts";
import { recordingCopy } from "../../features/audio-recording/copy.ts";
import { reportCopy } from "../../features/sound-meter/measurement-report/copy.ts";
import { soundBands } from "../content/sound-bands.ts";

test("内容按语言选择独立文案，不转换英文、来源、单位或用户输入", () => {
  const value = translations("麦克风设置", "Microphone settings", "麥克風設定");
  assert.equal(text(value, "zh-CN"), "麦克风设置");
  assert.equal(text(value, "en"), "Microphone settings");
  assert.equal(text(value, "zh-TW"), "麥克風設定");
  assert.equal(localize("zh-TW", "导出", "Export", "匯出"), "匯出");
});

test("测量、录音、报告和七档刻度均提供完整繁体文案", () => {
  for (const copy of [meterCopy, recordingCopy, reportCopy]) {
    assert.deepEqual(Object.keys(copy["zh-TW"]).sort(), Object.keys(copy["zh-CN"]).sort());
    for (const value of Object.values(copy["zh-TW"]))
      assert.ok(typeof value === "string" ? value.trim() : value.every((item) => item.trim()));
  }
  assert.equal(meterCopy["zh-TW"].microphone, "麥克風");
  assert.equal(meterCopy["zh-TW"].export, "匯出資料");
  assert.equal(reportCopy["zh-TW"].copy, "複製摘要");
  assert.deepEqual(
    meterCopy["zh-TW"].estimateScaleLabels,
    [0, 1, 3, 4, 5, 6].map((index) => soundBands[index].title.zhTW),
  );
});
