"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export function useFocusMode(root: RefObject<HTMLDivElement | null>) {
  const [focused, setFocused] = useState(false);
  const [notice, setNotice] = useState<"fullFallback" | "closeError" | null>(null);
  const previous = useRef<HTMLElement | null>(null);
  const native = useRef(false);

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement === root.current) await document.exitFullscreen();
      setFocused(false);
      setNotice(null);
    } catch {
      setNotice("closeError");
    }
  }, [root]);

  useEffect(() => {
    const changed = () => {
      if (document.fullscreenElement === root.current) native.current = true;
      else if (native.current) {
        native.current = false;
        setFocused(false);
      }
    };
    document.addEventListener("fullscreenchange", changed);
    return () => document.removeEventListener("fullscreenchange", changed);
  }, [root]);

  useEffect(() => {
    if (!focused) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.querySelector<HTMLButtonElement>("[data-focus-exit]")?.focus();
    const keydown = (event: KeyboardEvent) => {
      // 原生模态框自行处理焦点和 Escape，避免抽屉关闭时连带退出全屏。
      if (root.current?.querySelector("dialog[open]")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        void exit();
      }
      if (event.key !== "Tab") return;
      const nodes = Array.from(
        root.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]',
        ) || [],
      ).filter((node) => node.getClientRects().length > 0);
      const first = nodes[0];
      const last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      previous.current?.focus();
    };
  }, [focused, root, exit]);

  async function toggle() {
    if (focused) {
      await exit();
      return;
    }
    previous.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setNotice(null);
    setFocused(true);
    const element = root.current;
    if (document.fullscreenEnabled && element?.requestFullscreen) {
      try {
        await element.requestFullscreen();
      } catch {
        setNotice("fullFallback");
      }
    } else setNotice("fullFallback");
  }

  return { focused, notice, toggle };
}
