import type { LocalizedText } from "../i18n/text.ts";
export { translations, text } from "../i18n/text.ts";
export type { LocalizedText } from "../i18n/text.ts";
export interface ContentSection {
  id: string;
  title: LocalizedText;
  tocTitle?: LocalizedText;
  paragraphs: LocalizedText[];
  items?: LocalizedText[];
  table?: { headers: LocalizedText[]; rows: LocalizedText[][] };
}
export interface Source {
  id?: string;
  title: string | LocalizedText;
  url: string;
}
export interface SiteContent {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  takeaway: LocalizedText;
  sections: ContentSection[];
  sources: Source[];
  related: string[];
  updated: string;
  kind: "article" | "guide" | "trust";
}
