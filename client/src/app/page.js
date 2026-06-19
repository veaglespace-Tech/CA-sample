"use client";
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";
import {
  Heart,
  Lightbulb,
  Smile,
  Megaphone,
  Trophy,
  ShoppingBasket,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

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

const demoClientLogos = [
  "Aster Works", "Nira Foods", "BluePeak Labs", "UrbanNest",
  "StrideKart", "Mira Retail", "FinEdge Co", "TerraBuild",
  "NovaKart", "BrightNest", "CloudMint", "KraftLane",
];

const journeyCards = [
  {
    title: "Start Your Business",
    href: "/company-registration",
    desc: "Incorporation, licences, DSC, MSME, FSSAI, startup registration and first compliance steps.",
    image: localAssets.journeyStart,
    percent: "100",
  },
  {
    title: "Manage Your Business",
    href: "/gst-registration",
    desc: "GST, accounting, annual filings, labour compliance, tax returns and document reminders.",
    image: localAssets.journeyManage,
    percent: "98",
  },
  {
    title: "Protect Your Business",
    href: "/trademark-registration",
    desc: "Trademark, copyright, patents, contracts, legal notices and IP protection support.",
    image: localAssets.journeyProtect,
    percent: "99",
  },
];

const serviceGroups = [
  {
    title: "Business Registration",
    desc: "Private Limited, LLP, OPC registration with full legal compliance.",
    icon: <Heart size={32} />
  },
  {
    title: "Tax & Payroll",
    desc: "GST registration, return filing, and complete accounting services.",
    icon: <Lightbulb size={32} />
  },
  {
    title: "Trademark & IP",
    desc: "Trademark, copyright, and patent registration to secure your brand.",
    icon: <Shield size={32} />
  },
  {
    title: "Compliances & Docs",
    desc: "Annual returns, director changes, and registered office updates.",
    icon: <FileText size={32} />
  },
  {
    title: "Wealth Management",
    desc: "Financial planning and risk analysis for steady business growth.",
    icon: <Zap size={32} />
  },
  {
    title: "Quick Support",
    desc: "Dedicated CA and lawyer support for all your queries.",
    icon: <Phone size={32} />
  }
];

const trustStats = [
  { value: "240+", label: "Verified Experts", icon: <Users size={48} /> },
  { value: "15k+", label: "Businesses Served", icon: <TrendingUp size={48} /> },
  { value: "98%", label: "Satisfaction Rate", icon: <Award size={48} /> },
  { value: "10+", label: "Cities Presence", icon: <Zap size={48} /> },
];

const reviews = [
  {
    text: "My experience with Veagle Space was excellent by all standards. The company is highly professional in providing real estate appraisal services. The team is cooperative and competent, and responds to all needs quickly and efficiently.",
    name: "Sultan Alsubaie",
    role: "Local Guide",
    rating: 5,
  },
  {
    text: "One of the best real estate appraisal companies in the Kingdom. I recommend this company to anyone looking for reliable, high-quality services in this field.",
    name: "Sultan Alhamoud",
    role: "Local Guide",
    rating: 5,
  },
  {
    text: "One of the promising companies in the field of real estate appraisal. They are thanked for their outstanding performance.",
    name: "Darwesh Mostafa",
    role: "Local Guide",
    rating: 5,
  },
];

function StarRow({ count = 5 }) {
  return (
    <span className="inline-flex items-center gap-[3px] text-amber-400" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="fill-current w-4 h-4" />
      ))}
    </span>
  );
}

