import Link from "next/link";

import { RefreshCcw } from "lucide-react";

export const metadata = {
  title: "Refund Policy - Veagle Space Technology",
  description: "Read Veagle Space Technology's refund policy for legal and compliance services.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            <RefreshCcw size={14} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Refund Policy
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
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">1. General Policy</h2>
                <p>At Veagle Space Technology, we strive to deliver quality services. If you are not satisfied with our services, we offer a refund under the following conditions.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">2. Eligibility for Refund</h2>
                <p>Refunds are applicable if: (a) the service was not initiated within 7 working days of payment, (b) a duplicate payment was made by error, or (c) the service cannot be completed due to reasons attributable to Veagle Space Technology.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">3. Non-Refundable Services</h2>
                <p>Government fees, stamp duty, and third-party charges paid on your behalf are non-refundable. Services where work has been initiated (e.g., documents prepared, applications filed) may not be eligible for full refunds.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">4. How to Request a Refund</h2>
                <p>Email us at <a href="mailto:info@veaglespace.com" className="text-gold hover:underline font-bold">info@veaglespace.com</a> with your order ID and reason for refund. Our team will review and respond within 3-5 business days.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">5. Refund Timeline</h2>
                <p>Approved refunds will be credited to the original payment method within 7-10 business days.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">6. Contact Us</h2>
                <p>For refund queries: <a href="mailto:info@veaglespace.com" className="text-gold hover:underline font-bold">info@veaglespace.com</a> or call <span className="font-bold">+91 82379 99101</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
