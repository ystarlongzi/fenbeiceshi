import { activeSite } from "@/lib/routing/sites";
import { HomePage } from "@/components/home-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("meter", activeSite.primaryLocale);
export default function Page() {
  return <HomePage locale={activeSite.primaryLocale} />;
}
