import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { contents, href, sitePages } from "../src/lib/routing/pages.ts";
import { soundBands } from "../src/lib/content/sound-bands.ts";
import {
  soundCategories,
  soundReferences,
  soundSources,
} from "../src/lib/content/sound-references.ts";
import {
  exposureFactors,
  healthActions,
  healthImpacts,
  healthSources,
} from "../src/lib/content/noise-health.ts";
import { decibelChartNotes } from "../src/lib/content/decibel-chart.ts";

const locales = ["zh-CN", "en"] as const;
const ids = sitePages.map((page) => page.id);
assert.equal(new Set(ids).size, ids.length, "页面 ID 不得重复");
const paths = sitePages.flatMap((page) => locales.map((locale) => href(page.id, locale)));
assert.equal(new Set(paths).size, paths.length, "规范路径不得重复");
assert.equal(
  sitePages.filter((page) => page.index).length * locales.length,
  22,
  "当前可索引页面为 22 个",
);
assert.equal(sitePages.find((page) => page.id === "records")?.index, false);
for (const content of contents) {
  const sections = [
    ...content.sections,
    ...(content.id === "decibel-chart" ? decibelChartNotes : []),
  ];
  assert.ok(
    content.sources.length && content.sections.length && content.related.length,
    content.id,
  );
  assert.equal(new Set(sections.map((section) => section.id)).size, sections.length, content.id);
  assert.ok(
    content.related.every((id) => ids.includes(id)),
    content.id,
  );
  for (const locale of locales) {
    const language = locale === "en" ? "en" : "zh";
    assert.ok(
      content.title[language] && content.description[language] && content.takeaway[language],
      content.id,
    );
    assert.ok(
      sections.every(
        (section) => section.title[language] && section.paragraphs.every((p) => p[language]),
      ),
      content.id,
    );
  }
}
const plan = JSON.parse(await readFile("docs/产品/页面与关键词映射.json", "utf8"));
const soundIds = soundReferences.map((sound) => sound.id);
assert.equal(new Set(soundIds).size, soundIds.length, "声音参考 ID 不得重复");
assert.ok(soundReferences.length >= 30, "分贝对照页应保留完整的日常声音覆盖");
for (const sound of soundReferences) {
  assert.ok(
    Number.isFinite(sound.min) &&
      Number.isFinite(sound.max) &&
      sound.min >= 0 &&
      sound.min <= sound.max,
    sound.id,
  );
  assert.ok(
    soundCategories.some((category) => category.id === sound.category),
    sound.id,
  );
  assert.ok(soundSources[sound.source], `声音参考缺少来源：${sound.id}`);
  assert.ok(sound.name.zh && sound.name.en && sound.context.zh && sound.context.en, sound.id);
}
for (const band of soundBands) {
  assert.ok(band.min >= 0 && band.max > band.min && band.max <= 160, band.range);
  assert.ok(
    band.examples.every((id) => soundIds.includes(id)),
    `分段示例缺失：${band.range}`,
  );
}
assert.equal(soundBands[0].min, 0);
assert.equal(soundBands.at(-1)?.max, 160);
for (let index = 1; index < soundBands.length; index += 1)
  assert.equal(soundBands[index - 1].max, soundBands[index].min, "分段必须连续");
assert.equal(new Set(healthImpacts.map((impact) => impact.id)).size, healthImpacts.length);
for (const impact of healthImpacts) {
  for (const field of [impact.title, ...impact.paragraphs])
    assert.ok(field.zh && field.en, `健康正文缺少双语内容：${impact.id}`);
  for (const source of impact.sources)
    assert.ok(
      Object.values(healthSources).some((item) => item.url === source.url),
      impact.id,
    );
}
for (const field of [
  ...exposureFactors,
  ...healthActions.flatMap((action) => [action.title, action.body]),
])
  assert.ok(field.zh && field.en, "暴露条件与行动步骤必须保留双语内容");
const sourceIds = Object.values(soundSources).map((source) => source.id);
assert.equal(new Set(sourceIds).size, sourceIds.length, "来源锚点不得重复");
for (const page of sitePages.filter((page) => page.index)) {
  const candidate = plan.pages.find((item: { id: string }) => item.id === page.id);
  assert.ok(candidate, page.id);
  for (const locale of locales) assert.equal(candidate.locales[locale].path, href(page.id, locale));
}
console.log(
  `内容检查通过：${contents.length} 个双语正文，22 个可索引 URL，2 个 noindex 功能 URL。`,
);
