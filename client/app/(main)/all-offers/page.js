import Link from "next/link";

export const metadata = {
  title: "All Offers - Veagle Space",
  description: "Exclusive offers and discounts on legal, tax and compliance services from Veagle Space.",
};

const offers = [
  { title: "Startup Bundle", desc: "Company Registration + GST + Trademark in one package", discount: "30% OFF", tag: "Most Popular", price: "₹9,999" },
  { title: "GST Special", desc: "GST Registration + 1 Year Filing support", discount: "20% OFF", tag: "Limited Time", price: "₹2,999" },
  { title: "Trademark Combo", desc: "Trademark Registration + Search + Watch", discount: "25% OFF", tag: "Best Value", price: "₹5,999" },
  { title: "Annual Compliance Pack", desc: "ROC Filing + Income Tax Return + GST Annual Return", discount: "15% OFF", tag: "Save More", price: "₹7,499" },
  { title: "MSME Registration", desc: "Udyam Registration + MSME Certificate", discount: "FREE", tag: "No Cost", price: "₹999 ₹0" },
  { title: "Virtual CFO", desc: "Monthly bookkeeping + quarterly compliance review", discount: "10% OFF", tag: "New", price: "₹4,999/mo" },
];

export default function AllOffersPage() {
  return (
    <>
      <section className="vs-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link><span className="sep">›</span><span>All Offers</span>
          </div>
          <h1>Special Offers & Deals</h1>
          <p className="vs-hero-sub">Save on legal and compliance services with our exclusive bundles.</p>
        </div>
      </section>
      <section className="vs-section">
        <div className="vs-container">
          <div className="vs-pricing-grid">
            {offers.map((offer) => (
              <div key={offer.title} className="vs-pricing-card" style={{position:"relative"}}>
                <div className="vs-pricing-badge">{offer.tag}</div>
                <h3>{offer.title}</h3>
                <p style={{fontSize:"0.85rem",color:"var(--muted)",margin:"0.5rem 0 1rem"}}>{offer.desc}</p>
                <div className="vs-pricing-price">
                  <span className="vs-pricing-amount">{offer.price}</span>
                </div>
                <div style={{marginTop:"0.5rem",fontSize:"0.85rem",fontWeight:700,color:"var(--green)"}}>🎉 {offer.discount}</div>
                <Link href="/contact" className="vs-btn-cta" style={{marginTop:"1rem",display:"block",textAlign:"center",padding:"0.65rem"}}>
                  Claim Offer →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

