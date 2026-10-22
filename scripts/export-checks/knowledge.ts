import assert from "node:assert/strict";
import { articles } from "../../src/lib/content/articles.ts";
import { href } from "../../src/lib/routing/pages.ts";
import { localize } from "../../src/lib/i18n/text.ts";
import type { Locale } from "../../src/features/sound-meter/types.ts";

export function checkKnowledgeDirectory(html: string, locale: Locale) {
  const path = href("knowledge", locale);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, `知识目录缺少正文：${path}`);
  const toolHelp = main.match(/<section\b[^>]*id="tool-help"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  const knowledgeStart = main.indexOf('id="sound-knowledge"');
  assert.ok(toolHelp && knowledgeStart >= 0, `缺少工具帮助与声音知识分组：${path}`);
  const knowledge = main.slice(knowledgeStart);
  assert.ok(
    main.includes(
      `<h1>${localize(locale, "知识与帮助", "Knowledge &amp; help", "知識與幫助")}</h1>`,
    ),
    `目录标题应与导航一致：${path}`,
  );
  for (const id of ["guide", "how-it-works", "faq", "microphone-help"]) {
    assert.ok(toolHelp.includes(`href="${href(id, locale)}"`), `工具帮助缺少入口：${path} → ${id}`);
    assert.ok(
      !knowledge.includes(`href="${href(id, locale)}"`),
      `工具帮助不应混入声音知识：${path} → ${id}`,
    );
  }
  for (const id of [
    "phone-accuracy",
    "dbfs-spl",
    "decibel-chart",
    "noise-health",
    "noise-reduction",
    "hearing-protection",
    "china-noise-standards",
    "workplace-noise-standards",
  ]) {
    assert.ok(
      knowledge.includes(`href="${href(id, locale)}"`),
      `声音知识缺少入口：${path} → ${id}`,
    );
    assert.ok(
      !toolHelp.includes(`href="${href(id, locale)}"`),
      `声音知识不应混入工具帮助：${path} → ${id}`,
    );
  }
  const standards = knowledge.match(
    /<section\b[^>]*aria-labelledby="standards-title"[^>]*>([\s\S]*?)<\/section>/,
  )?.[1];
  assert.ok(standards, `知识目录缺少法规与职业标准分组：${path}`);
  assert.deepEqual(
    [...standards.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1]),
    ["china-noise-standards", "workplace-noise-standards"].map((id) => href(id, locale)),
    `法规与职业标准分组应保留两篇同语言文章：${path}`,
  );
  for (const article of articles.filter((item) => !item.parentId))
    assert.equal(
      main.split(`href="${href(article.id, locale)}"`).length - 1,
      1,
      `知识分组应完整且不重复地保留顶层文章：${path} → ${article.id}`,
    );
}
