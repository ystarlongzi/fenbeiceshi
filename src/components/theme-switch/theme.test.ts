import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
  themeBootstrap,
  THEME_KEY,
} from "./theme.ts";

function withBrowser(run: (browser: ReturnType<typeof makeBrowser>) => void) {
  const keys = ["window", "document", "localStorage"];
  const descriptors = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  const browser = makeBrowser();
  try {
    for (const key of keys) {
      Object.defineProperty(globalThis, key, {
        configurable: true,
        value: browser.globals[key as keyof typeof browser.globals],
      });
    }
    run(browser);
  } finally {
    keys.forEach((key, i) => {
      if (descriptors[i]) Object.defineProperty(globalThis, key, descriptors[i]);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
}

function makeBrowser() {
  const media = Object.assign(new EventTarget(), { matches: false });
  const browserWindow = Object.assign(new EventTarget(), { matchMedia: () => media });
  const dataset: Record<string, string> = {};
  const saved = new Map<string, string>();
  const storage = {
    blocked: false,
    getItem(key: string) {
      if (this.blocked) throw new Error("storage denied");
      return saved.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      if (this.blocked) throw new Error("storage denied");
      saved.set(key, value);
    },
  };
  const globals = {
    window: browserWindow,
    document: { documentElement: { dataset } },
    localStorage: storage,
  };
  return {
    globals,
    dataset,
    media,
    saved,
    storage,
    boot: () => runInNewContext(themeBootstrap, globals),
    system(dark: boolean) {
      media.matches = dark;
      media.dispatchEvent(new Event("change"));
    },
    external(value: string | null, key: string | null = THEME_KEY) {
      browserWindow.dispatchEvent(Object.assign(new Event("storage"), { key, newValue: value }));
    },
  };
}

test("首屏脚本优先使用有效偏好，缺失或非法值跟随系统", () => {
  withBrowser(({ saved, dataset, media, boot }) => {
    media.matches = true;
    for (const value of ["dark", "light", "invalid", "<script>", null]) {
      if (value === null) saved.delete(THEME_KEY);
      else saved.set(THEME_KEY, value);
      boot();
      assert.equal(dataset.theme, value === "light" ? "light" : "dark");
      assert.equal(
        dataset.themePreference,
        value === "dark" || value === "light" ? value : "system",
      );
    }
  });
});

test("首屏存储受限仍应用系统主题，并保留不可持久化状态", () => {
  withBrowser(({ storage, media, dataset, boot }) => {
    storage.blocked = true;
    media.matches = true;
    boot();
    assert.equal(dataset.theme, "dark");
    assert.equal(dataset.themePersistence, "unavailable");
  });
});

test("手动切换立即生效并持久化，写入失败保留当前主题和错误上下文", () => {
  withBrowser(({ boot, storage, saved, dataset }) => {
    boot();
    assert.equal(setTheme("dark"), null);
    assert.equal(saved.get(THEME_KEY), "dark");
    boot();
    assert.equal(getThemeSnapshot(), "dark");
    storage.blocked = true;
    const error = setTheme("light");
    assert.equal(getThemeSnapshot(), "light");
    assert.equal(dataset.themePersistence, "unavailable");
    assert.ok(error?.cause instanceof Error);
    assert.equal(saved.get(THEME_KEY), "dark");
    assert.throws(() => setTheme("invalid" as "dark"), RangeError);
  });
});

test("默认随系统变化，手动偏好不会被系统变化覆盖", () => {
  withBrowser(({ boot, system }) => {
    boot();
    const unsubscribe = subscribeTheme(() => {});
    try {
      system(true);
      assert.equal(getThemeSnapshot(), "dark");
      setTheme("light");
      system(false);
      system(true);
      assert.equal(getThemeSnapshot(), "light");
    } finally {
      unsubscribe();
    }
  });
});

test("跨标签页同步和清空偏好正常，取消订阅后不再响应", () => {
  withBrowser(({ boot, external, system, dataset }) => {
    boot();
    let changes = 0;
    const unsubscribe = subscribeTheme(() => {
      changes += 1;
    });
    external("dark", "unrelated");
    assert.equal(changes, 0);
    external("dark");
    assert.equal(getThemeSnapshot(), "dark");
    system(true);
    external(null, null);
    assert.equal(dataset.themePreference, "system");
    assert.equal(getThemeSnapshot(), "dark");
    unsubscribe();
    const before = changes;
    external("light");
    system(false);
    assert.equal(changes, before);
    assert.equal(getThemeSnapshot(), "dark");
  });
});

test("服务端快照不访问浏览器环境", () => {
  assert.equal(getServerThemeSnapshot(), "light");
});
