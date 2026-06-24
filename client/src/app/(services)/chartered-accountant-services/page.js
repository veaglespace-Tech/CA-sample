"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Shield,
  Star,
  Users,
  Award,
  TrendingUp,
  Zap,
  Phone,
  FileText,
  Search,
  BookOpen,
  DollarSign,
  PieChart,
  Scale,
  Briefcase,
  HelpCircle,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import LeadForm from "../../../components/forms/LeadForm";

const structureData = {
  pvtLtd: {
    name: "Private Limited Company",
    filings: [
      { name: "MCA AOC-4 (Financial Statements)", cycle: "Annual", desc: "Filing of company financial accounts with ROC" },
      { name: "MCA MGT-7 (Annual Return)", cycle: "Annual", desc: "Details of shareholding and directors with ROC" },
      { name: "ITR-6 Income Tax Return", cycle: "Annual", desc: "Corporate income tax filing" },
      { name: "GSTR-1 & GSTR-3B Filings", cycle: "Monthly/Quarterly", desc: "GST outwards and summarized monthly returns" },
      { name: "TDS Return Filing", cycle: "Quarterly", desc: "Filing of tax deducted at source returns" },
      { name: "ROC Director KYC (DIR-3 KYC)", cycle: "Annual", desc: "Mandatory KYC update for all active directors" },
    ],
    pricing: {
      under20L: { fee: "₹1,499 / mo", total: "₹17,988 / yr", package: "Pvt Ltd Starter" },
      between20_50L: { fee: "₹2,499 / mo", total: "₹29,988 / yr", package: "Pvt Ltd Growth" },
      between50_2C: { fee: "₹3,999 / mo", total: "₹47,988 / yr", package: "Pvt Ltd Enterprise" },
      above2C: { fee: "Custom Quote", total: "Talk to expert", package: "Pvt Ltd Custom" },
    }
  },
  llp: {
    name: "Limited Liability Partnership (LLP)",
    filings: [
      { name: "MCA Form 11 (Annual Return)", cycle: "Annual", desc: "Statement of partner contributions and management" },
      { name: "MCA Form 8 (Financial Statement)", cycle: "Annual", desc: "Statement of accounts and solvency" },
      { name: "ITR-5 Income Tax Return", cycle: "Annual", desc: "Partnership firm income tax filing" },
      { name: "GSTR-1 & GSTR-3B Filings", cycle: "Monthly/Quarterly", desc: "GST outwards and summarized monthly returns" },
      { name: "TDS Return Filing", cycle: "Quarterly", desc: "Filing of tax deducted at source returns" },
    ],
    pricing: {
      under20L: { fee: "₹999 / mo", total: "₹11,988 / yr", package: "LLP Starter" },
      between20_50L: { fee: "₹1,899 / mo", total: "₹22,788 / yr", package: "LLP Growth" },
      between50_2C: { fee: "₹2,999 / mo", total: "₹35,988 / yr", package: "LLP Enterprise" },
      above2C: { fee: "Custom Quote", total: "Talk to expert", package: "LLP Custom" },
    }
  },
  proprietorship: {
    name: "Sole Proprietorship / Individual",
    filings: [
      { name: "ITR-3 or ITR-4 (Business Income ITR)", cycle: "Annual", desc: "Income tax return for business / profession" },
      { name: "GSTR-1 & GSTR-3B Filings", cycle: "Monthly/Quarterly", desc: "GST outwards and summarized monthly returns" },
      { name: "TDS Return Filing", cycle: "Quarterly", desc: "Filing of tax deducted at source returns" },
      { name: "Advance Tax Calculation", cycle: "Quarterly", desc: "Filing and tracking quarterly advance taxes" },
    ],
    pricing: {
      under20L: { fee: "₹499 / mo", total: "₹5,988 / yr", package: "Proprietor Basic" },
      between20_50L: { fee: "₹1,299 / mo", total: "₹15,588 / yr", package: "Proprietor Growth" },
      between50_2C: { fee: "₹2,199 / mo", total: "₹26,388 / yr", package: "Proprietor Enterprise" },
      above2C: { fee: "Custom Quote", total: "Talk to expert", package: "Proprietor Custom" },
    }
  },
  partnership: {
    name: "Partnership Firm",
    filings: [
      { name: "ITR-5 Income Tax Return", cycle: "Annual", desc: "Partnership firm income tax filing" },
      { name: "GSTR-1 & GSTR-3B Filings", cycle: "Monthly/Quarterly", desc: "GST outwards and summarized monthly returns" },
      { name: "TDS Return Filing", cycle: "Quarterly", desc: "Filing of tax deducted at source returns" },
      { name: "Partnership Compliance Reviews", cycle: "Annual", desc: "Year-end interest and salary allocations for partners" },
    ],
    pricing: {
      under20L: { fee: "₹799 / mo", total: "₹9,588 / yr", package: "Partnership Starter" },
      between20_50L: { fee: "₹1,599 / mo", total: "₹19,188 / yr", package: "Partnership Growth" },
      between50_2C: { fee: "₹2,499 / mo", total: "₹29,988 / yr", package: "Partnership Enterprise" },
      above2C: { fee: "Custom Quote", total: "Talk to expert", package: "Partnership Custom" },
    }
  }
};

