import type { MetadataRoute } from "next";
import { contents, href, sitePages, SITE_URL } from "@/lib/routing/pages";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return sitePages
    .filter((page) => page.index)
    .flatMap((page) =>
      (["zh-CN", "en"] as const).map((locale) => ({
        url: SITE_URL + href(page.id, locale),
        lastModified: contents.find((item) => item.id === page.id)?.updated || "2026-10-17",
      })),
    );
}
