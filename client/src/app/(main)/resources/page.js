"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ArticleCard from "../../../components/resources/ArticleCard";
import { regulatoryUpdates } from "../../../lib/public-page-data";
import { ChevronRight, ArrowRight, BookOpen, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

export default function ResourcesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${API_URL}/api/articles`);
        const json = await res.json();
        if (json.ok) setArticles(json.data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="flex min-h-screen flex-col selection:bg-gold/100/20 selection:text-gold">
      
      {/* ── HERO SECTION ── */}
      <section className="relative flex min-h-[40vh] flex-col items-center justify-center bg-white px-4 py-8 md:py-20 sm:px-6 lg:px-8 z-20 overflow-hidden">
        {/* Animated Mesh Background */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -left-[10%] top-[10%] h-[400px] w-[400px] animate-[float_10s_ease-in-out_infinite] rounded-full bg-gold/100/10 blur-[100px]" />
          <div className="absolute right-[10%] top-[30%] h-[500px] w-[500px] animate-[float_14s_ease-in-out_infinite_2s_reverse] rounded-full bg-violet-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 animate-fade-in-up">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900">Resources</span>
          </div>

          <h1 className="animate-fade-in-up font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight" style={{ animationDelay: "100ms" }}>
            Articles & <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Regulatory Updates</span>
          </h1>
          <p className="animate-fade-in-up mt-6 max-w-2xl text-lg font-medium text-slate-600 leading-relaxed" style={{ animationDelay: "200ms" }}>
            Stay informed with expert guides, compliance updates, and practical business insights to help you navigate India&apos;s regulatory landscape.
          </p>
        </div>
      </section>

      {/* ── ARTICLES SECTION ── */}
      <section className="relative z-10 border-t border-slate-100 bg-slate-50/50 py-8 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                <BookOpen size={16} /> Knowledge Base
              </p>
              <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Latest Articles
              </h2>
            </div>
            <p className="text-slate-500 font-medium max-w-md text-sm sm:text-right">
              Guides for registration, licences, taxation, intellectual property, and business compliance.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 md:py-20">
              <span className="loading loading-spinner loading-lg text-blue-500 mb-4"></span>
              <p className="text-slate-500 font-bold animate-pulse">Loading latest articles...</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, idx) => (
                <div key={article.id} className="animate-fade-in-up flex h-full" style={{ animationDelay: `${(idx % 10) * 100}ms` }}>
                  <ArticleCard article={article} apiUrl={API_URL} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 md:py-16 px-4 text-center rounded-none border border-slate-200 bg-white shadow-sm">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">Articles are being updated</h3>
              <p className="text-slate-500 max-w-md mx-auto font-medium">Meanwhile, explore common regulatory topics from Veagle Space Technology&apos;s live site.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── REGULATORY UPDATES SECTION ── */}
      <section className="bg-white py-8 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-violet-600 flex items-center justify-center gap-2">
              <AlertCircle size={16} /> Compliance Tracking
            </p>
            <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Regulatory Updates
            </h2>
            <p className="mt-4 text-lg font-medium text-slate-500 max-w-2xl mx-auto">
              Important topics businesses frequently track for registrations, renewals, and filings.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regulatoryUpdates.map((item, idx) => (
              <Link 
                key={item} 
                href="/talk-to-expert" 
                className="group relative flex flex-col rounded-none border border-slate-200 bg-white p-8 shadow-sm transition-all duration-400 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10 overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-violet-50/0 group-hover:from-violet-50/50 group-hover:to-fuchsia-50/20 transition-colors duration-500" />
                
                <h3 className="relative z-10 font-heading text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-700 transition-colors">
                  {item}
                </h3>
                <p className="relative z-10 text-sm font-medium text-slate-500 leading-relaxed flex-1">
                  Speak with a Veagle Space Technology advisor to understand applicability, documents, timeline, and next steps.
                </p>
                <div className="relative z-10 mt-6 flex items-center gap-2 text-sm font-bold text-violet-600">
                  Ask an expert
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
}
