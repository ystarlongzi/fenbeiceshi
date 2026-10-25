import assert from "node:assert/strict";
import test from "node:test";
import { canonicalHref, sitePages } from "./pages.ts";
import { legacyEnglishRedirect } from "./redirects.ts";

test("47 个旧英文主题逐页迁移，带尾斜杠和不带尾斜杠均指向最终地址", () => {
  for (const page of sitePages) {
    const old = `/en${page.slug ? `/${page.slug}` : ""}`;
    assert.equal(legacyEnglishRedirect(old), canonicalHref(page.id, "en"));
    assert.equal(legacyEnglishRedirect(`${old}/`), canonicalHref(page.id, "en"));
  }
});

test("中文、近似前缀、缺页及外部地址不生成迁移跳转", () => {
  for (const path of ["/", "/zh-tw/", "/english/", "/en/missing/", "https://evil.example/en/"])
    assert.equal(legacyEnglishRedirect(path), null);
});
