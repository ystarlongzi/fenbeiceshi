import assert from "node:assert/strict";
import test from "node:test";
import { languageHref, locales } from "./locales.ts";
import { canonicalHref, pagePath, sitePages } from "../routing/pages.ts";
import { siteForLocale } from "../routing/sites.ts";
import { pageMetadata } from "../seo/metadata.ts";

const available = sitePages.map((page) => "/" + (page.slug ? page.slug + "/" : ""));

test("所有已发布页面可在两个域名三种语言间对应切换，站内使用相对地址", () => {
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

test("三语 canonical 与 hreflang 跨域对应，每页自引用且不合并到中文", () => {
  for (const locale of locales) {
    const page = pageMetadata("phone-accuracy", locale);
    assert.equal(page.alternates?.canonical, canonicalHref("phone-accuracy", locale));
    assert.deepEqual(page.alternates?.languages, {
      "zh-CN": "https://fenbeiceshi.com/knowledge/phone-decibel-accuracy/",
      "zh-TW": "https://fenbeiceshi.com/zh-tw/knowledge/phone-decibel-accuracy/",
      en: "https://soundmetergo.com/knowledge/phone-decibel-accuracy/",
      "x-default": "https://soundmetergo.com/knowledge/phone-decibel-accuracy/",
    });
    assert.deepEqual(pageMetadata("records", locale).robots, { index: false, follow: true });
  }
  assert.ok(String(pageMetadata("meter", "en").title).endsWith(" | SoundMeterGo"));
  assert.equal(String(pageMetadata("meter", "en").metadataBase), "https://soundmetergo.com/");
});
