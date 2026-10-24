import Link from "next/link";
import { Notice } from "@/components/notice";
import { LinkArrow } from "@/components/link-arrow";
import { decibelChartExposure } from "@/lib/content/decibel-chart";
import { localize, text } from "@/lib/i18n/text";
import { href } from "@/lib/routing/pages";
import type { Locale } from "@/features/sound-meter/types";
import styles from "./index.module.css";

export function HealthReference({ locale }: { locale: Locale }) {
  const { title, paragraphs, table } = decibelChartExposure;

  return (
    <div id="exposure" className={styles.reference}>
      <table className={styles.table} aria-describedby="exposure-basis exposure-scope">
        <caption>{text(title, locale)}</caption>
        <thead>
          <tr>
            {table.headers.map((header, index) => (
              <th key={index} scope="col">
                {text(header, locale)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map(([level, niosh, osha]) => (
            <tr key={level.en}>
              <th scope="row">{text(level, locale)}</th>
              <td>{text(niosh, locale)}</td>
              <td>{text(osha, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Notice
        className={styles.notice}
        tone="warning"
        aria-label={localize(
          locale,
          "职业暴露参考说明",
          "Occupational exposure reference notes",
          "職業暴露參考說明",
        )}
      >
        <p id="exposure-basis">{text(paragraphs[0], locale)}</p>
        <p id="exposure-scope">{text(paragraphs[1], locale)}</p>
      </Notice>
      <div className={styles.links}>
        <Link className={styles.articleLink} href={href("noise-health", locale)}>
          {localize(locale, "了解噪音与健康", "Explore noise and health", "瞭解噪音與健康")}
          <LinkArrow size={16} />
        </Link>
        <Link className={styles.exposureLink} href={`${href("noise-health", locale)}#exposure`}>
          {localize(locale, "查看暴露时长参考", "Explore exposure time", "檢視暴露時長參考")}
          <LinkArrow size={16} />
        </Link>
      </div>
    </div>
  );
}
