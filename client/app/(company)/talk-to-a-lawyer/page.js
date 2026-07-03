"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Check, Shield, ChevronDown, Phone, Users, Star, Mail, MapPin } from "lucide-react";
import dynamic from 'next/dynamic';
const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });
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
import { siteMeta } from "../../../lib/navigation-data";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada", "Malayalam", "Gujarati"];

const TESTIMONIALS = [
  {
    text: "The Veagle Space Technology Pvt. Ltd. team is truly amazing. They helped me resolve my property dispute efficiently and professionally.",
    name: "Kalpesh Salunke",
    verified: true,
  },
  {
    text: "Received a wonderful consultation regarding my civil matter at a very affordable cost. Highly recommended!",
    name: "Jasveer Singh",
    verified: true,
  },
  {
    text: "I had a great experience with Veagle Space Technology Pvt. Ltd.. Their team helped me resolve my GST issue smoothly and guided me through the process.",
    name: "Sumit Kumar",
    verified: true,
  },
  {
    text: "As an entrepreneur, I value efficiency and clarity — and Veagle Space Technology Pvt. Ltd. delivered both. Their legal team is proactive and professional.",
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
      <div className="bg-white p-4 md:p-10 rounded-none shadow-xl border border-slate-100 text-center relative z-10 w-full max-w-md mx-auto transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Appointment Booked!</h3>
        <p className="text-slate-500 font-medium leading-relaxed">Our verified lawyer will call you shortly on +91 {form.phone}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-none shadow-2xl border border-slate-100 relative z-10 w-full transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
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

      <form onSubmit={handleFormSubmit} className="space-y-4 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" noValidate>
        <div>
          <input
            type="text"
            placeholder="Full Name *"
            value={form.fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            className={`w-full px-4 py-3.5 bg-slate-50 border rounded-sm outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${errors.fullName ? "border-red-400 focus:border-red-500" : getFieldSuccess("fullName", form.fullName) ? "border-green-400 focus:border-green-500 bg-green-50/50" : "border-slate-200 focus:border-blue-500"}`}
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
            className={`w-full px-4 py-3.5 bg-slate-50 border rounded-sm outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${errors.email ? "border-red-400 focus:border-red-500" : getFieldSuccess("email", form.email) ? "border-green-400 focus:border-green-500 bg-green-50/50" : "border-slate-200 focus:border-blue-500"}`}
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
            className={`w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border rounded-sm outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${errors.language ? "border-red-400 focus:border-red-500" : getFieldSuccess("language", form.language) ? "border-green-400 focus:border-green-500 bg-green-50/50" : "border-slate-200 focus:border-blue-500"}`}
            onClick={() => setShowLangDropdown(!showLangDropdown)}
          >
            <span className={form.language ? "text-slate-900" : "text-slate-400"}>
              {form.language || "Language *"}
            </span>
            <ChevronDown size={18} className="text-slate-400" />
          </button>
          <FormFeedback error={errors.language} success={getFieldSuccess("language", form.language)} />
          {showLangDropdown && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-sm shadow-xl max-h-60 overflow-y-auto py-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${form.language === lang ? "text-gold bg-gold/10/50 font-bold" : "text-slate-700"}`}
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
            className={`w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border rounded-sm outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${errors.problemType ? "border-red-400 focus:border-red-500" : getFieldSuccess("problemType", form.problemType) ? "border-green-400 focus:border-green-500 bg-green-50/50" : "border-slate-200 focus:border-blue-500"}`}
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

        <label className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs font-semibold text-slate-500 p-2 border border-green-100 bg-green-50/30 rounded-sm cursor-pointer">
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
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-sm font-bold hover:shadow-lg hover:shadow-gold/30 transition-all active:scale-[0.98] mt-2"
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Header Hero Banner - Solid Navy */}
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
           <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
             <Shield size={14} /> 100% Confidential Consultation
           </div>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
             Online Lawyer Consultation. <br/><span className="text-gold">Anytime, Anywhere.</span>
           </h1>
           <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
             Get personalized guidance from verified senior lawyers. Available 24/7. Satisfaction Guaranteed.
           </p>
        </div>
      </section>

      {/* 2. Overlapping Content */}
      <section className="max-w-7xl mx-auto px-4 w-full -mt-32 relative z-20 pb-24">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 xl:gap-12 items-start">
          
          {/* Left: Contact Info & Value Props */}
          <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {/* Stats Card */}
            <div className="bg-white p-6 border border-slate-100 shadow-xl rounded-none flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Users size={20} className="text-emerald-500" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                </div>
                <span className="text-sm text-slate-900 font-semibold"><strong>220+</strong> online</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Phone size={20} className="text-amber-500" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                </div>
                <span className="text-sm text-slate-900 font-semibold"><strong>92</strong> live calls</span>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="relative rounded-none bg-white shadow-xl border-slate-100 border p-8 hover:border-gold/30 transition-colors">
              <div className="text-amber-400 mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 font-medium italic text-sm leading-relaxed mb-6 min-h-[60px]">
                &quot;{TESTIMONIALS[activeTestimonial].text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {TESTIMONIALS[activeTestimonial].name.charAt(0)}
                </div>
                <div>
                  <p className="text-slate-900 text-sm font-bold">{TESTIMONIALS[activeTestimonial].name}</p>
                  {TESTIMONIALS[activeTestimonial].verified && (
                    <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5"><Check size={12} /> Verified Client</p>
                  )}
                </div>
              </div>
              
              {/* Pagination Dots */}
              <div className="absolute bottom-8 right-8 flex gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? "bg-navy w-4" : "bg-slate-200 hover:bg-slate-300"}`}
                  />
                ))}
              </div>
            </div>

            {/* Value Props Card */}
            <div className="bg-gradient-to-br from-gold to-orange-500 p-8 text-white shadow-xl rounded-none relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-10">
                 <Shield size={140} className="-mr-8 -mt-8" />
               </div>
               <h3 className="text-xl font-black mb-2 relative z-10">Why Talk to Us?</h3>
               <p className="text-sm font-medium text-white/80 mb-6 relative z-10 leading-relaxed">
                 We ensure you are connected with the right legal professional who understands your specific legal needs.
               </p>
               <ul className="space-y-4 relative z-10">
                 <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} /> Instant Lawyer Allocation</li>
                 <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} /> Transparent Pricing Models</li>
                 <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} /> Multi-lingual Support Staff</li>
                 <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} /> Secure & Confidential</li>
               </ul>
            </div>
          </div>

          {/* Right: The Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <LawyerConsultForm />
          </div>

        </div>
      </section>
    </div>
  );
}

