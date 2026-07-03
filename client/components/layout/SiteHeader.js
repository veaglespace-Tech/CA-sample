"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

/**
 * SiteHeader — shows the Header on all pages except dashboard/admin routes.
 * Kept as a client component so we can use usePathname for route detection.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const isDashboard =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (isDashboard) return null;
  return <Header />;
}
