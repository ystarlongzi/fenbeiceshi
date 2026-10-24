import assert from "node:assert/strict";
import { decibelChartExposure, decibelChartWarning } from "../../src/lib/content/decibel-chart.ts";
import { text } from "../../src/lib/i18n/text.ts";
import { href } from "../../src/lib/routing/pages.ts";
import type { Locale } from "../../src/features/sound-meter/types.ts";
import { escapeText } from "./html.ts";

export function checkChartHealth(html: string, locale: Locale) {
  const path = href("decibel-chart", locale);
  const table = html.match(/<table\b[^>]*>([\s\S]*?)<\/table>/)?.[1];
  assert.ok(table, `分贝指南缺少静态职业暴露对照表：${path}`);
  assert.ok(
    table.includes(`<caption>${escapeText(text(decibelChartExposure.title, locale))}</caption>`),
    `暴露表缺少可访问标题：${path}`,
  );
  const headers = [...table.matchAll(/<th\b[^>]*scope="col"[^>]*>(.*?)<\/th>/g)];
  assert.equal(headers.length, 4, `暴露表应包含独立风险提示列：${path}`);
  assert.deepEqual(
    headers.map((match) => match[1]),
    decibelChartExposure.table.headers.map((header) => escapeText(text(header, locale))),
    `表头应区分声级、两项职业参考与本站风险提示：${path}`,
  );
  const body = table.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1];
  assert.ok(body, `暴露表缺少表体：${path}`);
  const rows = [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)];
  assert.equal(rows.length, 7, `暴露表应包含六个职业参考点与 120+ 警示：${path}`);
  const highLevel = rows.at(-1)?.[1];
  assert.ok(highLevel, `暴露表缺少 120+ 警示：${path}`);
  assert.ok(highLevel.includes(">120+</th>"), `暴露表缺少 120+ 警示：${path}`);
  assert.equal(
    (highLevel.match(/<td\b/g) || []).length,
    3,
    `120+ 应分别保留两项时长与风险列：${path}`,
  );
  assert.equal(
    highLevel.split(escapeText(text(decibelChartWarning.duration, locale))).length - 1,
    2,
    `120+ 两项时长都应显示本站警示：${path}`,
  );
  assert.match(highLevel, /headers="exposure-critical-level"/, path);
  for (const item of [decibelChartWarning.duration, decibelChartWarning.risk])
    assert.ok(highLevel.includes(escapeText(text(item, locale))), `120+ 警示缺少内容：${path}`);
  for (const [index, [level, niosh, osha, risk]] of decibelChartExposure.table.rows.entries()) {
    const row = rows[index][1];
    assert.ok(row.includes(`<th scope="row">${text(level, locale)}</th>`), path);
    for (const cell of [niosh, osha])
      assert.ok(row.includes(`<td>${escapeText(text(cell, locale))}</td>`), path);
    assert.ok(row.includes(`>${escapeText(text(risk, locale))}</span>`), `缺少风险等级：${path}`);
    assert.match(row, /data-risk="(?:caution|moderate|high|severe|extreme)"/, path);
  }
  assert.match(highLevel, /<sup\b[^>]*>\*<\/sup>/, `120+ 时长应带星号：${path}`);
  assert.equal((highLevel.match(/<sup\b/g) || []).length, 2, `两项时长应各自带星号：${path}`);
  assert.match(highLevel, /aria-describedby="exposure-warning-note"/, path);
  assert.ok(html.includes('id="exposure-warning-note"'), path);
  assert.ok(html.includes(escapeText(text(decibelChartWarning.note, locale))), path);
  for (const [index, paragraph] of decibelChartExposure.paragraphs.entries())
    assert.ok(
      html.includes(escapeText(text(paragraph, locale))),
      `暴露表缺少计算口径或适用条件：${path} → ${index}`,
    );
  assert.match(html, /aria-describedby="exposure-basis exposure-scope exposure-risk"/, path);
  assert.match(
    html,
    /<div\b[^>]*role="region"[^>]*tabindex="0"/i,
    `窄屏表格应支持键盘滚动：${path}`,
  );
  for (const id of ["exposure-basis", "exposure-scope", "exposure-risk"])
    assert.ok(html.includes(`id="${id}"`), path);
  for (const suffix of ["", "#exposure"])
    assert.ok(
      html.includes(`href="${href("noise-health", locale)}${suffix}"`),
      `健康区缺少同语言完整文章或时长入口：${path} → ${suffix}`,
    );
  assert.doesNotMatch(
    html,
    /<input\b|无限制安全暴露|無限制安全暴露|unlimited safe exposure/i,
    `健康区应保持静态参考，不承诺无限制安全暴露：${path}`,
  );
}
