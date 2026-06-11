import { Check } from "lucide-react";

export default function PackageCards({ service, plans, onSelectPlan }) {
  return (
    <section id="packages" className="mb-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-2xl md:text-3xl font-black text-[#061A34] text-center mb-2">
          Choose The Best {service.shortTitle} Package
        </h2>
        <p className="text-slate-500 text-center mb-10 font-medium">
          Transparent pricing. No hidden fees.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((pack) => {
            const isHighlight = pack.isHighlighted || pack.highlighted;
            
            return (
              <article 
                key={pack.name} 
                onClick={() => {
                  if (onSelectPlan) onSelectPlan(pack);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`relative flex flex-col h-full rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${
                  isHighlight 
                    ? "bg-white border-2 border-orange-400 shadow-lg shadow-orange-500/10 scale-100 md:scale-105 z-10" 
                    : "bg-slate-50 border border-slate-100"
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md whitespace-nowrap">
                    Recommended Plan
                  </div>
                )}
                
                <h3 className={`text-xl font-black text-center mb-2 mt-2 ${isHighlight ? "text-[#061A34]" : "text-slate-700"}`}>
                  {pack.name}
                </h3>
                <p className="text-slate-500 text-sm text-center mb-6 min-h-[40px]">
                  {pack.description || pack.desc}
                </p>

                <div className="flex justify-center items-center gap-3 mb-2">
                  {pack.oldPrice && (
                    <span className="text-slate-400 line-through text-sm font-semibold">{pack.oldPrice}</span>
                  )}
                  {pack.tag && (
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">
                      {pack.tag}
                    </span>
                  )}
                </div>

                <div className="flex justify-center items-baseline gap-1 mb-1">
                  <span className={`text-[2rem] font-black tracking-tight leading-none ${isHighlight ? "text-primary" : "text-slate-800"}`}>
                    {pack.price}
                  </span>
                </div>
                
                <div className="text-slate-400 text-center text-xs font-medium mb-8">
                  {service.govtFees}
                </div>

                <button 
                  type="button" 
                  className={`w-full py-3.5 rounded-xl font-bold mb-8 transition-all duration-300 pointer-events-none ${
                    isHighlight 
                      ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5" 
                      : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md"
                  }`}
                >
                  Buy Now
                </button>

                <ul className="space-y-4 mt-auto border-t border-slate-100 pt-6">
                  {(pack.features || pack.items).map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isHighlight ? "bg-orange-100 text-orange-500" : "bg-blue-100 text-primary"}`}>
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
