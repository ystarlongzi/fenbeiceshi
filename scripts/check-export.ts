import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { contents, href, sitePages, SITE_URL } from "../src/lib/routing/pages.ts";
import { text } from "../src/lib/content/types.ts";

const locales = ["zh-CN", "en"] as const;
const htmlByPath = new Map<string, string>();
const titles = new Set<string>();
for (const page of sitePages) {
  for (const locale of locales) {
    const path = href(page.id, locale);
    const html = await readFile(resolve("out", path.slice(1), "index.html"), "utf8");
    htmlByPath.set(path, html);
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
    for (const alternate of locales)
      assert.ok(
        html.includes(`hrefLang="${alternate}" href="${SITE_URL + href(page.id, alternate)}"`) ||
          html.includes(`hreflang="${alternate}" href="${SITE_URL + href(page.id, alternate)}"`),
        `缺少语言对应：${path}`,
      );
    const content = contents.find((item) => item.id === page.id);
    if (content) {
      const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      const excerpt = text(content.takeaway, locale)
        .slice(0, 18)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;");
      assert.ok(visible.includes(excerpt), `核心答案不在静态正文：${path}`);
      for (const source of content.sources) assert.ok(visible.includes(source.url), path);
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
