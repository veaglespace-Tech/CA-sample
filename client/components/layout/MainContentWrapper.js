"use client";

import { usePathname } from "next/navigation";

export default function MainContentWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <main className={isDashboard ? "min-h-screen" : "pt-[80px] lg:pt-[112px] min-h-screen"}>
      {children}
    </main>
  );
}
