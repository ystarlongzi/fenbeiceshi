import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { contents, href, sitePages } from "../src/lib/routing/pages.ts";

const locales = ["zh-CN", "en"] as const;
const ids = sitePages.map((page) => page.id);
assert.equal(new Set(ids).size, ids.length, "页面 ID 不得重复");
const paths = sitePages.flatMap((page) => locales.map((locale) => href(page.id, locale)));
assert.equal(new Set(paths).size, paths.length, "规范路径不得重复");
assert.equal(
  sitePages.filter((page) => page.index).length * locales.length,
  20,
  "首批可索引页面为 20 个",
);
assert.equal(sitePages.find((page) => page.id === "records")?.index, false);
for (const content of contents) {
  assert.ok(
    content.sources.length && content.sections.length && content.related.length,
    content.id,
  );
  assert.equal(
    new Set(content.sections.map((section) => section.id)).size,
    content.sections.length,
    content.id,
  );
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
      content.sections.every(
        (section) => section.title[language] && section.paragraphs.every((p) => p[language]),
      ),
      content.id,
    );
  }
}
const plan = JSON.parse(await readFile("docs/产品/页面与关键词映射.json", "utf8"));
for (const page of sitePages.filter((page) => page.index)) {
  const candidate = plan.pages.find((item: { id: string }) => item.id === page.id);
  assert.ok(candidate, page.id);
  for (const locale of locales) assert.equal(candidate.locales[locale].path, href(page.id, locale));
}
console.log(
  `内容检查通过：${contents.length} 个双语正文，20 个可索引 URL，2 个 noindex 功能 URL。`,
);