const caServices = [
  {
    title: "Income Tax Filing & Planning",
    desc: "End-to-end ITR preparation for individuals, partnerships, startups, and enterprises with year-round tax-saving strategy alignment.",
    icon: <Briefcase className="h-6 w-6 text-blue-500" />,
    color: "blue",
    list: ["ITR 1 to 7 Filing", "Advance Tax Management", "Capital Gains Planning", "Tax Audits (Sec 44AB)"]
  },
  {
    title: "GST Compliance & Filings",
    desc: "Hassle-free GSTIN registrations, returns filing, input tax credit (ITC) reconciliation, and expert reply support for department notices.",
    icon: <PieChart className="h-6 w-6 text-violet-500" />,
    color: "violet",
    list: ["GST Returns (1 & 3B)", "ITC Reconciliation", "Annual GSTR-9 filing", "Notice Response Assistance"]
  },
  {
    title: "Statutory & Tax Audit",
    desc: "Robust audits carried out by seasoned, independent CA practitioners that ensure regulatory compliance and verify control systems.",
    icon: <Shield className="h-6 w-6 text-emerald-500" />,
    color: "emerald",
    list: ["Statutory Company Audits", "Tax Audit U/S 44AB", "Internal Operations Audit", "ROC Financial Certifications"]
  },
  {
    title: "Virtual CFO Advisory",
    desc: "Scale your startup with full finance delegation: weekly MIS reporting, dynamic financial modeling, payroll setup, and cash flow projections.",
    icon: <TrendingUp className="h-6 w-6 text-amber-500" />,
    color: "orange",
    list: ["Interactive MIS Dashboards", "Cash Flow Forecasts", "Pitch-deck Fin Modeling", "Payroll & Expense Controls"]
  },
  {
    title: "ROC & Corporate Compliance",
    desc: "Never miss a deadline. Complete annual filings, director changes, share allocations, and secretarial audit compliance handled digitally.",
    icon: <Scale className="h-6 w-6 text-cyan-500" />,
    color: "blue",
    list: ["ROC Forms AOC-4 & MGT-7", "DIR-3 KYC filings", "Board Meeting drafting", "Share Capital Increases"]
  },
  {
    title: "NRI & FEMA Taxation",
    desc: "Specialized consultancy for cross-border investments, DTAA benefits, repatriation assistance, and foreign assets disclosure compliance.",
    icon: <DollarSign className="h-6 w-6 text-rose-500" />,
    color: "violet",
    list: ["DTAA Benefit Optimization", "15CA/15CB Certifications", "Repatriation Strategy", "Foreign Assets ITR Filing"]
  }
];

