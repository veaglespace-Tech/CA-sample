"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check,
  Shield,
  ArrowRight,
  MapPin,
  Hash,
  Briefcase,
  Type,
  MessageSquare,
  Lock,
  ChevronDown
} from "lucide-react";
import {
  validatePinCode,
  validateRequired,
  validateCity,
  validateState,
  validateAddress,
  validateBusinessName,
  validateMessage,
  INDIAN_STATES,
} from "../../../lib/validators";
import toast from "react-hot-toast";
import FormFeedback from "../../../components/forms/FormFeedback";
import useLiveValidation from "../../../hooks/useLiveValidation";
import SearchableDropdown from "../../../components/ui/SearchableDropdown";
import { formatInrAmount, parseCurrencyAmount } from "../../../lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

function NextStepForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const leadId = searchParams.get("leadId");
  const planId = searchParams.get("planId");
  const planName = searchParams.get("planName");
  const planPrice = searchParams.get("planPrice");
  const planAmount = searchParams.get("planAmount");
  const resolvedPlanAmount = parseCurrencyAmount(planAmount) ?? parseCurrencyAmount(planPrice);
  const isCustomPlan = planName?.toLowerCase().includes("custom") || planPrice?.toLowerCase?.().includes("custom") || planPrice?.toLowerCase?.().includes("quote");

  const [form, setForm] = useState({
    city: "",
    state: "",
    pinCode: "",
    address: "",
    natureOfBusiness: "",
    businessName: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const validators = {
    city: (value) => validateCity(value),
    state: (value, formValues) => {
      if (formValues?.city?.trim() && !value) return "Required";
      return validateState(value);
    },
    pinCode: (value) => validatePinCode(value),
    natureOfBusiness: (value) => validateRequired(value, "Nature of Business"),
    address: (value) => validateAddress(value, 10),
    businessName: (value) => validateBusinessName(value, true),
    message: (value) => {
      if (isCustomPlan && (!value || !value.trim())) return "Please describe your requirements for the custom plan";
      return validateMessage(value, !isCustomPlan, 1000);
    },
  };
  const { errors, validateField, validateForm, getFieldSuccess } = useLiveValidation(validators);

  const handleFieldChange = (key, value) => {
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    if (validators[key]) {
      validateField(key, value, nextForm);
    }
    if (key === 'city' && validators.state) {
      validateField('state', nextForm.state, nextForm);
    }
  };

  useEffect(() => {
    if (form.pinCode && form.pinCode.length === 6) {
      const fetchLocation = async () => {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${form.pinCode}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            const fetchedCity = postOffice.District || postOffice.Block;
            const fetchedState = postOffice.State;
            setForm(prev => {
              const nextForm = { ...prev, city: fetchedCity, state: fetchedState };
              if (validators.city) validateField("city", fetchedCity, nextForm);
              if (validators.state) validateField("state", fetchedState, nextForm);
              return nextForm;
            });
            toast.success("Location auto-filled");
          }
        } catch (error) {
          console.error("Error fetching location", error);
        }
      };
      fetchLocation();
    }
  }, [form.pinCode]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leadId) {
      toast.error("Invalid Request: Lead ID is missing.");
      return;
    }

    // Validate inputs
    const newErrors = validateForm(form);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        city: form.city,
        state: form.state,
        pinCode: form.pinCode,
        address: form.address,
        natureOfBusiness: form.natureOfBusiness,
        businessName: form.businessName,
        message: form.message,
        metadata: {
          state: form.state,
          pinCode: form.pinCode,
          address: form.address,
          natureOfBusiness: form.natureOfBusiness,
          // ✅ Save plan details so PayU controller can read them
          selectedPlanId: planId || undefined,
          selectedPlanName: planName || undefined,
          selectedPlanPrice: planPrice || undefined,
          selectedPlanAmount: resolvedPlanAmount ?? undefined,
        }
      };

      const response = await fetch(`${API_URL}/api/registration/${leadId}/next-step`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit next step details");
      }

      let redirectUrl = `/payment-step?leadId=${leadId}`;
      if (planId) redirectUrl += `&planId=${encodeURIComponent(planId)}`;
      if (planName) redirectUrl += `&planName=${encodeURIComponent(planName)}`;
      if (planPrice) redirectUrl += `&planPrice=${encodeURIComponent(planPrice)}`;
      if (resolvedPlanAmount !== null) redirectUrl += `&planAmount=${encodeURIComponent(resolvedPlanAmount.toFixed(2))}`;
      router.push(redirectUrl);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-14 px-4 sm:px-6 lg:px-8 relative z-10">

      <div className="mb-10 text-center">
        <ul className="steps w-full max-w-md mx-auto">
          <li 
            className="step step-primary font-bold cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.back()}
            title="Go back to Contact"
          >
            Contact
          </li>
          <li className="step step-primary font-bold">Details</li>
          <li className="step font-bold text-slate-400">Payment</li>
        </ul>
      </div>

      {/* ─── Glassmorphism / Sleek Form Card ─── */}
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden transition-all duration-300">

        {/* Card Premium Header */}
        <div className="bg-gradient-to-r from-[#061A34] to-[#1e3a8a] px-8 py-7 text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
           <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest mb-2.5">
                <Lock className="text-[10px]" /> Step 2 of 3
              </div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Business details</h2>
              <p className="text-slate-200 text-xs font-medium mt-1">Provide proposed business details to quickly register.</p>
           </div>
           {planName && (
             <div className="bg-white/10 border border-white/15 rounded-2xl px-5 py-3 text-left shrink-0 min-w-[180px]">
               <span className="block text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">Selected Plan</span>
               <span className="block text-sm font-black text-white">{planName}</span>
               {planPrice && (
                 <span className="block text-xs font-bold text-orange-300 mt-0.5">
                   {isCustomPlan ? "Custom Quote" : formatInrAmount(planAmount || planPrice)}
                 </span>
               )}
             </div>
           )}
           <div className="shrink-0 flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
             <Shield size={24} className="text-primary-content" />
             <div className="text-left">
               <div className="text-xs font-black leading-none text-white">ISO 27001</div>
               <span className="text-[9px] font-bold text-slate-300">Data Encrypted</span>
             </div>
           </div>
        </div>

        {/* Card Form Body */}
        <div className="p-8 sm:p-10 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-7" noValidate>

            {/* Grid 1: City & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control w-full">
                <label className="label pt-0 pb-1.5"><span className="label-text font-black text-slate-700 text-xs uppercase tracking-wider">City / Location <span className="text-rose-500">*</span></span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="E.g. Mumbai"
                    className={`input input-bordered w-full pl-11 rounded-2xl bg-slate-50/50 text-sm font-semibold text-slate-900 border-slate-200 focus:border-primary focus:bg-white focus:shadow-md transition-all duration-300 ${errors.city ? "border-rose-500 bg-rose-50/10 focus:border-rose-500" : getFieldSuccess("city", form.city) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                    value={form.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    maxLength={50}
                  />
                </div>
                <FormFeedback error={errors.city} success={getFieldSuccess("city", form.city)} />
              </div>

              <div className="form-control w-full">
                <label className="label pt-0 pb-1.5"><span className="label-text font-black text-slate-700 text-xs uppercase tracking-wider">State <span className="text-rose-500">*</span></span></label>
                <SearchableDropdown
                  options={INDIAN_STATES}
                  value={form.state}
                  onChange={(val) => handleFieldChange("state", val)}
                  placeholder="Select State"
                  icon={<MapPin size={18} />}
                  error={errors.state}
                  success={getFieldSuccess("state", form.state)}
                />
                <FormFeedback error={errors.state} success={getFieldSuccess("state", form.state)} />
              </div>
            </div>

            {/* Grid 2: PIN Code & Nature of Business */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control w-full">
                <label className="label pt-0 pb-1.5"><span className="label-text font-black text-slate-700 text-xs uppercase tracking-wider">PIN Code <span className="text-rose-500">*</span></span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Hash size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="E.g. 400001"
                    className={`input input-bordered w-full pl-11 rounded-2xl bg-slate-50/50 text-sm font-semibold text-slate-900 border-slate-200 focus:border-primary focus:bg-white focus:shadow-md transition-all duration-300 ${errors.pinCode ? "border-rose-500 bg-rose-50/10 focus:border-rose-500" : getFieldSuccess("pinCode", form.pinCode) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                    value={form.pinCode}
                    onChange={(e) => handleFieldChange("pinCode", e.target.value)}
                    maxLength={6}
                    inputMode="numeric"
                  />
                </div>
                <FormFeedback error={errors.pinCode} success={getFieldSuccess("pinCode", form.pinCode)} />
              </div>

              <div className="form-control w-full">
                <label className="label pt-0 pb-1.5"><span className="label-text font-black text-slate-700 text-xs uppercase tracking-wider">Nature of Business <span className="text-rose-500">*</span></span></label>
                <SearchableDropdown
                  options={["Trading", "Manufacturing", "Services", "E-commerce", "Other"]}
                  value={form.natureOfBusiness}
                  onChange={(val) => handleFieldChange("natureOfBusiness", val)}
                  placeholder="Select Nature of Business"
                  icon={<Briefcase size={17} />}
                  error={errors.natureOfBusiness}
                  success={getFieldSuccess("natureOfBusiness", form.natureOfBusiness)}
                />
                <FormFeedback error={errors.natureOfBusiness} success={getFieldSuccess("natureOfBusiness", form.natureOfBusiness)} />
              </div>
            </div>

            {/* Complete Address */}
            <div className="form-control">
              <label className="label pt-0 pb-1.5"><span className="label-text font-black text-slate-700 text-xs uppercase tracking-wider">Complete Address <span className="text-rose-500">*</span></span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={18} />
                </span>
                <input
                  type="text"
                  placeholder="E.g. 101, Business Park, Andheri East"
                  className={`input input-bordered w-full pl-11 rounded-2xl bg-slate-50/50 text-sm font-semibold text-slate-900 border-slate-200 focus:border-primary focus:bg-white focus:shadow-md transition-all duration-300 ${errors.address ? "border-rose-500 bg-rose-50/10 focus:border-rose-500" : getFieldSuccess("address", form.address) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                  value={form.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                  maxLength={300}
                />
              </div>
              <FormFeedback error={errors.address} success={getFieldSuccess("address", form.address)} />
            </div>

            {/* Business or Company Name */}
            <div className="form-control">
              <label className="label pt-0 pb-1.5"><span className="label-text font-black text-slate-700 text-xs uppercase tracking-wider">Business or Company Name (Proposed)</span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Type size={18} />
                </span>
                <input
                  type="text"
                  placeholder="E.g. Valuexpert Pvt Ltd"
                  className={`input input-bordered w-full pl-11 rounded-2xl bg-slate-50/50 text-sm font-semibold text-slate-900 border-slate-200 focus:border-primary focus:bg-white focus:shadow-md transition-all duration-300 ${errors.businessName ? "border-rose-500 bg-rose-50/10 focus:border-rose-500" : getFieldSuccess("businessName", form.businessName) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                  value={form.businessName}
                  onChange={(e) => handleFieldChange("businessName", e.target.value)}
                  maxLength={100}
                />
              </div>
              <FormFeedback error={errors.businessName} success={getFieldSuccess("businessName", form.businessName)} />
            </div>

            {/* Special Requirements */}
            <div className="form-control">
              <label className="label pt-0 pb-1.5"><span className="label-text font-black text-slate-700 text-xs uppercase tracking-wider">{isCustomPlan ? "Describe Your Requirements" : "Special Requirements / Message"} {isCustomPlan && <span className="text-rose-500">*</span>}</span></label>
              <div className="relative">
                <span className="absolute top-3 left-4 pointer-events-none text-slate-400">
                  <MessageSquare size={18} />
                </span>
                <textarea
                  placeholder="Tell us more about your business needs..."
                  className={`textarea textarea-bordered w-full pl-11 rounded-2xl bg-slate-50/50 text-sm font-semibold text-slate-900 border-slate-200 focus:textarea-primary focus:bg-white focus:shadow-md transition-all duration-300 min-h-[120px] ${errors.message ? "border-rose-500 bg-rose-50/10 focus:border-rose-500" : getFieldSuccess("message", form.message) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                  value={form.message}
                  onChange={(e) => handleFieldChange("message", e.target.value)}
                  maxLength={1000}
                />
              </div>
              <FormFeedback error={errors.message} success={getFieldSuccess("message", form.message)} successMessage={`${form.message.trim().length}/1000 characters`} />
            </div>



            {/* CTA Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block rounded-2xl h-14 text-base font-black gap-2 shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-indigo-600 border-none hover:from-primary hover:to-indigo-700 active:scale-98 transition-all duration-300 mt-4 group"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>

            {/* Footer Trust Row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 opacity-50 text-xs font-bold text-slate-500 mt-6 pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5"><Shield className="text-slate-400" /> 256-bit SSL Secure</span>
              <span className="flex items-center gap-1.5"><Check className="text-slate-400" /> Expert Verified</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function NextStepRegistrationPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen relative overflow-hidden">
      {/* Dynamic Background Blur Accents */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-indigo-50/30 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-blue-50/30 blur-3xl -z-10" />

      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }>
        <NextStepForm />
      </Suspense>
    </div>
  );
}


