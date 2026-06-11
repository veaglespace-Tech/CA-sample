"use client";

import { useState } from "react";
import {
  User, Phone, Mail, Briefcase, Clock, MessageSquare, ArrowRight
} from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  validateName,
  validatePhone,
  validateEmail,
  validateMessage,
} from "../../lib/validators";
import useLiveValidation from "../../hooks/useLiveValidation";
import FormField from "./FormField";
import { apiFetch } from "../../lib/api/client";

export default function LeadForm({ endpoint = "/api/contact", mode = "contact", submitLabel = "Submit Request" }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceName: "",
    preferredTime: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const validators = {
    fullName: (value) => validateName(value),
    phone: (value) => validatePhone(value),
    email: (value) => validateEmail(value),
    message: (value) => validateMessage(value, true, 1000),
  };
  const { errors, validateField, validateForm, getFieldSuccess, resetValidation } = useLiveValidation(validators);

  const update = (key) => (e) => {
    let value = e && e.target ? e.target.value : e; // handle both event object and direct value (from PhoneInput)
    if (key === "phone") {
      value = value || "";
    }
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    if (validators[key]) {
      validateField(key, value, nextForm);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    const newErrors = validateForm(form);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setStatus("loading");

    try {
      const res = await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setForm({ fullName: "", email: "", phone: "", serviceName: "", preferredTime: "", message: "" });
      resetValidation();
    } catch (err) {
      console.error("[LeadForm] Backend save failed:", err);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto w-full">
      <form className="flex flex-col gap-6" onSubmit={handleFormSubmit} noValidate>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Full Name" htmlFor={`${mode}-fullName`} error={errors.fullName} success={getFieldSuccess("fullName", form.fullName)} required>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <User size={18} />
              </span>
              <input
                id={`${mode}-fullName`}
                type="text"
                placeholder="e.g. Rahul Sharma"
                className={`input input-bordered w-full pl-11 rounded-2xl bg-white text-sm font-bold text-slate-900 border-slate-300 placeholder:text-slate-500 placeholder:font-medium shadow-sm hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.fullName ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/20" : getFieldSuccess("fullName", form.fullName) ? "border-emerald-500 bg-emerald-50/40 focus:ring-emerald-500/20" : ""}`}
                value={form.fullName}
                onChange={update("fullName")}
                maxLength={50}
              />
            </div>
          </FormField>
          
          <FormField label="Phone Number" htmlFor={`${mode}-phone`} error={errors.phone} success={getFieldSuccess("phone", form.phone)} required>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Phone size={18} />
              </span>
              <PhoneInput
                country={'in'}
                value={form.phone}
                onChange={update("phone")}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: false
                }}
                inputStyle={{
                  width: '100%',
                  height: '3rem',
                  paddingLeft: '3.5rem',
                  borderRadius: '1rem',
                  border: errors.phone ? '1px solid #f43f5e' : getFieldSuccess("phone", form.phone) ? '1px solid #10b981' : '1px solid #cbd5e1',
                  backgroundColor: errors.phone ? '#fff1f2' : getFieldSuccess("phone", form.phone) ? '#ecfdf5' : '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
                buttonStyle={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderRadius: '1rem 0 0 1rem',
                  paddingLeft: '0.5rem'
                }}
                containerStyle={{
                  width: '100%'
                }}
              />
            </div>
          </FormField>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Email Address" htmlFor={`${mode}-email`} error={errors.email} success={getFieldSuccess("email", form.email)} required>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </span>
              <input
                id={`${mode}-email`}
                type="email"
                placeholder="name@company.com"
                className={`input input-bordered w-full pl-11 rounded-2xl bg-white text-sm font-bold text-slate-900 border-slate-300 placeholder:text-slate-500 placeholder:font-medium shadow-sm hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${errors.email ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/20" : getFieldSuccess("email", form.email) ? "border-emerald-500 bg-emerald-50/40 focus:ring-emerald-500/20" : ""}`}
                value={form.email}
                onChange={update("email")}
              />
            </div>
          </FormField>
          
          <FormField label="Service Interested In" htmlFor={`${mode}-service`}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Briefcase size={18} />
              </span>
              <input
                id={`${mode}-service`}
                type="text"
                placeholder="e.g. GST Registration"
                className="input input-bordered w-full pl-11 rounded-2xl bg-white text-sm font-bold text-slate-900 border-slate-300 placeholder:text-slate-500 placeholder:font-medium shadow-sm hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                value={form.serviceName}
                onChange={update("serviceName")}
              />
            </div>
          </FormField>
        </div>

        {mode === "callback" && (
          <FormField label="Preferred Time for Call" htmlFor={`${mode}-preferredTime`}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Clock size={18} />
              </span>
              <input
                id={`${mode}-preferredTime`}
                type="text"
                placeholder="e.g. Tomorrow morning 11 AM"
                className="input input-bordered w-full pl-11 rounded-2xl bg-white text-sm font-bold text-slate-900 border-slate-300 placeholder:text-slate-500 placeholder:font-medium shadow-sm hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                value={form.preferredTime}
                onChange={update("preferredTime")}
              />
            </div>
          </FormField>
        )}

        <FormField
          label="Message / Requirements"
          htmlFor={`${mode}-message`}
          error={errors.message}
          success={getFieldSuccess("message", form.message)}
          successMessage={`${form.message.trim().length}/1000 characters`}
          hint="Max 1000 characters"
        >
          <div className="relative">
            <span className="absolute top-3 left-4 pointer-events-none text-slate-500">
              <MessageSquare size={18} />
            </span>
            <textarea
              id={`${mode}-message`}
              rows={mode === "callback" ? 3 : 4}
              placeholder="Tell us a bit about your requirements..."
              className={`textarea textarea-bordered w-full pl-11 rounded-2xl bg-white text-sm font-bold text-slate-900 border-slate-300 placeholder:text-slate-500 placeholder:font-medium shadow-sm hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 min-h-[100px] ${errors.message ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/20" : getFieldSuccess("message", form.message) ? "border-emerald-500 bg-emerald-50/40 focus:ring-emerald-500/20" : ""}`}
              value={form.message}
              onChange={update("message")}
              maxLength={1000}
            />
          </div>
        </FormField>

        <button
          type="submit"
          className={`btn btn-block rounded-2xl h-14 text-base font-black gap-2 transition-all duration-300 mt-2 ${
            status === "success" 
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-none" 
              : status === "loading" 
              ? "bg-slate-300 text-slate-500 border-none cursor-not-allowed" 
              : "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 text-white shadow-lg shadow-primary/25 border-none group active:scale-[0.98]"
          }`}
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? (
            <span className="loading loading-spinner"></span>
          ) : status === "success" ? (
            "✓ Request Received"
          ) : (
            <>
              {submitLabel}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>

        {status === "success" && (
          <div className="rounded-2xl bg-emerald-50/80 backdrop-blur-sm p-4 text-center text-sm font-bold text-emerald-600 border border-emerald-100 animate-fade-in-up mt-2">
            Thank you! Our expert will contact you shortly.
          </div>
        )}
        {status === "error" && (
          <div className="rounded-2xl bg-rose-50/80 backdrop-blur-sm p-4 text-center text-sm font-bold text-rose-600 border border-rose-100 animate-fade-in-up mt-2">
            Something went wrong. Please check your connection and try again.
          </div>
        )}
      </form>
    </div>
  );
}
