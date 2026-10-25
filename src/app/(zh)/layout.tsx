import { activeSite } from "@/lib/routing/sites";
import type { ReactNode } from "react";
import { SiteDocument } from "@/components/site-document";
import "../globals.css";

export default function ChineseLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale={activeSite.primaryLocale}>{children}</SiteDocument>;
}
