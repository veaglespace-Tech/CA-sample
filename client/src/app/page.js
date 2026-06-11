                                                                                                                                                           import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  Phone,
  Search,
  Shield,
  Star,
  Zap,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import HomeSearch from "../components/ui/HomeSearch";
import ExpandableServiceList from "../components/ui/ExpandableServiceList";
import LeadForm from "../components/forms/LeadForm";
import ReviewBadge from "../components/common/ReviewBadge";
import { sectionIcons, democaAssets } from "../lib/navigation-data";

const localAssets = {
  start: "/yourcompany-assets/hero-start.svg",
  manage: "/yourcompany-assets/hero-manage.svg",
  protect: "/yourcompany-assets/hero-protect.svg",
  growthStart: "/yourcompany-assets/growth-start.svg",
  growthManage: "/yourcompany-assets/growth-manage.svg",
  growthProtect: "/yourcompany-assets/growth-protect.svg",
  heroIllustration: "/yourcompany-assets/hero-illustration.png",
  ctaConsultation: "/yourcompany-assets/cta-consultation.png",
  journeyStart: "/yourcompany-assets/journey-start.png",
  journeyManage: "/yourcompany-assets/journey-manage.png",
  journeyProtect: "/yourcompany-assets/journey-protect.png",
  teamIllustration: "/yourcompany-assets/team-illustration.png",
};

const heroQuickLinks = [
  { label: "Trademark Registration", href: "/trademark-registration" },
  { label: "GST Registration", href: "/gst-registration" },
  { label: "Company Registration", href: "/company-registration" },
  { label: "Lawyer Consultation", href: "/talk-to-a-lawyer" },
];

const journeyCards = [
  {
    title: "Start Your Business",
    href: "/company-registration",
    desc: "Incorporation, licences, DSC, MSME, FSSAI, startup registration and first compliance steps.",
    image: localAssets.start,
    tone: "start",
    gradient: "from-indigo-600 to-indigo-400",
    bg: "bg-indigo-500",
    shadow: "shadow-indigo-500/25 hover:shadow-indigo-500/50",
    glow: "group-hover:shadow-[0_0_60px_-10px_rgba(79,70,229,0.6)]",
    glowColor: "rgba(79,70,229,0.15)",
    borderGlow: "hover:border-indigo-300/40",
  },
  {
    title: "Manage Your Business",
    href: "/gst-registration",
    desc: "GST, accounting, annual filings, labour compliance, tax returns and document reminders.",
    image: localAssets.manage,
    tone: "manage",
    gradient: "from-teal-600 to-teal-400",
    bg: "bg-teal-500",
    shadow: "shadow-teal-500/25 hover:shadow-teal-500/50",
    glow: "group-hover:shadow-[0_0_60px_-10px_rgba(13,148,136,0.6)]",
    glowColor: "rgba(13,148,136,0.15)",
    borderGlow: "hover:border-teal-300/40",
  },
  {
    title: "Protect Your Business",
    href: "/trademark-registration",
    desc: "Trademark, copyright, patents, contracts, legal notices and IP protection support.",
    image: localAssets.protect,
    tone: "protect",
    gradient: "from-slate-800 to-slate-600",
    bg: "bg-slate-700",
    shadow: "shadow-slate-500/25 hover:shadow-slate-500/50",
    glow: "group-hover:shadow-[0_0_60px_-10px_rgba(30,41,59,0.6)]",
    glowColor: "rgba(30,41,59,0.15)",
    borderGlow: "hover:border-slate-300/40",
  },
];

const demoClientLogos = [
  "Aster Works", "Nira Foods", "BluePeak Labs", "UrbanNest",
  "StrideKart", "Mira Retail", "FinEdge Co", "TerraBuild",
  "NovaKart", "BrightNest", "CloudMint", "KraftLane",
];

