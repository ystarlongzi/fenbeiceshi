import assert from "node:assert/strict";
import test from "node:test";
import { BAIDU_SITE_ID, createBaiduAnalyticsRuntime } from "./baidu.ts";

function fixture(href = "https://fenbeiceshi.com/?note=private#record") {
  const scripts: {
    id?: string;
    async?: boolean;
    src?: string;
    onload?: () => void;
    onerror?: () => void;
  }[] = [];
  const cookies: string[] = [];
  const scope = { location: new URL(href), _hmt: [] as unknown[][] };
  const doc = {
    documentElement: { dataset: {} as Record<string, string> },
    createElement: () => ({}),
    head: { appendChild: (script: (typeof scripts)[number]) => scripts.push(script) },
    set cookie(value: string) {
      cookies.push(value);
    },
  };
  const runtime = createBaiduAnalyticsRuntime(
    scope as unknown as Window,
    doc as unknown as Document,
  );
  const views = () => scope._hmt.filter(([name]) => name === "_trackPageview");
  return { scope, doc, scripts, cookies, views, ...runtime };
}

test("百度统计沿用停用状态，拒绝时不加载脚本或改写 Cookie", () => {
  const app = fixture();
  app.disable();
  assert.deepEqual(app.scripts, []);
  assert.deepEqual(app.scope._hmt, []);
  assert.deepEqual(app.cookies, []);
});

test("百度首屏只加载一个异步脚本，关闭自动页面和点击采集", () => {
  const app = fixture();
  app.pageView();
  app.pageView();
  assert.equal(app.scripts.length, 1);
  assert.equal(app.scripts[0].id, "site-baidu-analytics");
  assert.equal(app.scripts[0].async, true);
  assert.equal(app.scripts[0].src, `https://hm.baidu.com/hm.js?${BAIDU_SITE_ID}`);
  assert.deepEqual(app.scope._hmt, [
    ["_setAutoPageview", false],
    ["_setAutoEventTracking", false],
    ["_setAutoTracking", true],
    ["_trackPageview", "/"],
  ]);
});

test("百度站内切页与前进后退各记一次，查询与锚点不进入页面参数", () => {
  const app = fixture();
  app.pageView();
  for (const path of ["/guide/?note=private#next", "/guide/?other=secret", "/"]) {
    app.scope.location = new URL(path, app.scope.location);
    app.pageView();
  }
  assert.deepEqual(app.views(), [
    ["_trackPageview", "/"],
    ["_trackPageview", "/guide/"],
    ["_trackPageview", "/"],
  ]);
  assert.doesNotMatch(JSON.stringify(app.scope._hmt), /private|secret/);
  assert.equal(app.scripts.length, 1);
});

test("百度只统计中文正式域名，含繁体；国际站和本地预览不加载", () => {
  const traditional = fixture("https://fenbeiceshi.com/zh-tw/privacy/");
  traditional.pageView();
  assert.deepEqual(traditional.views(), [["_trackPageview", "/zh-tw/privacy/"]]);
  for (const href of [
    "https://soundmetergo.com/",
    "https://soundmetergo.com/fr/",
    "http://127.0.0.1:31031/",
    "http://fenbeiceshi.com/",
    "https://fenbeiceshi.com:31031/",
    "https://fenbeiceshi.com.evil.test/",
    "https://www.fenbeiceshi.com/",
  ]) {
    const app = fixture(href);
    app.pageView();
    assert.deepEqual(app.scripts, [], href);
    assert.deepEqual(app.scope._hmt, [], href);
  }
});

test("百度脚本下载期间撤回会丢弃待发事件，重选后仍只加载一次", () => {
  const app = fixture();
  app.pageView();
  app.disable();
  assert.deepEqual(app.views(), []);
  assert.deepEqual(app.scope._hmt.at(-1), ["_setAutoTracking", false]);
  app.pageView();
  assert.equal(app.scripts.length, 1);
  assert.deepEqual(app.scope._hmt.slice(-2), [
    ["_setAutoTracking", true],
    ["_trackPageview", "/"],
  ]);
});

test("百度加载后撤回停用采集，仅清理本站此站点的 Cookie", () => {
  const app = fixture();
  app.pageView();
  app.scripts[0].onload!();
  assert.equal(app.doc.documentElement.dataset.baiduAnalyticsLoad, "ready");
  app.disable();
  assert.deepEqual(app.scope._hmt.at(-1), ["_setAutoTracking", false]);
  assert.equal(app.cookies.length, 8);
  assert.ok(
    app.cookies.every((cookie) =>
      new RegExp(`^Hm_(?:lvt|lpvt|cv|ck)_${BAIDU_SITE_ID}=; Max-Age=0;`).test(cookie),
    ),
  );
  app.pageView();
  assert.equal(app.scripts.length, 1);
  assert.equal(app.views().length, 2);
});

test("百度网络加载失败保留可观察状态，不中断页面运行", (context) => {
  const warning = context.mock.method(console, "warn", () => {});
  const app = fixture();
  app.pageView();
  app.scripts[0].onerror!();
  assert.equal(app.doc.documentElement.dataset.baiduAnalyticsLoad, "unavailable");
  assert.equal(warning.mock.callCount(), 1);
  app.disable();
  assert.deepEqual(app.views(), []);
});
