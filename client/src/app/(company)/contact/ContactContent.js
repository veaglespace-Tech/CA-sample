"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import LeadForm from "../../../components/forms/LeadForm";
import { siteMeta } from "../../../lib/navigation-data";

const contactCards = [
  { 
    icon: <Phone size={20} className="text-primary" />, 
    title: "Call Us", 
    value: siteMeta.phone, 
    note: "Monday to Saturday, 10 AM to 7 PM",
    href: `tel:${siteMeta.phone.replace(/[^0-9+]/g, '')}`
  },
  { 
    icon: <Mail size={20} className="text-primary" />, 
    title: "Email Us", 
    value: siteMeta.email, 
    note: "Send your requirement and our team will respond shortly.",
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${siteMeta.email}`
  },
  { 
    icon: <MapPin size={20} className="text-primary" />, 
    title: "Office", 
    value: siteMeta.companyName, 
    note: "Business consulting and online service support across India.",
    href: "https://www.google.com/maps/place/Valuexpert+Consulting+LLP/@18.6101637,73.8176721,17z/data=!3m1!4b1!4m6!3m5!1s0x3bdd170bbb3afd21:0x36357b73a2636f91!8m2!3d18.6101586!4d73.820247!16s%2Fg%2F11pc9jtm0x?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
  },
  { 
    icon: <Clock size={20} className="text-primary" />, 
    title: "Response Window", 
    value: "Quick callback", 
    note: "Share your details and preferred time for a practical next step.",
    href: "#contact-form-panel"
  },
];

export default function ContactContent() {
  return (
    <div className="bg-white min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-slate-200/60">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px]" />
          <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-primary text-xs font-black uppercase tracking-widest mb-6 animate-fade-in-up">
            <Mail size={16} /> Contact Support
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Get in Touch with <br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Valuexpert</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Need help with online company registration, tax filing, or legal compliance? Send us an email or call between 10 AM and 7 PM. We are here to help.
          </p>
        </div>
      </section>

      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
              <div id="contact-form-panel" className="relative scroll-mt-32 w-full">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-blue-300/40 via-indigo-300/40 to-violet-300/40 blur-2xl opacity-60 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                <div className="relative rounded-[2rem] bg-white p-6 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] ring-1 ring-slate-200/50 lg:p-12">
                  <div className="mb-8">
                    <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary mb-4">Expert callback</span>
                    <h2 className="font-heading text-3xl font-black text-slate-900 sm:text-4xl mb-4 tracking-tight">Tell Us What You Need</h2>
                    <p className="text-[0.95rem] font-medium leading-relaxed text-slate-500">Online company registration, GST filing, ITR tax return, trademark registration, FSSAI licences, or legal compliance support - share your requirement and our CA/legal team will guide you.</p>
                  </div>
                  <LeadForm endpoint="/api/contact" mode="contact" submitLabel="Submit Request" />
                </div>
              </div>
            </div>

            {/* Right Column: Contact Cards */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5 order-1 lg:order-2">
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2 px-2">Direct Contact</h3>
              {contactCards.map((card, i) => {
                const isExternal = card.href.startsWith("http");
                const isScroll = card.href.startsWith("#");

                const cardContent = (
                  <>
                    <div className="flex shrink-0 h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-1 group-hover:text-primary/70 transition-colors">{card.title}</h4>
                      <p className="text-lg font-bold text-slate-900 mb-2">{card.value}</p>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">{card.note}</p>
                    </div>
                  </>
                );

                if (isScroll) {
                  return (
                    <a
                      key={card.title}
                      href={card.href}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById("contact-form-panel");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                          const firstInput = element.querySelector("input");
                          if (firstInput) firstInput.focus();
                        }
                      }}
                      className="group flex items-start gap-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {cardContent}
                  </a>
                );
              })}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
