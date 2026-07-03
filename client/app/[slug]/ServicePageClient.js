"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, Suspense } from "react";
import {
  ArrowRight,
  Award,
  Check,
  Clock,
  FileText,
  Shield,
  Star,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

// Data & Utils
import { serviceData, standardFaqs, contentTabs, statesList, relatedPagesList } from "../../data/services";
import { getServiceInfoBySlug } from "../../lib/navigation-data";
import { useGetPublicReviewsQuery } from "../../store/api/reviewApi";

// Components
import ConsultForm from "../../components/services/ConsultForm";
import PackageCards from "../../components/services/PackageCards";
import FAQ from "../../components/services/FAQ";
import TrustSection from "../../components/common/TrustSection";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");
const LAST_UPDATED = "May 5 2026, 02:30 PM";

function slugToTitle(slug) {
  return (slug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildGenericService(slug) {
  const navInfo = getServiceInfoBySlug(slug);
  const title = navInfo?.label || slugToTitle(slug);
  const category = navInfo?.category || "Legal Services";

  let features = [
    "Dedicated expert callback",
    "Document checklist and eligibility review",
    "Clear pricing before work begins",
    "Progress updates from the team",
  ];
  let benefits = [
    { title: "Expert Guidance", desc: "Understand the right path before submitting documents or applications." },
    { title: "Faster Execution", desc: "Move through forms, filings, and follow-ups with fewer delays." },
    { title: "Transparent Pricing", desc: "Get a clear quote and scope before the work starts." },
    { title: "Ongoing Support", desc: "Stay informed across each stage of your service request." },
  ];
  let documents = [ "PAN or identity proof", "Address proof", "Business details", "Relevant certificates or registrations", "Any prior notices or filings" ];
  let process = [ "Submit Details", "Expert Callback", "Document Review", "Filing or Drafting", "Completion Update" ];
  let price = "Talk to Expert";
  let oldPrice = "Custom Quote";
  let timeframe = "Quick Callback";

  if (category.includes("Registration") || category.includes("License") || category.includes("Company") || category.includes("Business Setup")) {
    features = [
      "Name Availability Search & Approval",
      "Document Preparation (MOA/AOA, etc.)",
      "Digital Signature Certificate (DSC)",
      "Govt Registration & Filing Support",
      "Post-Incorporation Guidance",
    ];
    documents = ["PAN Card of Directors/Founders", "Aadhar Card/Voter ID", "Passport size photographs", "Latest Bank Statement", "Registered Office Address Proof"];
    process = ["Initial Consultation", "Collect Documents", "Name Approval", "Filing Registration", "Certificate Issuance"];
    price = "Rs. 2,999";
    oldPrice = "Rs. 4,999";
    timeframe = "7-10 Working Days";
  } else if (category.includes("Tax") || category.includes("Compliance") || category.includes("Filing") || category.includes("Accounting")) {
    features = [
      "Automated Tax Calculation",
      "Error-free Return Filing",
      "Dedicated Tax Professional",
      "Notice Reply Support",
      "Year-round Compliance Advisory",
    ];
    documents = ["PAN Card", "Aadhar Card", "Form 16 / Income Details", "Bank Statements", "Investment Proofs"];
    process = ["Upload Documents", "Tax Computation", "Review Computation", "File Return", "Acknowledgment"];
    price = "Rs. 999";
    oldPrice = "Rs. 1,499";
    timeframe = "1-3 Working Days";
  } else if (category.includes("Trademark") || category.includes("Copyright") || category.includes("Patent") || category.includes("IP")) {
    features = [
      "Comprehensive IP Search",
      "Drafting IP Application",
      "Filing with Government Registry",
      "Reply to Examination Reports",
      "Hearing Support if needed",
    ];
    documents = ["Brand Name/Logo/Invention Details", "Applicant Identity Proof", "Business Registration Proof", "User Affidavit (if applicable)", "Power of Attorney"];
    process = ["IP Search", "Draft Application", "Filing & Acknowledgment", "Examination Review", "Registration Granted"];
    price = "Rs. 5,999";
    oldPrice = "Rs. 8,999";
    timeframe = "3-5 Working Days";
  } else if (category.includes("Lawyer") || category.includes("Litigation") || category.includes("Notice") || category.includes("Complaint")) {
    features = [
      "Verified Experienced Lawyers",
      "Confidential Consultation",
      "Strategic Legal Notice Drafting",
      "End-to-end Litigation Support",
      "Alternative Dispute Resolution",
    ];
    documents = ["Relevant Case Facts", "Previous Notices (if any)", "Evidences/Contracts", "Identity Proof", "Address Proof"];
    process = ["Book Consultation", "Case Evaluation", "Drafting Legal Strategy", "Issuing Notice/Filing", "Representation"];
    price = "Rs. 1,499";
    oldPrice = "Rs. 2,499";
    timeframe = "Immediate Support";
  } else if (category.includes("Document") || category.includes("Contract") || category.includes("Agreement") || category.includes("HR Policies")) {
    features = [
      "Legally Vetted Templates",
      "Customized Clause Drafting",
      "Review by Senior Corporate Lawyers",
      "Unlimited Revisions (Up to 3 Days)",
      "Ready to execute format",
    ];
    documents = ["Party Details", "Commercial Terms", "Obligations & Deliverables", "Termination Clauses", "Dispute Resolution Details"];
    process = ["Share Requirements", "First Draft Creation", "Client Review", "Revisions", "Final Legal Document"];
    price = "Rs. 1,999";
    oldPrice = "Rs. 3,499";
    timeframe = "2-4 Working Days";
  }

  return {
    title,
    shortTitle: title,
    subtitle: `Get expert-led support for ${ title } with complete compliance and fast turnaround.`,
    intro: `Veagle Space Technology helps you seamlessly navigate eligibility, documents, timelines, and filing steps for ${ title } across India.`,
    category,
    price,
    oldPrice,
    govtFees: price === "Talk to Expert" ? "Transparent quote" : "+ Govt. Fees",
    timeframe,
    guarantee: "100% Satisfaction with expert Legal & Tax professionals.",
    formTitle: `Get Started with ${ title }`,
    reviewedBy: "Compliance expert",
    features,
    benefits,
    documents,
    process,
    faqs: [
      { q: `What is the step-by-step process for ${title}?`, a: `The process for ${title} begins with an initial consultation where our experts evaluate your specific requirements. We then gather the required paperwork, draft the necessary applications, and file them directly with the relevant government authorities on your behalf.` },
      { q: `What documents do I need to provide for ${title}?`, a: `While requirements vary, you typically need basic identity proofs (PAN, Aadhaar), address proofs, and your business registration details. Once you start the process for ${title}, our team will provide a customized, exact document checklist.` },
      { q: `How much time does it take to complete ${title}?`, a: `The timeline for ${title} depends heavily on government processing speeds and how quickly you can provide the required documents. However, Veagle Space guarantees fast-track preparation and filing to ensure the quickest possible completion.` },
      { q: `Can I complete the ${title} procedure entirely online?`, a: `Yes! Veagle Space offers a 100% digital and paperless process for ${title}. You can securely upload your documents to our portal, and our experts will handle all the regulatory filings without you needing to visit any offices.` },
      { q: `Why should I choose Veagle Space for ${title}?`, a: `Choosing Veagle Space for ${title} means you get transparent pricing with no hidden charges, support from dedicated legal professionals, and guaranteed compliance. We take care of all the legalities so you can focus entirely on running your business.` }
    ]
  };
}

function buildPackages(service) {
  if (service.shortTitle === "GST Registration") {
    return [
      {
        name: "Standard",
        desc: "48-hours fast track GST application",
        oldPrice: "Rs. 799",
        price: "Rs. 399",
        tag: "50% off",
        items: [ "GST form filing in under 48 hours", "GST certificate support" ],
      },
      {
        name: "Premium",
        desc: "24-hours fast track GST application",
        oldPrice: "Rs. 3,999",
        price: "Rs. 1,999",
        tag: "Recommended Plan",
        highlighted: true,
        items: [
          "GST application filed within 24 hours",
          "GST registration completed in eligible cases",
          "Error-free documentation review",
          "ARN generated on priority basis",
          "Free GST compliance checklist",
          "Dedicated GST expert support",
        ],
      },
      {
        name: "Custom Plan",
        desc: "Perfect for registration and tax filings",
        oldPrice: null,
        price: "Custom Quote",
        tag: "Tailored",
        items: [ "Expert assisted process", "GST registration", "MSME registration guidance", "GST filing support for 12 months" ],
      },
    ];
  }

  return [
    {
      name: "Standard",
      desc: `Essential support for ${ service.shortTitle }`,
      oldPrice: service.oldPrice,
      price: service.price,
      tag: "Starter",
      items: [ "Expert callback", "Document checklist", "Application preparation" ],
    },
    {
      name: "Premium",
      desc: "Priority filing with expert review",
      oldPrice: service.oldPrice,
      price: service.price,
      tag: "Recommended Plan",
      highlighted: true,
      items: [ "Everything in Standard", "Priority document review", "Filing support", "Dedicated expert coordination" ],
    },
    {
      name: "Custom Plan",
      desc: "End-to-end managed support tailored to your needs",
      oldPrice: null,
      price: "Custom Quote",
      tag: "Tailored",
      items: [ "Everything in Premium", "Additional compliance guidance", "Post-completion support", "Follow-up reminders" ],
    },
  ];
}

function ServiceTabs() {
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      // Find the current section
      const sections = contentTabs.map(t => document.getElementById(t.id)).filter(Boolean);
      let current = "";
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        // 150px offset to account for sticky header and the tabs themselves
        if (rect.top <= 180) {
          current = section.id;
        }
      }
      setActiveTab(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // initial check
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-[70px] md:top-[90px] z-30 mb-8 -mx-4 sm:mx-0 flex justify-center overflow-hidden px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-none sm:rounded-full px-2 py-2 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
        <nav className="flex items-center justify-between gap-1 sm:gap-2 min-w-max w-full px-1" aria-label="Service details">
          {contentTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a 
                key={tab.id} 
                href={`#${tab.id}`}
                className={`px-4 md:px-6 py-2 text-[0.85rem] md:text-sm font-bold rounded-sm sm:rounded-full transition-all duration-300 whitespace-nowrap text-center flex-1 ${
                  isActive
                    ? "bg-[#d29052] text-white shadow-md shadow-indigo-500/30" 
                    : "text-slate-500 hover:bg-[#d29052]/10 hover:text-[#d29052]"
                }`}
              >
                {tab.label === "Why Veagle Space Technology?" ? "Why Us?" : tab.label}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function TestimonialsSection({ slug }) {
  const { data, isLoading } = useGetPublicReviewsQuery({ serviceSlug: slug });
  const { data: generalData } = useGetPublicReviewsQuery({ general: "true" });

  // Merge: service-specific first, then fill with general if less than 3
  const serviceReviews = data?.data || [];
  const generalReviews = generalData?.data || [];
  const combined = [
    ...serviceReviews,
    ...generalReviews.filter((r) => !serviceReviews.find((sr) => sr.id === r.id)),
  ].slice(0, 6);

  // Fallback static reviews if nothing in DB yet
  const fallback = [
    { name: "Rahul D.", text: "Veagle Space Technology made my company registration so smooth. Highly recommended!", rating: 5, company: "Entrepreneur", location: "Mumbai" },
    { name: "Sneha M.", text: "The GST registration was done in 2 days. Excellent CA support.", rating: 5, company: "CA Firm", location: "Pune" },
    { name: "Amit K.", text: "Trademark registration was always confusing to me, but they simplified it.", rating: 5, company: "Startup Founder", location: "Bangalore" },
  ];

  const reviews = combined.length > 0 ? combined : fallback;

  return (
    <section className="mb-12" id="testimonials">
      <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">What our customers say</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-none border border-slate-200 animate-pulse h-44 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={rev.id || idx} className="bg-white p-6 rounded-none shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col h-full transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
              <div className="flex gap-1 text-[#d29052] mb-4" aria-label={`${rev.rating || 5} star rating`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill={star <= (rev.rating || 5) ? "currentColor" : "none"} className={star <= (rev.rating || 5) ? "text-[#d29052]" : "text-slate-300"} />
                ))}
              </div>
              <p className="text-slate-600 text-sm font-medium mb-5 leading-relaxed flex-grow">&quot;{rev.text}&quot;</p>
              <div className="flex flex-col border-t border-slate-200 pt-4 mt-auto">
                <strong className="text-slate-900 text-sm">{rev.name}</strong>
                <span className="text-slate-500 text-xs">
                  {[rev.company, rev.location].filter(Boolean).join(" · ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RelatedSections({ service }) {
  const [showAllPages, setShowAllPages] = useState(false);

  const displayedPages = showAllPages ? relatedPagesList : relatedPagesList.slice(0, 5);

  return (
    <section className="space-y-10 pb-16">

      <div className="bg-white rounded-none p-6 md:p-8 border border-slate-200 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Other Important Pages Related to {service.category}</h2>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {displayedPages.map((page) => (
            <Link key={page} href={`/${page.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-[0.75rem] md:text-[0.8rem] font-semibold text-slate-600 hover:text-[#d29052] bg-slate-50 hover:bg-slate-50 px-3 md:px-4 py-2 rounded-full transition-colors border border-slate-200">
              {page}
            </Link>
          ))}
        </div>
        {!showAllPages && relatedPagesList.length > 5 && (
          <div className="mt-6 text-center">
            <button onClick={() => setShowAllPages(true)} className="text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-6 py-2.5 rounded-full transition-colors">
              View All Pages
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ServicePageClient({ slug }) {
  const service = useMemo(() => {
    const custom = serviceData[slug];
    const generic = buildGenericService(slug);
    if (!custom) return generic;
    return { ...generic, ...custom };
  }, [slug]);

  const isRegistrationPage = slug.includes("registration") || 
    (service.category && (
      service.category.includes("Registration") || 
      service.category.includes("Company") || 
      service.category.includes("License") || 
      service.category.includes("Business Setup") ||
      service.category.includes("Start a Business")
    ));

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/plans/service/${slug}`);
        const json = await res.json();
        if (json.ok) {
          if (json.data && json.data.length > 0) {
            setPlans(json.data);
            setSelectedPlan(json.data.find(p => p.name === "Premium" || p.isHighlighted) || json.data[0]);
          } else if (json.serviceExists) {
            // Service is configured in DB but has 0 plans intentionally
            setPlans([]);
            setSelectedPlan(null);
          } else {
            // Service not yet migrated to DB, use legacy fallback
            const defaultPlans = buildPackages(service);
            setPlans(defaultPlans);
            setSelectedPlan(defaultPlans.find(p => p.name === "Premium" || p.isHighlighted) || defaultPlans[0]);
          }
        } else {
          throw new Error("API returned not ok");
        }
      } catch (error) {
        console.warn("Using fallback plans (API not available or failed to fetch).");
        const defaultPlans = buildPackages(service);
        setPlans(defaultPlans);
        setSelectedPlan(defaultPlans.find(p => p.name === "Premium" || p.isHighlighted) || defaultPlans[0]);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, [slug, service]);

  const displayPrice = useMemo(() => {
    if (plansLoading) return "Loading...";
    const targetPlan = selectedPlan || (plans && plans.length > 0 ? (plans.find(p => p.name === "Premium" || p.isHighlighted) || plans[0]) : null);
    
    if (targetPlan && targetPlan.price) {
      // format price if it's just a number
      const priceStr = String(targetPlan.price).trim();
      if (/^\d+$/.test(priceStr)) {
        return `Rs. ${Number(priceStr).toLocaleString('en-IN')}`;
      }
      return priceStr;
    }

    // If service was loaded from DB and has explicitly 0 plans, return null
    if (!plansLoading && plans && plans.length === 0) {
      return null;
    }
    
    return service.price;
  }, [plans, service, plansLoading, selectedPlan]);

  const displayFeatures = useMemo(() => {
    if (selectedPlan && (selectedPlan.features || selectedPlan.items)) {
      return selectedPlan.features || selectedPlan.items;
    }
    return service.features;
  }, [selectedPlan, service.features]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8 md:py-12 flex flex-col lg:flex-row gap-8 items-start">

        {/* ── LEFT: all scrollable content ── */}
        <div className="w-full lg:flex-1 min-w-0">

          {/* Hero */}
          <section className="bg-slate-50 text-slate-900 p-8 md:p-4 md:p-12 mb-8 relative overflow-hidden">
            {/* Dark background simulation */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-multiply opacity-5"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">
                <Link href="/" className="hover:text-[#d29052] transition-colors">Home</Link>
                <ChevronRight size={14} className="opacity-50" />
                <span>{service.category}</span>
                <ChevronRight size={14} className="opacity-50" />
                <span className="text-[#d29052]">{service.shortTitle}</span>
              </div>

              <div className="inline-flex items-center gap-2 bg-[#d29052]/20 text-[#d29052] border border-[#d29052]/30 px-3 py-1.5 text-xs font-bold mb-6 uppercase tracking-wider">
                <Shield size={14} />
                Secure Consultation
              </div>

              <h1 className="text-3xl md:text-[2.5rem] font-black text-slate-900 leading-[1.15] tracking-tight mb-4">
                {service.title}
              </h1>

              <div className="mb-6 border-b border-slate-200 pb-6">
                <p className="text-slate-700 text-[1.05rem] leading-relaxed max-w-3xl mb-4 font-light">
                  {service.intro}
                </p>
                <div className="flex items-center flex-wrap gap-2 text-sm">
                  <div className="flex items-center text-white bg-[#d29052] px-2 py-0.5 font-bold mr-2">
                    <Star size={12} className="mr-1" fill="currentColor" /> 4.8/5
                  </div>
                  <span className="text-slate-500">Reviewed by</span>
                  <Link href="/reviews" className="text-[#d29052] font-bold hover:underline">
                    {service.reviewedBy}
                  </Link>
                  <span className="text-slate-300 mx-1">•</span>
                  <span className="text-slate-500 italic text-xs">Updated {LAST_UPDATED}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center mb-8 w-fit">
                {displayPrice && (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest">Professional Fees</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-[#d29052]">{displayPrice}</span>
                        <span className="text-xs font-semibold text-slate-500">{service.govtFees}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-slate-100 mx-2"></div>
                  </>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest">Estimated Time</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900">{service.timeframe.split(' ')[0]}</span>
                    <span className="text-xs font-semibold text-slate-500">{service.timeframe.split(' ').slice(1).join(' ')}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-8">
                {displayFeatures.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-5 h-5 bg-[#d29052]/20 text-[#d29052] flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-light text-slate-800">{feature}</span>
                  </div>
                ))}
              </div>

              <a href="#packages" className="inline-flex items-center justify-center gap-2 bg-[#d29052] text-white px-8 py-3.5 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                <FileText size={18} /> View Packages
              </a>
            </div>
          </section>

          <div className="block lg:hidden mb-10 -mt-2">
            <Suspense fallback={<div className="h-96 w-full bg-white animate-pulse rounded-none border border-slate-200 flex items-center justify-center text-slate-500 font-semibold">Loading form...</div>}>
              <ConsultForm
                formTitle={service.formTitle}
                serviceName={service.title}
                isRegistration={isRegistrationPage}
                slug={slug}
                mainCategory={service.category}
                selectedPlan={selectedPlan}
              />
            </Suspense>
          </div>
        </div>

        <aside className="hidden lg:block w-full lg:w-[380px] lg:shrink-0 sticky top-[100px] z-20">
          <Suspense fallback={<div className="h-[500px] w-full bg-white animate-pulse rounded-none border border-slate-200 flex items-center justify-center text-slate-500 font-semibold">Loading form...</div>}>
            <ConsultForm
              formTitle={service.formTitle}
              serviceName={service.title}
              isRegistration={isRegistrationPage}
              slug={slug}
              mainCategory={service.category}
              selectedPlan={selectedPlan}
            />
          </Suspense>
        </aside>
      </div>

      {/* Bottom Section: Full Width Content */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          {/* Trust bar */}
          <div className="mb-8">
            <TrustSection />
          </div>

          {/* Packages */}
          <PackageCards service={service} plans={plans} onSelectPlan={setSelectedPlan} />

          {/* Tab nav & Detail Content Wrapper for sticky scope */}
          <div className="relative">
            {/* Tab nav */}
            <ServiceTabs />

            {/* Detail content sections */}
            <div className="space-y-6 mb-12">
            <article id="overview" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-200 pb-3">{service.shortTitle} Overview</h2>
              <p className="text-slate-600 text-[0.95rem] leading-relaxed mb-4">{service.intro}</p>
              <p className="text-slate-600 text-[0.95rem] leading-relaxed bg-[#d29052]/10 p-4 rounded-none border border-[#d29052]/30">
                Our team helps with eligibility checks, document collection, application preparation, filing, and follow-up support so the process stays clear from start to finish.
              </p>
            </article>

            <article id="eligibility" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-200 pb-3">Eligibility & Requirements</h2>
              {service.eligibility ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                  {service.eligibility.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-none p-4 border border-slate-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                      <CheckCircle2 className="text-[#d29052] shrink-0 mt-0.5" size={18} />
                      <span className="text-sm font-medium text-slate-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-slate-600 text-[0.95rem] leading-relaxed mb-6">
                    You may need this service when you are starting a business, regularising an existing business, expanding operations, handling filings, or responding to a compliance requirement.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[ "Businesses", "Professionals", "Startups", "Existing firms" ].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 bg-slate-50 rounded-none px-4 py-3 border border-slate-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                        <CheckCircle2 size={16} className="text-[#d29052] shrink-0" />
                        <span className="text-sm font-bold text-slate-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </article>

            <article id="types" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-200 pb-3">Types and Coverage</h2>
              {service.types ? (
                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
                  {service.types.map((type, i) => (
                    <div key={i} className="bg-slate-50 rounded-none p-4 border border-slate-100 flex flex-col transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-none bg-[#d29052]/20 text-[#d29052] flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                        <h3 className="font-bold text-slate-900">{type.title}</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{type.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-[0.95rem] leading-relaxed">
                  Based on your requirement, experts can assist with fresh applications, amendments, documentation, renewals, notices, and ongoing compliance support.
                </p>
              )}
            </article>

            <article id="benefits" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-3">Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
                {service.benefits.map((benefit, i) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-none bg-[#d29052]/20 text-[#d29052] flex items-center justify-center font-black shrink-0 border border-[#d29052]/30">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article id="fees" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-3">Fees</h2>
              <div className="flex flex-col gap-4">
                {displayPrice && (
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-none border border-slate-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                    <span className="text-sm font-semibold text-slate-600">Professional fee starts at</span>
                    <strong className="text-lg font-black text-[#d29052]">{displayPrice}</strong>
                  </div>
                )}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-none border border-slate-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                  <span className="text-sm font-semibold text-slate-600">Government fees</span>
                  <strong className="text-base font-bold text-slate-900">{service.govtFees}</strong>
                </div>
              </div>
            </article>

            <article id="timeline" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-3">Timeline</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-[#d29052]/10 p-4 rounded-none border border-[#d29052]/30">
                  <span className="text-sm font-semibold text-[#d29052]">Estimated completion</span>
                  <strong className="text-base font-bold text-[#d29052]">{service.timeframe}</strong>
                </div>
              </div>
            </article>

            <article id="documents" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-3">Documents Required</h2>
              <ul className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
                {service.documents.map((document) => (
                  <li key={document} className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-none border border-slate-100">
                    <FileText size={16} className="text-[#d29052] shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{document}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article id="process" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-200 pb-3">Process</h2>
              <div className="relative border-l-2 border-[#d29052]/30 ml-4 space-y-8">
                {service.process.map((step, index) => (
                  <div key={step} className="relative pl-8">
                    <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-none bg-slate-50 border-4 border-[#d29052]/20 flex items-center justify-center transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                      <div className="w-2.5 h-2.5 rounded-none bg-[#d29052]"></div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-none transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                      <span className="text-xs font-black text-[#d29052] uppercase tracking-widest mb-1 block">Step {index + 1}</span>
                      <h3 className="text-sm font-bold text-slate-900">{step}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article id="why-us" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-3">Why Veagle Space?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-50 rounded-none p-4 border border-slate-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                  <Shield className="mx-auto mb-3 text-[#d29052]" size={24} />
                  <span className="text-xs font-bold text-slate-700">Verified<br/>Professionals</span>
                </div>
                <div className="bg-slate-50 rounded-none p-4 border border-slate-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                  <Clock className="mx-auto mb-3 text-[#d29052]" size={24} />
                  <span className="text-xs font-bold text-slate-700">Clear<br/>Timelines</span>
                </div>
                <div className="bg-slate-50 rounded-none p-4 border border-slate-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                  <Award className="mx-auto mb-3 text-[#d29052]" size={24} />
                  <span className="text-xs font-bold text-slate-700">Transparent<br/>Pricing</span>
                </div>
                <div className="bg-slate-50 rounded-none p-4 border border-slate-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-[#d29052]/50">
                  <FileText className="mx-auto mb-3 text-[#d29052]" size={24} />
                  <span className="text-xs font-bold text-slate-700">Document-led<br/>Process</span>
                </div>
              </div>
            </article>

            <article id="faqs" className="scroll-mt-[150px] md:scroll-mt-[180px] bg-white rounded-none p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-3">Frequently Asked Questions</h2>
              <FAQ faqs={service.faqs || standardFaqs} />
            </article>
          </div>
          </div>

          {/* Testimonials */}
          <TestimonialsSection slug={slug} />

          {/* Related links */}
          <RelatedSections service={service} />
        </div>


    </div>
  );
}
