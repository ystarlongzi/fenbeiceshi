import assert from "node:assert/strict";
import type { SoundDetail } from "../../src/lib/content/decibel-details/index.ts";
import type { Locale } from "../../src/features/sound-meter/types.ts";
import { href } from "../../src/lib/routing/pages.ts";
import { escapeText } from "./html.ts";

export function checkDetailContext(html: string, detail: SoundDetail, locale: Locale) {
  const chinese = locale === "zh-CN" ? "zh" : locale === "zh-TW" ? "zhTW" : null;
  const linkedQuestions = detail.questions.filter((question) => question.chineseLink);
  assert.equal(
    (html.match(/data-detail-context-link=""/g) ?? []).length,
    chinese ? linkedQuestions.length : 0,
    `详情上下文入口的语言或数量不正确：${locale} → ${detail.key}`,
  );
  if (!chinese) return;

  for (const question of linkedQuestions) {
    const link = question.chineseLink!;
    const body = html.match(
      new RegExp(`<div\\b[^>]*id="${question.id}"[^>]*>([\\s\\S]*?)</div>`),
    )?.[1];
    assert.ok(body, `问题应静态输出：${locale} → ${detail.key} → ${question.id}`);
    assert.ok(
      body.includes(`href="${href(link.pageId, locale)}#${link.hash}"`),
      `问题旁缺少对应语言的处理入口：${locale} → ${detail.key} → ${question.id}`,
    );
    assert.ok(body.includes(escapeText(link.label[chinese])), locale);
  }
}
