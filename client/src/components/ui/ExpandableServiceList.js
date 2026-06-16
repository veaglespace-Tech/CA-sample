"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function ExpandableServiceList({ items, hoverBg, c }) {
  const [expanded, setExpanded] = useState(false);

  // Show only 4 items on mobile when not expanded, show all on desktop always.
  // We can handle desktop vs mobile purely through responsive state, or by using Tailwind classes.
  // A simpler way: limit to 4 items initially, but provide a "View More" button.
  // Actually, we want it to be always expanded on desktop. So we can render two lists,
  // or use CSS to hide items past index 3 on mobile unless expanded.

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {items.map(([label, href, icon], idx) => (
          <li 
            key={label}
            className={`${!expanded && idx >= 4 ? 'hidden sm:block' : 'block'}`}
          >
            <Link
              href={href}
              className={`group/link flex items-center justify-between gap-3 rounded-sm border border-transparent px-4 py-3 transition-all duration-300 hover:shadow-sm ${hoverBg}`}
            >
              <div className="flex items-center gap-3">
                {icon && (
                  <img 
                    src={icon} 
                    alt="" 
                    className="h-5 w-5 shrink-0 object-contain opacity-50 transition-opacity duration-300 group-hover/link:opacity-100" 
                    loading="lazy" 
                    decoding="async"
                  />
                )}
                <span className="text-sm font-bold text-slate-600 transition-colors duration-300 group-hover/link:text-slate-900">
                  {label}
                </span>
              </div>
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white opacity-0 shadow-sm transition-all duration-300 group-hover/link:opacity-100 group-hover/link:translate-x-1 ${c.text}`}>
                <ChevronRight className="h-3 w-3" strokeWidth={3} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      
      {items.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`sm:hidden mt-2 flex items-center justify-center gap-2 rounded-sm py-2 text-sm font-bold transition-colors ${c.text} hover:bg-slate-50`}
        >
          {expanded ? "View Less" : `View More (${items.length - 4})`}
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
