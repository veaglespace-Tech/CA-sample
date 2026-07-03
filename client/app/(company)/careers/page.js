import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle } from "lucide-react";
import { siteMeta } from "../../../lib/navigation-data";

export const metadata = {
  title: "Careers - Veagle Space Technology Pvt. Ltd.",
  description: "Join Veagle Space Technology Pvt. Ltd. Consulting Pvt Ltd and help businesses simplify legal, tax, registration, and compliance work.",
};

const openings = [
  { title: "Business Advisor", dept: "Client Advisory", type: "Full-time", location: "Hybrid / Remote" },
  { title: "Legal Consultant", dept: "Legal", type: "Full-time", location: "Hybrid / Remote" },
  { title: "Chartered Accountant", dept: "Tax and Compliance", type: "Full-time", location: "Hybrid / Remote" },
  { title: "Company Secretary", dept: "Corporate Compliance", type: "Full-time", location: "Hybrid / Remote" },
  { title: "Trademark Consultant", dept: "IP Services", type: "Full-time", location: "Hybrid / Remote" },
  { title: "Client Success Executive", dept: "Operations", type: "Full-time", location: "Hybrid / Remote" },
];

const culture = [
  "Clear communication with clients and internal teams",
  "Practical problem solving for startups and SMEs",
  "Deadline-first approach to compliance work",
  "Transparent advice with affordable professional service",
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            <Briefcase size={14} /> Careers
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Careers at <span className="text-gold">Veagle Space</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Build the future of business consulting with a team focused on legal, tax, registration, and compliance services.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full -mt-32 relative z-20 pb-24">
        <div className="bg-white p-8 md:p-12 shadow-xl rounded-none border border-slate-100 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="vx-static-grid">
          <div>
            <span className="vx-eyebrow">Open roles</span>
            <h2 className="vs-section-title">Work Where Businesses Get Built</h2>
            <p className="vx-muted">We work with founders, SMEs, and growing companies that need clear advice, clean documentation, and reliable execution.</p>
          </div>
          <div className="vx-feature-list">
            {culture.map((item) => (
              <div className="vx-feature-item" key={item}>
                <CheckCircle />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

      <section className="vs-section vs-section-alt">
        <div className="vs-container">
          <div className="vx-card-grid">
            {openings.map((job) => (
              <article key={job.title} className="vx-info-card vx-job-card">
                <span className="vx-card-icon"><Briefcase /></span>
                <h2>{job.title}</h2>
                <p>{job.dept}</p>
                <p>{job.type} | {job.location}</p>
                <Link href="/contact">Apply Now <ArrowRight /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          <div className="vs-refer">
            <div>
              <h2>Do Not See Your Role?</h2>
              <p>Send your profile to {siteMeta.email}. We keep strong profiles for upcoming advisory, legal, tax, and operations roles.</p>
            </div>
            <Link href="/contact" className="vs-refer-btn">Send Profile</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

