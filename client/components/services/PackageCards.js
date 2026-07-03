import { Check } from "lucide-react";

export default function PackageCards({ service, plans, onSelectPlan }) {
  if (!plans || plans.length === 0) return null;

  return (
    <section id="packages" className="mb-12">
      <div className="bg-white rounded-none p-8 md:p-4 md:p-12 border border-slate-200 shadow-sm hover:shadow-md transition-shadow transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-2">
          Choose The Best {service.shortTitle} Package
        </h2>
        <p className="text-slate-600 text-center mb-10 font-medium">
          Transparent pricing. No hidden fees.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-y-0">
          {plans.map((pack) => {
            const isHighlight = pack.isHighlighted || pack.highlighted;
            
            return (
              <article 
                key={pack.name} 
                onClick={() => {
                  if (onSelectPlan) onSelectPlan(pack);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`group relative flex flex-col md:grid md:grid-rows-subgrid md:row-span-7 h-full rounded-none p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${
                  isHighlight 
                    ? "bg-slate-50 border-2 border-gold shadow-lg shadow-gold/10 scale-100 md:scale-105 z-10" 
                    : "bg-slate-50 border border-slate-200"
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest shadow-md whitespace-nowrap">
                    Recommended Plan
                  </div>
                )}
                
                <h3 className={`text-xl font-black text-center mb-2 mt-2 ${isHighlight ? "text-slate-900" : "text-slate-700"}`}>
                  {pack.name}
                </h3>
                <p className="text-slate-500 text-sm text-center mb-6 min-h-[40px] flex items-start justify-center">
                  {pack.description || pack.desc}
                </p>

                <div className="flex justify-center items-center gap-3 mb-2">
                  {pack.oldPrice && (
                    <span className="text-slate-400 line-through text-sm font-semibold">{pack.oldPrice}</span>
                  )}
                  {pack.tag && (
                    <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-none text-xs font-bold">
                      {pack.tag}
                    </span>
                  )}
                </div>

                <div className="flex justify-center items-baseline gap-1 mb-1">
                  <span className={`text-[2rem] font-black tracking-tight leading-none ${isHighlight ? "text-gold" : "text-slate-900"}`}>
                    {pack.price}
                  </span>
                </div>
                
                <div className="text-slate-400 text-center text-xs font-medium mb-8">
                  {service.govtFees}
                </div>

                <button 
                  type="button" 
                  className={`w-full py-3.5 rounded-none font-bold mb-8 transition-all duration-300 pointer-events-none ${
                    isHighlight 
                      ? "bg-gold text-white shadow-md hover:shadow-lg group-hover:-translate-y-0.5" 
                      : "bg-navy text-white shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5"
                  }`}
                >
                  Buy Now
                </button>

                <ul className="space-y-4 md:mt-0 mt-auto border-t border-slate-200 pt-6">
                  {(pack.features || pack.items).map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <div className={`mt-0.5 w-5 h-5 rounded-none flex items-center justify-center shrink-0 ${isHighlight ? "bg-gold/20 text-gold" : "bg-slate-100 text-slate-500"}`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
