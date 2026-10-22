export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

export const THEME_KEY = "fenbeiceshi:theme:v1";
const THEME_EVENT = "fenbeiceshi:theme-change";

export function getThemeSnapshot(): ThemePreference {
  const preference = document.documentElement.dataset.themePreference;
  return preference === "dark" || preference === "light" ? preference : "system";
}

export function getServerThemeSnapshot(): ThemePreference {
  return "system";
}

export function setTheme(theme: ThemePreference): Error | null {
  if (theme !== "light" && theme !== "dark" && theme !== "system")
    throw new RangeError("无效的主题偏好。");
  applyPreference(theme);
  let error: Error | null = null;
  try {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.dataset.themePersistence = "available";
  } catch (cause) {
    document.documentElement.dataset.themePersistence = "unavailable";
    error = new Error("当前主题已切换，但浏览器未能保存偏好。", { cause });
  }
  window.dispatchEvent(new Event(THEME_EVENT));
  return error;
}

export function subscribeTheme(listener: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const systemChanged = () => {
    if (document.documentElement.dataset.themePreference !== "system") return;
    applyPreference("system");
    listener();
  };
  const storedChanged = (event: StorageEvent) => {
    if (event.key !== THEME_KEY && event.key !== null) return;
    const value = event.newValue;
    applyPreference(value === "light" || value === "dark" ? value : "system");
    listener();
  };
  media.addEventListener("change", systemChanged);
  window.addEventListener("storage", storedChanged);
  window.addEventListener(THEME_EVENT, listener);
  return () => {
    media.removeEventListener("change", systemChanged);
    window.removeEventListener("storage", storedChanged);
    window.removeEventListener(THEME_EVENT, listener);
  };
}

function applyPreference(preference: ThemePreference) {
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
}

// 首次绘制前执行，只有经过白名单校验的主题值才能写入根节点。
export const themeBootstrap = `(() => {
  const root = document.documentElement;
  let saved = null;
  try {
    saved = localStorage.getItem(${JSON.stringify(THEME_KEY)});
    root.dataset.themePersistence = "available";
  } catch {
    root.dataset.themePersistence = "unavailable";
  }
  const preference = saved === "light" || saved === "dark" ? saved : "system";
  root.dataset.themePreference = preference;
  root.dataset.theme = preference === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    : preference;
})();`;
