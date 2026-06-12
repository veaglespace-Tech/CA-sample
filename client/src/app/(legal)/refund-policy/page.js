import Link from "next/link";

import { RefreshCcw } from "lucide-react";

export const metadata = {
  title: "Refund Policy - Valuexpert",
  description: "Read Valuexpert's refund policy for legal and compliance services.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative overflow-hidden bg-slate-50 pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-slate-200/60">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px]" />
          <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-primary text-xs font-black uppercase tracking-widest mb-6 animate-fade-in-up">
            <RefreshCcw size={16} /> Legal
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Refund Policy
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Last updated: January 2025
          </p>
        </div>
      </section>

      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100">
            <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">1. General Policy</h2>
                <p>At Valuexpert, we strive to deliver quality services. If you are not satisfied with our services, we offer a refund under the following conditions.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">2. Eligibility for Refund</h2>
                <p>Refunds are applicable if: (a) the service was not initiated within 7 working days of payment, (b) a duplicate payment was made by error, or (c) the service cannot be completed due to reasons attributable to Valuexpert.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">3. Non-Refundable Services</h2>
                <p>Government fees, stamp duty, and third-party charges paid on your behalf are non-refundable. Services where work has been initiated (e.g., documents prepared, applications filed) may not be eligible for full refunds.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">4. How to Request a Refund</h2>
                <p>Email us at <a href="mailto:support@yourdomain.com" className="text-primary hover:underline font-bold">support@yourdomain.com</a> with your order ID and reason for refund. Our team will review and respond within 3-5 business days.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">5. Refund Timeline</h2>
                <p>Approved refunds will be credited to the original payment method within 7-10 business days.</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">6. Contact Us</h2>
                <p>For refund queries: <a href="mailto:support@yourdomain.com" className="text-primary hover:underline font-bold">support@yourdomain.com</a> or call <span className="font-bold">+91 00000 00000</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
