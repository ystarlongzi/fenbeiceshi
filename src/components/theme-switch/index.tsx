"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { Icon, type IconName } from "../icon";
import type { Locale } from "@/features/sound-meter/types";
import { localize } from "@/lib/i18n/text";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
  type ThemePreference,
} from "./theme";
import styles from "./index.module.css";

export function ThemeSwitch({ locale }: { locale: Locale }) {
  const preference = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const ready = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [notice, setNotice] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const label = localize(locale, "主题", "Theme", "主題");
  const options: { value: ThemePreference; icon: IconName; label: string }[] = [
    { value: "system", icon: "monitor", label: localize(locale, "跟随系统", "System", "跟隨系統") },
    { value: "dark", icon: "moon", label: localize(locale, "深色", "Dark", "深色") },
    { value: "light", icon: "sun", label: localize(locale, "浅色", "Light", "淺色") },
  ];
  const selected = options.findIndex((option) => option.value === preference);
  const open = active !== null;
  const highlighted = active ?? selected;

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setActive(null);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    setNotice(Boolean(setTheme(option.value)));
    setActive(null);
    button.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Tab") {
      setActive(null);
      return;
    }
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        setActive(null);
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(highlighted);
      else setActive(selected);
      return;
    }
    let next: number | undefined;
    if (event.key === "ArrowDown") next = (highlighted + 1) % options.length;
    else if (event.key === "ArrowUp") next = (highlighted + options.length - 1) % options.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setActive(open || event.key === "Home" || event.key === "End" ? next : selected);
    }
  }

  return (
    <div
      ref={root}
      className={styles.control}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
      }}
    >
      <button
        ref={button}
        type="button"
        role="combobox"
        className={styles.button}
        data-theme-switch=""
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined}
        title={`${label}：${options[selected].label}`}
        disabled={!ready}
        onClick={() => setActive(open ? null : selected)}
        onKeyDown={onKeyDown}
      >
        <span className={styles.label}>{options[selected].label}</span>
        {options.map((option) => (
          <Icon
            key={option.value}
            name={option.icon}
            size={17}
            className={`${styles.symbol} ${styles[option.value]}`}
          />
        ))}
      </button>
      <ul
        id={`${id}-list`}
        role="listbox"
        aria-label={label}
        className={styles.options}
        hidden={!open}
      >
        {options.map((option, index) => (
          <li
            id={`${id}-option-${index}`}
            key={option.value}
            role="option"
            data-theme-option={option.value}
            aria-selected={index === selected}
            data-active={index === highlighted}
            onPointerDown={(event) => event.preventDefault()}
            onPointerMove={() => setActive(index)}
            onClick={() => choose(index)}
          >
            <Icon name={option.icon} size={16} />
            <span>{option.label}</span>
            {index === selected ? <Icon name="circle-check" size={15} /> : null}
          </li>
        ))}
      </ul>
      {notice && !open ? (
        <span role="status" className={styles.notice}>
          {localize(
            locale,
            "本次主题已切换，浏览器未能保存此偏好。",
            "Theme changed for this visit. Your browser could not save the preference.",
            "本次主題已切換，瀏覽器未能儲存此偏好。",
          )}
        </span>
      ) : null}
    </div>
  );
}

const subscribe = () => () => undefined;
const getSnapshot = () => true;
const getServerSnapshot = () => false;