export default function Home() {
  const container = useRef();
  const [stats, setStats] = useState({ count: 29, rating: "4.8" });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/reviews`);
        if (!res.ok) return;
        const data = await res.json();
        const reviews = data?.data || [];
        if (reviews.length > 0) {
          const rating = (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1);
          setStats({ count: reviews.length, rating });
        }
      } catch (error) {
        console.error("Failed to fetch review stats:", error);
      }
    }
    fetchStats();
  }, []);
  
  useGSAP(() => {
    gsap.from('.gsap-hero-item', { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out' });
    gsap.from('.gsap-stat-card', { scrollTrigger: { trigger: '.gsap-stats-container', start: 'top 85%' }, y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' });
    gsap.from('.gsap-service-card', { scrollTrigger: { trigger: '.gsap-service-container', start: 'top 80%' }, y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' });
    gsap.from('.gsap-contact-col', { scrollTrigger: { trigger: '.gsap-contact-container', start: 'top 75%' }, x: (i) => i === 0 ? -50 : 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out' });
  }, { scope: container });

  return (
    <div ref={container} className="flex min-h-screen flex-col font-sans text-slate-600 bg-white">
      
      {/* 1. HERO / BANNER SECTION */}
      <div className="relative min-h-[90vh] w-full bg-navy flex flex-col items-center justify-center overflow-hidden py-12 md:py-20">
        {/* Particle JS Canvas Simulation & Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-25"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="gsap-hero-item mb-8">
            <ReviewBadge />
          </div>
          
          <h1 className="gsap-hero-item text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
            Launch & Scale Your<br />
            <span className="text-gold">Business With Total Confidence.</span>
          </h1>
          
          <p className="gsap-hero-item text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto mb-10">
            Your trusted partner for business registration, tax compliance, intellectual property protection, and growth advisory.
          </p>

          <div className="gsap-hero-item w-full max-w-2xl mx-auto mb-8 relative z-30">
            <HomeSearch />
          </div>

          <div className="gsap-hero-item flex flex-wrap items-center justify-center gap-3">
            {heroQuickLinks.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="border border-white/30 bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-gold hover:bg-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <section className="border-b border-slate-100 bg-slate-50 py-6">
        <div className="mx-auto flex max-w-7xl items-center gap-10 overflow-hidden px-4">
          <span className="shrink-0 text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:block whitespace-nowrap">Trusted by</span>
          <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex animate-[slide-left_28s_linear_infinite] gap-16 whitespace-nowrap">
              {[...demoClientLogos, ...demoClientLogos].map((brand, i) => (
                <span
                  key={i}
                  className="font-heading text-xl font-extrabold text-slate-400 transition-all duration-300 hover:text-gold cursor-default"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEMO HEADING / TOP DOWNLOAD */}
      <div className="bg-navy text-white py-6 border-t border-white/10 gsap-stats-container transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
            <div className="gsap-stat-card text-2xl font-light text-gold">15,000+ Clients</div>
            <div className="gsap-stat-card text-2xl font-light">99% Success Rate</div>
            <div className="gsap-stat-card text-lg text-slate-300 hidden md:block">India&apos;s Trusted Business Platform</div>
            <div className="gsap-stat-card">
              <Link href="/services" className="inline-flex items-center gap-2 border border-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gold hover:border-gold transition-colors duration-300">
                Explore Services <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN FEATURES */}
      <div className="py-8 md:py-24 bg-white gsap-service-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy mb-4">Welcome to <strong className="font-black">Veagle Space</strong><br/><span className="text-gold">experience &amp; </span> best solutions</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
            <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
              We deliver top-tier CA and legal services across India. <strong>Our streamlined portal is the preferred choice</strong> for seamless business setup, tax management, and legal compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-3 gap-12">
            {serviceGroups.map((feature, i) => (
              <div key={i} className="gsap-service-card text-center group cursor-pointer">
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-gold text-gold flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc} <strong className="text-navy transition-colors group-hover:text-gold">..more</strong></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. RECENT CASE / SHARE HOLDER (Journey Cards) */}
      <div className="py-8 md:py-24 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy mb-4">Your <strong> Growth Engine</strong></h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
            <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
              Comprehensive solutions to launch, manage, and secure your enterprise—from expert CA advisory to digital IP protection.
            </p>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-3 gap-8">
            {journeyCards.map((item, i) => (
              <div key={i} className="relative group overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer">
                {/* Glow Effect behind */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image Section */}
                <div className="h-56 overflow-hidden relative bg-slate-50/50 flex items-center justify-center border-b border-slate-100 p-6">
                  {/* Subtle abstract blobs in background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-colors duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
                  
                  <img 
                    src={item.image} 
                    className="w-full h-full object-contain relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2 drop-shadow-sm group-hover:drop-shadow-xl" 
                    alt={item.title} 
                  />
                  
                  {/* Percent Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-2xl w-14 h-14 flex flex-col items-center justify-center font-bold text-gold border border-gold/30 shadow-lg z-20 transition-all duration-500 group-hover:border-gold group-hover:scale-110 group-hover:-translate-y-1">
                    <span className="text-lg leading-none">{item.percent}%</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 relative z-20 bg-white group-hover:bg-transparent transition-colors duration-500 h-[220px] flex flex-col">
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-3 transition-colors duration-300 group-hover:text-gold">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow">
                    {item.desc}
                  </p>
                  
                  <div className="mt-auto">
                    <Link href={item.href} className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-gold transition-colors relative">
                      <span className="relative z-10 group-hover:text-[#b07842] transition-colors duration-300">Read More</span>
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                        <ChevronRight size={16} className="text-gold group-hover:text-white transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  </div>
                </div>
                
                {/* Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-gold to-amber-400 transition-all duration-500 group-hover:w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. ABOUT WORKING (Simple Process) */}
      <div className="flex flex-col md:flex-row min-h-[500px]">
        <div className="md:w-1/2 relative bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center min-h-[300px]">
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <a href="#" className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 hover:bg-gold hover:border-gold transition-all duration-300 hover:scale-110">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
            </a>
          </div>
        </div>
        <div className="md:w-1/2 bg-navy text-white p-12 md:p-4 md:p-20 flex flex-col justify-center">
          <h3 className="text-4xl font-light mb-6">Simple <br/><span className="text-gold font-bold">4-Step Process</span></h3>
          <div className="text-lg text-slate-300 font-light mb-6">From Search to Done.</div>
          
          <div className="space-y-6 mb-10">
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                   <h4 className="font-bold text-lg mb-1">Search Your Service</h4>
                   <p className="text-slate-400 text-sm">Find the CA service you need via our portal.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                   <h4 className="font-bold text-lg mb-1">Share Details</h4>
                   <p className="text-slate-400 text-sm">Submit forms and documents securely online.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                   <h4 className="font-bold text-lg mb-1">Expert Callback</h4>
                   <p className="text-slate-400 text-sm">Verified CA confirms your filing and quotes.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                   <h4 className="font-bold text-lg mb-1">Track Completion</h4>
                   <p className="text-slate-400 text-sm">Get live updates on your dashboard.</p>
                </div>
             </div>
          </div>

          <div className="flex gap-4">
            <Link href="/services" className="bg-gold text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-navy transition-colors duration-300">
              Browse Services
            </Link>
          </div>
        </div>
      </div>

      {/* 6. ACHIVEMENTS (Trust Stats) */}
      <div className="bg-gold text-white py-8 md:py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-1 md:grid-cols-4 gap-8">
            {trustStats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="mb-4 opacity-80 transition-transform duration-300 hover:scale-110">{stat.icon}</div>
                <div className="text-3xl md:text-5xl font-black mb-2 drop-shadow-sm">{stat.value}</div>
                <h4 className="text-lg font-medium tracking-wide uppercase">{stat.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. TESTIMONIALS */}
      <div className="py-8 md:py-24 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-navy mb-4">Loved by <strong>Founders</strong></h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
            <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
              Real results for real businesses across India.
            </p>
          </div>
          
          <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] py-4">
            <div className="flex animate-[slide-left_35s_linear_infinite] gap-8 hover:[animation-play-state:paused] whitespace-normal min-w-max">
              {[...reviews, ...reviews, ...reviews, ...reviews].map((review, i) => (
                <div key={i} className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 w-[320px] md:w-[380px] shrink-0 rounded-2xl cursor-default text-left relative overflow-hidden group flex flex-col">
                  {/* Top accent line on hover */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <StarRow count={review.rating} />
                  <p className="text-slate-600 mt-4 mb-8 text-[0.95rem] leading-relaxed italic line-clamp-4 relative z-10">
                    &quot;{review.text}&quot;
                  </p>
                  <div className="flex items-center gap-4 mt-auto border-t border-slate-100 pt-5 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-navy to-navy-light text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy">{review.name}</h4>
                      <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-6">
            <div className="group flex items-center gap-5 rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-8 py-5 shadow-lg shadow-slate-100/80 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/15 hover:-translate-y-1 hover:border-gold/30 relative overflow-hidden">
              {/* Rotating background glow on hover */}
              <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(197,160,89,0.3)_360deg)] animate-[spin_3s_linear_infinite]" />

              <div className="relative z-10 text-left">
                <div className="font-heading text-4xl font-black text-navy">{stats.rating}</div>
                <div className="mt-0.5"><StarRow count={Math.round(parseFloat(stats.rating))} /></div>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div className="relative z-10 text-left">
                 <div className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-gold transition-colors">Rating On</div>
                 <div className="font-heading font-bold text-lg text-navy">Google Reviews</div>
                 <div className="text-xs font-semibold text-slate-500">{stats.count} verified reviews</div>
              </div>
            </div>

            <Link 
              href="/reviews"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-yellow-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all hover:shadow-gold/25 duration-300"
            >
              Show All Reviews
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* 8. CALL US / TOLL FREE */}
      <div className="bg-navy-light text-white py-16 md:py-8 md:py-24 gsap-contact-container overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16 bg-white border border-slate-200 gsap-contact-col relative overflow-hidden group shadow-2xl z-10">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gold"></div>
              <h2 className="text-3xl lg:text-4xl font-black mb-3 text-slate-900 tracking-tight">Leave a <span className="text-gold">Message</span></h2>
              <p className="text-slate-500 mb-8 font-medium">Fill out the form below and our experts will get back to you shortly.</p>
              <form className="flex flex-col gap-4 relative z-10">
                <input type="text" placeholder="Full Name *" className="bg-slate-50 border border-slate-200 px-5 py-4 text-slate-800 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all rounded-sm placeholder:text-slate-400 font-medium" />
                <input type="email" placeholder="Email Address *" className="bg-slate-50 border border-slate-200 px-5 py-4 text-slate-800 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all rounded-sm placeholder:text-slate-400 font-medium" />
                <textarea placeholder="How can we help you? *" rows="4" className="bg-slate-50 border border-slate-200 px-5 py-4 text-slate-800 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all rounded-sm placeholder:text-slate-400 resize-none font-medium"></textarea>
                <button type="submit" className="bg-gold text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-navy transition-all duration-300 shadow-md hover:shadow-lg w-full mt-2 rounded-sm border-2 border-transparent hover:border-navy">Send Message</button>
              </form>
            </div>
            <div className="md:w-1/2 p-12 md:p-4 md:p-20 flex flex-col justify-center items-center md:text-left md:items-start text-center bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center relative gsap-contact-col overflow-hidden">
              <div className="absolute inset-0 bg-gold/90 mix-blend-multiply transition-opacity duration-500 hover:opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              <div className="relative z-10 w-full transform transition-transform duration-500 hover:scale-105">
                <div className="inline-flex items-center gap-3 mb-6 bg-white/10 px-4 py-2 rounded-none backdrop-blur-sm border border-white/20 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                  <Phone size={18} className="text-white" />
                  <span className="text-white font-bold uppercase tracking-widest text-sm">Toll Free</span>
                </div>
                <strong className="text-5xl md:text-3xl md:text-7xl font-black mb-6 block text-white drop-shadow-lg">1800-555-333</strong>
                <p className="text-white/90 text-lg leading-relaxed mb-10 max-w-md font-medium">
                  Reach out to us for immediate assistance regarding your business registration and compliance needs.
                </p>
                <Link href="/talk-to-expert" className="inline-flex items-center gap-3 border-2 border-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-gold transition-all duration-300">
                  Call an Expert <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

