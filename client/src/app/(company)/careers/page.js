import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle } from "lucide-react";
import { siteMeta } from "../../../lib/navigation-data";

export const metadata = {
  title: "Careers - Valuexpert",
  description: "Join Valuexpert Consulting Pvt Ltd and help businesses simplify legal, tax, registration, and compliance work.",
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
    <>
      <section className="vs-page-hero vx-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link><span className="sep">&gt;</span><span>Careers</span>
          </div>
          <h1>Careers at Valuexpert</h1>
          <p className="vs-hero-sub">Build the future of business consulting with a team focused on legal, tax, registration, and compliance services.</p>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container vx-static-grid">
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
    </>
  );
}

