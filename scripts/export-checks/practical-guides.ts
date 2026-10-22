import assert from "node:assert/strict";
import { text, type SiteContent } from "../../src/lib/content/types.ts";
import { href } from "../../src/lib/routing/pages.ts";
import type { Locale } from "../../src/lib/i18n/locales.ts";
import { escapeText } from "./html.ts";

export function checkPracticalGuide(visible: string, content: SiteContent, locale: Locale) {
  const path = href(content.id, locale);
  for (const section of content.sections) {
    const fields = [
      section.title,
      ...section.paragraphs,
      ...(section.items ?? []),
      ...(section.table?.headers ?? []),
      ...(section.table?.rows.flat() ?? []),
    ];
    for (const field of fields)
      assert.ok(
        visible.includes(escapeText(text(field, locale))),
        `文章正文必须静态输出：${path} → ${section.id}`,
      );
  }
  for (const id of content.related)
    assert.ok(visible.includes(`href="${href(id, locale)}"`), `缺少关联文章：${path} → ${id}`);
  if (content.id === "hearing-protection")
    assert.ok(
      visible.includes(`href="${href("noise-health", locale)}#exposure"`),
      `听力保护下一步应进入健康与暴露参考：${path}`,
    );
  if (content.id === "china-noise-standards" || content.id === "workplace-noise-standards") {
    const next =
      content.id === "china-noise-standards" ? "workplace-noise-standards" : "hearing-protection";
    const cta = visible.match(/<div class="[^"]*cta[^"]*">([\s\S]*?)<\/a><\/div>/)?.[1];
    assert.ok(cta, `法规与标准缺少下一步操作：${path}`);
    assert.ok(cta.includes(`href="${href(next, locale)}"`), `法规与标准下一步入口不正确：${path}`);
    assert.ok(
      !cta.includes(`href="${href("meter", locale)}#measure"`),
      `法规与标准不应用测量入口暗示合规评价：${path}`,
    );
  }
}
