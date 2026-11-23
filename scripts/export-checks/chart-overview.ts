import assert from "node:assert/strict";
import {
  chineseChartIntro,
  chineseChartStandards,
  chineseChartSummaryLabel,
  decibelChart,
} from "../../src/lib/content/decibel-chart.ts";
import { text } from "../../src/lib/content/types.ts";
import { href } from "../../src/lib/routing/pages.ts";
import type { Locale } from "../../src/features/sound-meter/types.ts";
import { escapeText } from "./html.ts";

export function checkChartOverview(html: string, locale: Locale) {
  const chinese = locale === "zh-CN" ? "zh" : locale === "zh-TW" ? "zhTW" : null;
  if (!chinese) {
    assert.doesNotMatch(html, /data-chart-(?:summary|overview|standards)=/, locale);
    return;
  }

  const overview = html.match(/<p\b[^>]*data-chart-overview=""[^>]*>([\s\S]*?)<\/p>/);
  assert.ok(overview, `中文页首缺少静态简短答案：${locale}`);
  const summary = html.match(/<div\b[^>]*data-chart-summary=""[^>]*>([\s\S]*?)<\/div>/);
  assert.ok(summary, `中文导读缺少摘要分组：${locale}`);
  assert.ok(summary[1].includes(overview[0]), `摘要与正文应放在同一组：${locale}`);
  assert.ok(
    summary[1].includes(`>${escapeText(chineseChartSummaryLabel[chinese])}</span>`),
    `摘要标识必须静态输出：${locale}`,
  );
  assert.equal((html.match(/data-chart-overview=""/g) || []).length, 1, locale);
  assert.equal(
    overview[1].replace(/<[^>]*>/g, ""),
    escapeText(text(decibelChart.takeaway, locale)),
    `页首答案与内容定义不一致：${locale}`,
  );
  const tocLabel = locale === "zh-CN" ? "本文目录" : "本文目錄";
  assert.ok(
    overview.index! < html.indexOf(`aria-label="${tocLabel}"`),
    `手机目录前应先展示答案：${locale}`,
  );
  assert.ok(overview.index! < html.indexOf('id="levels"'), locale);
  assert.equal((overview[1].match(/<a\b/g) || []).length, chineseChartIntro.length, locale);
  for (const part of chineseChartIntro) {
    assert.ok(
      overview[1].includes(`href="${href(part.pageId, locale)}"`),
      `页首缺少对应分贝详情入口：${locale} → ${part.pageId}`,
    );
    assert.ok(overview[1].includes(`>${part.label}</a>`), locale);
  }

  const standards = html.match(/<p\b[^>]*data-chart-standards=""[^>]*>([\s\S]*?)<\/p>/);
  assert.ok(standards, `声音对照后缺少法规入口：${locale}`);
  assert.ok(standards.index! > html.indexOf('id="sound-query"'), locale);
  assert.ok(standards.index! < html.indexOf('id="health"'), locale);
  assert.ok(standards[1].includes(escapeText(chineseChartStandards.before[chinese])), locale);
  assert.ok(
    standards[1].includes(`href="${href("china-noise-standards", locale)}"`),
    `法规入口应链接对应语言：${locale}`,
  );
  assert.ok(standards[1].includes(escapeText(chineseChartStandards.label[chinese])), locale);
}
