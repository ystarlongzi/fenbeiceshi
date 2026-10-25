import { localizedHome, localizedMetadata } from "@/lib/i18n/routes";

export function generateMetadata() {
  return localizedMetadata("meter", "it");
}
export default function Page() {
  return localizedHome("it");
}
