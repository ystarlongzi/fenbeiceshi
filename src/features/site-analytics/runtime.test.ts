import assert from "node:assert/strict";
import test from "node:test";
import { createAnalyticsRuntime } from "./runtime.ts";

function fixture(href = "https://fenbeiceshi.com/?note=private#record") {
  const scripts: Record<string, unknown>[] = [];
  const cookies: string[] = [];
  const scope = { location: new URL(href), dataLayer: [] as IArguments[] };
  const doc = {
    title: "分贝测试",
    referrer: "https://search.example/private?q=secret",
    documentElement: { dataset: {} },
    createElement: () => ({}),
    head: { appendChild: (script: Record<string, unknown>) => scripts.push(script) },
    set cookie(value: string) {
      cookies.push(value);
    },
  };
  const runtime = createAnalyticsRuntime(
    scope as unknown as Window,
    doc as unknown as Document,
    "G-TEST123456",
  );
  const commands = () => scope.dataLayer.map((args) => Array.from(args));
  const views = () => commands().filter((args) => args[0] === "event" && args[1] === "page_view");
  return { scope, doc, scripts, cookies, commands, views, ...runtime };
}

test("初始与拒绝状态不加载 Google，不发送命令或删除本机报告", () => {
  const app = fixture();
  app.disable();
  assert.equal(app.scripts.length, 0);
  assert.deepEqual(app.commands(), []);
  assert.deepEqual(app.cookies, []);
});

test("同意后仅加载一次，默认拒绝广告，关闭自动页面事件并去重首屏", () => {
  const app = fixture();
  app.pageView("zh-CN");
  app.pageView("zh-CN");
  assert.equal(app.scripts.length, 1);
  assert.equal(app.scripts[0].async, true);
  assert.equal(app.scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-TEST123456");
  assert.deepEqual(app.commands()[0], [
    "consent",
    "default",
    {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  ]);
  assert.deepEqual(app.commands()[1], ["consent", "update", { analytics_storage: "granted" }]);
  const config = app.commands().find((args) => args[0] === "config")?.[2] as Record<
    string,
    unknown
  >;
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(app.views().length, 1);
  assert.equal(JSON.stringify(app.commands()).includes("private"), false);
  assert.equal(JSON.stringify(app.commands()).includes("secret"), false);
});

test("路由变化和前进后退各记一次，查询、锚点、备注不形成新页面", () => {
  const app = fixture();
  app.pageView("zh-CN");
  app.scope.location = new URL("https://fenbeiceshi.com/guide/?note=private#example");
  app.doc.title = "使用指南";
  app.pageView("zh-CN");
  app.scope.location = new URL("https://fenbeiceshi.com/guide/?other=private#next");
  app.pageView("zh-CN");
  app.scope.location = new URL("https://fenbeiceshi.com/");
  app.pageView("zh-CN");
  assert.equal(app.views().length, 3);
  const params = app.views()[1][2] as Record<string, unknown>;
  assert.deepEqual(params, {
    page_location: "https://fenbeiceshi.com/guide/",
    page_referrer: "https://fenbeiceshi.com/",
    page_title: "使用指南",
    language: "zh-CN",
    send_to: "G-TEST123456",
  });
});

test("撤回立即设置停用开关并清理此流 Cookie，重选不重复加载脚本", () => {
  const app = fixture();
  app.pageView("zh-CN");
  app.disable();
  assert.equal((app.scope as unknown as Record<string, unknown>)["ga-disable-G-TEST123456"], true);
  assert.equal(app.cookies.length, 4);
  assert.ok(app.cookies.every((value) => /^_ga(?:_TEST123456)?=; Max-Age=0;/.test(value)));
  assert.equal(app.commands().length, 6);
  app.pageView("zh-CN");
  assert.equal(app.scripts.length, 1);
  assert.equal(app.views().length, 2);
});

test("即使显式允许，本地预览和相似外域也不发送正式统计", () => {
  for (const href of ["http://127.0.0.1:31031/", "https://fenbeiceshi.com.evil.test/"]) {
    const app = fixture(href);
    app.pageView("en");
    assert.equal(app.scripts.length, 0);
    assert.deepEqual(app.commands(), []);
  }
});
