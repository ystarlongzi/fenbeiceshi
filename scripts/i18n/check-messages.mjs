import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { sourceCatalog } from "./catalog.mjs";
import { additionalLocales } from "../../src/lib/i18n/additional-locales.ts";
import { faqItems } from "../../src/lib/content/faq.ts";
import { meterCopy } from "../../src/features/sound-meter/copy.ts";
import { recordingCopy } from "../../src/features/audio-recording/copy.ts";

const entries = await sourceCatalog();
const expected = entries.map((entry) => entry.source).sort();
const parameters = (value) =>
  [...value.matchAll(/\{[a-zA-Z][a-zA-Z0-9]*\}/g)].map(([match]) => match).sort();
const protectedTerms =
  /(?<![A-Za-z])(?:dBFS|dBA|dBC|dB|RMS|PCM|MP3|CSV|MiB)(?![A-Za-z])|[−-]?\d+(?:[.,]\d+)?/g;
const terms = (value) =>
  [...value.matchAll(protectedTerms)].map((match) =>
    match[0].startsWith("-") && match.index > 0 && /[A-Za-z\d]/.test(value[match.index - 1])
      ? match[0].slice(1)
      : match[0],
  );
const missingTerms = [];
const faqActions = [
  ["install", meterCopy.en.start],
  ["calibration", meterCopy.en.generic],
  ["calibration", meterCopy.en.calibration],
  ["calibration", meterCopy.en.adjusted],
  ["audio", recordingCopy.en.enable],
  ["reports", meterCopy.en.save],
  ["reports", meterCopy.en.export],
];
const symbols = (value) => [...value.matchAll(/[≤≥±]/g)].map(([symbol]) => symbol).sort();
for (const locale of additionalLocales) {
  const groups = {};
  for (const name of ["ui", "knowledge", "details"]) {
    groups[name] = JSON.parse(
      await readFile(`src/lib/i18n/messages/${locale}/${name}.json`, "utf8"),
    );
    assert.ok(Object.keys(groups[name]).length <= 650, `${locale}/${name} 词典应按职责拆分`);
  }
  const messages = { ...groups.ui, ...groups.knowledge, ...groups.details };
  assert.deepEqual(Object.keys(messages).sort(), expected, `词典与实际源文案不一致：${locale}`);
  for (const { source, ui } of entries) {
    const value = messages[source];
    assert.ok(typeof value === "string" && value.trim(), `翻译缺失：${locale} → ${source}`);
    assert.equal(
      Object.hasOwn(groups.ui, source),
      ui,
      `正文不得混入界面词典：${locale} → ${source}`,
    );
    assert.deepEqual(parameters(value), parameters(source), `参数损坏：${locale} → ${source}`);
    assert.deepEqual(symbols(value), symbols(source), `数学符号改变：${locale} → ${source}`);
    assert.doesNotMatch(value, /SMG\s*PH\s*\d/i, `翻译占位符未还原：${locale}`);
    for (const [name] of source.matchAll(/\b(?:NIOSH|OSHA|WHO|CDC|ISO|IEC|GBZ)\b/g))
      assert.ok(value.includes(name), `机构或标准名丢失：${locale} → ${source}`);
    const remaining = terms(value);
    for (const term of terms(source)) {
      const index = remaining.indexOf(term);
      if (index < 0) missingTerms.push({ locale, source, term });
      else remaining.splice(index, 1);
    }
  }
  // 帮助中的操作名称须与实际控件相同，避免改了按钮却留下无法对应的旧说明。
  for (const [id, action] of faqActions) {
    const question = faqItems.find((item) => item.id === id);
    assert.ok(question, `常见问题未定义：${id}`);
    const answer = question.answer.map((part) => messages[part.en]).join("\n");
    assert.ok(answer.includes(messages[action]), `FAQ 操作名称与控件不一致：${locale}/${id}`);
  }
  for (const question of faqItems)
    for (const part of question.answer)
      assert.doesNotMatch(
        messages[part.en],
        /\b31st\b/,
        `FAQ 残留英文序数：${locale}/${question.id}`,
      );
}
assert.deepEqual(missingTerms, [], "数值或单位丢失");
console.log(
  `多语言词典检查通过：${additionalLocales.length} 种新语言，各 ${entries.length} 条文案；参数、数值、单位及客户端范围完整。`,
);
