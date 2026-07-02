"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import LeadForm from "../../../components/forms/LeadForm";
import { siteMeta } from "../../../lib/navigation-data";

const contactCards = [
  { 
    icon: <Phone size={20} className="text-gold" />, 
    title: "Call Us (Primary)", 
    value: siteMeta.phone, 
    note: "Monday to Saturday, 10 AM to 7 PM",
    href: `tel:${siteMeta.phone.replace(/[^0-9+]/g, '')}`
  },
  { 
    icon: <Phone size={20} className="text-gold" />, 
    title: "Call Us (Secondary)", 
    value: "+91 85306 00577", 
    note: "Monday to Saturday, 10 AM to 7 PM",
    href: "tel:+918530600577"
  },
  { 
    icon: <Mail size={20} className="text-gold" />, 
    title: "Email Us", 
    value: siteMeta.email, 
    note: "Send your requirement and our team will respond shortly.",
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${siteMeta.email}`
  },
  { 
    icon: <MapPin size={20} className="text-gold" />, 
    title: "Office", 
    value: siteMeta.companyName, 
    note: "Business consulting and online service support across India.",
    href: "https://www.google.com/maps/place/Veagle Space Technology Pvt. Ltd.+Consulting+LLP/@18.6101637,73.8176721,17z/data=!3m1!4b1!4m6!3m5!1s0x3bdd170bbb3afd21:0x36357b73a2636f91!8m2!3d18.6101586!4d73.820247!16s%2Fg%2F11pc9jtm0x?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
  },
  { 
    icon: <Clock size={20} className="text-gold" />, 
    title: "Response Window", 
    value: "Quick callback", 
    note: "Share your details and preferred time for a practical next step.",
    href: "#contact-form-panel"
  },
];

export default function ContactContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            <Mail size={14} /> Contact Support
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Get in Touch with <br className="sm:hidden" /><span className="text-gold">Veagle Space Technology Pvt. Ltd.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Need help with online company registration, tax filing, or legal compliance? Send us an email or call between 10 AM and 7 PM. We are here to help.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full -mt-32 relative z-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
              <div id="contact-form-panel" className="relative scroll-mt-32 w-full">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-blue-300/40 via-indigo-300/40 to-violet-300/40 blur-2xl opacity-60 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                <div className="relative rounded-[2rem] bg-white p-6 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] ring-1 ring-slate-200/50 lg:p-12">
                  <div className="mb-8">
                    <span className="inline-block rounded-full bg-gold/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-gold mb-4">Expert callback</span>
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
                    <div className="flex shrink-0 h-14 w-14 items-center justify-center rounded-none bg-slate-50 text-slate-600 group-hover:bg-gold group-hover:text-white transition-colors duration-300 shadow-sm">
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-1 group-hover:text-gold/70 transition-colors">{card.title}</h4>
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
                      className="group flex items-start gap-5 p-6 rounded-none bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
                    className="group flex items-start gap-5 p-6 rounded-none bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
