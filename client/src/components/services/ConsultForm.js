"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Check, FileText, Star } from "lucide-react";
import dynamic from 'next/dynamic';
const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });
import 'react-phone-input-2/lib/style.css';
import {
  validateName,
  validatePhone,
  validateEmail,
  validateBusinessName,
} from "../../lib/validators";
import useLiveValidation from "../../hooks/useLiveValidation";
import FormFeedback from "../forms/FormFeedback";
import { formatInrAmount, parseCurrencyAmount } from "../../lib/utils";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");

export default function ConsultForm({ formTitle, serviceName, isRegistration, slug, mainCategory, selectedPlan }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    businessName: "",
    customRequirements: "",
    whatsapp: true,
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    let nextForm = { ...form };
    let shouldUpdate = false;

    const saved = sessionStorage.getItem("consultFormDraft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        nextForm = { ...nextForm, ...parsed };
        shouldUpdate = true;
      } catch (e) {}
    }

    if (user) {
      nextForm.fullName = user.name || nextForm.fullName;
      nextForm.email = user.email || nextForm.email;
      let userPhone = user.phone || "";
      if (userPhone && userPhone.length === 10 && !userPhone.startsWith('+')) {
        userPhone = '91' + userPhone;
      }
      nextForm.phone = userPhone || nextForm.phone;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(nextForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem("consultFormDraft", JSON.stringify(form));
  }, [form]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const validators = {
    fullName: (value) => validateName(value),
    email: (value) => validateEmail(value),
    phone: (value) => validatePhone(value),
    businessName: (value) => validateBusinessName(value, true),
  };
  const { errors, validateField, validateForm, getFieldSuccess, resetValidation } = useLiveValidation(validators);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const newErrors = validateForm(form);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegistration ? "/api/registration" : "/api/consult";

      let registrationType = "OTHER";
      if (slug?.includes("company")) registrationType = "COMPANY_REGISTRATION";
      else if (slug?.includes("gst")) registrationType = "GST_REGISTRATION";
      else if (slug?.includes("trademark")) registrationType = "TRADEMARK_REGISTRATION";
      else if (slug?.includes("fssai")) registrationType = "FSSAI_REGISTRATION";
      else if (slug?.includes("msme")) registrationType = "MSME_REGISTRATION";
      else if (slug?.includes("llp")) registrationType = "LLP_REGISTRATION";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          service: serviceName,
          serviceName,
          serviceSlug: slug,
          sourcePageSlug: slug,
          pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
          registrationType: isRegistration ? registrationType : undefined,
          mainCategory,
          metadata: {
            selectedPlanId: selectedPlan?.id,
            selectedPlanName: selectedPlan?.name,
            selectedPlanPrice: selectedPlan?.price,
            selectedPlanAmount: parseCurrencyAmount(selectedPlan?.price) ?? undefined,
            customRequirements: form.customRequirements,
            whatsappOptIn: form.whatsapp,
            referredByCode: refCode || undefined
          }
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || "Request failed");
      }

      if (isRegistration && responseData.data?.id) {
        let redirectUrl = `/nextstep-registration?leadId=${responseData.data.id}`;
        if (selectedPlan) {
          if (selectedPlan.id) redirectUrl += `&planId=${encodeURIComponent(selectedPlan.id)}`;
          redirectUrl += `&planName=${encodeURIComponent(selectedPlan.name)}&planPrice=${encodeURIComponent(selectedPlan.price)}`;
          const planAmount = parseCurrencyAmount(selectedPlan.price);
          if (planAmount !== null) {
            redirectUrl += `&planAmount=${encodeURIComponent(planAmount.toFixed(2))}`;
          }
        }
        router.push(redirectUrl);
      } else {
        resetValidation();
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || "Failed to submit request. Please try again.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="card bg-base-100 shadow-2xl border border-base-200">
        <div className="card-body items-center text-center py-8 md:py-12">
          <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-2xl font-black">Request Received!</h3>
          <p className="opacity-70 mt-2">Our expert will call you within 30 minutes for a free consultation.</p>
          <button onClick={() => setSubmitted(false)} className="btn btn-ghost btn-sm mt-6">Send another request</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-200 sticky top-28 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
      <div className="group absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-white text-[10px] font-black px-4 py-1.5 rounded-none uppercase tracking-widest z-20 shadow-lg flex items-center gap-1.5 whitespace-nowrap cursor-help transition-all duration-300 hover:shadow-gold/30 hover:scale-105">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-none h-2 w-2 bg-white"></span>
        </span>
        Active Offer
        
        {/* Tooltip */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-slate-50 text-slate-900 text-[11px] font-medium px-4 py-2.5 rounded-none shadow-xl w-max max-w-[220px] text-center normal-case tracking-normal z-50 border border-slate-200 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-50 border-t border-l border-slate-200 rotate-45 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50"></div>
          🎉 Get up to <strong className="text-gold font-black">15% OFF</strong> on all services when you consult with our experts today!
        </div>
      </div>
      <div className="p-8 sm:p-4 md:p-10">
        <h3 className="text-[1.25rem] md:text-[1.4rem] lg:text-[1.45rem] font-black mb-2 leading-tight text-slate-900 tracking-tight">{formTitle}</h3>
        {selectedPlan && (
          <div className="bg-slate-50 border border-slate-200 rounded-none p-3 mb-6 flex flex-col gap-1 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-gold">Selected Package</span>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-800">{selectedPlan.name}</span>
              <span className="text-sm font-black text-gold">
                {formatInrAmount(selectedPlan.price)}
              </span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className={selectedPlan ? "space-y-4" : "space-y-4 mt-8"} noValidate>
          <div className="form-control">
            <input
              type="text"
              placeholder="Full Name *"
              className={`w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-md focus:outline-none focus:border-gold transition-all duration-300 hover:border-slate-300 focus:ring-1 focus:ring-gold read-only:opacity-75 read-only:bg-slate-50 read-only:cursor-not-allowed placeholder:text-slate-400 ${errors.fullName ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
              value={form.fullName}
              onChange={(event) => handleFieldChange("fullName", event.target.value)}
              maxLength={50}
              readOnly={isMounted && !!user}
            />
            <FormFeedback error={errors.fullName} success={getFieldSuccess("fullName", form.fullName)} />
          </div>
          <div className="form-control">
            <input
              type="email"
              placeholder="Email Address *"
              className={`w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-md focus:outline-none focus:border-gold transition-all duration-300 hover:border-slate-300 focus:ring-1 focus:ring-gold read-only:opacity-75 read-only:bg-slate-50 read-only:cursor-not-allowed placeholder:text-slate-400 ${errors.email ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
              value={form.email}
              onChange={(event) => handleFieldChange("email", event.target.value)}
              readOnly={isMounted && !!user}
            />
            <FormFeedback error={errors.email} success={getFieldSuccess("email", form.email)} />
          </div>
          <div className="form-control">
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
                height: '3rem',
                paddingLeft: '3.5rem',
                borderRadius: '0.375rem',
                border: errors.phone ? '1px solid #f43f5e' : getFieldSuccess("phone", form.phone) ? '1px solid #10b981' : '1px solid #e2e8f0',
                backgroundColor: errors.phone ? '#fff1f2' : getFieldSuccess("phone", form.phone) ? '#f0fdf4' : '#ffffff',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0f172a',
              }}
              buttonStyle={{
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '0.375rem 0 0 0.375rem',
                paddingLeft: '0.5rem'
              }}
              containerStyle={{
                width: '100%'
              }}
            />
            <FormFeedback error={errors.phone} success={getFieldSuccess("phone", form.phone)} />
          </div>
          <div className="form-control">
            <input
              type="text"
              placeholder="Business Name"
              className={`w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-md focus:outline-none focus:border-gold transition-all duration-300 hover:border-slate-300 focus:ring-1 focus:ring-gold placeholder:text-slate-400 ${errors.businessName ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
              value={form.businessName}
              onChange={(event) => handleFieldChange("businessName", event.target.value)}
              maxLength={100}
            />
            <FormFeedback error={errors.businessName} success={getFieldSuccess("businessName", form.businessName)} />
          </div>

          {selectedPlan && selectedPlan.name === "Custom Plan" && (
            <div className="form-control animate-in fade-in slide-in-from-top-2 duration-300">
              <textarea
                placeholder="What are your specific requirements?"
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-md focus:outline-none focus:border-gold transition-all duration-300 hover:border-slate-300 focus:ring-1 focus:ring-gold placeholder:text-slate-400 h-24 resize-none"
                value={form.customRequirements}
                onChange={(event) => handleFieldChange("customRequirements", event.target.value)}
                maxLength={500}
              ></textarea>
            </div>
          )}

          <div className="form-control mt-2">
            <label className="label cursor-pointer justify-start gap-3 px-1">
              <input
                type="checkbox"
                className="checkbox checkbox-primary border-slate-300 checkbox-sm rounded-none transition-all duration-200 hover:scale-105"
                checked={form.whatsapp}
                onChange={(event) => setForm({ ...form, whatsapp: event.target.checked })}
              />
              <span className="label-text text-slate-600 text-xs">Get updates on WhatsApp</span>
            </label>
          </div>

          <button type="submit" className="w-full py-4 rounded-none text-[0.95rem] font-bold uppercase tracking-widest bg-gold text-white border-none hover:bg-white hover:text-navy transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 mt-2" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : "Get Started Now"}
          </button>

          {error && <p className="text-error text-xs font-bold text-center mt-2">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-200">
            <div className="flex flex-col items-center text-center gap-1 group cursor-default">
              <div className="p-1.5 rounded-none bg-slate-50 text-gold border border-slate-100 group-hover:scale-110 transition-transform duration-200 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <Star size={14} fill="currentColor" />
              </div>
              <span className="text-[10px] font-bold text-slate-500">4.5/5 Rating</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1 group cursor-default">
              <div className="p-1.5 rounded-none bg-slate-50 text-gold border border-slate-100 group-hover:scale-110 transition-transform duration-200 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">Verified Pros</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1 group cursor-default">
              <div className="p-1.5 rounded-none bg-slate-50 text-gold border border-slate-100 group-hover:scale-110 transition-transform duration-200 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <FileText size={14} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">50K+ Filings</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

