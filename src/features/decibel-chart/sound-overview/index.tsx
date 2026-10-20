"use client";

import type { Locale } from "@/features/sound-meter/types";
import { Icon } from "@/components/icon";
import { useSoundSelection } from "../sound-explorer/selection";
import styles from "./index.module.css";

export function SoundOverview({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const { bands, selection, setSelection, band: currentBand } = useSoundSelection();

  function choose(tone: string) {
    setSelection(
      selection?.kind === "band" && selection.tone === tone ? null : { kind: "band", tone },
    );
    requestAnimationFrame(() => {
      const results = document.getElementById("sound-results");
      results?.focus({ preventScroll: true });
      results?.scrollIntoView({ block: "start" });
    });
  }

  return (
    <figure className={styles.overview}>
      <ol aria-label={en ? "Choose a sound level band" : "选择分贝分段"}>
        {bands.map((band) => (
          <li key={band.tone}>
            <button
              type="button"
              className={styles.band}
              data-tone={band.tone}
              data-current={currentBand?.tone === band.tone}
              aria-pressed={selection?.kind === "band" && selection.tone === band.tone}
              aria-controls="sound-results"
              onClick={() => choose(band.tone)}
            >
              <span className={styles.range}>
                {band.range} <small>dB</small>
              </span>
              <strong>{band.title}</strong>
              <span className={styles.examples}>{band.examples}</span>
              {currentBand?.tone === band.tone ? (
                <Icon name="circle-check" size={16} className={styles.mark} />
              ) : null}
            </button>
          </li>
        ))}
      </ol>
      <figcaption>
        {en
          ? "Ranges may cross bands; boundary values belong to the higher band."
          : "参考范围可能跨档；交界值计入后一档。"}
      </figcaption>
    </figure>
  );
}
