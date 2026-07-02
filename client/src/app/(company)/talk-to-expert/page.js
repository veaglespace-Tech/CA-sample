"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronDown, Phone, Shield, Star, Mail, MapPin, MessageSquareText } from "lucide-react";
import dynamic from 'next/dynamic';
const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });
import 'react-phone-input-2/lib/style.css';
import ProblemCategoryModal from "../../../components/ui/ProblemCategoryModal";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateRequired,
} from "../../../lib/validators";
import FormFeedback from "../../../components/forms/FormFeedback";
import useLiveValidation from "../../../hooks/useLiveValidation";
import { siteMeta } from "../../../lib/navigation-data";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada", "Malayalam", "Gujarati"];

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
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const validators = {
    fullName: (value) => validateName(value),
    email: (value) => validateEmail(value),
    phone: (value) => validatePhone(value),
    language: (value) => validateRequired(value, "Preferred language"),
    problemType: (value) => validateRequired(value, "Problem category/type"),
  };
  const { errors, validateField, validateForm, getFieldSuccess } = useLiveValidation(validators);

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

  async function handleFormSubmit(event) {
    event.preventDefault();
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
          serviceName: `Expert Consultation - ${form.problemCategory || "General"}`,
          message: `Problem: ${form.problemType || "Not selected"}\nLanguage: ${form.language || "Not selected"}`,
          pagePath: "/talk-to-expert",
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
    } catch (error) {
      console.error("[TalkToExpert] Save failed:", error);
      setSaveError("Saving failed. Please try again.");
    }
    setSaving(false);
  }

  function handleProblemSelect(category, problem) {
    const nextForm = { ...form, problemCategory: category, problemType: problem };
    setForm(nextForm);
    validateField("problemType", problem, nextForm);
    setShowProblemModal(false);
  }

  function handleLanguageSelect(language) {
    const nextForm = { ...form, language };
    setForm(nextForm);
    validateField("language", language, nextForm);
    setShowLangDropdown(false);
  }

  if (submitted) {
    return (
      <div className="bg-white p-8 md:p-14 rounded-none shadow-xl border border-slate-100 text-center relative z-10 w-full animate-fade-in-up">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <Check size={48} strokeWidth={3} />
        </div>
        <h3 className="text-3xl font-black text-navy mb-4 tracking-tight">Appointment Booked!</h3>
        <p className="text-slate-600 font-medium leading-relaxed text-lg">
          Our verified expert will call you shortly on <br/><strong className="text-navy text-xl mt-2 block">+91 {form.phone}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-10 rounded-none shadow-2xl border border-slate-100 relative z-10 w-full animate-fade-in-up">
      {showProblemModal && (
        <ProblemCategoryModal
          onSelect={handleProblemSelect}
          onClose={() => setShowProblemModal(false)}
        />
      )}

      <div className="mb-8 border-b border-slate-100 pb-6">
        <h3 className="font-heading text-2xl sm:text-3xl font-black text-navy tracking-tight">Request a Callback</h3>
        <p className="text-sm font-semibold text-slate-500 mt-2 leading-relaxed">
          Fill in your details and select a problem type. We'll instantly assign the right expert to assist you.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <input
              type="text"
              placeholder="Full Name *"
              value={form.fullName}
              onChange={(event) => handleFieldChange("fullName", event.target.value)}
              className={`w-full px-5 py-4 bg-slate-50 border rounded-none outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-gold/30 ${errors.fullName ? "border-rose-400 focus:border-rose-500" : getFieldSuccess("fullName", form.fullName) ? "border-emerald-400 focus:border-emerald-500 bg-emerald-50/50" : "border-slate-200 focus:border-gold"}`}
              maxLength={50}
            />
            <FormFeedback error={errors.fullName} success={getFieldSuccess("fullName", form.fullName)} />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(event) => handleFieldChange("email", event.target.value)}
              className={`w-full px-5 py-4 bg-slate-50 border rounded-none outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-gold/30 ${errors.email ? "border-rose-400 focus:border-rose-500" : getFieldSuccess("email", form.email) ? "border-emerald-400 focus:border-emerald-500 bg-emerald-50/50" : "border-slate-200 focus:border-gold"}`}
            />
            <FormFeedback error={errors.email} success={getFieldSuccess("email", form.email)} />
          </div>
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
                height: '3.5rem',
                paddingLeft: '3.5rem',
                borderRadius: '0',
                border: errors.phone ? '1px solid #fb7185' : getFieldSuccess("phone", form.phone) ? '1px solid #34d399' : '1px solid #e2e8f0',
                backgroundColor: errors.phone ? '#fff1f2' : getFieldSuccess("phone", form.phone) ? '#ecfdf5' : '#f8fafc',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0f172a',
              }}
              buttonStyle={{
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '0',
                paddingLeft: '0.5rem'
              }}
              containerStyle={{
                width: '100%'
              }}
            />
          </div>
          <FormFeedback error={errors.phone} success={getFieldSuccess("phone", form.phone)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="relative">
            <button
              type="button"
              className={`w-full flex items-center justify-between px-5 py-4 bg-slate-50 border rounded-none outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-gold/30 ${errors.language ? "border-rose-400 focus:border-rose-500" : getFieldSuccess("language", form.language) ? "border-emerald-400 focus:border-emerald-500 bg-emerald-50/50" : "border-slate-200 focus:border-gold"}`}
              onClick={() => setShowLangDropdown((current) => !current)}
            >
              <span className={form.language ? "text-slate-900" : "text-slate-400"}>{form.language || "Language *"}</span>
              <ChevronDown size={18} className="text-slate-400" />
            </button>
            <FormFeedback error={errors.language} success={getFieldSuccess("language", form.language)} />
            {showLangDropdown && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-none shadow-xl max-h-60 overflow-y-auto py-1">
                {LANGUAGES.map((language) => (
                  <button
                    key={language}
                    type="button"
                    className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-slate-50 transition-colors ${form.language === language ? "text-gold bg-gold/5 font-bold border-l-2 border-gold" : "text-slate-700 border-l-2 border-transparent"}`}
                    onClick={() => handleLanguageSelect(language)}
                  >
                    {language}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              className={`w-full flex items-center justify-between px-5 py-4 bg-slate-50 border rounded-none outline-none transition-all text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-gold/30 ${errors.problemType ? "border-rose-400 focus:border-rose-500" : getFieldSuccess("problemType", form.problemType) ? "border-emerald-400 focus:border-emerald-500 bg-emerald-50/50" : "border-slate-200 focus:border-gold"}`}
              onClick={() => setShowProblemModal(true)}
            >
              <span className={form.problemType ? "text-slate-900 truncate" : "text-slate-400"}>{form.problemType || "Problem Type *"}</span>
              <ChevronDown size={18} className="text-slate-400 shrink-0" />
            </button>
            <FormFeedback error={errors.problemType} success={getFieldSuccess("problemType", form.problemType)} />
          </div>
        </div>

        {saveError && <p className="text-rose-500 text-xs font-bold mt-1">{saveError}</p>}

        <label className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs font-semibold text-slate-600 p-4 border border-emerald-100 bg-emerald-50/30 rounded-none cursor-pointer mt-2">
          <div className="flex-1 flex items-center gap-2">
            <span>Get easy updates through</span>
            <span className="flex items-center justify-center w-5 h-5 bg-[#25D366] text-white rounded-full text-[10px]">💬</span>
            <span className="text-[#25D366] font-bold">Whatsapp</span>
          </div>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              checked={form.whatsapp}
              onChange={(event) => handleFieldChange("whatsapp", event.target.checked)}
              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-200 appearance-none cursor-pointer transition-transform duration-300 checked:translate-x-5 checked:border-[#25D366]"
            />
            <div className={`toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer transition-colors duration-300 ${form.whatsapp ? "bg-[#25D366]" : ""}`}></div>
          </div>
        </label>

        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-orange-500 text-white px-6 py-4 rounded-none font-black tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-gold/30 transition-all active:scale-[0.98] mt-4" disabled={saving}>
          {saving ? "Processing..." : "Book An Appointment Now"}
        </button>
      </form>
    </div>
  );
}

export default function TalkToExpertPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. Header Hero Banner - Solid Navy */}
      <section className="bg-navy pt-24 pb-48 px-4 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
           <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gold/30 bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.15em] shadow-sm">
             <Shield size={14} /> 100% Confidential Consultation
           </div>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
             Expert Guidance for <br/><span className="text-gold">Your Business Growth.</span>
           </h1>
           <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
             Get clear, actionable advice from verified CA, CS, and Legal professionals. Available whenever you need.
           </p>
        </div>
      </section>

      {/* 2. Overlapping Content */}
      <section className="max-w-7xl mx-auto px-4 w-full -mt-32 relative z-20 pb-24">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 xl:gap-12 items-start">
          
          {/* Left: Contact Info & Value Props */}
          <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {/* Contact Details Card */}
            <div className="bg-white p-8 border border-slate-100 shadow-xl rounded-none hover:border-gold/30 transition-colors">
               <h3 className="text-xl font-black text-navy mb-8">Direct Support</h3>
               <div className="space-y-8">
                 <div className="flex items-start gap-5">
                   <div className="w-12 h-12 bg-navy-light/5 flex items-center justify-center text-navy shrink-0 border border-slate-100">
                     <Phone size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Call Us</p>
                     <p className="text-lg font-black text-slate-900">{siteMeta.phone}</p>
                     <p className="text-lg font-black text-slate-900">{siteMeta.phone2}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-5">
                   <div className="w-12 h-12 bg-navy-light/5 flex items-center justify-center text-navy shrink-0 border border-slate-100">
                     <Mail size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Us</p>
                     <p className="text-lg font-black text-slate-900">{siteMeta.email}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-5">
                   <div className="w-12 h-12 bg-navy-light/5 flex items-center justify-center text-navy shrink-0 border border-slate-100">
                     <MapPin size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visit Us</p>
                     <p className="text-sm font-bold text-slate-900 leading-relaxed max-w-[250px]">{siteMeta.address}</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Value Props Card */}
            <div className="bg-gradient-to-br from-gold to-orange-500 p-8 text-white shadow-xl rounded-none relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-10">
                 <MessageSquareText size={140} className="-mr-8 -mt-8" />
               </div>
               <h3 className="text-xl font-black mb-2 relative z-10">Why Talk to Us?</h3>
               <p className="text-sm font-medium text-white/80 mb-6 relative z-10 leading-relaxed">
                 We ensure you are connected with the right professional who understands your specific industry needs.
               </p>
               <ul className="space-y-4 relative z-10">
                 <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} /> Instant Expert Allocation</li>
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
