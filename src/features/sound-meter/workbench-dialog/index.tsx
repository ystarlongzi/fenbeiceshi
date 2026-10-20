"use client";

import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { Icon } from "@/components/icon";
import styles from "./index.module.css";

export function WorkbenchDialog({
  open,
  title,
  closeLabel,
  drawer = false,
  onClose,
  returnFocus,
  children,
}: {
  open: boolean;
  title: string;
  closeLabel: string;
  drawer?: boolean;
  onClose: () => void;
  returnFocus?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previous = document.activeElement;
    const fallback = returnFocus?.current;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      const target =
        previous instanceof HTMLElement &&
        previous.isConnected &&
        previous.getClientRects().length > 0
          ? previous
          : fallback;
      target?.focus();
    };
  }, [open, returnFocus]);

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${drawer ? styles.drawer : ""}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <header className={styles.header}>
        <h2 id={titleId}>{title}</h2>
        <button type="button" onClick={onClose} aria-label={closeLabel}>
          <Icon name="x" size={20} />
        </button>
      </header>
      <div className={styles.body}>{children}</div>
    </dialog>
  );
}
