import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ReviewBadge({ className = "" }) {
  return (
    <Link
      href="/reviews"
      className={`group inline-flex items-center gap-3 sm:gap-4 rounded-full border border-slate-200 bg-white p-1.5 pr-4 sm:pr-5 shadow-sm transition-all duration-300 hover:border-gold/30 hover:bg-slate-50 hover:shadow-md ${className}`}
    >
      <span className="flex h-6 sm:h-7 items-center rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] px-3 sm:px-4 text-[0.65rem] sm:text-[0.7rem] font-black uppercase tracking-widest text-white shadow-sm shadow-indigo-500/20">
        Trusted
      </span>
      <span className="flex items-center gap-2 sm:gap-3">
        <span className="flex items-center gap-[2px]">
          {/* Custom Solid Star SVG for precise matching of the modern UI */}
          {[...Array(4)].map((_, i) => (
            <svg key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FFB703]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </span>
        <span className="flex items-baseline gap-1.5 text-sm sm:text-base">
          <span className="font-extrabold text-slate-800">4.0/5</span>
          <span className="text-slate-500 font-semibold text-xs sm:text-sm">from 29 Google reviews</span>
        </span>
      </span>
      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