const faqs = [
  {
    q: "Why do I need a Chartered Accountant instead of DIY tax software?",
    a: "While basic ITR forms can be DIY, businesses and self-employed professionals face complex tax codes. Our verified CAs do not just file your returns—they optimize your business expenses, maximize your eligible deductions (such as under Sec 80C, 10AA, etc.), ensure robust GST credit matching, and secure your filings against tax notices."
  },
  {
    q: "How does the Veagle Space Technology digital CA model work?",
    a: "It's 100% digital and seamless. Once you choose a service, you are assigned a dedicated Chartered Accountant. You upload all documents (bank statements, purchase sheets, invoices) to a secure encrypted portal. Your CA reviews, compiles reports, shares calculations for your approval, and files your taxes digitally. You receive all filing copies instantly."
  },
  {
    q: "What is a Tax Audit and is it mandatory for my company?",
    a: "Under Section 44AB of the Income Tax Act, a Tax Audit is mandatory for any business with an annual turnover exceeding ₹1 Crore (₹10 Crores if cash transactions are less than 5%), or for professionals whose gross receipts exceed ₹50 Lakhs. Our CAs will evaluate your accounts, certify your reports, and file your Form 3CA/3CB and 3CD directly."
  },
  {
    q: "How fast do your experts get back after raising a request?",
    a: "For all CA advisory, callback, or audit requests, a verified Chartered Accountant from our team will contact you within 2 business hours to review your documents and provide a transparent quote."
  },
  {
    q: "Are my company's financial documents secure on your platform?",
    a: "Absolutely. We employ bank-grade SSL encryption and comply with rigorous security standards. Your data is restricted strictly to your assigned Chartered Accountant and is never shared with third-party networks."
  }
];

const brandLogos = [
  "Apex FinCorp", "BlueSpace Tech", "Nira Organic", "UrbanSpace Labs",
  "FinEdge Consultants", "Aura Retail", "Mira Health", "Stratum Logistics"
];

function StarRow({ count = 5 }) {
  return (
    <span className="inline-flex items-center gap-[3px] text-amber-400" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </span>
  );
}

