import type { ReactNode } from "react";
import { SiteDocument } from "@/components/site-document";
import "../globals.css";

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
