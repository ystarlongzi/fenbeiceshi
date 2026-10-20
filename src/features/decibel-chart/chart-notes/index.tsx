import { Icon } from "@/components/icon";
import { decibelChartNotes } from "@/lib/content/decibel-chart";
import { soundSources } from "@/lib/content/sound-references";
import { text } from "@/lib/content/types";
import type { Locale } from "@/features/sound-meter/types";
import { DisclosureAnchors } from "@/components/disclosure-anchors";
import styles from "./index.module.css";

export function ChartNotes({ locale }: { locale: Locale }) {
  return (
    <div className={styles.notes}>
      <DisclosureAnchors ids={decibelChartNotes.map((section) => section.id)} />
      {decibelChartNotes.map((section) => {
        const source = section.id === "scale" ? soundSources.ccohs : null;
        return (
          <details key={section.id} className={styles.note}>
            <summary>
              <span>{text(section.title, locale)}</span>
              <Icon name="chevron-down" size={16} />
            </summary>
            <div id={section.id} className={styles.body}>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{text(paragraph, locale)}</p>
              ))}
              {section.items ? (
                <ul>
                  {section.items.map((item, index) => (
                    <li key={index}>{text(item, locale)}</li>
                  ))}
                </ul>
              ) : null}
              {section.table ? (
                <div className={styles.tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        {section.table.headers.map((header, index) => (
                          <th key={index} scope="col">
                            {text(header, locale)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, index) => (
                        <tr key={index}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{text(cell, locale)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {source ? (
                <a className={styles.source} href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                  <Icon name="external-link" size={13} />
                </a>
              ) : null}
            </div>
          </details>
        );
      })}
    </div>
  );
}
