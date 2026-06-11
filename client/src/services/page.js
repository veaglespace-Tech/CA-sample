import Link from "next/link";
import { getAllServiceRoutes } from "../lib/navigation-data";
import {
  businessRegistration, taxPayroll, compliances, trademarkIP,
  documentation, othersMenu,
} from "../lib/navigation-data";

export const metadata = {
  title: "All Services",
  description: "Explore all legal, tax, compliance, and business registration services offered by Demo CA.",
};

const serviceCategories = [
  { title: "Business Registration", data: businessRegistration },
  { title: "Trademark & IP", data: trademarkIP },
  { title: "Tax & Payroll", data: taxPayroll },
  { title: "Compliances", data: compliances },
  { title: "Documentation", data: documentation },
  { title: "Others", data: othersMenu },
];

export default function ServicesPage() {
  return (
    <>
      <section className="vs-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">›</span>
            <span>All Services</span>
          </div>
          <h1>All Services</h1>
          <p className="vs-hero-sub">
            Explore our complete range of legal, tax, and business services. Click any service to learn more.
          </p>
        </div>
      </section>

      {serviceCategories.map((cat) => (
        <section key={cat.title} className="vs-section">
          <div className="vs-container">
            <h2 className="vs-section-title">{cat.title}</h2>
            <div className="vs-mega-grid" style={{ paddingTop: "1rem" }}>
              {cat.data.sections.map((section) => (
                <div key={section.title} className="vs-mega-section">
                  <h4 className="vs-mega-title">{section.title}</h4>
                  <div className="vs-mega-links">
                    {section.links.map((link, idx) => (
                      <Link key={`${link.label}-${link.href}-${idx}`} href={link.href} className="vs-mega-link">
                        {link.label}
                        {link.isNew && <span className="vs-new-badge">New</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
