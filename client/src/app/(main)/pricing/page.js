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
    <>
      <section className="vs-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">›</span>
            <span>Pricing</span>
          </div>
          <h1>Simple, Transparent Pricing</h1>
          <p className="vs-hero-sub">
            Choose the plan that fits your business. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          <div className="vs-pricing-grid">
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
        </div>
      </section>
    </>
  );
}

