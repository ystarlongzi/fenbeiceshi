import assert from "node:assert/strict";
import test, { before } from "node:test";
import { languageHref, locales } from "./locales.ts";
import { canonicalHref, pagePath, sitePages } from "../routing/pages.ts";
import { siteForLocale } from "../routing/sites.ts";
import { pageMetadata } from "../seo/metadata.ts";
import { prepareLocale } from "./load-messages.ts";

before(async () => {
  await Promise.all(locales.map(prepareLocale));
});

const available = sitePages.map((page) => "/" + (page.slug ? page.slug + "/" : ""));

test("所有已发布页面可在两个域名的 27 种语言间对应切换，站内使用相对地址", () => {
  for (const page of sitePages)
    for (const source of locales)
      for (const target of locales) {
        const expected =
          siteForLocale(source) === siteForLocale(target)
            ? pagePath(page.id, target)
            : canonicalHref(page.id, target);
        const path = pagePath(page.id, source);
        assert.equal(languageHref(path, target, available, source), expected);
        assert.equal(languageHref(path.slice(0, -1), target, available, source), expected);
      }
});

test("未发布主题回到目标语言首页，只有完整前缀会被移除", () => {
  assert.equal(languageHref("/missing/", "en", available, "zh-CN"), "https://soundmetergo.com/");
  assert.equal(languageHref("/missing/", "zh-TW", available, "zh-CN"), "/zh-tw/");
  assert.equal(languageHref("/zh-tw", "en", available, "zh-TW"), "https://soundmetergo.com/");
  assert.equal(languageHref("/zh-tw-other/", "zh-CN", ["/zh-tw-other/"], "zh-TW"), "/zh-tw-other/");
});

test("canonical 与 27 种语言 hreflang 跨域对应，每页自引用且不合并到中文", () => {
  for (const locale of locales) {
    const page = pageMetadata("phone-accuracy", locale);
    assert.equal(page.alternates?.canonical, canonicalHref("phone-accuracy", locale));
    assert.deepEqual(page.alternates?.languages, {
      ...Object.fromEntries(
        locales.map((language) => [language, canonicalHref("phone-accuracy", language)]),
      ),
      "x-default": "https://soundmetergo.com/knowledge/phone-decibel-accuracy/",
    });
    assert.deepEqual(pageMetadata("records", locale).robots, { index: false, follow: true });
  }
  assert.ok(String(pageMetadata("meter", "en").title).endsWith(" | SoundMeterGo"));
  assert.equal(String(pageMetadata("meter", "en").metadataBase), "https://soundmetergo.com/");
});
