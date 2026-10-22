import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { href, sitePages } from "../routing/pages.ts";
import { locales, type Locale } from "./locales.ts";
import {
  browserLanguage,
  getLanguagePersistenceError,
  getServerLanguagePersistenceError,
  languageBootstrap,
  languageSelectionHref,
  LANGUAGE_KEY,
  setLanguagePreference,
  subscribeLanguagePreference,
} from "./preference.ts";

const available = sitePages.flatMap((page) => locales.map((locale) => href(page.id, locale)));

function makeBrowser(pathname = "/") {
  const saved = new Map<string, string>();
  const redirects: string[] = [];
  const dataset: Record<string, string> = {};
  const storage = {
    readBlocked: false,
    writeBlocked: false,
    getItem(key: string) {
      if (this.readBlocked) throw new Error("storage read denied");
      return saved.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      if (this.writeBlocked) throw new Error("storage write denied");
      saved.set(key, value);
    },
  };
  const location = {
    pathname,
    search: "",
    hash: "",
    replace: (url: string) => redirects.push(url),
  };
  const navigator = { languages: ["en-US"], language: "en-US" };
  const globals = {
    window: Object.assign(new EventTarget(), { localStorage: storage, location }),
    document: { documentElement: { dataset } },
    navigator,
    URLSearchParams,
  };
  return {
    globals,
    saved,
    redirects,
    dataset,
    storage,
    location,
    navigator,
    boot: (locale: Locale = "zh-CN") =>
      runInNewContext(languageBootstrap(locale, available), globals),
  };
}

