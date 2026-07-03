"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWidgets from "./FloatingWidgets";

/**
 * SiteShell — client-side wrapper that hides the Header, Footer, and
 * FloatingWidgets on dashboard and admin routes while keeping layout.js
 * as a Server Component (required for Next.js `metadata` export).
 */
export default function SiteShell() {
  const pathname = usePathname();
  const isDashboard =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (isDashboard) return null;

  return (
    <>
      <Header />
      <Footer />
      <FloatingWidgets />
    </>
  );
}
