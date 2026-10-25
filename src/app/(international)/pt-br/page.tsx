import { localizedHome, localizedMetadata } from "@/lib/i18n/routes";

export function generateMetadata() {
  return localizedMetadata("meter", "pt-BR");
}
export default function Page() {
  return localizedHome("pt-BR");
}