const growthTracks = [
  {
    title: "Business Registration & Licenses",
    image: localAssets.growthStart,
    color: "blue",
    accent: "#4f46e5",
    items: [
      ["Private Limited Company", "/private-limited-company", sectionIcons.business],
      ["Limited Liability Partnership (LLP)", "/llp-registration", sectionIcons.business],
      ["One Person Company (OPC)", "/one-person-company", sectionIcons.business],
      ["Sole Proprietorship", "/sole-proprietorship", sectionIcons.business],
      ["Section 8 Company (NGO)", "/section-8-company", sectionIcons.business],
      ["Digital Signature Certificate (DSC)", "/digital-signature-certificate", sectionIcons.licenses],
      ["FSSAI Registration", "/fssai-basic-registration", sectionIcons.licenses],
      ["Import Export Code (IEC)", "/import-export-code", sectionIcons.licenses],
      ["Udyam / MSME Registration", "/msme-registration", sectionIcons.licenses],
    ],
  },
  {
    title: "Tax, Payroll & Compliances",
    image: localAssets.growthManage,
    color: "violet",
    accent: "#0d9488",
    items: [
      ["GST Registration", "/gst-registration", sectionIcons.gst],
      ["GST Return Filing (Monthly / Quarterly)", "/gst-return-filing", sectionIcons.gst],
      ["Income Tax Return Filing", "/income-tax-return-filing", sectionIcons.accounting],
      ["Accounting & Book-keeping Services", "/accounting-bookkeeping", sectionIcons.accounting],
      ["Payroll Processing", "/payroll", sectionIcons.labour],
      ["Annual Return Filing (MGT-7 / MGT-7A)", "/annual-compliance", sectionIcons.filings],
      ["Director Appointment", "/director-appointment", sectionIcons.companyChanges],
      ["Registered Office", "/registered-office-change", sectionIcons.companyChanges],
    ],
  },
  {
    title: "Trademark, IP & Documentation",
    image: localAssets.growthProtect,
    color: "emerald",
    accent: "#1e293b",
    items: [
      ["Trademark Registration", "/trademark-registration", sectionIcons.trademark],
      ["Trademark Renewal", "/trademark-renewal", sectionIcons.trademark],
      ["Copyright Registration", "/copyright-registration", sectionIcons.copyright],
      ["Patent Registration", "/patent-registration", sectionIcons.patent],
      ["Design Registration", "/design-registration", sectionIcons.design],
      ["Legal Notice", "/legal-notice", sectionIcons.notices],
      ["Non Disclosure Agreement (NDA)", "/nda", sectionIcons.contracts],
      ["Founders Agreement", "/founders-agreement", sectionIcons.contracts],
    ],
  },
];

const serviceGroups = [
  {
    title: "Business Registration",
    icon: sectionIcons.business,
    accent: "blue",
    glowClass: "hover:shadow-indigo-500/20 hover:border-indigo-300 bg-gradient-to-br from-blue-50/80 to-cyan-50/30",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    links: [
      ["Private Limited Company", "/private-limited-company"],
      ["Limited Liability Partnership (LLP)", "/llp-registration"],
      ["Sole Proprietorship", "/sole-proprietorship"],
      ["Section 8 Company (NGO)", "/section-8-company"],
    ],
  },
  {
    title: "Tax & Payroll",
    icon: sectionIcons.gst,
    accent: "violet",
    glowClass: "hover:shadow-teal-500/20 hover:border-teal-300 bg-gradient-to-br from-violet-50/80 to-fuchsia-50/30",
    iconBg: "bg-teal-100",
    iconText: "text-teal-600",
    links: [
      ["GST Registration", "/gst-registration"],
      ["GST Return Filing (Monthly / Quarterly)", "/gst-return-filing"],
      ["Income Tax Return Filing", "/income-tax-return-filing"],
      ["Accounting & Book-keeping Services", "/accounting-bookkeeping"],
    ],
  },
  {
    title: "Trademark & IP",
    icon: sectionIcons.trademark,
    accent: "emerald",
    glowClass: "hover:shadow-slate-500/20 hover:border-slate-300 bg-gradient-to-br from-emerald-50/80 to-teal-50/30",
    iconBg: "bg-slate-100",
    iconText: "text-slate-600",
    links: [
      ["Trademark Registration", "/trademark-registration"],
      ["Copyright Registration", "/copyright-registration"],
      ["Patent Registration", "/patent-registration"],
      ["Design Registration", "/design-registration"],
    ],
  },
  {
    title: "Compliances & Documents",
    icon: sectionIcons.contracts,
    accent: "orange",
    glowClass: "hover:shadow-orange-500/20 hover:border-orange-300 bg-gradient-to-br from-orange-50/80 to-amber-50/30",
    iconBg: "bg-orange-100",
    iconText: "text-orange-600",
    links: [
      ["Annual Return Filing (MGT-7 / MGT-7A)", "/annual-compliance"],
      ["Director Appointment", "/director-appointment"],
      ["Legal Notice", "/legal-notice"],
      ["Non Disclosure Agreement (NDA)", "/nda"],
    ],
  },
];

