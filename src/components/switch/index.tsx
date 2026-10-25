"use client";

import type { ReactNode } from "react";
import styles from "./index.module.css";

export function Switch({
  checked,
  onCheckedChange,
  children,
  disabled = false,
  describedBy,
  controls,
  setting,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
  describedBy?: string;
  controls?: string;
  setting?: string;
}) {
  return (
    <label className={styles.switch}>
      <span className={styles.label}>{children}</span>
      <span className={styles.control} dir="ltr">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onCheckedChange(event.target.checked)}
          aria-describedby={describedBy}
          aria-controls={controls}
          data-setting={setting}
        />
        <span className={styles.track} aria-hidden="true" />
      </span>
    </label>
  );
}
