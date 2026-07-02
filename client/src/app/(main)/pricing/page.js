import Link from "next/link";

export const metadata = {
  title: "Pricing & Plans",
  description: "Transparent pricing for all Veagle Space legal, tax, and compliance services.",
};

const plans = [
  {
    name: "Starter",
    price: "₹1,499",
    period: "one-time",
    features: ["Business Registration", "Digital Signature", "PAN & TAN Application", "GST Registration", "Dedicated RM"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "₹4,999",
    period: "per year",
    features: ["Everything in Starter", "Annual Compliance Filing", "Tax Return Filing", "Accounting & Bookkeeping", "Priority Support"],
    cta: "Most Popular",
    highlight: true,
  },
  {
    name: "Business",
    price: "₹9,999",
    period: "per year",
    features: ["Everything in Growth", "Trademark Registration", "Legal Document Drafting", "Virtual CFO Services", "Dedicated Legal Advisor"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            Pricing
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Simple, Transparent <span className="text-gold">Pricing</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your business. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full -mt-32 relative z-20 pb-24">
        <div className="vs-pricing-grid animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {plans.map((plan) => (
              <div key={plan.name} className={`vs-pricing-card ${plan.highlight ? "vs-pricing-highlight" : ""}`}>
                {plan.highlight && <div className="vs-pricing-badge">Most Popular</div>}
                <h3>{plan.name}</h3>
                <div className="vs-pricing-price">
                  <span className="vs-pricing-amount">{plan.price}</span>
                  <span className="vs-pricing-period">/{plan.period}</span>
                </div>
                <ul className="vs-pricing-features">
                  {plan.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <Link href="/contact" className={plan.highlight ? "vs-btn-cta" : "vs-btn-login"} style={{ textAlign: "center", display: "block" }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
      </section>
    </div>
  );
}

