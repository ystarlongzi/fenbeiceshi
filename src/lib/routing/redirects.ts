import { canonicalHref, findPage } from "./pages.ts";

export function legacyEnglishRedirect(pathname: string): string | null {
  if (pathname !== "/en" && !pathname.startsWith("/en/")) return null;
  const slug = pathname.slice(3).replace(/^\/+|\/+$/g, "");
  const page = findPage(slug);
  return page ? canonicalHref(page.id, "en") : null;
}
