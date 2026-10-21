import type { MetadataRoute } from "next";
import { contents, href, sitePages, SITE_URL } from "@/lib/routing/pages";
import { locales } from "@/lib/i18n/locales";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return sitePages
    .filter((page) => page.index)
    .flatMap((page) =>
      locales.map((locale) => ({
        url: SITE_URL + href(page.id, locale),
        lastModified: contents.find((item) => item.id === page.id)?.updated || "2026-10-17",
      })),
    );
}
