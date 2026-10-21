"use client";
import { localize } from "@/lib/i18n/text";

import { useState, useSyncExternalStore } from "react";
import { Icon } from "../icon";
import type { Locale } from "@/features/sound-meter/types";
import { getServerThemeSnapshot, getThemeSnapshot, setTheme, subscribeTheme } from "./theme";
import styles from "./index.module.css";

export function ThemeSwitch({ locale }: { locale: Locale }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [notice, setNotice] = useState(false);
  const title =
    theme === "dark"
      ? localize(locale, "切换到亮色", "Switch to light mode", "切換到亮色")
      : localize(locale, "切换到暗色", "Switch to dark mode", "切換到暗色");
  return (
    <span className={styles.control}>
      <button
        type="button"
        className={styles.button}
        aria-label={localize(locale, "暗色模式", "Dark mode", "暗色模式")}
        aria-pressed={theme === "dark"}
        title={title}
        onClick={() => setNotice(Boolean(setTheme(theme === "dark" ? "light" : "dark")))}
      >
        <Icon name="moon" size={17} className={styles.moon} />
        <Icon name="sun" size={17} className={styles.sun} />
      </button>
      {notice ? (
        <span role="status" className={styles.notice}>
          {localize(
            locale,
            "本次主题已切换，浏览器未能保存此偏好。",
            "Theme changed for this visit. Your browser could not save the preference.",
            "本次主題已切換，瀏覽器未能儲存此偏好。",
          )}
        </span>
      ) : null}
    </span>
  );
}
