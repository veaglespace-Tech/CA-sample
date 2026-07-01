"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");

export default function ReviewBadge({ className = "" }) {
  const [stats, setStats] = useState({ count: 0, rating: "0" });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/reviews`);
        if (!res.ok) return;
        const data = await res.json();
        const reviews = data?.data || [];
        if (reviews.length > 0) {
          const rating = (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1);
          setStats({ count: reviews.length, rating });
        } else {
          setStats({ count: 0, rating: "0" });
        }
      } catch (error) {
        console.error("Failed to fetch review stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <Link
      href="/reviews"
      className={`group flex sm:inline-flex items-center max-w-full gap-2 sm:gap-4 rounded-full border border-slate-200 bg-white p-1 sm:p-1.5 pr-2 sm:pr-5 shadow-sm transition-all duration-300 hover:border-gold/30 hover:bg-slate-50 hover:shadow-md ${className}`}
    >
      <span className="flex shrink-0 h-6 sm:h-7 items-center rounded-full bg-gradient-to-r from-navy to-navy-light px-2.5 sm:px-4 text-[0.6rem] sm:text-[0.7rem] font-black uppercase tracking-widest text-white shadow-sm shadow-navy/20">
        Trusted
      </span>
      <span className="flex items-center gap-1.5 sm:gap-3 min-w-0 overflow-hidden">
        <span className="hidden sm:flex items-center gap-[2px] shrink-0">
          {/* Custom Solid Star SVG for precise matching of the modern UI */}
          {[...Array(4)].map((_, i) => (
            <svg key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FFB703]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </span>
        <span className="flex items-baseline gap-1 sm:gap-1.5 text-xs sm:text-base min-w-0 truncate">
          <span className="font-extrabold text-slate-800 shrink-0">{stats.rating}/5</span>
          <span className="text-slate-500 font-semibold text-[0.65rem] sm:text-sm whitespace-nowrap truncate">from {stats.count} Google reviews</span>
        </span>
      </span>
      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 transition-transform group-hover:translate-x-1 shrink-0 ml-auto sm:ml-0" />
    </Link>
  );
}
