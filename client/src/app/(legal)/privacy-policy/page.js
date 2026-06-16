import Link from "next/link";

import { Shield } from "lucide-react";

export const metadata = { title: "Privacy Policy - Veagle Space Technology" };

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative overflow-hidden bg-slate-50 pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-slate-200/60">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-gold/100/5 blur-[120px]" />
          <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-gold text-xs font-black uppercase tracking-widest mb-6 animate-fade-in-up transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <Shield size={16} /> Legal
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Privacy Policy
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Last updated: January 2025
          </p>
        </div>
      </section>

      <section className="relative py-16 lg:py-8 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-4 md:p-12 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">1. Information We Collect</h2>
                <p>We collect personal information such as name, email, phone number, and business details when you register or use our services.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">2. How We Use Your Information</h2>
                <p>Your information is used to provide, maintain, and improve our services, communicate with you, and ensure legal compliance.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">3. Data Security</h2>
                <p>We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">4. Cookies</h2>
                <p>We use cookies and similar technologies to enhance your browsing experience and analyze website traffic.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">5. Contact Us</h2>
                <p>For privacy-related queries, contact us at <a href="mailto:info@veaglespace.com" className="text-gold hover:underline font-bold">info@veaglespace.com</a> or call <span className="font-bold">+91 82379 99101</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
