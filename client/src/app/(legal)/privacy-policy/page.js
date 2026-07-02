import Link from "next/link";

import { Shield } from "lucide-react";

export const metadata = { title: "Privacy Policy - Veagle Space Technology" };

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            <Shield size={14} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Last updated: January 2025
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 w-full -mt-32 relative z-20 pb-24">
        <div className="bg-white p-8 md:p-12 shadow-xl rounded-none border border-slate-100 hover:border-gold/30 transition-colors animate-fade-in-up" style={{ animationDelay: '100ms' }}>
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
      </section>
    </div>
  );
}
