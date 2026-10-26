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
  /(?<![A-Za-z])(?:generic-rms-v1|manual-offset-v1|LEX,8h|A\/C|dB\([AC]\)|dBFS|dBA|dBC|dB|RMS|PCM|MP3|CSV|MiB|LAeq|TWA|SPL|NRR|[µμ]Pa)(?![A-Za-z])|[−-]?\d+(?:[.,]\d+)?/g;
const normalizeTerm = (value) => {
  value = value.replaceAll("−", "-");
  // 英文千位分组可写成无分隔整数；物理值不变，避免逗号在其他语言中被读成小数点。
  if (/^[−-]?[1-9]\d{0,2}(?:,\d{3})+$/.test(value)) return value.replaceAll(",", "");
  return value.replace("μPa", "µPa");
};
const terms = (value) =>
  [...value.matchAll(protectedTerms)].map((match) =>
    normalizeTerm(
      match[0].startsWith("-") && match.index > 0 && /[A-Za-z\d]/.test(value[match.index - 1])
        ? match[0].slice(1)
        : match[0],
    ),
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
const articleActions = [
  ["Select Start measuring", meterCopy.en.start],
  ["The browser receives sound only after", meterCopy.en.start],
  ["The default is a generic noise estimate", meterCopy.en.generic],
  ["Manual adjustment changes the display scale", meterCopy.en.generic],
  ["Manual adjustment changes the display scale", meterCopy.en.adjusted],
];
const symbols = (value) => [...value.matchAll(/[<>≤≥±]/g)].map(([symbol]) => symbol).sort();
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
    assert.doesNotMatch(value, /\b31st\b/, `正文残留英文序数：${locale} → ${source}`);
    for (const [, letter] of source.matchAll(/\b([AC])[- ]weight(?:ing|ed)\b/g)) {
      assert.match(
        value,
        new RegExp(`(?<![A-Za-z])${letter}(?![A-Za-z])`),
        `计权字母丢失：${locale} → ${source}`,
      );
    }
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
  for (const [prefix, action] of articleActions) {
    const entry = entries.find(({ source }) => source.startsWith(prefix));
    assert.ok(entry, `帮助正文未定义：${prefix}`);
    assert.ok(
      messages[entry.source]
        .toLocaleLowerCase(locale)
        .includes(messages[action].toLocaleLowerCase(locale)),
      `正文操作名称与控件不一致：${locale} → ${prefix}`,
    );
  }
}
assert.deepEqual(missingTerms, [], "数值或单位丢失");
console.log(
  `多语言词典检查通过：${additionalLocales.length} 种新语言，各 ${entries.length} 条文案；参数、数值、单位及客户端范围完整。`,
);
