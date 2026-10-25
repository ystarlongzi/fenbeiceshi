import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { pagePath, sitePages } from "../routing/pages.ts";
import type { Locale } from "./locales.ts";
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

const available = sitePages.map((page) => "/" + (page.slug ? page.slug + "/" : ""));

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

test("浏览器语言识别文字体系及顺序，并可限制在当前域名支持的语言", () => {
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
  for (const [languages, expected] of cases) assert.equal(browserLanguage(languages), expected);
  assert.equal(browserLanguage(["en-US", "zh-TW"], ["zh-CN", "zh-TW"]), "zh-TW");
  assert.equal(browserLanguage(["zh-CN"], ["en"]), "en");
});

test("中文无前缀页面仅在本站简繁之间自动选择，保留查询与锚点", () => {
  for (const page of sitePages) {
    const browser = makeBrowser(pagePath(page.id, "zh-CN"));
    browser.navigator.languages = ["zh-Hant"];
    browser.location.search = "?q=60";
    browser.location.hash = "#reference";
    browser.boot();
    assert.deepEqual(browser.redirects, [pagePath(page.id, "zh-TW") + "?q=60#reference"]);
    assert.equal(browser.saved.size, 0);
  }
});

test("英文偏好不使中文域名强制跨域，英文与明确繁体页面保持 URL 指定语言", () => {
  const chinese = makeBrowser();
  chinese.saved.set(LANGUAGE_KEY, "en");
  chinese.boot();
  assert.deepEqual(chinese.redirects, []);
  for (const locale of ["en", "zh-TW"] as const) {
    const browser = makeBrowser(pagePath("guide", locale));
    browser.navigator.languages = ["zh-CN"];
    browser.saved.set(LANGUAGE_KEY, "zh-CN");
    browser.boot(locale);
    assert.deepEqual(browser.redirects, []);
  }
  const unknown = makeBrowser("/unpublished/");
  unknown.navigator.languages = ["zh-TW"];
  unknown.boot();
  assert.deepEqual(unknown.redirects, []);
});

test("本站手动偏好优先，无效值安全忽略，存储读取异常仍能选择繁体", () => {
  const browser = makeBrowser();
  browser.saved.set(LANGUAGE_KEY, "zh-TW");
  browser.boot();
  assert.deepEqual(browser.redirects, ["/zh-tw/"]);
  for (const saved of ["invalid", "../en", "constructor", '<script>alert("x")</script>']) {
    const other = makeBrowser();
    other.saved.set(LANGUAGE_KEY, saved);
    other.navigator.languages = [];
    other.navigator.language = "zh-TW";
    other.boot();
    assert.deepEqual(other.redirects, ["/zh-tw/"]);
  }
  browser.redirects.length = 0;
  browser.storage.readBlocked = true;
  browser.navigator.languages = ["zh-TW"];
  browser.boot();
  assert.deepEqual(browser.redirects, ["/zh-tw/"]);
  assert.equal(browser.dataset.languagePersistence, "unavailable");
});

test("跨域手动选择在目标域保存，禁止存储时仍保留当前语言且不产生循环", () => {
  for (const blocked of [false, true]) {
    const browser = makeBrowser();
    browser.location.search = "?language=en";
    browser.storage.readBlocked = blocked;
    browser.storage.writeBlocked = blocked;
    browser.boot("en");
    assert.deepEqual(browser.redirects, []);
    assert.equal(browser.saved.get(LANGUAGE_KEY), blocked ? undefined : "en");
    assert.equal(browser.dataset.languagePersistence, blocked ? "unavailable" : "available");
  }
  const browser = makeBrowser();
  browser.navigator.languages = ["zh-TW"];
  browser.location.search = "?language=zh-CN";
  browser.boot();
  assert.deepEqual(browser.redirects, []);
  assert.equal(browser.saved.get(LANGUAGE_KEY), "zh-CN");
});

test("手动选择持久化并通知两个入口，失败保留原偏好、数据和错误上下文", () => {
  withBrowser(({ saved, storage }) => {
    saved.set("fenbeiceshi:theme:v1", "dark");
    saved.set("unrelated-records", "original");
    let changes = 0;
    const unsubscribe = subscribeLanguagePreference(() => (changes += 1));
    const unsubscribeOther = subscribeLanguagePreference(() => (changes += 1));
    assert.equal(setLanguagePreference("zh-TW"), null);
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

test("跨域切换保留主题、查询与锚点，站内持久化成功后清除临时参数", () => {
  const source = {
    pathname: "/knowledge/decibel-chart/",
    search: "?q=60&language=en",
    hash: "#levels",
  };
  assert.equal(
    languageSelectionHref(source, "zh-CN", available, false, "en"),
    "https://fenbeiceshi.com/knowledge/decibel-chart/?q=60&language=zh-CN#levels",
  );
  assert.equal(
    languageSelectionHref(source, "zh-TW", available, true, "en"),
    "https://fenbeiceshi.com/zh-tw/knowledge/decibel-chart/?q=60&language=zh-TW#levels",
  );
  assert.equal(
    languageSelectionHref(source, "en", available, true, "zh-CN"),
    "https://soundmetergo.com/knowledge/decibel-chart/?q=60&language=en#levels",
  );
  assert.equal(
    languageSelectionHref(source, "zh-TW", available, true, "zh-CN"),
    "/zh-tw/knowledge/decibel-chart/?q=60#levels",
  );
});

test("首屏脚本不能被路径中的 HTML 定界符关闭", () => {
  assert.doesNotMatch(languageBootstrap("zh-CN", ["/</script>/"]), /<\/script>/i);
});
