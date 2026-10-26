import assert from "node:assert/strict";
import test from "node:test";
import { ANALYTICS_CONSENT_KEY } from "./model.ts";

let sequence = 0;
async function fixture(
  run: (env: {
    store: Map<string, string>;
    events: EventTarget;
    blocked: { read: boolean; write: boolean };
    preference: typeof import("./preference.ts");
  }) => void,
) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  const store = new Map<string, string>();
  const events = new EventTarget();
  const blocked = { read: false, write: false };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: Object.assign(events, {
      localStorage: {
        getItem(key: string) {
          if (blocked.read) throw new Error("读取被禁用");
          return store.get(key) ?? null;
        },
        setItem(key: string, value: string) {
          if (blocked.write) throw new Error("写入被禁用");
          store.set(key, value);
        },
      },
    }),
  });
  try {
    const preference = await import(
      new URL(`./preference.ts?test=${sequence++}`, import.meta.url).href
    );
    run({ store, events, blocked, preference });
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

test("服务端快照不读取浏览器，初次访问和非法偏好均不授权", async () => {
  await fixture(({ store, preference }) => {
    store.set(ANALYTICS_CONSENT_KEY, "true");
    assert.deepEqual(preference.getServerConsentSnapshot(), {
      choice: null,
      error: false,
      ready: false,
    });
    assert.deepEqual(preference.getConsentSnapshot(), { choice: null, error: false, ready: true });
    assert.equal(preference.getConsentSnapshot(), preference.getConsentSnapshot());
  });
});

test("读写受限不默认同意，手动选择仍在本页生效并保留错误上下文", async () => {
  await fixture(({ blocked, preference }) => {
    blocked.read = true;
    blocked.write = true;
    assert.deepEqual(preference.getConsentSnapshot(), { choice: null, error: true, ready: true });
    const failure = preference.setAnalyticsConsent("granted");
    assert.ok(failure instanceof Error);
    assert.ok(failure.cause instanceof Error);
    assert.deepEqual(preference.getConsentSnapshot(), {
      choice: "granted",
      error: true,
      ready: true,
    });
    preference.setAnalyticsConsent("denied");
    assert.equal(preference.getConsentSnapshot().choice, "denied");
  });
});

test("保存、跨标签撤回、清空及取消订阅不影响其他浏览器数据", async () => {
  await fixture(({ store, events, preference }) => {
    store.set("report", "keep");
    let updates = 0;
    const unsubscribe = preference.subscribeAnalyticsConsent(() => updates++);
    assert.equal(preference.setAnalyticsConsent("granted"), null);
    assert.equal(store.get(ANALYTICS_CONSENT_KEY), "granted");
    assert.equal(updates, 1);
    store.set(ANALYTICS_CONSENT_KEY, "denied");
    events.dispatchEvent(Object.assign(new Event("storage"), { key: ANALYTICS_CONSENT_KEY }));
    assert.equal(preference.getConsentSnapshot().choice, "denied");
    store.delete(ANALYTICS_CONSENT_KEY);
    events.dispatchEvent(Object.assign(new Event("storage"), { key: null }));
    assert.equal(preference.getConsentSnapshot().choice, null);
    assert.equal(store.get("report"), "keep");
    unsubscribe();
    preference.setAnalyticsConsent("denied");
    assert.equal(updates, 3);
  });
});
