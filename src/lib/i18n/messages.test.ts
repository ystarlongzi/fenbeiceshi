import assert from "node:assert/strict";
import test, { before } from "node:test";
import { additionalLocales } from "./additional-locales.ts";
import { prepareLocale } from "./load-messages.ts";
import { formatLocalized, localize, text } from "./text.ts";
import { translateEnglish } from "./messages.ts";
import { getMeterCopy } from "../../features/sound-meter/copy.ts";
import { getReportCopy } from "../../features/sound-meter/measurement-report/copy.ts";
import { getRecordingCopy } from "../../features/audio-recording/copy.ts";
import { soundBands } from "../content/sound-bands.ts";
import { languageSelectionHref } from "./preference.ts";
import { sitePages } from "../routing/pages.ts";

before(async () => {
  await Promise.all(additionalLocales.map(prepareLocale));
});

test("新语言使用完整界面文案，七档名称保持共用，词典不会随仪表刷新重建", () => {
  for (const locale of additionalLocales) {
    const copy = getMeterCopy(locale);
    assert.equal(getMeterCopy(locale), copy);
    assert.notEqual(copy.start, getMeterCopy("en").start, locale);
    assert.notEqual(getReportCopy(locale).saveTitle, getReportCopy("en").saveTitle, locale);
    assert.notEqual(getRecordingCopy(locale).hint, getRecordingCopy("en").hint, locale);
    assert.equal(copy.estimateScaleLabels[0], text(soundBands[0].title, locale));
    assert.equal(copy.estimateScaleLabels.at(-1), text(soundBands.at(-1)!.title, locale));
    assert.equal(copy.start, localize(locale, "开始测量", "Start measuring", "開始測量"));
  }
});

test("估算缩写不解释为时区，仪表名称使用对应的交互含义", () => {
  assert.equal(getMeterCopy("ar").estimatedUnit, "dB · تقديري");
  assert.equal(getMeterCopy("de").gauge, "Zeiger");
  assert.equal(getMeterCopy("de").bars, "Balken");
  assert.equal(getMeterCopy("de").average, "Energetischer Mittelwert");
});

test("动态参数在翻译后插入，设备名称、备注或标签不参与翻译", () => {
  for (const locale of additionalLocales) {
    const label = "<script>device-name & 用户备注</script>";
    const result = formatLocalized(locale, "", "Increase {label} by {step}", "", {
      label,
      step: 0.5,
    });
    assert.ok(result.includes(label) && result.includes("0.5"), locale);
    assert.doesNotMatch(result, /\{(?:label|step)\}/);
  }
  assert.throws(() => formatLocalized("de", "", "Enter {min} or more.", "", {}), /翻译参数缺失/);
  assert.throws(() => translateEnglish("de", "Unregistered source text"), /缺少已发布语言的翻译/);
  assert.throws(() => translateEnglish("de", "toString"), /缺少已发布语言的翻译/);
});

test("同国际域切换保留主题、查询和锚点，并使用目标语言路径", () => {
  const paths = sitePages.map((page) => `/${page.slug ? `${page.slug}/` : ""}`);
  assert.equal(
    languageSelectionHref(
      { pathname: "/de/records/", search: "?theme=dark", hash: "#main-content" },
      "ja",
      paths,
      true,
      "de",
    ),
    "/ja/records/?theme=dark#main-content",
  );
  assert.equal(
    languageSelectionHref(
      { pathname: "/ar/records/", search: "", hash: "" },
      "zh-TW",
      paths,
      true,
      "ar",
    ),
    "https://fenbeiceshi.com/zh-tw/records/?language=zh-TW",
  );
});
