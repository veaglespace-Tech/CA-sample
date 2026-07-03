"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import FloatingWidgets from "./FloatingWidgets";
import ClientChatbot from "./ClientChatbot";

/**
 * SiteFooter — shows Footer and FloatingWidgets at the bottom of every page
 * except dashboard/admin routes. Renders AFTER <main> in layout.js.
 */
export default function SiteFooter() {
  const pathname = usePathname();
  const isDashboard =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (isDashboard) return null;
  return (
    <>
      <Footer />
      <FloatingWidgets />
      <ClientChatbot />
    </>
  );
}
