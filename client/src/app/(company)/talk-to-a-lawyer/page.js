"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Check, Shield, ChevronDown, Phone, Users, Star } from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  validateName,
  validatePhone,
  validateEmail,
  validateRequired,
} from "../../../lib/validators";
import ProblemCategoryModal from "../../../components/ui/ProblemCategoryModal";
import toast from "react-hot-toast";
import FormFeedback from "../../../components/forms/FormFeedback";
import useLiveValidation from "../../../hooks/useLiveValidation";
import ReviewBadge from "../../../components/common/ReviewBadge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada", "Malayalam", "Gujarati"];

const TESTIMONIALS = [
  {
    text: "The Valuexpert team is truly amazing. They helped me resolve my property dispute efficiently and professionally.",
    name: "Kalpesh Salunke",
    verified: true,
  },
  {
    text: "Received a wonderful consultation regarding my civil matter at a very affordable cost. Highly recommended!",
    name: "Jasveer Singh",
    verified: true,
  },
  {
    text: "I had a great experience with Valuexpert. Their team helped me resolve my GST issue smoothly and guided me through the process.",
    name: "Sumit Kumar",
    verified: true,
  },
  {
    text: "As an entrepreneur, I value efficiency and clarity — and Valuexpert delivered both. Their legal team is proactive and professional.",
    name: "Rishabh Parihaar",
    verified: true,
  },
  {
    text: "All my doubts were cleared and answered. Satisfied with the consultation. Will definitely come back for future needs.",
    name: "Mrudul Ramakrishnan",
    verified: true,
  },
];

