"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
  { q: "How long does company registration take?", a: "Typically 7-10 working days depending on the type of entity and document readiness. Our team ensures the fastest possible processing." },
  { q: "What documents are needed for GST registration?", a: "PAN card, Aadhaar card, business address proof, bank account details, and photographs. Our experts will guide you through the complete checklist." },
  { q: "Do you provide post-registration compliance support?", a: "Yes, we offer comprehensive annual compliance packages including ROC filings, tax returns, and statutory audits." },
  { q: "Can I get online consultation with a lawyer?", a: "Absolutely. We offer online lawyer consultations across 15+ specializations including corporate, IP, family, and criminal law." },
  { q: "How does trademark registration work?", a: "We conduct a trademark search, file your application, respond to any objections, and support you through to registration. The process takes 6-8 months." },
  { q: "What is the cost of private limited company registration?", a: "Starting from ₹1,499 including government fees. The exact cost depends on authorized capital and number of directors." },
  { q: "Do you handle international business incorporation?", a: "Yes, we support company formation in the US, UK, Singapore, Netherlands, Hong Kong, and Dubai." },
  { q: "How do I cancel or modify my GST registration?", a: "Our GST experts handle cancellation, revocation, and amendment of GST registrations. Contact us for a free consultation." },
];

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      <section className="relative overflow-hidden bg-slate-50 pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-slate-200/60">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px]" />
          <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-primary text-xs font-black uppercase tracking-widest mb-6 animate-fade-in-up">
            <MessageCircleQuestion size={16} /> Help Center
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Frequently Asked Questions
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Find quick answers to the most common questions about our services.
          </p>
        </div>
      </section>

      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openIdx === idx ? "border-primary shadow-[0_8px_30px_rgb(59,130,246,0.1)]" : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"}`}
              >
                <button 
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none" 
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                >
                  <span className={`font-heading text-lg font-bold pr-4 transition-colors ${openIdx === idx ? "text-primary" : "text-slate-900"}`}>{faq.q}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIdx === idx ? "bg-primary/10 text-primary rotate-180" : "bg-slate-100 text-slate-500"}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIdx === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="p-6 pt-0 text-slate-600 font-medium leading-relaxed border-t border-slate-50 mt-2">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-slate-600 font-medium mb-6">Still have questions?</p>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary hover:bg-primary-600 rounded-full shadow-[0_4px_20px_rgb(59,130,246,0.4)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.6)] transition-all duration-300 hover:-translate-y-1">
              Contact our Support Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

