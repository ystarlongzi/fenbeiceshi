import type { ReactNode } from "react";
import { SiteDocument } from "@/components/site-document";
import "../../globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="de">{children}</SiteDocument>;
}
