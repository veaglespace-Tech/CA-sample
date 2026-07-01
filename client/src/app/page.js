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
                <strong className="block max-w-full whitespace-nowrap text-3xl sm:text-4xl lg:text-5xl font-black leading-none tracking-tight mb-6 text-white drop-shadow-lg">
                  +91 82379 99101
                </strong>
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

