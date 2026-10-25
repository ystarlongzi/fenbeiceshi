import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { sourceCatalog } from "./catalog.mjs";
import { additionalLocales } from "../../src/lib/i18n/additional-locales.ts";

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
}
assert.deepEqual(missingTerms, [], "数值或单位丢失");
console.log(
  `多语言词典检查通过：${additionalLocales.length} 种新语言，各 ${entries.length} 条文案；参数、数值、单位及客户端范围完整。`,
);
