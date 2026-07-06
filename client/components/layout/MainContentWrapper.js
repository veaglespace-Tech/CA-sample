"use client";

import { usePathname } from "next/navigation";

export default function MainContentWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <main className={isDashboard ? "min-h-screen" : "pt-[70px] lg:pt-[105px] min-h-screen"}>
      {children}
    </main>
  );
}