const processSteps = [
  {
    title: "Search Your Service",
    desc: "Use the live search or category cards to find the service you need.",
    icon: <Search />,
    num: "01",
    color: "blue",
    glow: "shadow-indigo-500/30 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)]",
    href: "/services",
  },
  {
    title: "Share Your Details",
    desc: "Submit the relevant form with contact, service, and timing details.",
    icon: <FileText />,
    num: "02",
    color: "violet",
    glow: "shadow-teal-500/30 hover:shadow-[0_0_40px_rgba(13,148,136,0.4)]",
    href: "/talk-to-expert",
  },
  {
    title: "Expert Callback",
    desc: "A Your Company Name professional confirms eligibility, documents, and quote.",
    icon: <Phone />,
    num: "03",
    color: "emerald",
    glow: "shadow-slate-500/30 hover:shadow-[0_0_40px_rgba(30,41,59,0.4)]",
    href: "/talk-to-expert",
  },
  {
    title: "Track Completion",
    desc: "Get filing, drafting, or consultation updates until the work is closed.",
    icon: <Shield />,
    num: "04",
    color: "orange",
    glow: "shadow-orange-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]",
    href: "/dashboard",
  },
];

const trustStats = [
  { value: "240+", label: "Verified Experts", icon: <Users />, glow: "hover:shadow-indigo-500/20", color: "text-indigo-500", bgGlow: "from-indigo-500 to-indigo-400" },
  { value: "15k+", label: "Businesses Served", icon: <TrendingUp />, glow: "hover:shadow-teal-500/20", color: "text-teal-500", bgGlow: "from-teal-500 to-teal-400" },
  { value: "98%", label: "Satisfaction Rate", icon: <Award />, glow: "hover:shadow-slate-500/20", color: "text-slate-600", bgGlow: "from-slate-600 to-slate-500" },
  { value: "10+", label: "Cities Presence", icon: <Zap />, glow: "hover:shadow-orange-500/20", color: "text-orange-500", bgGlow: "from-orange-400 to-amber-400" },
];

const reviews = [
  {
    text: "My experience with Demo CA was excellent by all standards. The company is highly professional in providing real estate appraisal services. The team is cooperative and competent, and responds to all needs quickly and efficiently.",
    name: "Sultan Alsubaie",
    role: "Local Guide",
    rating: 5,
    avatarColor: "from-indigo-600 to-indigo-400",
  },
  {
    text: "One of the best real estate appraisal companies in the Kingdom. I recommend this company to anyone looking for reliable, high-quality services in this field.",
    name: "Sultan Alhamoud",
    role: "Local Guide",
    rating: 5,
    avatarColor: "from-teal-600 to-teal-400",
  },
  {
    text: "One of the promising companies in the field of real estate appraisal. They are thanked for their outstanding performance.",
    name: "Darwesh Mostafa",
    role: "Local Guide",
    rating: 5,
    avatarColor: "from-slate-800 to-slate-600",
  },
];

const colorMap = {
  blue:    { ring: "ring-indigo-100",    bg: "bg-indigo-50",    text: "text-indigo-600",    glow: "shadow-indigo-500/20",    border: "border-indigo-200",    dot: "bg-indigo-500" },
  violet:  { ring: "ring-teal-100",  bg: "bg-teal-50",  text: "text-teal-600",  glow: "shadow-teal-500/20",  border: "border-teal-200",  dot: "bg-teal-500" },
  emerald: { ring: "ring-slate-100", bg: "bg-slate-50", text: "text-slate-600", glow: "shadow-slate-500/20", border: "border-slate-200", dot: "bg-slate-700" },
  orange:  { ring: "ring-orange-100",  bg: "bg-orange-50",  text: "text-orange-600",  glow: "shadow-orange-500/20",  border: "border-orange-200",  dot: "bg-orange-500" },
};

