import assert from "node:assert/strict";
import test from "node:test";
import { soundBands } from "../../lib/content/sound-bands.ts";
import { recordBand } from "../records/level.ts";
import { meterCopy } from "./copy.ts";
import { NOISE_SCALE_TICKS } from "./readings.ts";

test("七档统一使用已确认的中英文吵闹程度名称", () => {
  assert.deepEqual(
    soundBands.map((band) => band.title.zh),
    ["非常安静", "安静", "适中", "较吵", "很吵", "极吵", "极强噪音"],
  );
  assert.deepEqual(
    soundBands.map((band) => band.title.en),
    [
      "Very quiet",
      "Quiet",
      "Moderate",
      "Fairly noisy",
      "Very noisy",
      "Extremely noisy",
      "Extreme noise",
    ],
  );
});

test("六个仪表刻度与同读数的记录标签共用名称，保留原刻度位置", () => {
  assert.deepEqual(NOISE_SCALE_TICKS, [0, 40, 70, 85, 100, 120]);
  for (const [locale, language] of [
    ["zh-CN", "zh"],
    ["en", "en"],
  ] as const) {
    assert.equal(meterCopy[locale].estimateScaleLabels.length, NOISE_SCALE_TICKS.length);
    for (const [index, tick] of NOISE_SCALE_TICKS.entries())
      assert.equal(
        meterCopy[locale].estimateScaleLabels[index],
        recordBand(tick, "generic-estimate")?.title[language],
      );
  }
});
