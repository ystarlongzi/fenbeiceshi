"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavigationLink({
  href,
  exact,
  exclude = [],
  className,
  children,
}: {
  href: string;
  exact: boolean;
  exclude?: string[];
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const path = pathname ? `${pathname.replace(/\/+$/, "")}/` : "";
  const current =
    path === href
      ? "page"
      : !exact && path.startsWith(href) && !exclude.some((prefix) => path.startsWith(prefix))
        ? "location"
        : undefined;
  return (
    <Link href={href} className={className} aria-current={current}>
      {children}
    </Link>
  );
}
