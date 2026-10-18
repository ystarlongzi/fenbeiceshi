import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { contents, href, sitePages, SITE_URL } from "../src/lib/routing/pages.ts";
import { text } from "../src/lib/content/types.ts";
import { soundReferences, soundSources } from "../src/lib/content/sound-references.ts";
import { referenceLevel } from "../src/features/decibel-chart/sound-reference-list/filter.ts";
import { healthEffects, healthSources } from "../src/lib/content/health-effects.ts";

const locales = ["zh-CN", "en"] as const;
function escapeText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}
const htmlByPath = new Map<string, string>();
const titles = new Set<string>();
for (const page of sitePages) {
  for (const locale of locales) {
    const path = href(page.id, locale);
    const html = await readFile(resolve("out", path.slice(1), "index.html"), "utf8");
    htmlByPath.set(path, html);
    assert.doesNotMatch(html, /github\.com|\bgithub\b/i, `产品页面不得暴露 GitHub 信息：${path}`);
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`), path);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, path);
    const canonical = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)].map(
      (m) => m[1],
    );
    assert.deepEqual(canonical, [SITE_URL + path], path);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title && !titles.has(title), `标题缺失或重复：${path}`);
    titles.add(title);
    assert.match(html, /<meta name="description" content="[^"]+"/, path);
    const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
    assert.equal(noindex, !page.index, path);
    if (page.id === "meter")
      assert.ok(
        html.includes(`href="${href("decibel-chart", locale)}#health"`),
        `首页缺少健康导读：${path}`,
      );
    const navigation = html.match(
      /<nav aria-label="(?:主导航|Main navigation)">([\s\S]*?)<\/nav>/,
    )?.[1];
    assert.ok(navigation, `缺少主导航：${path}`);
    assert.ok(
      navigation.includes(`href="${href("decibel-chart", locale)}"`),
      `缺少分贝对照一级入口：${path}`,
    );
    const selected = [...navigation.matchAll(/<a\b([^>]*)>/g)].filter((match) =>
      match[1].includes("aria-current="),
    );
    const expectedSection = ["meter", "decibel-chart", "knowledge", "guide", "records"].includes(
      page.id,
    )
      ? page.id
      : page.slug.startsWith("knowledge/")
        ? "knowledge"
        : null;
    assert.equal(selected.length, expectedSection ? 1 : 0, `导航选中数量不正确：${path}`);
    if (expectedSection)
      assert.ok(selected[0][1].includes(`href="${href(expectedSection, locale)}"`), path);
    for (const alternate of locales)
      assert.ok(
        html.includes(`hrefLang="${alternate}" href="${SITE_URL + href(page.id, alternate)}"`) ||
          html.includes(`hreflang="${alternate}" href="${SITE_URL + href(page.id, alternate)}"`),
        `缺少语言对应：${path}`,
      );
    const content = contents.find((item) => item.id === page.id);
    if (content) {
      const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      const excerpt = escapeText(text(content.takeaway, locale).slice(0, 18));
      assert.ok(visible.includes(excerpt), `核心答案不在静态正文：${path}`);
      for (const source of content.sources) assert.ok(visible.includes(source.url), path);
      const toc = visible.match(
        /<nav\b[^>]*aria-label="(?:本文目录|On this page)"[^>]*>([\s\S]*?)<\/nav>/,
      )?.[1];
      assert.ok(toc, `文章目录不在静态 HTML：${path}`);
      assert.deepEqual(
        [...toc.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
        content.sections.map((section) => section.id),
        `文章目录与章节不一致：${path}`,
      );
      if (page.id === "decibel-chart") {
        for (const sound of soundReferences) {
          assert.ok(
            visible.includes(`data-sound-id="${sound.id}"`),
            `声音条目不在静态正文：${path} → ${sound.id}`,
          );
          assert.ok(visible.includes(text(sound.name, locale)), path);
          assert.ok(visible.includes(referenceLevel(sound)), path);
        }
        for (const source of Object.values(soundSources))
          assert.ok(visible.includes(`id="${source.id}"`), path);
        assert.ok(visible.includes('id="sound-query"'), path);
        assert.ok(visible.includes('id="levels"') && visible.includes('id="exposure"'), path);
        for (const id of [
          "sound-level-input",
          "sound-level-range",
          "exposure-level-input",
          "exposure-level-range",
          "health",
        ])
          assert.ok(visible.includes(`id="${id}"`), `缺少交互或健康模块：${path} → ${id}`);
        for (const effect of healthEffects) {
          assert.ok(visible.includes(`data-health-id="${effect.id}"`), path);
          assert.ok(
            visible.includes(escapeText(text(effect.summary, locale))),
            `健康摘要不在静态正文：${path}`,
          );
          assert.ok(
            visible.includes(escapeText(text(effect.detail, locale))),
            `展开内容不在静态正文：${path}`,
          );
          assert.ok(visible.includes(effect.source.url), path);
        }
        for (const source of Object.values(healthSources))
          assert.ok(visible.includes(`id="${source.id}"`), path);
      }
    }
    for (const script of html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    )) {
      assert.ok(JSON.parse(script[1])["@type"], `结构化数据格式错误：${path}`);
    }
  }
}
let links = 0;
for (const [path, html] of htmlByPath) {
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const target = match[1].replace(/&amp;/g, "&");
    if (!target.startsWith("/") && !target.startsWith("#")) continue;
    const url = new URL(target, SITE_URL + path);
    assert.ok(htmlByPath.has(url.pathname), `内部链接缺失：${path} → ${target}`);
    if (url.hash)
      assert.ok(
        htmlByPath.get(url.pathname)?.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `锚点缺失：${path} → ${target}`,
      );
    links += 1;
  }
}
const sitemap = await readFile("out/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).sort();
const expected = sitePages
  .filter((page) => page.index)
  .flatMap((page) => locales.map((locale) => SITE_URL + href(page.id, locale)))
  .sort();
assert.deepEqual(urls, expected);
assert.match(await readFile("out/404.html", "utf8"), /noindex/);
console.log(
  `静态产物检查通过：${htmlByPath.size} 个页面，${urls.length} 个 sitemap URL，${links} 条内部链接与锚点。`,
);
