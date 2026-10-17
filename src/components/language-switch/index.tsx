"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/features/sound-meter/types";

export function LanguageSwitch({
  locale,
  available,
  className,
}: {
  locale: Locale;
  available: string[];
  className?: string;
}) {
  const pathname = usePathname() || (locale === "en" ? "/en/" : "/");
  const clean = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const target = locale === "en" ? clean.replace(/^\/en\//, "/") : `/en${clean}`;
  const url = available.includes(target) ? target : locale === "en" ? "/" : "/en/";
  return (
    <Link
      href={url}
      hrefLang={locale === "en" ? "zh-CN" : "en"}
      lang={locale === "en" ? "zh-CN" : "en"}
      className={className}
      aria-label={locale === "en" ? "切换到简体中文" : "Switch to English"}
    >
      {locale === "en" ? "简中" : "EN"}
    </Link>
  );
}
