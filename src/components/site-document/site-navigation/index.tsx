"use client";
import { localize } from "@/lib/i18n/text";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/icon";
import type { Locale } from "@/features/sound-meter/types";
import { NavigationLink } from "../navigation-link";
import styles from "./index.module.css";

interface NavigationItem {
  href: string;
  label: string;
  icon: IconName;
  exact: boolean;
  exclude?: string[];
  optional: boolean;
}

export function SiteNavigation({
  items,
  locale,
  utilities,
}: {
  items: NavigationItem[];
  locale: Locale;
  utilities: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const trigger = triggerRef.current;
    const desktopNavigation = desktopRef.current;
    const desktop = window.matchMedia("(min-width: 761px)");
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      dialog.close();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      const currentLink = desktopNavigation?.querySelector<HTMLAnchorElement>("a[aria-current]");
      const desktopTarget = currentLink?.getClientRects().length
        ? currentLink
        : desktopNavigation?.querySelector<HTMLAnchorElement>("a");
      const target = desktop.matches ? desktopTarget : trigger;
      if (target?.isConnected) target.focus({ preventScroll: true });
    };
  }, [open]);

  const navigation = (
    <nav
      aria-label={localize(locale, "主导航", "Main navigation", "主導航")}
      className={styles.links}
    >
      {items.map((item) => (
        <NavigationLink
          key={item.href}
          href={item.href}
          exact={item.exact}
          exclude={item.exclude}
          className={`${styles.link} ${item.optional ? styles.optional : ""}`}
        >
          <Icon name={item.icon} size={18} />
          {item.label}
        </NavigationLink>
      ))}
    </nav>
  );

  return (
    <>
      <div ref={desktopRef} className={styles.desktop}>
        {navigation}
        <div className={styles.utilities}>{utilities}</div>
      </div>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={localize(locale, "打开菜单", "Open menu", "開啟選單")}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Icon name="menu" size={22} />
      </button>
      <dialog
        ref={dialogRef}
        id={dialogId}
        className={styles.drawer}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            "button:not(:disabled), a[href]",
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          const edge = event.shiftKey ? first : last;
          if (document.activeElement !== edge) return;
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        }}
        onClick={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("a[href]") &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey
          ) {
            setOpen(false);
            return;
          }
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            setOpen(false);
        }}
      >
        <div className={styles.drawerHeader}>
          <h2 id={titleId}>{localize(locale, "菜单", "Menu", "選單")}</h2>
          <button
            type="button"
            className={styles.close}
            aria-label={localize(locale, "关闭菜单", "Close menu", "關閉選單")}
            onClick={() => setOpen(false)}
          >
            <Icon name="x" size={22} />
          </button>
        </div>
        <div className={styles.drawerBody}>{navigation}</div>
        <div className={styles.drawerUtilities}>
          <span>{localize(locale, "外观与语言", "Appearance & language", "外觀與語言")}</span>
          <div className={styles.utilities}>{utilities}</div>
        </div>
      </dialog>
    </>
  );
}
