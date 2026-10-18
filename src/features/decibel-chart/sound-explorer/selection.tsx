"use client";

import { createContext, use, useState, type ReactNode } from "react";
import { bandAtLevel, readLevel, type ExplorerBand, type SoundSelection } from "./model";
import type { LevelRange } from "../sound-reference-list/filter";

interface SoundSelectionContext {
  bands: ExplorerBand[];
  selection: SoundSelection | null;
  setSelection: (selection: SoundSelection | null) => void;
  band: ExplorerBand | undefined;
  value: number | null;
  invalid: boolean;
  range: LevelRange | null;
}

const SelectionContext = createContext<SoundSelectionContext | null>(null);

export function SoundSelectionProvider({
  bands,
  children,
}: {
  bands: ExplorerBand[];
  children: ReactNode;
}) {
  const [selection, setSelection] = useState<SoundSelection | null>(null);
  const value = selection?.kind === "value" ? readLevel(selection.raw, 0, 160) : null;
  const band =
    selection?.kind === "band"
      ? bands.find((item) => item.tone === selection.tone)
      : value !== null
        ? bandAtLevel(bands, value)
        : undefined;
  const invalid = selection?.kind === "value" && value === null;
  const range =
    selection?.kind === "band" && band
      ? { min: band.min, max: band.max, includeMax: band.max === 160 }
      : value !== null
        ? { min: value, max: value, includeMax: true }
        : null;

  return (
    <SelectionContext value={{ bands, selection, setSelection, band, value, invalid, range }}>
      {children}
    </SelectionContext>
  );
}

export function useSoundSelection() {
  const context = use(SelectionContext);
  if (!context) throw new Error("声音查询缺少分段选择上下文。");
  return context;
}
