import Link from "next/link";
import { CheckCircle, Globe, Shield, Users } from "lucide-react";
import { featuredServices, democaHighlights } from "../../../lib/public-page-data";
import { siteMeta } from "../../../lib/navigation-data";

export const metadata = {
  title: "About Us - Veagle Space Technology Pvt. Ltd. | Online Business Registration & Legal Services",
  description: "Learn about Veagle Space Technology Pvt. Ltd. Consulting Pvt Ltd, India's premier business consulting platform for online company registration, trademark filing, tax returns, and legal compliance services.",
};

const stats = [
  { value: "10,000+", label: "Satisfied Clients" },
  { value: "4-5", label: "Working Days Startup Registration" },
  { value: "24/7", label: "Quick Support Mindset" },
  { value: "One-stop", label: "Business Setup Support" },
];

const pillars = [
  {
    icon: <Users />,
    title: "Multidisciplinary Team",
    copy: "Our professionals work across manufacturing, construction, pharmaceuticals, renewable energy, textile, automobile, food processing, and more.",
  },
  {
    icon: <Globe />,
    title: "India Entry and Global Support",
    copy: "We support international companies setting up in India and help domestic companies and SMEs prepare for global growth.",
  },
  {
    icon: <Shield />,
    title: "Legal Wings for Growth",
    copy: "From incorporation to licences, filings, IP, and contracts, Veagle Space Technology Pvt. Ltd. keeps the path practical and compliant.",
  },
];

export default function AboutUsPage() {
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
            <Users size={16} /> Who We Are
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Veagle Space Technology Pvt. Ltd.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            We offer legal wings to let your dreams soar higher.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 lg:py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 divide-x divide-slate-100">
            {stats.map((item, i) => (
              <div key={item.label} className="text-center px-4 animate-fade-in-up" style={{ animationDelay: `${200 + i * 100}ms` }}>
                <div className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">{item.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-16 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-3xl font-black text-slate-900 mb-4 tracking-tight">Who We Are</h2>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Veagle Space Technology Pvt. Ltd. is a leading online business registration platform and top CA firm that provides certified legal, tax, and compliance services to new businesses, SMEs, and startups across India. Over time, Veagle Space Technology Pvt. Ltd. has grown into a one-stop solution for companies that want to securely set up business operations and manage ongoing compliance.
                </p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4 tracking-tight">Our Mission</h2>
                <p className="text-slate-600 font-medium leading-relaxed">
                  To simplify access to critical legal advice, tax consultation, online company registration, and compliance services through transparent guidance, highly certified professionals, affordable pricing, and clear timelines.
                </p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-black text-slate-900 mb-4 tracking-tight">Why Choose Us</h2>
                <p className="text-slate-600 font-medium leading-relaxed">
                  We combine expert legal guidance with structured online workflows so founders and business teams can register companies, file GST, manage compliance, and protect their intellectual property without unnecessary confusion.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100">
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-6">Veagle Space Technology Pvt. Ltd. Highlights</h3>
              <div className="space-y-4">
                {democaHighlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 text-primary"><CheckCircle size={20} /></div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="relative py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <article key={pillar.title} className="group flex flex-col h-full p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {pillar.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">{pillar.title}</h2>
                <p className="text-slate-600 font-medium leading-relaxed mt-auto">{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="relative py-16 lg:py-24 bg-slate-50 text-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-white border border-slate-200 shadow-sm px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary mb-4">Popular Services</span>
            <h2 className="font-heading text-3xl md:text-4xl font-black mb-4 text-slate-900">Core Services We Help With</h2>
            <p className="text-slate-600 font-medium text-lg">Popular Veagle Space Technology Pvt. Ltd. services from the live platform, arranged in a cleaner format for faster scanning.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {featuredServices.slice(0, 6).map((service, index) => (
              <Link key={service.title} href={service.href} className="group flex flex-col h-full p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <span className="text-primary text-sm font-black uppercase tracking-widest mb-3 block">Service {String(index + 1).padStart(2, "0")}</span>
                <h2 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">{service.copy}</p>
                <div className="mt-auto pt-2">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-primary-600">
                    Explore service <span className="text-lg leading-none">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-black text-slate-900 mb-4">Start Your Business with Veagle Space Technology Pvt. Ltd.</h2>
          <p className="text-xl text-slate-600 font-medium mb-10">Call {siteMeta.phone} or email {siteMeta.email}. We would be delighted to speak.</p>
          <Link href="/talk-to-expert" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary hover:bg-primary-600 rounded-full shadow-[0_4px_20px_rgb(59,130,246,0.4)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.6)] transition-all duration-300 hover:-translate-y-1">
            Talk to an Expert
          </Link>
        </div>
      </section>
    </div>
  );
}

