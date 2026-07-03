import Link from "next/link";

export const metadata = {
  title: "Sitemap - Veagle Space",
  description: "Complete sitemap of all pages on Veagle Space - legal, tax and compliance services.",
};

const sections = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Reviews", href: "/reviews" },
      { label: "All Offers", href: "/all-offers" },
      { label: "Refer & Earn", href: "/refer-and-earn" },
    ],
  },
  {
    title: "Business Registration",
    links: [
      { label: "Private Limited Company Registration", href: "/private-limited-company" },
      { label: "Limited Liability Partnership (LLP)", href: "/llp-registration" },
      { label: "One Person Company (OPC) Registration", href: "/one-person-company" },
      { label: "Sole Proprietorship Registration", href: "/sole-proprietorship" },
      { label: "Partnership Firm Registration", href: "/partnership-firm" },
      { label: "Nidhi Company Registration", href: "/nidhi-company" },
    ],
  },
  {
    title: "Tax & Compliance",
    links: [
      { label: "GST Registration", href: "/gst-registration" },
      { label: "GST Filing", href: "/gst-return-filing" },
      { label: "Income Tax Return", href: "/income-tax-return-filing" },
      { label: "TDS Return", href: "/tds-return-filing" },
      { label: "ESI Registration", href: "/esi-registration" },
      { label: "PF Registration", href: "/provident-fund-registration-pf" },
    ],
  },
  {
    title: "Trademark & IP",
    links: [
      { label: "Trademark Registration", href: "/trademark-registration" },
      { label: "Trademark Renewal", href: "/trademark-renewal" },
      { label: "Copyright Registration", href: "/copyright-registration" },
      { label: "Patent Registration", href: "/patent-registration" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Resources & Articles", href: "/resources" },
      { label: "Tools & Calculators", href: "/tools" },
      { label: "FAQ", href: "/faq" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <section className="vs-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">&rsaquo;</span>
            <span>Sitemap</span>
          </div>
          <h1>Sitemap</h1>
          <p className="vs-hero-sub">All pages and services on Veagle Space.</p>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          <div className="vs-sitemap-grid">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="vs-sitemap-title">{section.title}</h3>
                <ul className="vs-sitemap-list">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="vs-sitemap-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

