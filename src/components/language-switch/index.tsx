"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import type { Locale } from "@/features/sound-meter/types";
import { languageHref, localePrefix, localeSettings } from "@/lib/i18n/locales";
import { localize } from "@/lib/i18n/text";
import {
  getLanguagePersistenceError,
  getServerLanguagePersistenceError,
  languageSelectionHref,
  setLanguagePreference,
  subscribeLanguagePreference,
} from "@/lib/i18n/preference";
import { languageFlagPath } from "./flags";
import { languageOptions, linkedLanguageHref, nextLanguageIndex } from "./navigation";
import styles from "./index.module.css";

export function LanguageSwitch({ locale, available }: { locale: Locale; available: string[] }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
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
  const selected = languageOptions.indexOf(locale);
  const open = active !== null;
  const highlighted = active ?? selected;
  const label = localize(locale, "语言", "Language", "語言");

  useLayoutEffect(() => {
    if (!open || !list.current) return;
    const options = list.current;
    function position() {
      options.style.setProperty("--popup-offset", "0px");
      const { left, right } = options.getBoundingClientRect();
      const edge = document.documentElement.clientWidth - 16;
      const offset = left < 16 ? 16 - left : right > edge ? edge - right : 0;
      options.style.setProperty("--popup-offset", `${offset}px`);
    }
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [open]);

  useEffect(() => {
    if (!open || !list.current) return;
    const option = list.current.children[highlighted];
    if (!(option instanceof HTMLElement)) return;
    const { scrollTop, clientHeight } = list.current;
    if (option.offsetTop < scrollTop) list.current.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > scrollTop + clientHeight)
      list.current.scrollTop = option.offsetTop + option.offsetHeight - clientHeight;
  }, [open, highlighted]);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setActive(null);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function choose(index: number, event: MouseEvent<HTMLAnchorElement>) {
    const target = languageOptions[index];
    if (!target) return;
    const error = setLanguagePreference(target);
    const destination = languageSelectionHref(
      { pathname, search: window.location.search, hash: window.location.hash },
      target,
      available,
      !error,
      locale,
    );
    if (destination.startsWith("https://")) {
      // 跨域链接须保持可见，等文档上的 Google 点击监听完成关联再原生跳转。
      event.currentTarget.href = linkedLanguageHref(destination, event.currentTarget.href);
      return;
    }
    event.preventDefault();
    setActive(null);
    button.current?.focus();
    if (target !== locale) {
      router.push(destination);
    } else if (destination !== `${pathname}${window.location.search}${window.location.hash}`)
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
      if (open) list.current?.children[highlighted]?.querySelector("a")?.click();
      else setActive(selected);
      return;
    }
    const columns = list.current
      ? getComputedStyle(list.current).gridTemplateColumns.split(" ").length
      : 1;
    const next = nextLanguageIndex(
      event.key,
      highlighted,
      languageOptions.length,
      columns,
      localeSettings[locale].direction === "rtl",
    );
    if (next !== undefined) {
      event.preventDefault();
      setActive(open || event.key === "Home" || event.key === "End" ? next : selected);
      return;
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    const found = languageOptions.findIndex((language) =>
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
        <LanguageFlag locale={locale} />
        <span lang={locale} dir="auto">
          {localeSettings[locale].label}
        </span>
        <Icon name="chevron-down" size={14} />
      </button>
      <ul
        ref={list}
        id={`${id}-list`}
        role="listbox"
        aria-label={label}
        className={styles.options}
        hidden={!open}
      >
        {languageOptions.map((language, index) => (
          <li key={language} role="presentation">
            <a
              id={`${id}-option-${index}`}
              role="option"
              lang={language}
              tabIndex={-1}
              href={languageHref(pathname, language, available, locale)}
              aria-selected={language === locale}
              data-active={index === highlighted}
              onPointerDown={(event) => event.preventDefault()}
              onPointerMove={() => setActive(index)}
              onClick={(event) => choose(index, event)}
            >
              <LanguageFlag locale={language} />
              <span dir="auto">{localeSettings[language].label}</span>
              {language === locale ? <Icon name="circle-check" size={15} /> : null}
            </a>
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

function LanguageFlag({ locale }: { locale: Locale }) {
  return (
    <i
      className={styles.flag}
      aria-hidden="true"
      style={{ backgroundImage: `url(${languageFlagPath(locale)})` }}
    />
  );
}

const subscribe = () => () => undefined;
const getSnapshot = () => true;
const getServerSnapshot = () => false;
