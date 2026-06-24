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
    <div className="modal modal-open bg-slate-900/40 backdrop-blur-xs z-50">
      <div className="modal-box max-w-xl rounded-sm p-0 overflow-hidden shadow-xl border border-slate-700 flex flex-col max-h-[90vh] bg-navy transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
        
        {/* Simple & Clean Professional Header */}
        <div className="bg-slate-55 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white">{editingPlan ? "Edit Service Plan" : "Create New Service Plan"}</h3>
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
                className="btn btn-xs bg-gold/10 text-gold border-gold/30 hover:bg-gold/20 hover:border-indigo-300 rounded-md"
              >
                + Auto-fill Custom Plan
              </button>
            )}
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-200/50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto bg-navy">
          <form onSubmit={handleSubmit} className="p-6 space-y-4 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30">
            
            {/* Target Service Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 bg-navy-light p-4 rounded-sm border border-slate-800 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
              {/* Category */}
              <div>
                <label className="block mb-1">
                  <span className="text-xs font-bold text-slate-200">Category</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("");
                    handleFieldChange("serviceSlug", "");
                  }}
                  className="select select-bordered w-full h-10 px-3 rounded-sm text-sm bg-navy font-medium"
                >
                  <option value="">Select Category</option>
                  {serviceCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block mb-1">
                  <span className="text-xs font-bold text-slate-200">Subcategory (Optional)</span>
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    handleFieldChange("serviceSlug", "");
                  }}
                  disabled={!selectedCategory}
                  className="select select-bordered w-full h-10 px-3 rounded-sm text-sm bg-navy font-medium disabled:opacity-50"
                >
                  <option value="">All Subcategories</option>
                  {serviceCategories.find(c => c.id === selectedCategory)?.subcategories?.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              {/* Service */}
              <div>
                <label className="block mb-1">
                  <span className="text-xs font-bold text-slate-200">Target Service *</span>
                </label>
                <select
                  value={planForm.serviceSlug}
                  onChange={(e) => handleFieldChange("serviceSlug", e.target.value)}
                  disabled={!selectedCategory}
                  className={`select select-bordered w-full h-10 px-3 rounded-sm text-sm bg-navy font-medium disabled:opacity-50 ${errors.serviceSlug ? "border-rose-500" : ""}`}
                >
                  <option value="">Select Target Service</option>
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
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">
                  <span className="text-xs font-bold text-slate-200">Plan Name *</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Basic Package" 
                  className={`input input-bordered w-full h-10 px-3 rounded-sm text-sm bg-navy text-white border-slate-350 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium shadow-xs ${errors.name ? "border-rose-500 focus:border-rose-500" : getFieldSuccess("name", planForm.name) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                  value={planForm.name} 
                  onChange={(e) => handleFieldChange("name", e.target.value)} 
                />
                <FormFeedback error={errors.name} success={getFieldSuccess("name", planForm.name)} className="mt-1" />
              </div>
              <div>
                <label className="block mb-1">
                  <span className="text-xs font-bold text-slate-200">Visual Badge / Ribbon</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Best Seller" 
                  className="input input-bordered w-full h-10 px-3 rounded-sm text-sm bg-navy text-white border-slate-350 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium shadow-xs"
                  value={planForm.tag} 
                  onChange={(e) => handleFieldChange("tag", e.target.value)} 
                />
              </div>
            </div>

            {/* Plan Description */}
            <div>
              <label className="block mb-1">
                <span className="text-xs font-bold text-slate-200">Plan Description *</span>
              </label>
              <textarea 
                placeholder="Briefly describe what is unique about this plan..."
                className={`textarea textarea-bordered w-full p-3 rounded-sm text-sm bg-navy text-white border-slate-350 focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[70px] transition-all font-medium leading-relaxed shadow-xs ${errors.description ? "border-rose-500 focus:border-rose-500" : getFieldSuccess("description", planForm.description) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                value={planForm.description} 
                onChange={(e) => handleFieldChange("description", e.target.value)} 
              />
              <FormFeedback error={errors.description} success={getFieldSuccess("description", planForm.description)} className="mt-1" />
            </div>

            {/* Price Configurations */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">
                  <span className="text-xs font-bold text-slate-200">Final Price (INR) *</span>
                </label>
                <input 
                  type="number" 
                  placeholder="e.g. 2999"
                  className={`input input-bordered w-full h-10 px-3 rounded-sm text-sm bg-navy text-white border-slate-350 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-semibold shadow-xs ${errors.price ? "border-rose-500 focus:border-rose-500" : getFieldSuccess("price", planForm.price) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                  value={planForm.price} 
                  onChange={(e) => handleFieldChange("price", e.target.value)} 
                />
                <FormFeedback error={errors.price} success={getFieldSuccess("price", planForm.price)} className="mt-1" />
              </div>
              <div>
                <label className="block mb-1">
                  <span className="text-xs font-bold text-slate-200">Original Strike-through Price (INR)</span>
                </label>
                <input 
                  type="number" 
                  placeholder="e.g. 4999"
                  className={`input input-bordered w-full h-10 px-3 rounded-sm text-sm bg-navy text-slate-400 border-slate-350 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium shadow-xs ${errors.oldPrice ? "border-rose-500 focus:border-rose-500" : getFieldSuccess("oldPrice", planForm.oldPrice) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                  value={planForm.oldPrice} 
                  onChange={(e) => handleFieldChange("oldPrice", e.target.value)} 
                />
                <FormFeedback error={errors.oldPrice} success={getFieldSuccess("oldPrice", planForm.oldPrice)} className="mt-1" />
              </div>
            </div>

            {/* Included Features List */}
            <div>
              <label className="block mb-1">
                <span className="text-xs font-bold text-slate-200">Included Features (One per line) *</span>
              </label>
              <textarea 
                placeholder="GST Registration application&#10;Dedicated manager&#10;Error-free document checklist..."
                className={`textarea textarea-bordered w-full p-3 rounded-sm text-sm bg-navy text-white border-slate-350 focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[110px] transition-all font-medium leading-relaxed shadow-xs ${errors.features ? "border-rose-500 focus:border-rose-500" : getFieldSuccess("features", planForm.features) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                value={planForm.features} 
                onChange={(e) => handleFieldChange("features", e.target.value)} 
              />
              <FormFeedback error={errors.features} success={getFieldSuccess("features", planForm.features)} successMessage={`${planForm.features.split("\n").filter((item) => item.trim()).length} feature lines`} className="mt-1" />
            </div>

            {/* Highlight & Sort Order */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 mt-6">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary rounded-md w-4 h-4 border-slate-300 bg-navy"
                    checked={planForm.isHighlighted} 
                    onChange={(e) => setPlanForm({ ...planForm, isHighlighted: e.target.checked })} 
                  />
                  <span className="text-xs font-semibold text-slate-200">Highlight Plan (Recommended)</span>
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-400">Display Order:</span>
                  <input 
                    type="number" 
                    className="input input-bordered h-8 w-12 p-1 rounded-md text-center font-bold bg-navy text-white border-slate-350 text-xs"
                    value={planForm.sortOrder} 
                    onChange={(e) => setPlanForm({ ...planForm, sortOrder: e.target.value })} 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="btn btn-sm btn-ghost hover:bg-navy-light text-slate-400 font-medium px-4 h-9 rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-sm btn-primary px-6 h-9 rounded-sm font-bold text-white border-none"
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


