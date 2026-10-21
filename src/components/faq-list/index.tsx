import Link from "next/link";
import type { Locale } from "@/features/sound-meter/types";
import type { FaqItem } from "@/lib/content/faq";
import { text } from "@/lib/content/types";
import { href } from "@/lib/routing/pages";
import { Icon } from "../icon";
import { LinkArrow } from "../link-arrow";
import styles from "./index.module.css";

export function FaqList({
  items,
  locale,
  variant = "plain",
  className = "",
}: {
  items: FaqItem[];
  locale: Locale;
  variant?: "plain" | "grouped";
  className?: string;
}) {
  return (
    <div className={`${styles.list} ${variant === "grouped" ? styles.grouped : ""} ${className}`}>
      {items.map((item) => (
        <details key={item.id} id={`faq-${item.id}`} data-faq-id={item.id}>
          <summary>
            {text(item.question, locale)}
            <Icon name="chevron-down" size={17} />
          </summary>
          <div className={styles.answer}>
            {item.answer.map((paragraph, index) => (
              <p key={index}>{text(paragraph, locale)}</p>
            ))}
            <Link
              href={`${href(item.link.pageId, locale)}${item.link.hash ? `#${item.link.hash}` : ""}`}
            >
              {text(item.link.label, locale)}
              <LinkArrow size={15} />
            </Link>
          </div>
        </details>
      ))}
    </div>
  );
}
