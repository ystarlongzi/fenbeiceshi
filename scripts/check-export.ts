import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { contents, href, sitePages, SITE_URL } from "../src/lib/routing/pages.ts";
import { text } from "../src/lib/content/types.ts";
import { articles } from "../src/lib/content/articles.ts";
import { soundReferences, soundSources } from "../src/lib/content/sound-references.ts";
import { soundBands } from "../src/lib/content/sound-bands.ts";
import {
  exposureNotes,
  exposureReferences,
} from "../src/features/noise-health/exposure-explorer/copy.ts";
import { referenceLevel } from "../src/features/decibel-chart/sound-reference-list/filter.ts";
import {
  exposureFactors,
  healthActions,
  healthImpacts,
  healthSources,
} from "../src/lib/content/noise-health.ts";
import { decibelChartNotes } from "../src/lib/content/decibel-chart.ts";
import { faqItems, homeFaqItems } from "../src/lib/content/faq.ts";
import { locales, localeSettings } from "../src/lib/i18n/locales.ts";
import { localize } from "../src/lib/i18n/text.ts";

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
    if (locale === "zh-TW") {
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
      const visible = main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      assert.doesNotMatch(
        visible,
        /麦克风|分贝|导出数据|常见问题|准备就绪|测量设置|保存报告/,
        `繁体正文不得回退到简体界面：${path}`,
      );
    }
    if (page.id === "knowledge") {
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
      assert.ok(main, `知识目录缺少正文：${path}`);
      for (const article of articles)
        assert.equal(
          main.split(`href="${href(article.id, locale)}"`).length - 1,
          1,
          `知识分组应完整且不重复地保留已发布文章：${path} → ${article.id}`,
        );
    }
    if (page.id === "meter") {
      assert.ok(
        html.includes(`href="${href("noise-health", locale)}"`),
        `首页缺少健康导读：${path}`,
      );
      const scenarios = html.match(
        /<section\b[^>]*id="home-scenarios"[^>]*>([\s\S]*?)<\/section>/,
      )?.[1];
      assert.ok(scenarios, `首页缺少场景说明：${path}`);
      assert.doesNotMatch(
        scenarios,
        /<a\b|<button\b|role="(?:button|link)"/,
        `场景说明应保持静态阅读，不提供跳转或操作：${path}`,
      );
      const switches = [
        ...html.matchAll(/<input\b[^>]*data-setting="(recording|calibration)"[^>]*>/g),
      ];
      for (const setting of ["recording", "calibration"])
        assert.equal(
          switches.filter((match) => match[1] === setting).length,
          2,
          `桌面与抽屉均需包含设置开关：${path} → ${setting}`,
        );
      const hintIds: string[] = [];
      for (const [input, setting] of switches) {
        assert.match(input, /role="switch"/, `设置应使用开关：${path} → ${setting}`);
        assert.doesNotMatch(input, /\bchecked(?:=|\s|\/?>)/, `开关应默认关闭：${path}`);
        const hintId = input.match(/aria-describedby="([^"]+)"/)?.[1];
        assert.ok(hintId && html.includes(`id="${hintId}"`), `缺少关联的设置说明：${path}`);
        hintIds.push(hintId);
      }
      assert.equal(new Set(hintIds).size, hintIds.length, `设置说明 ID 不应重复：${path}`);
      assert.equal((html.match(/role="combobox"/g) || []).length, 4, path);
    }
    const navigations = [
      ...html.matchAll(
        /<nav\b[^>]*aria-label="(?:主导航|主導航|Main navigation)"[^>]*>([\s\S]*?)<\/nav>/g,
      ),
    ];
    assert.equal(navigations.length, 2, `桌面与移动抽屉均需静态输出主导航：${path}`);
    const expectedSection = [
      "meter",
      "decibel-chart",
      "knowledge",
      "guide",
      "records",
      "faq",
    ].includes(page.id)
      ? page.id
      : page.slug.startsWith("knowledge/")
        ? "knowledge"
        : null;
    for (const [, navigation] of navigations) {
      for (const id of ["meter", "decibel-chart", "knowledge", "guide", "records", "faq"])
        assert.ok(
          navigation.includes(`href="${href(id, locale)}"`),
          `缺少导航入口：${path} → ${id}`,
        );
      const selected = [...navigation.matchAll(/<a\b([^>]*)>/g)].filter((match) =>
        match[1].includes("aria-current="),
      );
      assert.equal(selected.length, expectedSection ? 1 : 0, `导航选中数量不正确：${path}`);
      if (expectedSection)
        assert.ok(selected[0][1].includes(`href="${href(expectedSection, locale)}"`), path);
    }
    const menuButton = html.match(/<button\b[^>]*aria-haspopup="dialog"[^>]*>/)?.[0];
    assert.ok(menuButton, `缺少移动菜单按钮：${path}`);
    assert.match(menuButton, /aria-expanded="false"/, `菜单应默认收起：${path}`);
    const menuId = menuButton.match(/aria-controls="([^"]+)"/)?.[1];
    assert.ok(menuId, `菜单按钮缺少控制对象：${path}`);
    const menu = [...html.matchAll(/<dialog\b([^>]*)>([\s\S]*?)<\/dialog>/g)].find((match) =>
      match[1].includes(`id="${menuId}"`),
    );
    assert.ok(menu, `移动菜单应使用关联的原生对话框：${path}`);
    assert.doesNotMatch(menu[1], /\bopen(?:=|\s|$)/, `移动菜单不应默认打开：${path}`);
    assert.ok(menu[2].includes(navigations[1][1]), `抽屉需包含完整主导航：${path}`);
    for (const [visible, count] of [
      [html, 2],
      [menu[2], 1],
    ] as const) {
      assert.doesNotMatch(visible, /<select\b/, `语言和麦克风均需使用自定义下拉：${path}`);
      const selectors = [
        ...visible.matchAll(/<button\b([^>]*data-language-switch=""[^>]*)>([\s\S]*?)<\/button>/g),
      ];
      assert.equal(selectors.length, count, `桌面与手机均需语言下拉框：${path}`);
      const listIds: string[] = [];
      for (const [, attributes, body] of selectors) {
        assert.match(attributes, /\bdisabled=/, `水合前应禁用语言选择，避免事件丢失：${path}`);
        assert.match(attributes, /role="combobox"/, path);
        assert.match(attributes, /aria-haspopup="listbox"/, path);
        assert.match(attributes, /aria-expanded="false"/, `语言菜单应默认收起：${path}`);
        assert.ok(
          attributes.includes(`aria-label="${localize(locale, "语言", "Language", "語言")}"`),
          path,
        );
        assert.ok(
          body.includes(`<span lang="${locale}">${localeSettings[locale].label}</span>`),
          path,
        );
        const listId = attributes.match(/aria-controls="([^"]+)"/)?.[1];
        assert.ok(listId, `语言入口缺少选项列表关联：${path}`);
        listIds.push(listId);
        const list = [...visible.matchAll(/<ul\b([^>]*)>([\s\S]*?)<\/ul>/g)].find((match) =>
          match[1].includes(`id="${listId}"`),
        );
        assert.ok(list, `缺少语言选项列表：${path}`);
        assert.match(list[1], /role="listbox"/, path);
        assert.match(list[1], /\bhidden=/, `未展开的语言列表应隐藏：${path}`);
        const options = [...list[2].matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/g)];
        assert.deepEqual(
          options.map((option) => option[2].match(/<span>([^<]*)<\/span>/)?.[1]),
          ["简体中文", "繁體中文", "English"],
          path,
        );
        for (const [index, language] of locales.entries()) {
          assert.match(options[index][1], /role="option"/, path);
          assert.ok(options[index][1].includes(`lang="${language}"`), path);
          assert.ok(
            options[index][1].includes(`aria-selected="${language === locale}"`),
            `下拉框应选中当前语言：${path}`,
          );
        }
      }
      assert.equal(new Set(listIds).size, count, `语言列表 ID 不应重复：${path}`);
    }
    assert.ok(
      html.includes(`property="og:locale" content="${localeSettings[locale].openGraph}"`),
      path,
    );
    for (const alternate of locales)
      assert.ok(
        html.includes(`hrefLang="${alternate}" href="${SITE_URL + href(page.id, alternate)}"`) ||
          html.includes(`hreflang="${alternate}" href="${SITE_URL + href(page.id, alternate)}"`),
        `缺少语言对应：${path}`,
      );
    const content = contents.find((item) => item.id === page.id);
    if (page.id === "meter" || page.id === "faq") {
      const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      const questions = [
        ...visible.matchAll(/<details\b([^>]*data-faq-id="([^"]+)"[^>]*)>([\s\S]*?)<\/details>/g),
      ];
      const expected = page.id === "meter" ? homeFaqItems : faqItems;
      assert.deepEqual(
        questions.map((match) => match[2]),
        expected.map((item) => item.id),
        `问题数量与顺序不正确：${path}`,
      );
      for (const [index, item] of expected.entries()) {
        const [, attributes, , body] = questions[index];
        assert.doesNotMatch(attributes, /\bopen(?:=|\s|$)/, `问题应默认收起：${path} → ${item.id}`);
        assert.ok(body.includes(escapeText(text(item.question, locale))), path);
        for (const paragraph of item.answer)
          assert.ok(
            body.includes(escapeText(text(paragraph, locale))),
            `回答必须在静态正文：${path} → ${item.id}`,
          );
        assert.ok(
          body.includes(
            `href="${href(item.link.pageId, locale)}${item.link.hash ? `#${item.link.hash}` : ""}"`,
          ),
          path,
        );
      }
      for (const id of ["faq", "how-it-works"])
        assert.ok(visible.includes(`href="${href(id, locale)}"`), `缺少帮助入口：${path} → ${id}`);
    }
    if (content) {
      const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      const excerpt = escapeText(text(content.takeaway, locale).slice(0, 18));
      assert.ok(visible.includes(excerpt), `核心答案不在静态正文：${path}`);
      for (const source of content.sources) assert.ok(visible.includes(source.url), path);
      const toc = visible.match(
        /<nav\b[^>]*aria-label="(?:本文目录|本文目錄|On this page)"[^>]*>([\s\S]*?)<\/nav>/,
      )?.[1];
      assert.ok(toc, `文章目录不在静态 HTML：${path}`);
      assert.deepEqual(
        [...toc.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
        content.sections.map((section) => section.id),
        `文章目录与章节不一致：${path}`,
      );
      if (page.id === "how-it-works")
        for (const section of content.sections)
          for (const paragraph of section.paragraphs)
            assert.ok(
              visible.includes(escapeText(text(paragraph, locale))),
              `工作原理必须静态输出：${path}`,
            );
      if (page.id === "decibel-chart") {
        const disclosures = [...visible.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g)];
        for (const note of decibelChartNotes) {
          const disclosure = disclosures.find((match) => match[2].includes(`id="${note.id}"`));
          assert.ok(disclosure, `说明缺少原生展开与原有锚点：${path} → ${note.id}`);
          assert.doesNotMatch(disclosure[1], /\bopen(?:=|\s|$)/, path);
          const body = disclosure[2];
          for (const paragraph of note.paragraphs)
            assert.ok(body.includes(escapeText(text(paragraph, locale))), path);
          assert.ok(
            body.includes(`href="${href(note.link.pageId, locale)}"`),
            `参考说明缺少进一步阅读入口：${path} → ${note.id}`,
          );
        }
        const comparison = visible.match(
          /<section\b[^>]*id="levels"[^>]*>([\s\S]*?)<\/section>/,
        )?.[1];
        assert.ok(comparison, `声音对照缺少统一章节：${path}`);
        assert.ok(comparison.includes('id="sound-query"'), `搜索应在对照章节内：${path}`);
        assert.ok(comparison.includes('id="reference"'), `保留旧查询锚点：${path}`);
        assert.equal(
          (comparison.match(/data-band-tone="/g) || []).length,
          7,
          `七档应直接包含声音内容：${path}`,
        );
        for (const band of soundBands) {
          assert.ok(
            comparison.includes(`data-band-description="${band.tone}"`),
            `缺少分段体感说明：${path} → ${band.tone}`,
          );
          assert.ok(
            comparison.includes(escapeText(text(band.description, locale))),
            `分段体感说明必须静态输出：${path} → ${band.tone}`,
          );
        }
        assert.doesNotMatch(
          comparison,
          /<input\b[^>]*type="(?:range|number)"|aria-label="(?:声音类别|Sound category)"|aria-controls="sound-results"/,
          `对照区不再包含滑块、独立数值输入、类别或分段筛选按钮：${path}`,
        );
        assert.equal((comparison.match(/<h2\b/g) || []).length, 1, path);
        assert.equal(
          (comparison.match(/data-sound-id="/g) || []).length,
          soundReferences.length,
          `每项声音只在统一对照区展示一份：${path}`,
        );
        const entries = [...comparison.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g)];
        assert.equal(entries.length, soundReferences.length, path);
        for (const sound of soundReferences) {
          assert.ok(
            comparison.includes(`data-sound-id="${sound.id}"`),
            `声音条目不在统一对照区静态正文：${path} → ${sound.id}`,
          );
          assert.ok(visible.includes(text(sound.name, locale)), path);
          assert.ok(visible.includes(referenceLevel(sound)), path);
          const entry = entries.find((match) => match[1].includes(`data-sound-id="${sound.id}"`));
          assert.ok(entry, `声音详情缺少原生展开：${path} → ${sound.id}`);
          assert.ok(
            entry[2].includes(`aria-hidden="true">${sound.emoji}</span>`),
            `声音标签缺少静态装饰图示：${path} → ${sound.id}`,
          );
          const band = soundBands.findLast((item) => sound.min >= item.min);
          assert.ok(entry[1].includes(`data-sound-band="${band?.tone}"`), path);
          assert.ok(entry[1].includes(`name="sound-details-${band?.tone}"`), path);
          assert.doesNotMatch(entry[1], /\bopen(?:=|\s|$)/, path);
          assert.ok(entry[2].includes(escapeText(text(sound.context, locale))), path);
          assert.ok(entry[2].includes(`href="#${soundSources[sound.source].id}"`), path);
        }
        for (const source of content.sources)
          assert.ok(visible.includes(`id="${source.id}"`), path);
        assert.ok(visible.includes('id="sound-query"'), path);
        assert.ok(visible.includes('id="levels"') && visible.includes('id="exposure"'), path);
        for (const id of ["sound-results", "health"])
          assert.ok(visible.includes(`id="${id}"`), `缺少交互或健康模块：${path} → ${id}`);
        assert.doesNotMatch(
          visible,
          /data-health-id=|id="exposure-level-input"/,
          `对照页不应保留健康正文和职业演示：${path}`,
        );
        for (const id of ["numbers", "scale", "distance", "limits"])
          assert.ok(visible.includes(`id="${id}"`), `保留已发布说明锚点：${path} → ${id}`);
        const healthEntry = visible.match(
          /<section\b[^>]*id="health"[^>]*>([\s\S]*?)<\/section>/,
        )?.[1];
        assert.ok(healthEntry, `对照页缺少健康导读：${path}`);
        assert.match(healthEntry, /<h2\b/, `健康导读应为独立章节：${path}`);
        assert.ok(
          visible.indexOf('id="health"') > visible.indexOf('id="levels"') &&
            visible.indexOf('id="health"') < visible.indexOf('id="reading"'),
          `健康入口应紧随声音对照并位于参考说明之前：${path}`,
        );
        for (const target of ["exposure", "effects"])
          assert.ok(
            healthEntry.includes(`href="${href("noise-health", locale)}#${target}"`),
            `对照页缺少健康文章的具体入口：${path} → ${target}`,
          );
        assert.equal(
          (healthEntry.match(/<p\b/g) || []).length,
          1,
          `对照页健康导读只保留一段：${path}`,
        );
      }
      if (page.id === "noise-health") {
        for (const section of content.sections)
          for (const paragraph of section.paragraphs)
            assert.ok(visible.includes(escapeText(text(paragraph, locale))), path);
        for (const impact of healthImpacts) {
          assert.ok(visible.includes(`data-health-id="${impact.id}"`), path);
          for (const paragraph of [impact.title, ...impact.paragraphs])
            assert.ok(
              visible.includes(escapeText(text(paragraph, locale))),
              `健康正文不在静态 HTML：${path}`,
            );
        }
        for (const field of [
          ...exposureFactors,
          ...healthActions.flatMap((action) => [action.title, action.body]),
        ])
          assert.ok(
            visible.includes(escapeText(text(field, locale))),
            `暴露条件与行动必须静态可读：${path}`,
          );
        const occupation = [...visible.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g)].find(
          (match) => match[2].includes('id="exposure-level-input"'),
        );
        assert.equal(occupation, undefined, `暴露时长应默认可见：${path}`);
        const exposureStart = visible.indexOf('id="exposure"');
        assert.ok(
          exposureStart >= 0 && exposureStart < visible.indexOf('id="effects"'),
          `暴露时长应位于影响概览之前：${path}`,
        );
        for (const id of ["exposure-level-input", "exposure-level-range"]) {
          const input = visible.match(new RegExp(`<input\\b[^>]*id="${id}"[^>]*>`))?.[0];
          assert.ok(input, `健康文章缺少声级控件：${path} → ${id}`);
          const attributes =
            id === "exposure-level-input"
              ? [
                  'type="text"',
                  'role="spinbutton"',
                  'aria-valuemin="40"',
                  'aria-valuemax="130"',
                  'value="85"',
                ]
              : ['min="40"', 'max="130"', 'step="0.5"', 'value="85"'];
          for (const attribute of attributes)
            assert.ok(input.includes(attribute), `${path} → ${id} → ${attribute}`);
        }
        assert.ok(visible.includes(locale === "en" ? "Noise level" : "噪音水平"), path);
        assert.ok(
          visible.includes(text(exposureNotes.reference, locale)),
          `默认动态说明应静态输出：${path}`,
        );
        const duration = visible.match(
          /<output\b[^>]*id="exposure-duration"[^>]*>([\s\S]*?)<\/output>/,
        )?.[1];
        assert.equal(
          duration?.replace(/<[^>]*>/g, ""),
          `8 ${localize(locale, "小时", "hrs", "小時")}`,
          path,
        );
        assert.match(
          visible,
          /id="exposure-duration"[^>]*style="color:var\(--noise-loud-ink\)"/,
          `默认时长应使用 85 dBA 对应的文字色：${path}`,
        );
        assert.match(
          visible,
          new RegExp(
            `id="exposure-level-band"[^>]*>${locale === "en" ? "Very noisy" : "很吵"}</span>`,
          ),
          `默认声级描述应静态输出：${path}`,
        );
        assert.ok(
          visible.indexOf('id="exposure-level-band"') >
            visible.indexOf("</output>", visible.indexOf('id="exposure-duration"')),
          `声级标签应紧跟时长结果：${path}`,
        );
        const referenceText = visible.replace(/<!--[\s\S]*?-->/g, "");
        for (const point of exposureReferences) {
          assert.ok(referenceText.includes(`${point.level} dBA`), `参考点必须静态可读：${path}`);
          assert.ok(
            referenceText.includes(escapeText(text(point.description, locale))),
            `参考点说明必须静态可读：${path} → ${point.level} dBA`,
          );
        }
        for (const source of Object.values(healthSources))
          assert.ok(visible.includes(`id="${source.id}"`), path);
        assert.ok(
          visible.includes(`href="${href("decibel-chart", locale)}"`),
          `健康文章应返回声音对照：${path}`,
        );
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
