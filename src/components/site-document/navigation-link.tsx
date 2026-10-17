"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavigationLink({
  href,
  exact,
  className,
  children,
}: {
  href: string;
  exact: boolean;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const path = pathname ? `${pathname.replace(/\/+$/, "")}/` : "";
  const current = path === href ? "page" : !exact && path.startsWith(href) ? "location" : undefined;
  return (
    <Link href={href} className={className} aria-current={current}>
      {children}
    </Link>
  );
}