/* ─── Consultation Form ─── */
function LawyerConsultForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    language: "",
    problemCategory: "",
    problemType: "",
    whatsapp: true,
  });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const validators = {
    fullName: (value) => validateName(value),
    email: (value) => validateEmail(value),
    phone: (value) => validatePhone(value),
    language: (value) => validateRequired(value, "Preferred language"),
    problemType: (value) => validateRequired(value, "Problem category/type"),
  };
  const { errors, validateField, validateForm, getFieldSuccess } = useLiveValidation(validators);

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);

  const handleFieldChange = (key, value) => {
    let finalValue = value;
    if (key === "phone" && typeof value === "object" && value && value.target) {
        finalValue = value.target.value;
    }
    const nextForm = { ...form, [key]: finalValue };
    setForm(nextForm);
    if (validators[key]) {
      validateField(key, finalValue, nextForm);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");
    const newErrors = validateForm(form);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/talk-to-expert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          serviceName: `Lawyer - ${form.problemCategory}`,
          message: form.problemType,
          pagePath: "/talk-to-a-lawyer",
          metadata: {
            language: form.language,
            problemCategory: form.problemCategory,
            problemType: form.problemType,
            whatsapp: form.whatsapp,
          },
        }),
      });

      if (!response.ok) throw new Error("Lead save failed");
      setSubmitted(true);
    } catch (err) {
      console.error("[LawyerForm] Save failed:", err);
      setSaveError("Failed to save. Please try again or contact us directly.");
    }
    setSaving(false);
  };

  const handleProblemSelect = (category, problem) => {
    const nextForm = { ...form, problemCategory: category, problemType: problem };
    setForm(nextForm);
    validateField("problemType", problem, nextForm);
    setShowProblemModal(false);
  };

  const handleLanguageSelect = (lang) => {
    const nextForm = { ...form, language: lang };
    setForm(nextForm);
    validateField("language", lang, nextForm);
    setShowLangDropdown(false);
  };

  if (submitted) {
    return (
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center relative z-10 w-full max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Appointment Booked!</h3>
        <p className="text-slate-500 font-medium leading-relaxed">Our verified lawyer will call you shortly on +91 {form.phone}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100 relative z-10 w-full">
      {showProblemModal && (
        <ProblemCategoryModal
          onSelect={handleProblemSelect}
          onClose={() => setShowProblemModal(false)}
        />
      )}

      <div className="mb-6">
        <h3 className="font-heading text-2xl font-black text-slate-900">Get Expert Legal Consultation</h3>
        <p className="text-xs font-semibold text-slate-400 mt-2">
          Complete the details below, and an expert lawyer will contact you shortly.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
        <div>
          <input
            type="text"
            placeholder="Full Name *"
            value={form.fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${errors.fullName ? "border-red-400 focus:border-red-500" : getFieldSuccess("fullName", form.fullName) ? "border-green-400 focus:border-green-500 bg-green-50/50" : "border-slate-200 focus:border-blue-500"}`}
            maxLength={50}
          />
          <FormFeedback error={errors.fullName} success={getFieldSuccess("fullName", form.fullName)} />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${errors.email ? "border-red-400 focus:border-red-500" : getFieldSuccess("email", form.email) ? "border-green-400 focus:border-green-500 bg-green-50/50" : "border-slate-200 focus:border-blue-500"}`}
          />
          <FormFeedback error={errors.email} success={getFieldSuccess("email", form.email)} />
        </div>

        <div>
          <div className="relative">
            <PhoneInput
              country={'in'}
              value={form.phone}
              onChange={(phone) => handleFieldChange("phone", phone)}
              inputProps={{
                name: 'phone',
                required: true,
              }}
              inputStyle={{
                width: '100%',
                height: '3.25rem',
                paddingLeft: '3.5rem',
                borderRadius: '0.75rem',
                border: errors.phone ? '1px solid #f87171' : getFieldSuccess("phone", form.phone) ? '1px solid #4ade80' : '1px solid #e2e8f0',
                backgroundColor: errors.phone ? '#fef2f2' : getFieldSuccess("phone", form.phone) ? '#f0fdf4' : '#f8fafc',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0f172a',
              }}
              buttonStyle={{
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '0.75rem 0 0 0.75rem',
                paddingLeft: '0.5rem'
              }}
              containerStyle={{
                width: '100%'
              }}
            />
          </div>
          <FormFeedback error={errors.phone} success={getFieldSuccess("phone", form.phone)} />
        </div>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            type="button"
            className={`w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${errors.language ? "border-red-400 focus:border-red-500" : getFieldSuccess("language", form.language) ? "border-green-400 focus:border-green-500 bg-green-50/50" : "border-slate-200 focus:border-blue-500"}`}
            onClick={() => setShowLangDropdown(!showLangDropdown)}
          >
            <span className={form.language ? "text-slate-900" : "text-slate-400"}>
              {form.language || "Language *"}
            </span>
            <ChevronDown size={18} className="text-slate-400" />
          </button>
          <FormFeedback error={errors.language} success={getFieldSuccess("language", form.language)} />
          {showLangDropdown && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${form.language === lang ? "text-primary bg-blue-50/50 font-bold" : "text-slate-700"}`}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Problem Type Dropdown */}
        <div className="relative">
          <button
            type="button"
            className={`w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${errors.problemType ? "border-red-400 focus:border-red-500" : getFieldSuccess("problemType", form.problemType) ? "border-green-400 focus:border-green-500 bg-green-50/50" : "border-slate-200 focus:border-blue-500"}`}
            onClick={() => setShowProblemModal(true)}
          >
            <span className={form.problemType ? "text-slate-900 truncate" : "text-slate-400"}>
              {form.problemType || "Problem Type *"}
            </span>
            <ChevronDown size={18} className="text-slate-400 shrink-0" />
          </button>
          <FormFeedback error={errors.problemType} success={getFieldSuccess("problemType", form.problemType)} />
        </div>

        {saveError && <p className="text-red-500 text-xs font-bold mt-1">{saveError}</p>}

        <label className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs font-semibold text-slate-500 p-2 border border-green-100 bg-green-50/30 rounded-xl cursor-pointer">
          <div className="flex-1 flex items-center gap-2">
            <span>Get easy updates through</span>
            <span className="flex items-center justify-center w-5 h-5 bg-[#25D366] text-white rounded-full text-[10px]">💬</span>
            <span className="text-[#25D366] font-bold">Whatsapp</span>
          </div>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              checked={form.whatsapp}
              onChange={(e) => handleFieldChange("whatsapp", e.target.checked)}
              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-200 appearance-none cursor-pointer transition-transform duration-300 checked:translate-x-5 checked:border-[#25D366]"
            />
            <div className={`toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer transition-colors duration-300 ${form.whatsapp ? "bg-[#25D366]" : ""}`}></div>
          </div>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98] mt-2"
        >
          {saving ? "Processing..." : "Book An Appointment Now"}
        </button>
      </form>
    </div>
  );
}

/* ─── Main Page ─── */
export default function TalkToLawyerPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Rotate testimonials every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* ═══════════════════════════════════════════
          1. HERO SECTION WITH MESH GRADIENTS
      ═══════════════════════════════════════════ */}
      <section className="relative flex flex-col overflow-hidden bg-white z-20 px-4 pb-16 pt-8 lg:pt-12 sm:px-6 lg:px-8">
        {/* Animated Radial Glows */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -left-[15%] top-[5%] h-[600px] w-[600px] animate-[float_10s_ease-in-out_infinite] rounded-full bg-blue-500/10 blur-[130px]" />
          <div className="absolute -bottom-[15%] -right-[10%] h-[700px] w-[700px] animate-[float_14s_ease-in-out_infinite_2s_reverse] rounded-full bg-violet-500/10 blur-[160px]" />
          <div className="absolute left-[35%] top-[40%] h-[500px] w-[500px] animate-[float_9s_ease-in-out_infinite_1s] rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid gap-14 lg:grid-cols-[1.2fr_1fr] items-center">
          {/* Left Column */}
          <div className="text-left">
            <div className="mb-6 animate-fade-in-up">
              <Link href="/" className="text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1">
                <span>Home</span> <span className="text-slate-600">/</span> <span>Talk To A Lawyer</span>
              </Link>
            </div>
            
            <div className="mb-6 animate-fade-in-up">
              <ReviewBadge />
            </div>
            
            <div className="mb-6 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white shadow-sm border-slate-200 px-3 py-1.5 text-xs font-semibold text-emerald-400 shadow-xl backdrop-blur-md">
                <Shield size={14} />
                Only ISO 27001 Certified Platform in India 🇮🇳
              </span>
            </div>

            <h1 className="animate-fade-in-up font-heading text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6">
              Online Lawyer Consultation.
              <br />
              <span className="relative inline-block mt-2">
                <span className="animate-[gradient-xy_6s_ease_infinite] bg-[length:300%_300%] bg-gradient-to-r from-blue-400 via-indigo-200 to-amber-300 bg-clip-text text-transparent">
                  Anytime, Anywhere.
                </span>
              </span>
            </h1>

            <ul className="space-y-4 mb-10 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              {[
                "Get personalized guidance from verified senior lawyers anytime, 24/7",
                "Confidential and Secure Consultations – Your Peace of Mind Guaranteed",
                "Satisfaction Guaranteed or Your Money Back."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 shrink-0 border border-blue-500/30">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-3 bg-white shadow-sm border-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                <div className="relative">
                  <Users size={18} className="text-emerald-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                </div>
                <span className="text-sm text-slate-900 font-semibold"><strong>220</strong> lawyers online</span>
              </div>
              <div className="flex items-center gap-3 bg-white shadow-sm border-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                <div className="relative">
                  <Phone size={18} className="text-amber-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                </div>
                <span className="text-sm text-slate-900 font-semibold"><strong>92</strong> live ongoing calls</span>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="relative rounded-2xl bg-white shadow-sm border-slate-200 border border-slate-200 p-6 backdrop-blur-md animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <div className="text-amber-400 mb-3 flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 font-medium italic text-sm leading-relaxed mb-4 min-h-[60px]">
                &quot;{TESTIMONIALS[activeTestimonial].text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {TESTIMONIALS[activeTestimonial].name.charAt(0)}
                </div>
                <div>
                  <p className="text-slate-900 text-xs font-bold">{TESTIMONIALS[activeTestimonial].name}</p>
                  {TESTIMONIALS[activeTestimonial].verified && (
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5"><Check size={10} /> Verified Client</p>
                  )}
                </div>
              </div>
              
              {/* Pagination Dots */}
              <div className="absolute bottom-6 right-6 flex gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeTestimonial ? "bg-white w-3" : "bg-white/30 hover:bg-white shadow-sm border-slate-2000"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="relative lg:mt-0 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-violet-500/20 blur-xl"></div>
            <LawyerConsultForm />
          </div>
        </div>

        {/* Diagonal Wave Bottom Decor */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50/50 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          2. TRUST BAR
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-200/60 py-12 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-widest">
            Trusted on Google and Trustpilot - Valuexpert, India leading legal-tech platform
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Google Reviews</span>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#FFB703" className="text-[#FFB703]" />
                ))}
              </div>
              <p className="text-xl font-black text-slate-900">4.5/5</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">20k+ Happy Reviews</p>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-slate-200"></div>
            
            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Trustpilot</span>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#FFB703" className="text-[#FFB703]" />
                ))}
              </div>
              <p className="text-xl font-black text-slate-900">4.5/5</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">7500+ Happy Reviews</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

