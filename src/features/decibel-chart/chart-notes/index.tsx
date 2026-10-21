import Link from "next/link";
import { Icon } from "@/components/icon";
import { LinkArrow } from "@/components/link-arrow";
import { decibelChartNotes } from "@/lib/content/decibel-chart";
import { text } from "@/lib/content/types";
import { href } from "@/lib/routing/pages";
import type { Locale } from "@/features/sound-meter/types";
import { DisclosureAnchors } from "@/components/disclosure-anchors";
import styles from "./index.module.css";

export function ChartNotes({ locale }: { locale: Locale }) {
  return (
    <div className={styles.notes}>
      <DisclosureAnchors
        ids={decibelChartNotes.flatMap((section) =>
          section.link.id ? [section.id, section.link.id] : [section.id],
        )}
      />
      {decibelChartNotes.map((section) => (
        <details key={section.id} className={styles.note}>
          <summary>
            <span>{text(section.title, locale)}</span>
            <Icon name="chevron-down" size={16} />
          </summary>
          <div id={section.id} className={styles.body}>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{text(paragraph, locale)}</p>
            ))}
            <Link
              id={section.link.id}
              className={styles.moreLink}
              href={href(section.link.pageId, locale)}
            >
              {text(section.link.label, locale)}
              <LinkArrow size={15} />
            </Link>
          </div>
        </details>
      ))}
    </div>
  );
}
