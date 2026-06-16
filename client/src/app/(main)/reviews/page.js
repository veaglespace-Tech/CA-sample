import Link from "next/link";
import { Star, Quote, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Customer Reviews - Demo CA",
  description: "Read real reviews from 5 lakh+ customers who used Demo CA for company registration, GST, trademark and more.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

async function fetchReviews() {
  try {
    const res = await fetch(`${API_URL}/api/reviews?general=true`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
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

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* ═══════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative flex flex-col justify-center overflow-hidden bg-white z-20 px-4 py-20 lg:py-8 md:py-28 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-gold/100/10 blur-[120px]" />
          <div className="absolute bottom-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border-slate-200 border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <Star className="text-amber-400" size={16} fill="currentColor" /> Trust &amp; Transparency
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Reviews</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={28} fill="currentColor" />
              ))}
            </div>
            <div className="text-slate-900 text-lg font-bold">
              4.8/5 Average Rating
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20"></div>
            <div className="text-slate-600 font-medium">
              Trusted by 5 Lakh+ businesses
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. REVIEWS GRID
      ═══════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-8 md:py-24 -mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <p className="text-slate-500 font-medium mb-8">Get started with Demo CA today and experience seamless compliance.</p>
          <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-gold hover:bg-gold-600 rounded-sm shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1">
            Talk to an Expert
          </Link>
        </div>
      </section>
    </div>
  );
}
