import Link from "next/link";
import { Star, Quote, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Customer Reviews - Veagle Space",
  description: "Read real reviews from 5 lakh+ customers who used Veagle Space for company registration, GST, trademark and more.",
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");

async function fetchReviews() {
  try {
    const res = await fetch(`${API_URL}/api/reviews`, {
      next: { revalidate: 0 }, // Fetch dynamically to avoid caching issues in dev
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || [];
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const reviews = await fetchReviews();
  const count = reviews.length;
  const rating = count > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / count).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ═══════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            <Star className="text-gold" size={14} fill="currentColor" /> Trust &amp; Transparency
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Customer <span className="text-gold">Reviews</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={28} fill="currentColor" />
              ))}
            </div>
            <div className="text-white text-lg font-bold">
              {rating}/5 Average Rating
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20"></div>
            <div className="text-white/80 font-medium">
              Trusted by 5 Lakh+ businesses
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. REVIEWS GRID
      ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 w-full -mt-32 relative z-20 pb-24">
        <div className="w-full">
          {reviews.length === 0 ? (
            <div className="text-center py-8 md:py-20 text-slate-400 font-medium">
              No reviews found. Check back soon!
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <div 
                  key={r.id} 
                  className="bg-white rounded-none p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 relative group flex flex-col h-full transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50"
                >
                  <Quote className="absolute top-6 right-6 text-slate-100 w-12 h-12 rotate-180 group-hover:text-blue-50 transition-colors" />
                  
                  <div className="flex gap-1 text-amber-400 mb-6 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={i < r.rating ? 0 : 2} />
                    ))}
                  </div>
                  
                  <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-grow relative z-10 italic">
                    &quot;{r.text}&quot;
                  </p>
                  
                  <div className="border-t border-slate-100 pt-6 mt-auto relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-gold font-bold">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {r.name}
                          <CheckCircle size={14} className="text-emerald-500" />
                        </p>
                        {r.service && (
                          <p className="text-xs font-semibold text-gold uppercase tracking-wider mt-0.5">{r.service}</p>
                        )}
                        {r.location && (
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{r.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. CTA SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-8 md:py-16 bg-white border-t border-slate-200/60 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-black text-slate-900 mb-4">Ready to Join 5 Lakh+ Happy Customers?</h2>
          <p className="text-slate-500 font-medium mb-8">Get started with Veagle Space today and experience seamless compliance.</p>
          <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-gold hover:bg-gold-600 rounded-sm shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1">
            Talk to an Expert
          </Link>
        </div>
      </section>
    </div>
  );
}

