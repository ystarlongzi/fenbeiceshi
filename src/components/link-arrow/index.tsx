import { Icon } from "../icon";
import styles from "./index.module.css";

export function LinkArrow({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span className={`${styles.arrow} ${className ?? ""}`} aria-hidden="true">
      <Icon name="arrow-right" size={size} />
    </span>
  );
}
