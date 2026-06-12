import Link from "next/link";
import { Download, Mail, MessageSquare, Radio } from "lucide-react";
import { siteMeta } from "../../../lib/navigation-data";

export const metadata = {
  title: "Media - Valuexpert",
  description: "Media resources, announcements, and brand information for Valuexpert Consulting Pvt Ltd.",
};

const mediaItems = [
  {
    icon: <Radio />,
    title: "Brand Story",
    copy: "Valuexpert helps startups, SMEs, and growing companies simplify legal, tax, registration, and compliance workflows.",
  },
  {
    icon: <MessageSquare />,
    title: "Expert Commentary",
    copy: "For comments on company registration, GST, income tax, licences, trademark, or startup compliance, contact our advisory team.",
  },
  {
    icon: <Download />,
    title: "Media Kit",
    copy: "Use Valuexpert Consulting Pvt Ltd as the official company name and support@yourdomain.com for press coordination.",
  },
];

export default function MediaPage() {
  return (
    <>
      <section className="vs-page-hero vx-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link><span className="sep">&gt;</span><span>Media</span>
          </div>
          <h1>Media and Brand Resources</h1>
          <p className="vs-hero-sub">Information for announcements, collaborations, and expert comments from Valuexpert.</p>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          <div className="vx-card-grid vx-card-grid-3">
            {mediaItems.map((item) => (
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
        <div className="vs-container">
          <div className="vs-refer">
            <div>
              <h2>Press and Media Enquiries</h2>
              <p>Reach us at {siteMeta.email} or call {siteMeta.phone} for media coordination.</p>
            </div>
            <Link href="/contact" className="vs-refer-btn"><Mail /> Contact Team</Link>
          </div>
        </div>
      </section>
    </>
  );
}

