"use client";

import { useState, type RefObject } from "react";
import { MeasurementReportDialog } from "../../sound-meter/measurement-report";
import { getReportCopy } from "../../sound-meter/measurement-report/copy";
import { withMeasurementNote } from "../../sound-meter/measurement-report/model";
import type { Locale, Measurement } from "../../sound-meter/types";

export function RecordExportDialog({
  record,
  locale,
  onClose,
  returnFocus,
}: {
  record: Measurement;
  locale: Locale;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  const [note, setNote] = useState(record.note);

  return (
    <MeasurementReportDialog
      record={withMeasurementNote(record, note)}
      locale={locale}
      note={note}
      noteHint={getReportCopy(locale).exportNoteHint}
      onNoteChange={setNote}
      onClose={onClose}
      returnFocus={returnFocus}
    />
  );
}
