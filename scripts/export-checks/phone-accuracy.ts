import assert from "node:assert/strict";
import { accuracyAction, accuracyLinks } from "../../src/features/phone-accuracy/copy.ts";
import { href } from "../../src/lib/routing/pages.ts";
import type { Locale } from "../../src/features/sound-meter/types.ts";
import { escapeText } from "./html.ts";

export function checkPhoneAccuracy(html: string, locale: Locale) {
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  const chinese = locale === "zh-CN" ? "zh" : locale === "zh-TW" ? "zhTW" : null;
  if (!chinese) {
    assert.doesNotMatch(visible, /data-accuracy-context=/, locale);
    if (locale === "en") assert.ok(visible.includes("Open the meter"), locale);
    return;
  }

  assert.equal((visible.match(/data-accuracy-context=/g) ?? []).length, 3, locale);
  for (const link of accuracyLinks) {
    const section = visible.match(
      new RegExp(`<section\\b[^>]*id="${link.section}"[^>]*>([\\s\\S]*?)</section>`),
    )?.[1];
    assert.ok(section, `准确性说明缺少原章节：${locale} → ${link.section}`);
    const context = section.match(
      new RegExp(`<p\\b[^>]*data-accuracy-context="${link.section}"[^>]*>([\\s\\S]*?)</p>`),
    )?.[1];
    assert.ok(context, `准确性说明缺少就近阅读入口：${locale} → ${link.section}`);
    assert.ok(context.includes(`href="${href(link.pageId, locale)}#${link.hash}"`), locale);
    assert.ok(context.includes(escapeText(link.label[chinese])), locale);
  }
  assert.ok(visible.includes(escapeText(accuracyAction.title[chinese])), locale);
  assert.ok(visible.includes(escapeText(accuracyAction.description[chinese])), locale);
  const action = [...visible.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].find(
    (match) =>
      match[1] === `${href("meter", locale)}#measure` &&
      match[2].includes(escapeText(accuracyAction.label[chinese])),
  );
  assert.ok(action, `准确性说明缺少同条件观察入口：${locale}`);
}
