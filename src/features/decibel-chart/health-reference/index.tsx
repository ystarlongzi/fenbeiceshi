import Link from "next/link";
import { Notice } from "@/components/notice";
import { LinkArrow } from "@/components/link-arrow";
import { decibelChartExposure, decibelChartWarning } from "@/lib/content/decibel-chart";
import { localize, text } from "@/lib/i18n/text";
import { href } from "@/lib/routing/pages";
import type { Locale } from "@/features/sound-meter/types";
import styles from "./index.module.css";

const riskTones: Record<string, string> = {
  "85": "caution",
  "88": "moderate",
  "91": "high",
  "94": "high",
  "100": "severe",
  "110": "extreme",
};

export function HealthReference({ locale }: { locale: Locale }) {
  const { title, paragraphs, table } = decibelChartExposure;

  return (
    <div id="exposure" className={styles.reference}>
      <p className={styles.scrollHint}>
        {localize(
          locale,
          "左右滑动查看完整表格",
          "Scroll sideways to view all columns",
          "左右滑動檢視完整表格",
        )}
      </p>
      <div
        className={styles.tableScroll}
        role="region"
        aria-label={localize(
          locale,
          "职业暴露与风险对照表",
          "Exposure and risk comparison",
          "職業暴露與風險對照表",
        )}
        tabIndex={0}
      >
        <table
          className={styles.table}
          aria-describedby="exposure-basis exposure-scope exposure-risk"
        >
          <caption>{text(title, locale)}</caption>
          <thead>
            <tr>
              {table.headers.map((header, index) => (
                <th key={index} scope="col" id={index === 3 ? "exposure-risk-column" : undefined}>
                  {text(header, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map(([level, niosh, osha, risk]) => (
              <tr key={level.en}>
                <th scope="row">{text(level, locale)}</th>
                <td>{text(niosh, locale)}</td>
                <td>{text(osha, locale)}</td>
                <td>
                  <span className={styles.risk} data-risk={riskTones[level.en]}>
                    {text(risk, locale)}
                  </span>
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row" id="exposure-critical-level">
                {text(decibelChartWarning.level, locale)}
              </th>
              {["niosh", "osha"].map((agency) => (
                <td
                  key={agency}
                  headers="exposure-critical-level"
                  className={styles.warningCell}
                  aria-describedby="exposure-warning-note"
                >
                  <strong>
                    {text(decibelChartWarning.duration, locale)}
                    <sup aria-hidden="true">*</sup>
                  </strong>
                </td>
              ))}
              <td headers="exposure-critical-level exposure-risk-column">
                <span className={styles.risk} data-risk="extreme">
                  {text(decibelChartWarning.risk, locale)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Notice id="exposure-warning-note" className={styles.warningNote} tone="warning">
        <p>* {text(decibelChartWarning.note, locale)}</p>
      </Notice>
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
        <p id="exposure-risk">{text(paragraphs[2], locale)}</p>
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
