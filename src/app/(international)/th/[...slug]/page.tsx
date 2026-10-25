import {
  localizedPage,
  localizedPageMetadata,
  localizedParams,
  type LocalizedRouteProps,
} from "@/lib/i18n/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return localizedParams();
}
export function generateMetadata(props: LocalizedRouteProps) {
  return localizedPageMetadata(props, "th");
}
export default function Page(props: LocalizedRouteProps) {
  return localizedPage(props, "th");
}
