import { Icon } from "@/components/icon";
import type { MeterCopy } from "../copy.ts";
import styles from "./index.module.css";

const levels = [0, 30, 60, 90, 120];

export function NoiseLevelReference({ copy }: { copy: MeterCopy }) {
  return (
    <details className={styles.reference}>
      <summary>
        <span>
          <Icon name="book-open" size={14} />
          {copy.noiseReference}
        </span>
        <Icon name="chevron-down" size={14} />
      </summary>
      <p className={styles.intro}>{copy.noiseReferenceHint}</p>
      <ol className={styles.examples}>
        {levels.map((value, i) => (
          <li key={value}>
            <div className={styles.reading}>
              <span>{copy.noiseReferenceApproximate}</span> <strong>{value}</strong> <span>dB</span>
            </div>
            <span className={styles.meaning}>{copy.noiseReferenceLabels[i]}</span>
          </li>
        ))}
      </ol>
      <div className={styles.footer}>
        <p>{copy.noiseReferenceNote}</p>
        <a href="https://stacks.cdc.gov/view/cdc/209822" target="_blank" rel="noreferrer">
          {copy.noiseReferenceSource}
          <Icon name="external-link" size={12} />
        </a>
      </div>
    </details>
  );
}
