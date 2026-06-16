"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../../store/api/authApi";
import { getDashboardPath } from "../../lib/auth";

export default function PublicOnlyRoute({ children }) {
  const router = useRouter();
  const token = useSelector((state) => state.auth?.token);
  const { data, isLoading } = useGetMeQuery(undefined, { skip: !token });
  const user = data?.user || null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.role) {
      router.replace(getDashboardPath(user.role));
    }
  }, [router, user]);

  if (!mounted) {
    return children; // Avoid hydration mismatch by rendering the same as SSR initially
  }

  return (
    <>
      {children}
      {(isLoading || user) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
          <div className="bg-white px-8 py-6 rounded-none shadow-2xl border border-slate-100 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <span className="loading loading-spinner text-gold loading-lg"></span>
            <p className="font-bold text-slate-700">{isLoading ? "Checking your session..." : "Redirecting to your dashboard..."}</p>
          </div>
        </div>
      )}
    </>
  );
}
