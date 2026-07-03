"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { validateSlug, validateRequired } from "../../../lib/validators";
import useLiveValidation from "../../../hooks/useLiveValidation";
import FormFeedback from "../../forms/FormFeedback";

function createInitialPlanForm(editingPlan) {
  if (!editingPlan) {
    return {
      serviceSlug: "",
      name: "",
      description: "",
      price: "",
      oldPrice: "",
      tag: "",
      isHighlighted: false,
      features: "",
      sortOrder: 0,
    };
  }

  return {
    serviceSlug: editingPlan.serviceSlug,
    name: editingPlan.name,
    description: editingPlan.description,
    price: editingPlan.price,
    oldPrice: editingPlan.oldPrice || "",
    tag: editingPlan.tag || "",
    isHighlighted: editingPlan.isHighlighted,
    features: (editingPlan.features || []).join("\n"),
    sortOrder: editingPlan.sortOrder,
  };
}

export default function PlanFormModal({ editingPlan, onClose, onSubmit, serviceCategories = [] }) {
  const [planForm, setPlanForm] = useState(() => createInitialPlanForm(editingPlan));
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (editingPlan?.serviceSlug && serviceCategories.length > 0) {
      for (const cat of serviceCategories) {
        if (cat.subcategories?.some(sub => sub.services?.some(s => s.slug === editingPlan.serviceSlug))) return cat.id;
        if (cat.services?.some(s => s.slug === editingPlan.serviceSlug)) return cat.id;
      }
    }
    return "";
  });
  
  const [selectedSubcategory, setSelectedSubcategory] = useState(() => {
    if (editingPlan?.serviceSlug && serviceCategories.length > 0) {
      for (const cat of serviceCategories) {
        if (cat.subcategories) {
          for (const sub of cat.subcategories) {
            if (sub.services?.some(s => s.slug === editingPlan.serviceSlug)) return sub.id;
          }
        }
      }
    }
    return "";
  });

  const validators = {
    serviceSlug: (value) => {
      if (!value || !value.trim()) return "Target Service Identifier is required";
      if (!/^[a-z0-9\-,\s]+$/.test(value.trim())) return "Only lowercase letters, numbers, hyphens, and commas are allowed";
      return null;
    },
    name: (value) => validateRequired(value, "Plan Name"),
    description: (value) => validateRequired(value, "Plan Description"),
    features: (value) => validateRequired(value, "Features list"),
    price: (value, values) => {
      if (!value) return "Final Price is required";
      if (Number(value) < 0) return "Price cannot be negative";
      if (values.oldPrice && Number(values.oldPrice) <= Number(value)) {
        return null;
      }
      return null;
    },
    oldPrice: (value, values) => {
      if (value && Number(value) < 0) return "Original Price cannot be negative";
      if (values.price && value && Number(value) <= Number(values.price)) {
        return "Original price must be greater than final price";
      }
      return null;
    },
  };
  const { errors, validateField, validateForm, getFieldSuccess } = useLiveValidation(validators);

  const handleFieldChange = (key, value) => {
    const nextForm = { ...planForm, [key]: value };
    setPlanForm(nextForm);
    if (validators[key]) {
      validateField(key, value, nextForm);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm(planForm);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit(planForm);
  };

  return (
    <div className="modal modal-open bg-slate-900/60 backdrop-blur-sm z-50">
      <div className="modal-box max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh] bg-slate-900">
        
        {/* Simple & Clean Professional Header */}
        <div className="bg-slate-800/80 px-6 py-5 border-b border-slate-700/60 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-100">{editingPlan ? "Edit Service Plan" : "Create New Service Plan"}</h3>
            {!editingPlan && (
              <button 
                type="button" 
                onClick={() => {
                  setPlanForm(prev => ({
                    ...prev,
                    name: "Custom Plan",
                    description: "A tailor-made plan customized exactly to your business requirements.",
                    price: "1499",
                    oldPrice: "",
                    tag: "Custom",
                    features: "Dedicated Relationship Manager\nCustom Business Consultation\nRequirement specific execution",
                    isHighlighted: false
                  }));
                }}
                className="btn btn-xs bg-gold/10 text-gold border-gold/30 hover:bg-gold/20 hover:border-gold/50 rounded-lg ml-2"
              >
                + Auto-fill Custom Plan
              </button>
            )}
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto bg-slate-900">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {/* Target Service Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 shadow-inner">
              {/* Category */}
              <div>
                <label className="block mb-2">
                  <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">Category</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("");
                    handleFieldChange("serviceSlug", "");
                  }}
                  className="select select-bordered w-full rounded-lg bg-slate-800 border-slate-600 text-slate-200 focus:border-gold focus:ring-1 focus:ring-gold/30 shadow-sm"
                >
                  <option value="">Select Category</option>
                  {serviceCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block mb-2">
                  <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">Subcategory</span>
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    handleFieldChange("serviceSlug", "");
                  }}
                  disabled={!selectedCategory}
                  className="select select-bordered w-full rounded-lg bg-slate-800 border-slate-600 text-slate-200 focus:border-gold focus:ring-1 focus:ring-gold/30 disabled:opacity-50 shadow-sm"
                >
                  <option value="">All Subcategories</option>
                  {serviceCategories.find(c => c.id === selectedCategory)?.subcategories?.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              {/* Service */}
              <div>
                <label className="block mb-2">
                  <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">Target Service *</span>
                </label>
                <select
                  value={planForm.serviceSlug}
                  onChange={(e) => handleFieldChange("serviceSlug", e.target.value)}
                  disabled={!selectedCategory}
                  className={`select select-bordered w-full rounded-lg bg-slate-800 border-slate-600 text-slate-200 focus:border-gold focus:ring-1 focus:ring-gold/30 disabled:opacity-50 shadow-sm ${errors.serviceSlug ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30" : ""}`}
                >
                  <option value="">Select Service</option>
                  {!selectedSubcategory ? (
                    <>
                      {/* Direct services without subcategory */}
                      {serviceCategories.find(c => c.id === selectedCategory)?.services?.map(service => (
                        <option key={service.id} value={service.slug}>{service.name}</option>
                      ))}
                      {/* Services grouped by subcategory */}
                      {serviceCategories.find(c => c.id === selectedCategory)?.subcategories?.map(sub => (
                        sub.services?.length > 0 ? (
                          <optgroup key={sub.id} label={sub.name}>
                            {sub.services.map(service => (
                              <option key={service.id} value={service.slug}>{service.name}</option>
                            ))}
                          </optgroup>
                        ) : null
                      ))}
                    </>
                  ) : (
                    /* Only services for the selected subcategory */
                    serviceCategories.find(c => c.id === selectedCategory)?.subcategories?.find(s => s.id === selectedSubcategory)?.services?.map(service => (
                      <option key={service.id} value={service.slug}>{service.name}</option>
                    ))
                  )}
                </select>
                {errors.serviceSlug && <FormFeedback error={errors.serviceSlug} className="mt-1" />}
              </div>
            </div>

            {/* Plan Name & Tag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2">
                  <span className="text-sm font-semibold text-slate-200">Plan Name *</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Basic Package" 
                  className={`input input-bordered w-full rounded-lg bg-slate-800 text-slate-100 border-slate-600 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all shadow-sm ${errors.name ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30" : getFieldSuccess("name", planForm.name) ? "border-emerald-500/50 bg-emerald-500/5" : ""}`}
                  value={planForm.name} 
                  onChange={(e) => handleFieldChange("name", e.target.value)} 
                />
                <FormFeedback error={errors.name} success={getFieldSuccess("name", planForm.name)} className="mt-1" />
              </div>
              <div>
                <label className="block mb-2">
                  <span className="text-sm font-semibold text-slate-200">Visual Badge / Ribbon</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Best Seller" 
                  className="input input-bordered w-full rounded-lg bg-slate-800 text-slate-100 border-slate-600 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all shadow-sm"
                  value={planForm.tag} 
                  onChange={(e) => handleFieldChange("tag", e.target.value)} 
                />
              </div>
            </div>

            {/* Plan Description */}
            <div>
              <label className="block mb-2">
                <span className="text-sm font-semibold text-slate-200">Plan Description *</span>
              </label>
              <textarea 
                placeholder="Briefly describe what is unique about this plan..."
                className={`textarea textarea-bordered w-full p-4 rounded-lg bg-slate-800 text-slate-100 border-slate-600 focus:border-gold focus:ring-1 focus:ring-gold/30 min-h-[80px] transition-all leading-relaxed shadow-sm ${errors.description ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30" : getFieldSuccess("description", planForm.description) ? "border-emerald-500/50 bg-emerald-500/5" : ""}`}
                value={planForm.description} 
                onChange={(e) => handleFieldChange("description", e.target.value)} 
              />
              <FormFeedback error={errors.description} success={getFieldSuccess("description", planForm.description)} className="mt-1" />
            </div>

            {/* Price Configurations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2">
                  <span className="text-sm font-semibold text-slate-200">Final Price (INR) *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input 
                    type="number" 
                    placeholder="2999"
                    className={`input input-bordered w-full pl-8 rounded-lg bg-slate-800 text-slate-100 border-slate-600 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-semibold shadow-sm ${errors.price ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30" : getFieldSuccess("price", planForm.price) ? "border-emerald-500/50 bg-emerald-500/5" : ""}`}
                    value={planForm.price} 
                    onChange={(e) => handleFieldChange("price", e.target.value)} 
                  />
                </div>
                <FormFeedback error={errors.price} success={getFieldSuccess("price", planForm.price)} className="mt-1" />
              </div>
              <div>
                <label className="block mb-2">
                  <span className="text-sm font-semibold text-slate-200">Original Strike-through Price</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input 
                    type="number" 
                    placeholder="4999"
                    className={`input input-bordered w-full pl-8 rounded-lg bg-slate-800 text-slate-400 border-slate-600 focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-medium shadow-sm ${errors.oldPrice ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30" : getFieldSuccess("oldPrice", planForm.oldPrice) ? "border-emerald-500/50 bg-emerald-500/5" : ""}`}
                    value={planForm.oldPrice} 
                    onChange={(e) => handleFieldChange("oldPrice", e.target.value)} 
                  />
                </div>
                <FormFeedback error={errors.oldPrice} success={getFieldSuccess("oldPrice", planForm.oldPrice)} className="mt-1" />
              </div>
            </div>

            {/* Included Features List */}
            <div>
              <label className="block mb-2">
                <span className="text-sm font-semibold text-slate-200">Included Features (One per line) *</span>
              </label>
              <textarea 
                placeholder="GST Registration application&#10;Dedicated manager&#10;Error-free document checklist..."
                className={`textarea textarea-bordered w-full p-4 rounded-lg bg-slate-800 text-slate-100 border-slate-600 focus:border-gold focus:ring-1 focus:ring-gold/30 min-h-[120px] transition-all leading-relaxed shadow-sm ${errors.features ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30" : getFieldSuccess("features", planForm.features) ? "border-emerald-500/50 bg-emerald-500/5" : ""}`}
                value={planForm.features} 
                onChange={(e) => handleFieldChange("features", e.target.value)} 
              />
              <FormFeedback error={errors.features} success={getFieldSuccess("features", planForm.features)} successMessage={`${planForm.features.split("\n").filter((item) => item.trim()).length} feature lines`} className="mt-1" />
            </div>

            {/* Highlight & Sort Order */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-6 border-t border-slate-700/60 mt-8">
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary rounded bg-slate-800 border-slate-500 group-hover:border-gold transition-colors"
                    checked={planForm.isHighlighted} 
                    onChange={(e) => setPlanForm({ ...planForm, isHighlighted: e.target.checked })} 
                  />
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-slate-100 transition-colors">Highlight Plan (Recommended)</span>
                </label>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-400">Display Order:</span>
                  <input 
                    type="number" 
                    className="input input-bordered h-10 w-20 px-3 rounded-lg text-center font-semibold bg-slate-800 text-slate-100 border-slate-600 focus:border-gold"
                    value={planForm.sortOrder} 
                    onChange={(e) => setPlanForm({ ...planForm, sortOrder: e.target.value })} 
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="btn btn-ghost hover:bg-slate-800 text-slate-300 font-medium px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary px-8 rounded-lg font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 border-none transition-all"
                >
                  Save Plan
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}


