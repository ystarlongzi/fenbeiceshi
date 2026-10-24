import assert from "node:assert/strict";
import { decibelChartExposure } from "../../src/lib/content/decibel-chart.ts";
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
  assert.deepEqual(
    headers.map((match) => match[1]),
    decibelChartExposure.table.headers.map((header) => escapeText(text(header, locale))),
    `表头应区分声级、NIOSH 推荐与 OSHA 剂量参考：${path}`,
  );
  const body = table.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1];
  assert.ok(body, `暴露表缺少表体：${path}`);
  const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
  assert.equal(rows.length, 7, `暴露表应包含七个声级参考点及 120 dBA 说明：${path}`);
  const highLevel = rows.find((row) => row[1].includes('<th scope="row">120</th>'))?.[1];
  assert.ok(highLevel, `暴露表缺少 120 dBA 的具体参考：${path}`);
  assert.match(highLevel, /9/, `120 dBA 应保留 NIOSH 约 9 秒的参考：${path}`);
  assert.match(highLevel, /115 dBA/, `120 dBA 应说明 OSHA 连续噪音上限：${path}`);
  assert.doesNotMatch(highLevel, /7\.5|0 秒|0 seconds/, `不得将剂量计算写成允许停留时长：${path}`);
  for (const [index, [level, niosh, osha]] of decibelChartExposure.table.rows.entries()) {
    const row = rows[index][1];
    assert.ok(row.includes(`<th scope="row">${text(level, locale)}</th>`), path);
    for (const cell of [niosh, osha])
      assert.ok(row.includes(`<td>${escapeText(text(cell, locale))}</td>`), path);
  }
  for (const [index, paragraph] of decibelChartExposure.paragraphs.entries())
    assert.ok(
      html.includes(escapeText(text(paragraph, locale))),
      `暴露表缺少计算口径或适用条件：${path} → ${index}`,
    );
  assert.match(html, /aria-describedby="exposure-basis exposure-scope"/, path);
  for (const id of ["exposure-basis", "exposure-scope"])
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
