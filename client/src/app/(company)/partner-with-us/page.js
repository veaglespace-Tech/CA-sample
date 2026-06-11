import Link from "next/link";
import { CheckCircle, Link2, Layers, Users } from "lucide-react";

export const metadata = {
  title: "Partner With Us - Veagle Space Technology Pvt. Ltd.",
  description: "Partner with Veagle Space Technology Pvt. Ltd. Consulting Pvt Ltd to support businesses with legal, tax, compliance, registration, and advisory services.",
};

const partnerTypes = [
  {
    icon: <Users />,
    title: "Professional Partners",
    copy: "Lawyers, CAs, CS professionals, tax consultants, and IP specialists can collaborate on verified client requirements.",
  },
  {
    icon: <Layers />,
    title: "Business Partners",
    copy: "Agencies, startup communities, incubators, and local business networks can refer clients and build service depth.",
  },
  {
    icon: <Link2 />,
    title: "Service Partners",
    copy: "Operational partners can support documentation, coordination, customer success, and fulfilment workflows.",
  },
];

const expectations = [
  "Transparent client communication",
  "Documented service timelines",
  "Professional and ethical advisory",
  "Deadline-focused execution",
  "Simple reporting and follow-up",
];

export default function PartnerWithUsPage() {
  return (
    <>
      <section className="vs-page-hero vx-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link><span className="sep">&gt;</span><span>Partner With Us</span>
          </div>
          <h1>Partner With Veagle Space Technology Pvt. Ltd.</h1>
          <p className="vs-hero-sub">Collaborate with a business consulting platform focused on registration, legal, tax, compliance, and IP services.</p>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          <div className="vx-card-grid vx-card-grid-3">
            {partnerTypes.map((item) => (
              <article key={item.title} className="vx-info-card">
                <span className="vx-card-icon">{item.icon}</span>
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vs-section vs-section-alt">
        <div className="vs-container vx-static-grid">
          <div>
            <span className="vx-eyebrow">Partner standards</span>
            <h2 className="vs-section-title">How We Work Together</h2>
            <p className="vx-muted">Veagle Space Technology Pvt. Ltd. partners should help clients make confident decisions with clear documents, predictable timelines, and professional communication.</p>
          </div>
          <div className="vx-feature-list">
            {expectations.map((item) => (
              <div className="vx-feature-item" key={item}>
                <CheckCircle />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          <div className="vs-refer">
            <div>
              <h2>Interested in Partnering?</h2>
              <p>Share your profile, city, practice area, and collaboration idea with the Veagle Space Technology Pvt. Ltd. team.</p>
            </div>
            <Link href="/contact" className="vs-refer-btn">Submit Partner Interest</Link>
          </div>
        </div>
      </section>
    </>
  );
}

