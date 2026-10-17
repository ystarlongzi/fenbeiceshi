import { notFound } from "next/navigation";
import { RoutePage } from "@/components/route-page";
import { findPage, sitePages } from "@/lib/routing/pages";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;
export function generateStaticParams() {
  return sitePages.filter((page) => page.slug).map((page) => ({ slug: page.slug.split("/") }));
}
type Props = { params: Promise<{ slug: string[] }> };
export async function generateMetadata({ params }: Props) {
  const page = findPage((await params).slug.join("/"));
  if (!page) notFound();
  return pageMetadata(page.id, "zh-CN");
}
export default async function Page({ params }: Props) {
  const page = findPage((await params).slug.join("/"));
  if (!page) notFound();
  return <RoutePage page={page} locale="zh-CN" />;
}
