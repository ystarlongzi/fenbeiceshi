import type { ReactNode } from "react";
import { SiteDocument } from "@/components/site-document";
import "../globals.css";

export default function TraditionalChineseLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="zh-TW">{children}</SiteDocument>;
}
