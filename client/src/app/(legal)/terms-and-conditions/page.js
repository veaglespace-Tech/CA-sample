import Link from "next/link";

import { FileText } from "lucide-react";

export const metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            <FileText size={14} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Terms and Conditions
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
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">1. Introduction</h2>
                <p>By accessing and using Veagle Space, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">2. Services</h2>
                <p>Veagle Space is a facilitating platform enabling access to reliable legal and compliance professionals. We are not a law firm and do not provide legal services ourselves.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">3. User Obligations</h2>
                <p>Users are responsible for providing accurate information and maintaining the confidentiality of their account credentials.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">4. Payment Terms</h2>
                <p>All fees are quoted in Indian Rupees and are subject to applicable taxes. Payment is due at the time of service initiation.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">5. Limitation of Liability</h2>
                <p>The information on this website is for knowledge purposes only and should not be relied upon as legal advice or opinion.</p>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
}