function withBrowser(run: (browser: ReturnType<typeof makeBrowser>) => void) {
  const browser = makeBrowser();
  const keys = ["window", "document"] as const;
  const descriptors = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  try {
    for (const key of keys)
      Object.defineProperty(globalThis, key, { configurable: true, value: browser.globals[key] });
    run(browser);
  } finally {
    keys.forEach((key, index) => {
      if (descriptors[index]) Object.defineProperty(globalThis, key, descriptors[index]);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
}

test("浏览器语言按顺序匹配，中文文字体系优先于地区，未知语言回退简体", () => {
  const cases: [string[], Locale][] = [
    [["zh-CN"], "zh-CN"],
    [["zh-SG"], "zh-CN"],
    [["zh"], "zh-CN"],
    [["zh-TW"], "zh-TW"],
    [["zh-HK"], "zh-TW"],
    [["zh-MO"], "zh-TW"],
    [["zh-Hant-CN"], "zh-TW"],
    [["zh-Hans-HK"], "zh-CN"],
    [[" ZH_hant_TW "], "zh-TW"],
    [["en-GB"], "en"],
    [["fr", "en-US", "zh-TW"], "en"],
    [["zh-TW", "en-US"], "zh-TW"],
    [["fr", "de"], "zh-CN"],
    [[], "zh-CN"],
  ];
  for (const [languages, expected] of cases)
    assert.equal(browserLanguage(languages), expected, languages.join(","));
});

test("所有无前缀页面首次按浏览器语言跳转，保留查询与锚点且不写入自动识别结果", () => {
  for (const page of sitePages) {
    const browser = makeBrowser(href(page.id, "zh-CN"));
    browser.navigator.languages = ["zh-Hant"];
    browser.location.search = "?q=60";
    browser.location.hash = "#reference";
    browser.boot();
    assert.deepEqual(browser.redirects, [`${href(page.id, "zh-TW")}?q=60#reference`]);
    assert.equal(browser.saved.size, 0);
  }
});

test("已保存的手动偏好优先于浏览器，非法偏好被忽略，缺少语言列表时读取单语言", () => {
  for (const locale of locales) {
    const browser = makeBrowser();
    browser.saved.set(LANGUAGE_KEY, locale);
    browser.navigator.languages = [locale === "en" ? "zh-CN" : "en-US"];
    browser.boot();
    assert.deepEqual(browser.redirects, locale === "zh-CN" ? [] : [href("meter", locale)]);
  }
  for (const saved of ["invalid", "../en", "constructor", '<script>alert("x")</script>']) {
    const browser = makeBrowser();
    browser.saved.set(LANGUAGE_KEY, saved);
    browser.navigator.languages = [];
    browser.navigator.language = "zh-TW";
    browser.boot();
    assert.deepEqual(browser.redirects, ["/zh-tw/"]);
  }
});

test("明确语言链接与未发布路径不被自动跳转，缺少目标主题时回到对应首页", () => {
  for (const locale of ["en", "zh-TW"] as const) {
    const browser = makeBrowser(href("decibel-chart", locale));
    browser.saved.set(LANGUAGE_KEY, "zh-CN");
    browser.boot(locale);
    assert.deepEqual(browser.redirects, []);
  }
  const browser = makeBrowser("/unpublished/");
  browser.boot();
  assert.deepEqual(browser.redirects, []);
  browser.location.pathname = "/guide/";
  runInNewContext(languageBootstrap("zh-CN", ["/guide/", "/en/"]), browser.globals);
  assert.deepEqual(browser.redirects, ["/en/"]);
});

test("存储读取被拒仍可识别语言，一次性链接保留手动简体选择且不会形成跳转循环", () => {
  const browser = makeBrowser();
  browser.storage.readBlocked = true;
  browser.boot();
  assert.deepEqual(browser.redirects, ["/en/"]);
  assert.equal(browser.dataset.languagePersistence, "unavailable");
  browser.redirects.length = 0;
  browser.location.search = "?language=zh-CN";
  browser.boot();
  assert.deepEqual(browser.redirects, []);
  browser.location.search = "?language=javascript%3Aalert(1)";
  browser.boot();
  assert.deepEqual(browser.redirects, ["/en/"]);
});

test("手动选择持久化并通知两个入口，写入失败保留原偏好和错误上下文，重试可恢复", () => {
  withBrowser(({ saved, storage, boot }) => {
    boot();
    saved.set("fenbeiceshi:theme:v1", "dark");
    saved.set("unrelated-records", "original");
    let changes = 0;
    const unsubscribe = subscribeLanguagePreference(() => (changes += 1));
    const unsubscribeOther = subscribeLanguagePreference(() => (changes += 1));
    assert.equal(setLanguagePreference("zh-TW"), null);
    assert.equal(saved.get(LANGUAGE_KEY), "zh-TW");
    assert.equal(changes, 2);
    storage.writeBlocked = true;
    const error = setLanguagePreference("zh-CN");
    assert.ok(error?.cause instanceof Error);
    assert.equal(getLanguagePersistenceError(), true);
    assert.equal(saved.get(LANGUAGE_KEY), "zh-TW");
    assert.equal(changes, 4);
    storage.writeBlocked = false;
    assert.equal(setLanguagePreference("zh-CN"), null);
    assert.equal(getLanguagePersistenceError(), false);
    assert.equal(changes, 6);
    unsubscribe();
    unsubscribeOther();
    setLanguagePreference("en");
    assert.equal(changes, 6);
    assert.equal(saved.get("fenbeiceshi:theme:v1"), "dark");
    assert.equal(saved.get("unrelated-records"), "original");
    assert.throws(() => setLanguagePreference("invalid" as Locale), RangeError);
  });
  assert.equal(getServerLanguagePersistenceError(), false);
});

test("手动切换保留查询和锚点，存储失败增加本次语言，保存成功时清除临时语言", () => {
  const source = {
    pathname: "/en/knowledge/decibel-chart/",
    search: "?q=60&language=en",
    hash: "#levels",
  };
  assert.equal(
    languageSelectionHref(source, "zh-CN", available, false),
    "/knowledge/decibel-chart/?q=60&language=zh-CN#levels",
  );
  assert.equal(
    languageSelectionHref(source, "zh-TW", available, true),
    "/zh-tw/knowledge/decibel-chart/?q=60#levels",
  );
});

test("首屏脚本只序列化可信配置，路径中的 HTML 定界符不能关闭脚本", () => {
  assert.doesNotMatch(languageBootstrap("zh-CN", ["/</script>/"]), /<\/script>/i);
});
