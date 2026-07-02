"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, X } from "lucide-react";
import Fuse from "fuse.js";
import { getAllNavigationLinks } from "../../lib/navigation-data";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");

const animatedExamples = [
  "Company Registration",
  "GST Registration",
  "Trademark Search",
  "Annual Compliance",
  "Talk to a Lawyer",
];

export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(animatedExamples[0].length);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  const links = useMemo(() => getAllNavigationLinks(), []);
  
  // Fuse.js configuration for fuzzy search
  const fuse = useMemo(() => new Fuse(links, {
    keys: [
      { name: "label", weight: 0.8 },
      { name: "category", weight: 0.2 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 2,
  }), [links]);

  const matches = useMemo(() => {
    if (!query.trim()) return links.slice(0, 6); // Show popular default items
    const results = fuse.search(query);
    return results.map(r => r.item).slice(0, 8);
  }, [fuse, query, links]);

  const animatedPlaceholder = animatedExamples[exampleIndex].slice(0, typedLength);

  async function recordSearch(searchQuery, targetHref) {
    try {
      await fetch(`${API_URL}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          matchedSlug: targetHref?.replace(/^\//, ""),
          sourcePageSlug: "home",
          pagePath: "/",
        }),
      });
    } catch {
      // Search should still navigate when the API is unavailable locally.
    }
  }

  function navigateTo(item) {
    if (!item) return;
    const cleanedQuery = query.trim() || item.label;
    void recordSearch(cleanedQuery, item.href);
    router.push(item.href);
    setActive(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const cleanedQuery = query.trim();
    if (!cleanedQuery) return;

    if (selectedIndex >= 0 && matches[selectedIndex]) {
      navigateTo(matches[selectedIndex]);
    } else {
      const target = matches[0] || {
        href: `/services?search=${encodeURIComponent(cleanedQuery)}`,
        label: cleanedQuery,
      };
      navigateTo(target);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < matches.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setActive(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const currentExample = animatedExamples[exampleIndex];
    const delay = !isDeleting && typedLength === currentExample.length ? 1200 : isDeleting ? 30 : 60;

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedLength === currentExample.length) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && typedLength === 0) {
        setIsDeleting(false);
        setExampleIndex((current) => (current + 1) % animatedExamples.length);
        return;
      }

      setTypedLength((current) => current + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [exampleIndex, isDeleting, typedLength]);

  useEffect(() => {
    const timer = window.setInterval(() => setShowCursor((current) => !current), 480);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      {/* Backdrop for active state (Mobile & Desktop) */}
      <div 
        className={`fixed inset-0 z-[40] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${active ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`} 
        onClick={() => setActive(false)} 
        aria-hidden="true" 
      />

      <div 
        className={`relative mx-auto w-full max-w-[760px] z-[50] transition-all duration-300 ${active ? "scale-[1.02] sm:scale-105" : ""}`}
        onMouseLeave={() => {
          setActive(false);
          inputRef.current?.blur();
        }}
      >
        
        {/* Magic Glow Border */}
        <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-gold via-yellow-500 to-orange-500 blur opacity-30 transition-opacity duration-500 ${active ? "animate-[pulse-glow_3s_ease-in-out_infinite] opacity-70 blur-md" : "opacity-0"}`} />

        <form
          className={`vx-search-form relative flex items-center gap-2 sm:gap-3 overflow-hidden bg-white p-1.5 pl-4 sm:pl-7 transition-all duration-300 ${
            active
              ? "rounded-[1.5rem] sm:rounded-full border border-gold/30 shadow-2xl shadow-gold/20"
              : "rounded-[1.5rem] sm:rounded-full border border-slate-200/80 shadow-lg hover:border-gold/50 hover:shadow-xl"
          }`}
          role="search"
          onSubmit={handleSubmit}
        >
          <div className="flex shrink-0 items-center text-gold">
            {active ? <Sparkles size={22} className="animate-pulse text-gold" /> : <Search size={22} className="text-slate-400" />}
          </div>
          
          <input
            ref={inputRef}
            type="search"
            placeholder={`Try "${animatedPlaceholder}${showCursor ? "|" : ""}"`}
            className="min-w-0 flex-1 bg-transparent py-3 sm:py-4 text-sm sm:text-lg font-bold text-slate-950 outline-none placeholder:text-slate-400"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setActive(true)}
            onKeyDown={handleKeyDown}
            aria-label="Search services"
            autoComplete="off"
          />

          {/* Clear Button (Mobile especially) */}
          {query && active && (
            <button 
              type="button" 
              onClick={() => setQuery("")}
              className="mr-1 p-2 text-slate-400 hover:text-slate-600 sm:hidden"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="submit"
            className="grid h-12 w-12 sm:h-14 shrink-0 place-items-center rounded-full bg-gradient-to-r from-gold to-orange-500 text-white shadow-lg shadow-gold/25 transition-all hover:scale-105 active:scale-95 sm:w-auto sm:px-8"
          >
            <Search className="sm:hidden" size={18} />
            <span className="hidden text-sm font-black uppercase tracking-wide sm:inline">Search</span>
          </button>
        </form>

        {/* Results Dropdown */}
        <div className={`absolute left-0 right-0 top-full pt-3 origin-top z-[1000] w-full transition-all duration-300 ${
          active ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible pointer-events-none"
        }`}>
          <div className="max-h-[60vh] sm:max-h-[450px] w-full overflow-y-auto rounded-[1.5rem] border border-slate-200/60 bg-white/95 p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            {matches.length > 0 ? (
            <>
              {!query.trim() && <div className="px-4 pb-2 pt-3 text-xs font-black uppercase tracking-widest text-slate-400">Popular Services</div>}
              {matches.map((item, index) => (
              <button 
                key={`${item.label}-${item.href}`} 
                type="button" 
                onMouseDown={(e) => { e.preventDefault(); navigateTo(item); }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex w-full items-center gap-4 rounded-sm p-3 text-left transition-all ${
                  selectedIndex === index ? "bg-gold/10/80 shadow-sm" : "bg-transparent hover:bg-slate-50"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm transition-colors ${
                  selectedIndex === index ? "bg-gradient-to-br from-gold to-orange-500 text-white shadow-md shadow-gold/20" : "bg-slate-100 text-slate-500"
                }`}>
                  {item.icon ? (
                    <img src={item.icon} alt="" className={`h-5 w-5 ${selectedIndex === index ? "brightness-0 invert" : ""}`} />
                  ) : (
                    <Search size={18} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.95rem] font-extrabold text-slate-900 truncate">{item.label}</div>
                  <div className="text-[0.7rem] font-black uppercase tracking-wider text-gold mt-0.5 truncate">{item.category}</div>
                </div>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white transition-all duration-300 ${
                  selectedIndex === index ? "translate-x-0 opacity-100 shadow-sm text-gold" : "-translate-x-2 opacity-0 text-slate-400"
                }`}>
                  <ArrowRight size={16} />
                </div>
              </button>
            ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 md:p-10 text-center text-slate-400">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
                <Search size={28} className="text-slate-300" />
              </div>
              <p className="font-semibold text-slate-600">No matching services found for</p>
              <p className="font-black text-slate-900 mt-1">&quot;{query}&quot;</p>
              <button 
                onMouseDown={(e) => { e.preventDefault(); router.push(`/services?search=${encodeURIComponent(query)}`); setActive(false); }}
                className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-white transition-all hover:bg-gold hover:shadow-lg hover:shadow-gold/25"
              >
                View all results
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
}

