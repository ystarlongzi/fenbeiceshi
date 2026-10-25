import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { additionalLocales } from "../../src/lib/i18n/additional-locales.ts";
import { locales, localeSettings } from "../../src/lib/i18n/locales.ts";
import { prepareLocale } from "../../src/lib/i18n/load-messages.ts";
import { localize, text } from "../../src/lib/i18n/text.ts";
import { canonicalHref, contents, pagePath, sitePages } from "../../src/lib/routing/pages.ts";
import { pageMetadata } from "../../src/lib/seo/metadata.ts";
import { faqItems, homeFaqItems } from "../../src/lib/content/faq.ts";
import { soundDetails } from "../../src/lib/content/decibel-details/index.ts";
import { soundBands } from "../../src/lib/content/sound-bands.ts";
import { soundReferences } from "../../src/lib/content/sound-references.ts";
import { healthActions, healthImpacts } from "../../src/lib/content/noise-health.ts";
import { escapeText } from "../export-checks/html.ts";

const documents = new Map<string, { html: string; visible: string }>();
for (const locale of ["en", ...additionalLocales] as const)
  for (const page of sitePages) {
    const path = pagePath(page.id, locale);
    const html = await readFile(resolve("out-soundmetergo", path.slice(1), "index.html"), "utf8");
    documents.set(path, { html, visible: html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "") });
  }

let links = 0;
for (const locale of additionalLocales) {
  await prepareLocale(locale);
  const titles = new Set<string>();
  for (const page of sitePages) {
    const path = pagePath(page.id, locale);
    const document = documents.get(path)!;
    const { html, visible } = document;
    const metadata = pageMetadata(page.id, locale);
    const contains = (value: string) =>
      assert.ok(visible.includes(escapeText(value)), `${path} 正文缺失：${value.slice(0, 90)}`);
    assert.match(
      html,
      new RegExp(`<html[^>]*lang="${locale}"[^>]*dir="${localeSettings[locale].direction}"`),
      path,
    );
    assert.equal((visible.match(/<h1(?:\s|>)/g) ?? []).length, 1, path);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.equal(title, escapeText(String(metadata.title)), path);
    assert.ok(!titles.has(title!), `同语言标题重复：${path}`);
    titles.add(title!);
    assert.ok(
      html.includes(
        `<meta name="description" content="${escapeText(String(metadata.description))}"`,
      ),
      path,
    );
    assert.deepEqual(
      [...html.matchAll(/rel="canonical"[^>]*href="([^"]+)"/g)].map((match) => match[1]),
      [canonicalHref(page.id, locale)],
      path,
    );
    assert.equal(/name="robots" content="[^"]*noindex/.test(html), !page.index, path);
    const alternates = [
      ...html.matchAll(/rel="alternate"[^>]*hrefLang="([^"]+)"[^>]*href="([^"]+)"/gi),
    ];
    assert.equal(alternates.length, locales.length + 1, path);
    for (const language of [...locales, "x-default"])
      assert.ok(
        alternates.some(
          (match) =>
            match[1] === language &&
            new URL(match[2]).href ===
              canonicalHref(
                page.id,
                language === "x-default" ? "en" : (language as (typeof locales)[number]),
              ),
        ),
        `${path} → ${language}`,
      );

    const menus = [...visible.matchAll(/<ul\b([^>]*role="listbox"[^>]*)>([\s\S]*?)<\/ul>/g)].filter(
      (match) => match[2].includes('lang="zh-CN"'),
    );
    assert.equal(menus.length, 2, path);
    for (const menu of menus) {
      const options = [...menu[2].matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/g)];
      assert.equal(options.length, locales.length, path);
      assert.equal(
        options.filter((option) => option[1].includes('aria-selected="true"')).length,
        1,
        path,
      );
      for (const [index, language] of locales.entries()) {
        assert.ok(options[index][1].includes(`lang="${language}"`), path);
        assert.ok(options[index][2].includes(escapeText(localeSettings[language].label)), path);
      }
    }
    for (const nav of [...visible.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/g)].filter((match) =>
      match[1].includes(`href="${pagePath("records", locale)}"`),
    ))
      for (const id of ["meter", "decibel-chart", "knowledge", "records"])
        assert.ok(nav[1].includes(`href="${pagePath(id, locale)}"`), `${path} 导航 → ${id}`);

    const content = contents.find((item) => item.id === page.id);
    if (content) {
      contains(text(content.takeaway, locale));
      for (const section of content.sections) {
        assert.ok(visible.includes(`id="${section.id}"`), path);
        for (const field of [
          section.title,
          ...section.paragraphs,
          ...(section.items ?? []),
          ...(section.table?.headers ?? []),
          ...(section.table?.rows.flat() ?? []),
        ])
          contains(text(field, locale));
      }
      for (const source of content.sources)
        assert.ok(visible.includes(escapeText(source.url)), `${path} 来源 → ${source.url}`);
    }
    if (page.id === "meter" || page.id === "faq")
      for (const item of page.id === "meter" ? homeFaqItems : faqItems) {
        contains(text(item.question, locale));
        for (const answer of item.answer) contains(text(answer, locale));
      }
    const detail = soundDetails.find((item) => item.content.id === page.id);
    if (detail)
      for (const item of detail.questions) {
        contains(text(item.question, locale));
        contains(text(item.answer, locale));
      }
    if (page.id === "decibel-chart") {
      for (const sound of soundReferences) {
        contains(text(sound.name, locale));
        contains(text(sound.description ?? sound.context, locale));
      }
      for (const band of soundBands) contains(text(band.title, locale));
    }
    if (page.id === "noise-health") {
      for (const impact of healthImpacts) {
        contains(text(impact.title, locale));
        for (const paragraph of impact.paragraphs) contains(text(paragraph, locale));
      }
      for (const action of healthActions) {
        contains(text(action.title, locale));
        contains(text(action.body, locale));
      }
    }
    contains(localize(locale, "语言", "Language", "語言"));
    for (const script of html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    )) {
      const data = JSON.parse(script[1]);
      assert.ok(data["@type"], path);
      if (data.inLanguage) assert.equal(data.inLanguage, locale, path);
    }
    for (const match of visible.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const target = match[1].replaceAll("&amp;", "&");
      if (!target.startsWith("/") && !target.startsWith("#")) continue;
      const url = new URL(target, `https://soundmetergo.com${path}`);
      const destination = documents.get(url.pathname);
      assert.ok(destination, `本地化链接缺失：${path} → ${target}`);
      if (url.hash)
        assert.ok(
          destination.visible.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
          `锚点缺失：${path} → ${target}`,
        );
      links += 1;
    }
  }
}
console.log(
  `新增语言产物检查通过：${additionalLocales.length * sitePages.length} 个页面，${links} 条内部链接与锚点；正文、SEO、语言菜单及结构化数据完整。`,
);
