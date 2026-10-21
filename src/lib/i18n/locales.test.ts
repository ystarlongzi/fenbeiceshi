import assert from "node:assert/strict";
import test from "node:test";
import { languageHref, locales, localePrefix } from "./locales.ts";
import { href, sitePages } from "../routing/pages.ts";
import { pageMetadata } from "../seo/metadata.ts";

test("所有页面可在三种语言之间双向切换，并保留主题和尾斜杠", () => {
  const available = sitePages.flatMap((page) => locales.map((locale) => href(page.id, locale)));
  for (const page of sitePages)
    for (const source of locales)
      for (const target of locales) {
        const path = href(page.id, source);
        assert.equal(languageHref(path, target, available), href(page.id, target));
        assert.equal(languageHref(path.slice(0, -1), target, available), href(page.id, target));
      }
});

test("缺少对应页面时回到目标语言首页，只移除完整的语言前缀", () => {
  for (const locale of locales)
    assert.equal(languageHref("/en/unpublished/", locale, []), `${localePrefix(locale)}/`);
  assert.equal(languageHref("/english/", "zh-TW", ["/zh-tw/english/"]), "/zh-tw/english/");
  assert.equal(languageHref("/zh-tw", "en", ["/en/"]), "/en/");
});

test("繁体页面自引用 canonical，三语 alternate 互相返回，记录页继续 noindex", () => {
  const page = pageMetadata("phone-accuracy", "zh-TW");
  assert.equal(
    page.alternates?.canonical,
    "https://fenbeiceshi.com/zh-tw/knowledge/phone-decibel-accuracy/",
  );
  assert.deepEqual(
    Object.keys(page.alternates?.languages ?? {}).sort(),
    [...locales, "x-default"].sort(),
  );
  assert.equal(
    page.openGraph && "locale" in page.openGraph ? page.openGraph.locale : null,
    "zh_TW",
  );
  assert.match(String(page.title), /手機測分貝/);
  assert.deepEqual(pageMetadata("records", "zh-TW").robots, { index: false, follow: true });
});
