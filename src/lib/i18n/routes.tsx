import { notFound } from "next/navigation";
import { HomePage } from "@/components/home-page";
import { RoutePage } from "@/components/route-page";
import { findPage, sitePages } from "@/lib/routing/pages";
import { pageMetadata } from "@/lib/seo/metadata";
import { prepareLocale } from "./load-messages";
import type { AdditionalLocale } from "./additional-locales";

export type LocalizedRouteProps = { params: Promise<{ slug: string[] }> };

export function localizedParams() {
  return sitePages.filter((page) => page.slug).map((page) => ({ slug: page.slug.split("/") }));
}

export async function localizedMetadata(id: string, locale: AdditionalLocale) {
  await prepareLocale(locale);
  return pageMetadata(id, locale);
}

export async function localizedHome(locale: AdditionalLocale) {
  await prepareLocale(locale);
  return <HomePage locale={locale} />;
}

export async function localizedPageMetadata(
  { params }: LocalizedRouteProps,
  locale: AdditionalLocale,
) {
  const page = findPage((await params).slug.join("/"));
  if (!page?.slug) notFound();
  return localizedMetadata(page.id, locale);
}

export async function localizedPage({ params }: LocalizedRouteProps, locale: AdditionalLocale) {
  const page = findPage((await params).slug.join("/"));
  if (!page?.slug) notFound();
  await prepareLocale(locale);
  return <RoutePage page={page} locale={locale} />;
}
