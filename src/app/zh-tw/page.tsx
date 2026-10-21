import { HomePage } from "@/components/home-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("meter", "zh-TW");
export default function Page() {
  return <HomePage locale="zh-TW" />;
}