export default function CharteredAccountantLanding() {
  const [selectedStructure, setSelectedStructure] = useState("pvtLtd");
  const [turnoverRange, setTurnoverRange] = useState("under20L");
  const [activeFaq, setActiveFaq] = useState(null);

  const currentEstimator = structureData[selectedStructure];
  const priceDetails = currentEstimator.pricing[turnoverRange] || { fee: "Custom Quote", total: "Talk to expert", package: "Custom Package" };

  return (
    <div className="flex min-h-screen flex-col selection:bg-gold/100/20 selection:text-gold bg-slate-50/50">
      
      {/* ═══════════════════════════════════════════
          1. HERO SECTION WITH MESH GRADIENTS
      ═══════════════════════════════════════════ */}
      <section className="relative flex flex-col overflow-hidden bg-white z-20 px-4 pb-16 pt-8 lg:pt-12 sm:px-6 lg:px-8">
        
        {/* Animated Radial Glows */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -left-[15%] top-[5%] h-[600px] w-[600px] animate-[float_10s_ease-in-out_infinite] rounded-full bg-gold/100/10 blur-[130px]" />
          <div className="absolute -bottom-[15%] -right-[10%] h-[700px] w-[700px] animate-[float_14s_ease-in-out_infinite_2s_reverse] rounded-full bg-violet-500/10 blur-[160px]" />
          <div className="absolute left-[35%] top-[40%] h-[500px] w-[500px] animate-[float_9s_ease-in-out_infinite_1s] rounded-full bg-gold/10 blur-[120px]" />
          {/* Radial grid line background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          
          {/* Trust Badge */}
          <div className="mb-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white shadow-sm border-slate-200 px-4 py-2 text-xs font-semibold text-slate-900 shadow-xl backdrop-blur-md">
              <span className="flex h-5 items-center rounded-full bg-amber-400 px-2.5 text-[0.6rem] font-black uppercase tracking-wider text-slate-900 shadow-md shadow-amber-400/20">
                ICAI Verified
              </span>
              <span className="flex items-center gap-1.5">
                <StarRow />
                <span className="font-bold text-amber-300">4.9/5</span>
                <span className="text-slate-600">from 5,000+ Business Owners</span>
              </span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up font-heading text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl">
            Elite CA Network.
            <br />
            <span className="relative inline-block">
              <span className="animate-[gradient-xy_6s_ease_infinite] bg-[length:300%_300%] bg-gradient-to-r from-blue-400 via-indigo-200 to-amber-300 bg-clip-text text-transparent">
                Frictionless Finance.
              </span>
              <span className="absolute -bottom-2 left-1/2 h-3 w-3/4 -translate-x-1/2 rounded-full bg-gold/100/20 blur-xl" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up mt-8 max-w-3xl font-body text-base font-semibold leading-relaxed text-slate-600 sm:text-xl">
            Stay compliant, optimize your tax structures, and outsource your accounts to certified Chartered Accountants. Zero manual stress, bank-grade encryption, and transparent fixed-pricing plans.
          </p>

          {/* Call-to-actions */}
          <div className="animate-fade-in-up mt-12 flex flex-col sm:flex-row gap-4 relative z-10" style={{ animationDelay: "200ms" }}>
            <Link
              href="#estimator"
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all hover:shadow-blue-500/25 duration-300"
            >
              Estimate Compliance Fee
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#callback"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white shadow-sm border-slate-200 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-slate-900 backdrop-blur-sm transition-all hover:bg-slate-50 border-slate-200 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
            >
              Talk to a Partner CA
            </Link>
          </div>

          {/* Key highlights */}
          <div className="animate-fade-in-up mt-14 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-4xl border-t border-slate-200 pt-10" style={{ animationDelay: "300ms" }}>
            {[
              { label: "Top 1% ICAI Experts", val: "350+ CAs" },
              { label: "Client Satisfaction", val: "99.2%" },
              { label: "Compliances Filed", val: "1.2 Lakh+" },
              { label: "Penalty Safety Cover", val: "100%" }
            ].map((hl, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-slate-900">{hl.val}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">{hl.label}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Diagonal Wave Bottom Decor */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          2. LOGO BAR (MARQUEE)
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-200/60 py-8 md:py-10 shadow-sm relative z-10">
        <div className="mx-auto flex max-w-7xl items-center gap-10 overflow-hidden px-4">
          <span className="shrink-0 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hidden lg:block whitespace-nowrap">
            Trusted by active companies
          </span>
          <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex animate-[slide-left_28s_linear_infinite] gap-20 whitespace-nowrap">
              {[...brandLogos, ...brandLogos].map((brand, i) => (
                <span
                  key={i}
                  className="font-heading text-lg font-black text-slate-400/80 transition-all duration-300 hover:text-blue-500 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] cursor-default"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. COMPREHENSIVE CA SERVICES
      ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-28 sm:px-6 lg:px-8" id="services">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-gold">Enterprise Scale</p>
          <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
            A Complete Finance Department, Re-imagined.
          </h2>
          <p className="mt-5 font-body text-base font-semibold leading-relaxed text-slate-500 sm:text-lg">
            Say goodbye to disorganized excel files and local consultants. We combine skilled CA professionals with automation to handle all filings seamlessly.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {caServices.map((srv, idx) => (
            <div
              key={srv.title}
              className="group relative flex flex-col justify-between h-full overflow-hidden rounded-none border border-slate-200/80 bg-white p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-slate-300"
            >
              {/* Inner ambient card glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/10 to-blue-50/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div>
                {/* Floating graphic element */}
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-slate-50 opacity-10 blur-xl transition-all duration-500 group-hover:scale-125" />
                
                {/* Icon Circle */}
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-slate-50 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {srv.icon}
                </div>

                <h3 className="mt-6 font-heading text-xl font-extrabold text-slate-900 transition-colors group-hover:text-gold">
                  {srv.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
                  {srv.desc}
                </p>
              </div>

              {/* Action features checklist */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <ul className="flex flex-col gap-2.5">
                  {srv.list.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. COMPLIANCE FEE & FILINGS ESTIMATOR (WIDGET)
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-200/60 py-8 md:py-28 relative overflow-hidden" id="estimator">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[20%] -left-[10%] h-[400px] w-[400px] rounded-full bg-gold/20/40 blur-[130px]" />
          <div className="absolute bottom-[20%] -right-[10%] h-[400px] w-[400px] rounded-full bg-violet-100/40 blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-gold">Dynamic Pricing</p>
            <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
              Compliance Filings &amp; Cost Estimator
            </h2>
            <p className="mt-5 font-body text-base font-semibold leading-relaxed text-slate-500">
              Select your business model and annual turnover range to instantly discover mandatory Indian compliances and estimated CA retainer fees.
            </p>
          </div>

          {/* Estimator Interface */}
          <div className="grid gap-8 lg:grid-cols-12 items-start mt-10">
            
            {/* Left Controls (8 Columns) */}
            <div className="lg:col-span-7 bg-slate-50/50 rounded-none border border-slate-200/80 p-6 sm:p-8 shadow-inner">
              
              {/* Step 1: Select Business Structure */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/100 text-[10px] font-bold text-white">1</span>
                  Select Business Structure
                </h3>
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                  {Object.entries(structureData).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedStructure(key)}
                      className={`flex flex-col items-start rounded-none border p-4 text-left transition-all duration-300 ${
                        selectedStructure === key
                          ? "bg-white border-blue-500 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <span className={`text-sm font-bold transition-colors ${selectedStructure === key ? "text-gold" : "text-slate-900"}`}>
                        {value.name}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-1">
                        {value.filings.length} Mandatory Filings / Year
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Turnover Bracket */}
              <div className="mt-10 border-t border-slate-200/80 pt-8">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/100 text-[10px] font-bold text-white">2</span>
                  Select Annual Turnover
                </h3>
                <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-1 md:grid-cols-4">
                  {[
                    { key: "under20L", label: "Under ₹20 Lakhs" },
                    { key: "between20_50L", label: "₹20 - ₹50 Lakhs" },
                    { key: "between50_2C", label: "₹50L - ₹2 Crores" },
                    { key: "above2C", label: "Above ₹2 Crores" }
                  ].map((bracket) => (
                    <button
                      key={bracket.key}
                      onClick={() => setTurnoverRange(bracket.key)}
                      className={`rounded-sm border py-3 px-3 text-center text-xs font-bold transition-all duration-200 ${
                        turnoverRange === bracket.key
                          ? "bg-gold border-gold text-white shadow-md shadow-gold/20"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {bracket.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Required Filings Output Checklist */}
              <div className="mt-10 border-t border-slate-200/80 pt-8">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
                  Expected Legal &amp; Compliance Filings Checklist
                </h3>
                <div className="flex flex-col gap-3">
                  {currentEstimator.filings.map((filing, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-none bg-white border border-slate-200/60 p-4 transition-all hover:shadow-md hover:border-slate-300 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 shrink-0 mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-sm font-extrabold text-slate-900">{filing.name}</span>
                          <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 self-start sm:self-center">
                            {filing.cycle}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mt-1">{filing.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Result Card (5 Columns) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="relative rounded-none bg-slate-900 p-8 text-white shadow-2xl overflow-hidden">
                {/* Background mesh grid decoration */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gold/100/25 blur-3xl" />
                
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                  Veagle Space Technology Retainer Plan
                </span>
                
                <h4 className="relative z-10 font-heading text-3xl font-black tracking-tight mt-3 text-white">
                  {priceDetails.package}
                </h4>
                
                <div className="relative z-10 mt-6 border-y border-white/10 py-6 my-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-3xl md:text-5xl font-black tracking-tight text-white">
                      {priceDetails.fee}
                    </span>
                  </div>
                  {turnoverRange !== "above2C" && (
                    <p className="text-xs font-semibold text-slate-400 mt-2">
                      Total Annualized: {priceDetails.total} (excl. GST)
                    </p>
                  )}
                </div>

                <div className="relative z-10 space-y-4">
                  {[
                    "Dedicated expert CA assigned",
                    "Full ROC & Income Tax filing support",
                    "GST return tracking & reconciliation",
                    "Assistance with basic legal drafting",
                    "Accuracy guaranteed: Penalty cover",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                      <CheckCircle className="h-4.5 w-4.5 text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 mt-10">
                  <Link
                    href="#callback"
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold/100 py-4 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold/20 hover:bg-gold transition-all active:scale-[0.98]"
                  >
                    Select retained package
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-3.5">
                    Zero commitment signup • Change package anytime
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. WHY RETURNING CLIENTS TRUST DemoCA
      ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-28 sm:px-6 lg:px-8">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-gold">Operational Excellence</p>
          <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
            Setting the Gold Standard for Business Taxes.
          </h2>
          <p className="mt-5 font-body text-base font-semibold leading-relaxed text-slate-500">
            Hiring a local consultant can lead to communication gaps, missed schedules, and costly penalties. Veagle Space Technology builds accountability directly into every workflow.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Verified Top-Tier CAs",
              desc: "Every practitioner undergoes rigorous profile checks. Our specialists possess deep knowledge in multi-state audits, startup structures, and cross-border taxes.",
              icon: <Users className="h-6 w-6 text-blue-500" />
            },
            {
              title: "No Surprise RETS",
              desc: "Say goodbye to arbitrary consultation invoices. We implement completely transparent, flat retainer pricing schedules without hidden administrative surcharges.",
              icon: <DollarSign className="h-6 w-6 text-violet-500" />
            },
            {
              title: "Digital Client Vaults",
              desc: "Securely upload bank records, ledgers, and trade documentation. Download finished reports and ITR acknowledgement filings instantly on your user dashboard.",
              icon: <Shield className="h-6 w-6 text-emerald-500" />
            },
            {
              title: "Guaranteed Accuracy",
              desc: "Our rigorous cross-verification audits eliminate mathematical and format errors. If any filing errors result in penalty levies, we back our services with complete liability covers.",
              icon: <Award className="h-6 w-6 text-amber-500" />
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col h-full rounded-none border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform duration-300 shrink-0">
                {item.icon}
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-slate-900 group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500 flex-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. INTERACTIVE FAQ ACCORDION
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-200/60 py-8 md:py-28 relative" id="faq">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-gold">Client Support</p>
            <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
              Common Questions Answered
            </h2>
            <p className="mt-5 font-body text-base font-semibold leading-relaxed text-slate-500">
              Clear, precise information regarding filings, consultations, and schedules.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-none border transition-all duration-300 ${
                    isOpen ? "border-blue-500 bg-slate-50/50 shadow-md shadow-blue-500/5" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-heading text-base font-extrabold text-slate-900 pr-4">
                      {faq.q}
                    </span>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180 border-gold/30 text-blue-500" : ""
                    }`}>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ${
                    isOpen ? "max-h-[300px] border-t border-slate-200/80" : "max-h-0"
                  }`}>
                    <p className="p-6 text-sm font-semibold leading-relaxed text-slate-600 bg-white/50">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. LEAD ACQUISITION CALLBACK COMPONENT
      ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-28 sm:px-6 lg:px-8" id="callback">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 to-indigo-950 px-8 py-8 md:py-20 sm:px-4 md:px-20 shadow-2xl border border-white/5">
          {/* Backdrop Glow Elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-[15%] -top-[15%] h-[60%] w-[45%] animate-[float_12s_ease-in-out_infinite] rounded-full bg-gold/30 blur-[120px]" />
            <div className="absolute -left-[10%] bottom-0 h-[50%] w-[40%] animate-[float_15s_ease-in-out_infinite_3s_reverse] rounded-full bg-violet-600/30 blur-[140px]" />
          </div>

          <div className="relative z-10 grid gap-14 lg:grid-cols-1 md:grid-cols-2 lg:items-center">
            
            {/* Left Content Column */}
            <div className="text-white">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                Book a consultation
              </span>
              <h2 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl mt-4 leading-tight">
                Outsource Your Compliance Issues Today.
              </h2>
              <p className="mt-6 text-sm sm:text-base font-semibold leading-relaxed text-slate-300">
                Discuss ITR filing, corporate ROC retentions, audits, or notice solutions with a certified ICAI expert CA in a free, confidential advisory session.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Free, zero-commitment initial intake consultation",
                  "Fixed retainer structures with zero hidden fees",
                  "100% digital data exchange on encrypted vaults",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-white/10 pt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-lg text-blue-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Hotline Number</p>
                  <p className="font-heading text-base font-extrabold text-white mt-0.5">+91 82379 99101</p>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="relative">
              {/* Animated surrounding borders glow */}
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 blur-xl opacity-40 animate-[pulse-glow_4s_ease-in-out_infinite]" />
              <div className="relative rounded-none bg-white p-8 shadow-2xl lg:p-4 md:p-10">
                <h3 className="font-heading text-2xl font-black text-slate-900">Request Partner CA Callback</h3>
                <p className="text-xs font-semibold text-slate-400 mt-2 mb-7">
                  Complete the details below, and an expert partner CA will contact you within 2 hours.
                </p>
                
                <LeadForm
                  endpoint="/api/talk-to-expert"
                  mode="callback"
                  submitLabel="Schedule Free Call"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
