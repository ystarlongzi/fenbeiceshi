import type { Locale } from "../../features/sound-meter/types.ts";

export interface Dual {
  zh: string;
  en: string;
}
export interface ContentSection {
  id: string;
  title: Dual;
  tocTitle?: Dual;
  paragraphs: Dual[];
  items?: Dual[];
  table?: { headers: Dual[]; rows: Dual[][] };
}
export interface Source {
  id?: string;
  title: string;
  url: string;
}
export interface SiteContent {
  id: string;
  slug: string;
  title: Dual;
  description: Dual;
  takeaway: Dual;
  sections: ContentSection[];
  sources: Source[];
  related: string[];
  updated: string;
  kind: "article" | "guide" | "trust";
}

export const dual = (zh: string, en: string): Dual => ({ zh, en });
export const text = (value: Dual, locale: Locale): string =>
  locale === "en" ? value.en : value.zh;
