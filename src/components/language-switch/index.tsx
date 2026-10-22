"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import type { Locale } from "@/features/sound-meter/types";
import { locales, localePrefix, localeSettings } from "@/lib/i18n/locales";
import { localize } from "@/lib/i18n/text";
import {
  getLanguagePersistenceError,
  getServerLanguagePersistenceError,
  languageSelectionHref,
  setLanguagePreference,
  subscribeLanguagePreference,
} from "@/lib/i18n/preference";
import styles from "./index.module.css";

export function LanguageSwitch({ locale, available }: { locale: Locale; available: string[] }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname() || `${localePrefix(locale)}/`;
  // 水合完成后再启用，避免路由监听绑定前的选择事件丢失。
  const ready = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const persistenceError = useSyncExternalStore(
    subscribeLanguagePreference,
    getLanguagePersistenceError,
    getServerLanguagePersistenceError,
  );
  const selected = locales.indexOf(locale);
  const open = active !== null;
  const highlighted = active ?? selected;
  const label = localize(locale, "语言", "Language", "語言");

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setActive(null);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function choose(index: number) {
    const target = locales[index];
    if (!target) return;
    setActive(null);
    button.current?.focus();
    const error = setLanguagePreference(target);
    const destination = languageSelectionHref(
      { pathname, search: window.location.search, hash: window.location.hash },
      target,
      available,
      !error,
    );
    if (target !== locale) router.push(destination);
    else if (destination !== `${pathname}${window.location.search}${window.location.hash}`)
      window.history.replaceState(window.history.state, "", destination);
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
    if (event.key === "ArrowDown") next = (highlighted + 1) % locales.length;
    else if (event.key === "ArrowUp") next = (highlighted + locales.length - 1) % locales.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = locales.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setActive(open || event.key === "Home" || event.key === "End" ? next : selected);
      return;
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    const found = locales.findIndex((language) =>
      localeSettings[language].label.toLowerCase().startsWith(event.key.toLowerCase()),
    );
    if (found >= 0) {
      event.preventDefault();
      setActive(found);
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
        className={styles.trigger}
        data-language-switch=""
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined}
        disabled={!ready}
        onClick={() => setActive(open ? null : selected)}
        onKeyDown={onKeyDown}
      >
        <span lang={locale}>{localeSettings[locale].label}</span>
        <Icon name="chevron-down" size={14} />
      </button>
      <ul
        id={`${id}-list`}
        role="listbox"
        aria-label={label}
        className={styles.options}
        hidden={!open}
      >
        {locales.map((language, index) => (
          <li
            id={`${id}-option-${index}`}
            key={language}
            role="option"
            lang={language}
            aria-selected={language === locale}
            data-active={index === highlighted}
            onPointerDown={(event) => event.preventDefault()}
            onPointerMove={() => setActive(index)}
            onClick={() => choose(index)}
          >
            <span>{localeSettings[language].label}</span>
            {language === locale ? <Icon name="circle-check" size={15} /> : null}
          </li>
        ))}
      </ul>
      {persistenceError && !open ? (
        <span role="status" className={styles.notice}>
          {localize(
            locale,
            "浏览器无法记住语言偏好，本次选择仍可使用。",
            "Your browser cannot remember the language preference. Your choice still works for this visit.",
            "瀏覽器無法記住語言偏好，本次選擇仍可使用。",
          )}
        </span>
      ) : null}
    </div>
  );
}

const subscribe = () => () => undefined;
const getSnapshot = () => true;
const getServerSnapshot = () => false;
