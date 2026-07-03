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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            <Link2 size={14} /> Partner With Us
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Partner With <span className="text-gold">Veagle Space</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Collaborate with a business consulting platform focused on registration, legal, tax, compliance, and IP services.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full -mt-32 relative z-20 pb-24">
        <div className="bg-white p-8 md:p-12 shadow-xl rounded-none border border-slate-100 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
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
    </div>
  );
}