function StarRow({ count = 5 }) {
  return (
    <span className="inline-flex items-center gap-[3px] text-amber-400" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="fill-current" />
      ))}
    </span>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-indigo-500/20 selection:text-indigo-700">

      {/* ═══════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center bg-white px-4 pb-14 pt-8 sm:px-6 lg:px-8 z-20">
        {/* Multi-layer animated mesh gradient */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -left-[15%] top-[5%] h-[600px] w-[600px] animate-[float_10s_ease-in-out_infinite] rounded-full bg-indigo-500/10 blur-[130px]" />
          <div className="absolute -bottom-[15%] -right-[10%] h-[700px] w-[700px] animate-[float_14s_ease-in-out_infinite_2s_reverse] rounded-full bg-teal-500/10 blur-[160px]" />
          <div className="absolute left-[40%] top-[50%] h-[400px] w-[400px] animate-[float_8s_ease-in-out_infinite_1s] rounded-full bg-rose-400/10 blur-[100px]" />
          <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[80px]" />
        </div>

        <div className="relative z-10 flex w-full max-w-7xl flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Trust badge */}
            <div className="mb-8 animate-fade-in-up">
              <ReviewBadge />
            </div>

            {/* Main heading */}
            <h1
              className="animate-fade-in-up font-heading text-4xl sm:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight text-slate-900"
              style={{ animationDelay: "80ms" }}
            >
              Launch & Scale Your
              <br />
              <span className="relative inline-block">
                <span className="animate-[gradient-xy_6s_ease_infinite] bg-[length:300%_300%] bg-gradient-to-r from-indigo-900 via-indigo-600 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
                  Business With Total Confidence.
                </span>
                <span className="absolute -bottom-2 left-0 h-4 w-3/4 rounded-full bg-indigo-500/10 blur-xl" />
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="animate-fade-in-up mt-7 max-w-xl font-body text-lg font-medium leading-relaxed text-slate-600 sm:text-xl"
              style={{ animationDelay: "160ms" }}
            >
              Your all-in-one SaaS platform for company incorporation, GST filing, trademark protection, and continuous compliance. Experience seamless business management with our premium expert network.
            </p>

            {/* Search Card */}
            <div
              className="animate-fade-in-up mt-10 w-full max-w-xl relative z-30"
              style={{ animationDelay: "240ms" }}
            >
              <HomeSearch />
            </div>

            {/* Quick links */}
            <div className="animate-fade-in-up mt-7 flex flex-nowrap items-center justify-start lg:justify-start gap-2.5 relative z-10 overflow-x-auto w-full max-w-[90vw] sm:max-w-none pb-2 scrollbar-hide" style={{ animationDelay: "320ms" }}>
              {heroQuickLinks.map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right — Hero Illustration */}
          <div className="hidden lg:flex flex-1 items-center justify-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <img
              src={localAssets.heroIllustration}
              alt="Your Company Name - Online Company Registration, GST & Legal Services Dashboard India"
              className="w-full max-w-2xl object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          2. TRUST STATS BAR
      ═══════════════════════════════════════════ */}
      <section className="relative z-10 border-y border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-100 gap-y-6 lg:gap-y-0 py-6 lg:py-0">
            {trustStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`group relative flex flex-col items-center justify-center gap-2 py-4 lg:py-10 px-2 lg:px-6 text-center transition-all duration-500 hover:z-10 hover:shadow-2xl ${stat.glow} cursor-default overflow-hidden animate-fade-in-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Background glow sweep */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-t ${stat.bgGlow}`} />
                {/* Animated bottom border glow */}
                <div className={`absolute bottom-0 left-0 h-1.5 w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r ${stat.bgGlow}`} />

                <div className={`relative z-10 text-2xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="relative z-10 font-heading text-4xl font-black text-slate-900 transition-transform duration-500 group-hover:scale-105">
                  {stat.value}
                </div>
                <div className="relative z-10 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors duration-300 group-hover:text-slate-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. LOGO MARQUEE
      ═══════════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-slate-50/60 py-10">
        <div className="mx-auto flex max-w-7xl items-center gap-10 overflow-hidden px-4">
          <span className="shrink-0 text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:block whitespace-nowrap">Trusted by</span>
          <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex animate-[slide-left_28s_linear_infinite] gap-16 whitespace-nowrap">
              {[...demoClientLogos, ...demoClientLogos].map((brand, i) => (
                <span
                  key={i}
                  className="font-heading text-xl font-extrabold text-slate-400 transition-all duration-300 hover:text-indigo-600 hover:drop-shadow-[0_0_8px_rgba(79,70,229,0.4)] cursor-default"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. JOURNEY CARDS — Colored glow shadows
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Company Registration & Compliance</p>
            <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Your Complete Business Growth Engine.
            </h2>
            <p className="mt-5 font-body text-lg text-slate-500">Everything you need to start, run, and scale—from online CA services to trademark filing.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {journeyCards.map((card, idx) => {
              const journeyImages = [localAssets.journeyStart, localAssets.journeyManage, localAssets.journeyProtect];
              return (
              <Link
                href={card.href}
                key={card.title}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl ${card.shadow} transition-all duration-500 hover:-translate-y-3 ${card.borderGlow}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Animated glow background */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 transition-all duration-500 group-hover:opacity-100`}
                  style={{ background: `radial-gradient(circle at 30% 20%, ${card.glowColor} 0%, transparent 70%)` }}
                />
                {/* Shimmer sweep on hover */}
                <div className="absolute inset-0 -translate-x-full rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {/* Accent blob */}
                <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-10 blur-3xl transition-all duration-500 group-hover:opacity-40 group-hover:scale-125 ${card.bg}`} />

                {/* Professional illustration */}
                <div className="relative z-10 mb-4">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={journeyImages[idx]}
                      alt={card.title}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                <h3 className="relative z-10 mt-4 font-heading text-2xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                  {card.title}
                </h3>
                <p className="relative z-10 mt-4 flex-1 font-body text-base font-medium leading-relaxed text-slate-500">
                  {card.desc}
                </p>

                <div className="relative z-10 mt-8 flex items-center gap-2 font-bold text-indigo-600">
                  Explore Services
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </Link>
            );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. HOW IT WORKS — Glowing step cards
      ═══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-16 overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-[20%] h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[120px]" />
          <div className="absolute bottom-0 right-[20%] h-[400px] w-[400px] rounded-full bg-teal-100/50 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Simple Process</p>
            <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              From Search to Done in 4 Steps.
            </h2>
            <p className="mt-5 text-lg font-medium text-slate-600">
              We handle the complexity so you can focus on building your business.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => {
              const c = colorMap[step.color];
              return (
                <Link
                  href={step.href || "#"}
                  key={step.title}
                  className={`group relative flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm transition-all duration-400 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl ${step.glow}`}
                >
                  {/* Glowing icon */}
                  <div
                    className={`mb-4 sm:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl ${c.bg} ${c.text} text-xl sm:text-2xl ring-1 ${c.ring} transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                  >
                    {step.icon}
                  </div>

                  <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">{step.desc}</p>

                  {/* Connector line */}
                  {idx < processSteps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-slate-200 lg:block" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. GROWTH TRACKS ── */}
      <section className="bg-slate-50 pt-16 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Complete Catalog</p>
            <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Services for Every Stage.
            </h2>
            <p className="mt-5 text-lg font-medium text-slate-500">Deep expertise across registration, compliance, and IP protection.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {growthTracks.map((track, tIdx) => {
              const c = colorMap[track.color];
              const gradientMap = {
                blue: "from-blue-50 via-white to-white border-blue-100/50",
                violet: "from-violet-50 via-white to-white border-violet-100/50",
                emerald: "from-emerald-50 via-white to-white border-emerald-100/50",
              };
              const bgHoverMap = {
                blue: "group-hover/link:bg-indigo-50/50 group-hover/link:border-indigo-200",
                violet: "group-hover/link:bg-teal-50/50 group-hover/link:border-teal-200",
                emerald: "group-hover/link:bg-slate-50/50 group-hover/link:border-slate-200",
              };
              const bgGradient = gradientMap[track.color] || "from-slate-50 via-white to-white border-slate-100";
              const hoverBg = bgHoverMap[track.color] || "group-hover/link:bg-slate-50";

              return (
                <div
                  key={track.title}
                  className={`group relative flex flex-col overflow-hidden rounded-[2rem] border bg-gradient-to-br bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${bgGradient}`}
                >
                  {/* Card Header */}
                  <div className="relative p-8 pb-6">
                    <div className="relative z-10 flex flex-col gap-5">
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center justify-center rounded-2xl bg-white ${c.text} shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                          style={{ width: "60px", height: "60px" }}
                        >
                          <img src={track.image} alt="" className="h-8 w-8 object-contain" loading="lazy" decoding="async" />
                        </div>
                        <span className={`inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest ${c.text} shadow-sm ring-1 ${c.ring}`}>
                          {track.items.length} Services
                        </span>
                      </div>
                      <h3 className="font-heading text-2xl font-black leading-tight text-slate-900 group-hover:text-slate-800">
                        {track.title}
                      </h3>
                    </div>
                  </div>

                  {/* List Container */}
                  <div className="flex-1 p-6 pt-0">
                    <ExpandableServiceList items={track.items} hoverBg={hoverBg} c={c} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. POPULAR SERVICES ── */}
      <section className="bg-white pt-14 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Quick Access</p>
              <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Service Directory.</h2>
            </div>
            <Link href="/services" className="group flex items-center gap-2 text-sm font-bold text-indigo-600 transition-all hover:gap-3">
              Browse all services <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceGroups.map((group) => (
              <div
                key={group.title}
                className={`group flex flex-col h-full rounded-3xl border border-slate-100 p-6 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${group.glowClass}`}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${group.iconBg} ring-1 ring-slate-200/50 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    <img src={group.icon} alt="" className="h-6 w-6 object-contain" loading="lazy" decoding="async" />
                  </div>
                  <h3 className="font-heading text-base font-bold leading-tight text-slate-900">{group.title}</h3>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  {group.links.map(([label, href]) => (
                    <Link
                      href={href}
                      key={label}
                      className={`group/link relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-white/80 hover:text-slate-900 ring-1 ring-transparent hover:ring-slate-200/80 hover:shadow-sm hover:-translate-y-0.5 overflow-hidden`}
                    >
                      <span className="relative z-10">{label}</span>
                      <ChevronRight className={`relative z-10 shrink-0 opacity-0 transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:opacity-100 ${group.iconText}`} />
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-500 group-hover/link:translate-x-full" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. REVIEWS — Glowing cards
      ═══════════════════════════════════════════ */}
      <section className="bg-slate-50 pt-14 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Testimonials</p>
            <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Loved by Founders.</h2>
            <p className="mt-5 text-lg font-medium text-slate-500">Real results for real businesses across India.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review, idx) => {
              const bgColors = [
                "bg-gradient-to-br from-blue-50/50 to-cyan-50/10",
                "bg-gradient-to-br from-violet-50/50 to-fuchsia-50/10",
                "bg-gradient-to-br from-emerald-50/50 to-teal-50/10",
              ];
              const hoverShadows = [
                "hover:shadow-indigo-500/20 hover:border-indigo-300",
                "hover:shadow-teal-500/20 hover:border-teal-300",
                "hover:shadow-slate-500/20 hover:border-slate-300",
              ];
              const glowSweeps = [
                "via-blue-100/40",
                "via-violet-100/40",
                "via-emerald-100/40",
              ];

              return (
              <div
                key={review.name}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up ${bgColors[idx % 3]} ${hoverShadows[idx % 3]}`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Shimmer on hover */}
                <div className={`absolute inset-0 -translate-x-full rounded-3xl bg-gradient-to-r from-transparent to-transparent transition-transform duration-700 group-hover:translate-x-full ${glowSweeps[idx % 3]}`} />

                {/* Quote mark */}
                <span className="absolute right-8 top-6 font-heading text-7xl font-black text-slate-200/50 select-none leading-none transition-colors duration-500 group-hover:text-white">&ldquo;</span>

                <StarRow count={review.rating} />

                <p className="relative z-10 mt-5 flex-1 text-base font-medium leading-relaxed text-slate-700">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="mt-8 flex items-center gap-4 relative z-10">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${review.avatarColor} font-heading text-base font-black text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-heading text-sm font-bold text-slate-900">{review.name}</div>
                    <div className="text-xs font-semibold text-slate-500">{review.role}</div>
                  </div>
                  <CheckCircle className="ml-auto text-slate-600" title="Verified" />
                </div>
              </div>
            )})}
          </div>

          {/* Google rating badge */}
          <div className="mt-12 flex justify-center">
            <div className="group flex items-center gap-5 rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-8 py-5 shadow-lg shadow-slate-100/80 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-1 hover:border-indigo-200 relative overflow-hidden">
              {/* Rotating background glow on hover */}
              <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(99,102,241,0.3)_360deg)] animate-[spin_3s_linear_infinite]" />

              <div className="relative z-10">
                <div className="font-heading text-4xl font-black text-slate-900">4.0</div>
                <div className="mt-0.5"><StarRow count={4} /></div>
              </div>
              <div className="h-12 w-px bg-slate-100" />
              <div className="relative z-10">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 transition-colors">Rating on</div>
                <div className="font-heading text-lg font-extrabold text-slate-900">Google Reviews</div>
                <div className="text-xs font-semibold text-slate-500">29 verified reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. CTA SECTION — Intense glow & animations
      ═══════════════════════════════════════════ */}
      <section className="bg-white px-4 pt-14 pb-16 sm:px-6 lg:px-8">
        <div className="group/cta relative mx-auto max-w-7xl rounded-[2.1rem] sm:rounded-[3.5rem] p-[2px] sm:p-[3px] shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-500 overflow-hidden">
          {/* Rotating gradient border wrapper */}
          <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,theme(colors.fuchsia.400),theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.amber.400),theme(colors.fuchsia.400))] animate-[spin_6s_linear_infinite] opacity-40 group-hover/cta:opacity-80 transition-opacity duration-500" />

          <div className="relative h-full overflow-hidden rounded-[2rem] sm:rounded-[3.4rem] bg-slate-50/90 backdrop-blur-2xl px-5 py-10 sm:px-20 sm:py-20 border border-white/50">
            {/* Multi-layer animated glow blobs inside */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-[15%] -top-[15%] h-[60%] w-[45%] animate-[float_12s_ease-in-out_infinite] rounded-full bg-pink-400/20 blur-[120px]" />
              <div className="absolute -left-[10%] bottom-0 h-[50%] w-[40%] animate-[float_15s_ease-in-out_infinite_3s_reverse] rounded-full bg-indigo-400/20 blur-[140px]" />
              <div className="absolute left-[45%] top-[40%] h-[40%] w-[30%] animate-[float_9s_ease-in-out_infinite_1.5s] rounded-full bg-amber-300/20 blur-[100px]" />
            </div>


          <div className="relative z-10 grid gap-14 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Free Consultation</p>
              <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                Ready to Formalize<br />Your Business?
              </h2>
              <p className="mt-6 text-xl font-medium leading-relaxed text-slate-600">
                Book a free callback with a verified expert. Zero commitment, complete clarity.
              </p>

              <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {trustStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="group/stat rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`mb-1 transition-transform duration-300 group-hover/stat:scale-110 ${stat.color}`}>{stat.icon}</div>
                    <div className="font-heading text-2xl font-black text-slate-900">{stat.value}</div>
                    <div className="mt-0.5 text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {["No hidden charges", "Verified professionals", "Dedicated support"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all duration-200 hover:border-indigo-200">
                    <Check className="text-slate-600 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Lead Form with inner glow */}
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-fuchsia-300 via-indigo-300 to-cyan-300 blur-xl opacity-40 animate-pulse" />
              <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/60 lg:p-10">

                <h3 className="mb-2 font-heading text-2xl font-bold text-slate-900">Request Callback</h3>
                <p className="mb-7 text-sm font-medium text-slate-500">Fill in your details and our team will contact you within 2 hours.</p>
                <LeadForm endpoint="/api/talk-to-expert" mode="callback" submitLabel="Book Free Consultation" />
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}



