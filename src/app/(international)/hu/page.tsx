import { localizedHome, localizedMetadata } from "@/lib/i18n/routes";

export function generateMetadata() {
  return localizedMetadata("meter", "hu");
}
export default function Page() {
  return localizedHome("hu");
}
