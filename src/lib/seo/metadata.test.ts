import assert from "node:assert/strict";
import test from "node:test";
import { breadcrumbData } from "./metadata.ts";
import { canonicalHref } from "../routing/pages.ts";
import { locales } from "../i18n/locales.ts";
import { localize } from "../i18n/text.ts";

test("三语帮助页与知识文章的面包屑归属知识与帮助", () => {
  for (const locale of locales) {
    for (const id of [
      "guide",
      "how-it-works",
      "faq",
      "calibration",
      "microphone-help",
      "noise-reduction",
      "hearing-protection",
      "china-noise-standards",
      "workplace-noise-standards",
      "when-professional-meter",
    ]) {
      const items = breadcrumbData(id, locale).itemListElement;
      assert.deepEqual(
        items.map((item) => item.item),
        ["meter", "knowledge", id].map((page) => canonicalHref(page, locale)),
      );
      assert.equal(items[1].name, localize(locale, "知识与帮助", "Knowledge & help", "知識與幫助"));
    }
  }
});

test("声音详情保留对照表父级，关于与隐私保持独立", () => {
  for (const locale of locales) {
    const detail = breadcrumbData("decibel-40", locale).itemListElement;
    assert.deepEqual(
      detail.map((item) => item.item),
      ["meter", "knowledge", "decibel-chart", "decibel-40"].map((id) => canonicalHref(id, locale)),
    );
    for (const id of ["about", "privacy"]) {
      assert.deepEqual(
        breadcrumbData(id, locale).itemListElement.map((item) => item.item),
        ["meter", id].map((page) => canonicalHref(page, locale)),
      );
    }
  }
});
