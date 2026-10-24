import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "../icon";
import styles from "./index.module.css";

type NoticeProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "info" | "warning" | "error";
  children: ReactNode;
};

export function Notice({ tone = "info", children, className = "", ...props }: NoticeProps) {
  return (
    <div role="note" {...props} className={`${styles.notice} ${className}`} data-tone={tone}>
      <Icon
        name={tone === "info" ? "circle-question-mark" : "circle-alert"}
        size={18}
        className={styles.icon}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
