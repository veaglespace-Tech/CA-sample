"use client";

import Link from "next/link";
import { Gift, MessageCircle, Share2, UserCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../../../store/api/authApi";

const steps = [
  { icon: <Share2 />, title: "Share a Requirement", desc: "Refer a founder, business owner, or professional who needs registration, compliance, tax, IP, or documentation help." },
  { icon: <UserCheck />, title: "We Guide the Client", desc: "The Your Company Name team connects, confirms the requirement, explains documents, and shares the next steps." },
  { icon: <Gift />, title: "Earn After Success", desc: "Rewards are processed after the referred client completes an eligible paid service." },
];

export default function ReferEarnPage() {
  const token = useSelector((state) => state.auth?.token);
  const { data: meData } = useGetMeQuery(undefined, { skip: !token });
  const user = meData?.user || null;
  const myRefCode = user?.referralCode || `VX-${user?.name?.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "") || "USER"}-${user?.id?.slice(-4).toUpperCase() || "ABCD"}`;

  return (
    <>
      <section className="vs-page-hero vx-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link><span className="sep">&gt;</span><span>Refer and Earn</span>
          </div>
          <h1>Refer and Earn with Your Company Name</h1>
          <p className="vs-hero-sub">Help another business get reliable professional support and earn when the referral becomes a successful client.</p>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          <div className="vx-card-grid vx-card-grid-3">
            {steps.map((step) => (
              <article key={step.title} className="vx-info-card">
                <span className="vx-card-icon">{step.icon}</span>
                <h2>{step.title}</h2>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vs-section vs-section-alt">
        <div className="vs-container vx-static-grid">
          <div className="vs-page-content">
            <h2>Best Referrals for Your Company Name</h2>
            <p>Refer startups, SMEs, brand owners, food businesses, exporters, NGOs, and companies that need professional help with registrations, licences, GST, income tax, trademark, compliance, or legal documents.</p>
            <h2>Reward Terms</h2>
            <p>Referral rewards are confirmed after the referred person successfully completes an eligible paid service. Your Company Name may update the referral program based on service category, campaign, and operational rules.</p>
          </div>
          <div className="vx-feature-list">
            {["Company Registration", "GST and Income Tax", "Trademark Registration", "FSSAI and Licences", "Annual Compliance", "Legal Documents"].map((item) => (
              <div className="vx-feature-item" key={item}>
                <MessageCircle />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          {user ? (
            <div className="vs-refer" style={{
              flexDirection: "column",
              alignItems: "stretch",
              background: "linear-gradient(135deg, #012b5d 0%, #024b94 100%)",
              color: "white",
              padding: "40px",
              borderRadius: "32px",
              boxShadow: "0 20px 40px rgba(1, 43, 93, 0.15)",
              gap: "24px"
            }}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <h2 style={{ color: "white", fontSize: "2rem", fontWeight: 900 }}>Your Referral Console</h2>
                <p style={{ opacity: 0.8, fontSize: "1rem", marginTop: "4px" }}>
                  Share your link with your network to earn rewards.
                </p>
              </div>

              <div style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                padding: "20px 32px",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                gap: "16px"
              }}>
                <div>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.1em", opacity: 0.6, display: "block", marginBottom: "4px" }}>
                    Your Referral Code
                  </span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "0.05em" }}>
                    {myRefCode}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(myRefCode);
                    toast.success("Referral code copied successfully!");
                  }}
                  className="vs-refer-btn"
                  style={{
                    background: "white",
                    color: "#012b5d",
                    padding: "12px 24px",
                    fontWeight: 950,
                    borderRadius: "16px"
                  }}
                >
                  Copy Code
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginTop: "8px" }}>
                <button
                  onClick={() => {
                    const registerLink = `${window.location.origin}/register/user?ref=${myRefCode}`;
                    const text = `Hey! I highly recommend Your Company Name for Company Registration, Tax, and Compliance. Use my link to sign up: ${registerLink}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  style={{
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "16px",
                    borderRadius: "20px",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  💬 WhatsApp Link
                </button>

                <button
                  onClick={() => {
                    const registerLink = `${window.location.origin}/register/user?ref=${myRefCode}`;
                    const subject = encodeURIComponent("Business Professional Support - Your Company Name");
                    const body = encodeURIComponent(
                      `Hey,\n\nI highly recommend Your Company Name for Company Registration, Trademark filing, GST, Income Tax, and all professional business licences.\n\nUse my direct link to sign up and get started: ${registerLink}\n\nBest regards!`
                    );
                    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank");
                  }}
                  style={{
                    background: "#0ea5e9",
                    color: "white",
                    border: "none",
                    padding: "16px",
                    borderRadius: "20px",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  ✉️ Email Link
                </button>

                <button
                  onClick={() => {
                    const registerLink = `${window.location.origin}/register/user?ref=${myRefCode}`;
                    navigator.clipboard.writeText(registerLink);
                    toast.success("Referral registration link copied successfully!");
                  }}
                  style={{
                    background: "white",
                    color: "#012b5d",
                    border: "none",
                    padding: "16px",
                    borderRadius: "20px",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  🔗 Copy Link
                </button>
              </div>
            </div>
          ) : (
            <div className="vs-refer" style={{ padding: "40px", borderRadius: "32px", background: "linear-gradient(135deg, #012b5d 0%, #024b94 100%)", color: "white" }}>
              <div>
                <h2 style={{ color: "white", fontSize: "1.8rem", fontWeight: 900 }}>Get Your Referral Link</h2>
                <p style={{ opacity: 0.8, fontSize: "0.95rem", marginTop: "4px" }}>
                  Sign in or register a free account to generate your custom referral code and direct sharing link.
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link href="/register/user" className="vs-refer-btn" style={{ background: "white", color: "#012b5d", fontWeight: 950 }}>
                  Register Now
                </Link>
                <Link href="/login" className="vs-refer-btn" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", fontWeight: 950 }}>
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

