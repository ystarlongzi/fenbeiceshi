import { HomePage } from "@/components/home-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("meter", "en");
export default function Page() {
  return <HomePage locale="en" />;
}
