import Link from "next/link";
import { ArrowRight, Briefcase, FileText, Shield, TrendingUp } from "lucide-react";
import { featuredServices } from "../../../lib/public-page-data";

export const metadata = {
  title: "Products - Veagle Space Technology",
  description: "Explore Veagle Space Technology products and service bundles for business setup, compliance, IP protection, and expert consultation.",
};

const productSuites = [
  {
    icon: <Briefcase />,
    title: "Start a Business",
    copy: "LLP, OPC, company registration, Section 8, producer company, partnership firm, and startup setup support.",
    href: "/company-registration",
  },
  {
    icon: <FileText />,
    title: "Registrations and Licences",
    copy: "DSC, IEC, MSME, ISO, FSSAI, Startup India, labour licences, PF, ESI, and sector-specific registrations.",
    href: "/services",
  },
  {
    icon: <TrendingUp />,
    title: "GST and Income Tax",
    copy: "GST registration, GST return filing, income tax return filing, accounting, and recurring compliance support.",
    href: "/gst-registration",
  },
  {
    icon: <Shield />,
    title: "Trademark and IP",
    copy: "Trademark registration, search, copyright, patent, design registration, and infringement support.",
    href: "/trademark-registration",
  },
];

export default function ProductsPage() {
  return (
    <>
      <section className="vs-page-hero vx-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link><span className="sep">&gt;</span><span>Products</span>
          </div>
          <h1>Veagle Space Technology Products and Service Suites</h1>
          <p className="vs-hero-sub">Structured solutions for starting, managing, and protecting your business.</p>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          <div className="vx-card-grid vx-card-grid-4">
            {productSuites.map((suite) => (
              <Link key={suite.title} href={suite.href} className="vx-info-card vx-link-card">
                <span className="vx-card-icon">{suite.icon}</span>
                <h2>{suite.title}</h2>
                <p>{suite.copy}</p>
                <span>Explore suite <ArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="vs-section vs-section-alt">
        <div className="vs-container">
          <div className="vx-section-head">
            <h2>Popular Products</h2>
            <p>Services frequently chosen by founders, SMEs, exporters, food businesses, and brand owners.</p>
          </div>
          <div className="vx-card-grid">
            {featuredServices.map((service) => (
              <Link key={service.title} href={service.href} className="vx-info-card vx-link-card">
                <h2>{service.title}</h2>
                <p>{service.copy}</p>
                <span>Read more</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

