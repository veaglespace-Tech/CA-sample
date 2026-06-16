"use client";

import { useState, useRef, useEffect } from "react";
import {
  Star, Plus, Pencil, Trash2, Search, X, Check,
  Filter, ChevronDown, Globe, Building2, MapPin, User,
  MessageSquare, ArrowUpDown, Eye, EyeOff,
} from "lucide-react";
import {
  useGetAdminReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "../../../store/api/reviewApi";
import toast from "react-hot-toast";

// ── All service slugs list for search dropdown ──────────────────────────────
// We import from navigation-data for slug discovery
const POPULAR_SERVICES = [
  { label: "Private Limited Company", slug: "private-limited-company" },
  { label: "LLP Registration", slug: "llp-registration" },
  { label: "OPC Registration", slug: "one-person-company" },
  { label: "GST Registration", slug: "gst-registration" },
  { label: "GST Return Filing", slug: "gst-return-filing" },
  { label: "Trademark Registration", slug: "trademark-registration" },
  { label: "Trademark Renewal", slug: "trademark-renewal" },
  { label: "FSSAI Registration", slug: "fssai-registration" },
  { label: "MSME Registration", slug: "msme-udyam-registration" },
  { label: "Income Tax Return", slug: "income-tax-return-filing" },
  { label: "DSC Token", slug: "digital-signature-certificate" },
  { label: "Section 8 Company", slug: "section-8-company-registration" },
  { label: "ISO Certification", slug: "iso-certification" },
  { label: "Accounting Services", slug: "accounting-bookkeeping" },
  { label: "Payroll Processing", slug: "payroll-processing" },
  { label: "Patent Registration", slug: "patent-registration" },
  { label: "Copyright Registration", slug: "copyright-registration" },
  { label: "Design Registration", slug: "design-registration" },
  { label: "NRI Business Setup", slug: "nri-business-setup" },
  { label: "Annual Compliance", slug: "annual-compliance-pvt-ltd" },
];

function StarRating({ value, onChange, size = 28 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform duration-150 hover:scale-110"
        >
          <Star
            size={size}
            className={`transition-colors duration-150 ${
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-100 text-slate-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ServiceSearchDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = POPULAR_SERVICES.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  const selected = POPULAR_SERVICES.find((s) => s.slug === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-navy-light border border-slate-700 rounded-sm text-sm font-semibold text-slate-200 hover:border-indigo-300 focus:outline-none focus:border-indigo-400 transition-all"
      >
        <span className={selected ? "text-white" : "text-slate-400"}>
          {selected ? selected.label : "Search & select a service..."}
        </span>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-navy border border-slate-700 rounded-sm shadow-2xl shadow-slate-900/10 overflow-hidden transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          <div className="p-2 border-b border-slate-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search services..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-navy-light border border-slate-700 rounded-sm focus:outline-none focus:border-indigo-300"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); setSearch(""); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:bg-navy-light transition-colors"
            >
              <Globe size={14} />
              <span>General Review (not service-specific)</span>
            </button>
            {filtered.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => { onChange(s.slug); setOpen(false); setSearch(""); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gold/10 transition-colors text-left ${value === s.slug ? "bg-gold/10 text-gold font-bold" : "text-slate-200 font-medium"}`}
              >
                <Building2 size={14} className="shrink-0" />
                <span>{s.label}</span>
                {value === s.slug && <Check size={14} className="ml-auto text-gold" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">No services found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_FORM = {
  name: "", company: "", location: "", service: "", serviceSlug: "",
  isGeneral: true, rating: 5, text: "", status: "PUBLISHED", sortOrder: 0,
};

export default function ReviewsSection() {
  const [search, setSearch] = useState("");
  const [filterSlug, setFilterSlug] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data, isLoading, isFetching } = useGetAdminReviewsQuery({
    serviceSlug: filterSlug,
    status: filterStatus,
    search,
  });
  const reviews = data?.data || [];

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const isSaving = isCreating || isUpdating;

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (review) => {
    setEditing(review);
    setForm({
      name: review.name || "",
      company: review.company || "",
      location: review.location || "",
      service: review.service || "",
      serviceSlug: review.serviceSlug || "",
      isGeneral: review.isGeneral ?? true,
      rating: review.rating || 5,
      text: review.text || "",
      status: review.status || "PUBLISHED",
      sortOrder: review.sortOrder || 0,
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      toast.error("Name and review text are required.");
      return;
    }
    try {
      const payload = {
        ...form,
        isGeneral: !form.serviceSlug,
        service: form.serviceSlug
          ? POPULAR_SERVICES.find((s) => s.slug === form.serviceSlug)?.label || form.service
          : form.service,
        sortOrder: parseInt(form.sortOrder) || 0,
        rating: parseInt(form.rating) || 5,
      };
      if (editing) {
        await updateReview({ id: editing.id, ...payload }).unwrap();
        toast.success("Review updated successfully!");
      } else {
        await createReview(payload).unwrap();
        toast.success("Review created successfully!");
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save review.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted.");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete review.");
    }
  };

  const selectedServiceLabel = POPULAR_SERVICES.find((s) => s.slug === filterSlug)?.label;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" size={24} />
            Reviews & Testimonials
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Manage customer reviews — link them to specific services or mark as general.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-sm font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus size={18} />
          Add Review
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, text, service..."
            className="w-full pl-10 pr-4 py-2.5 bg-navy border border-slate-700 rounded-sm text-sm font-medium focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
        <ServiceSearchDropdown value={filterSlug} onChange={setFilterSlug} />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-navy border border-slate-700 rounded-sm text-sm font-semibold text-slate-200 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-3 text-sm text-slate-400 font-medium px-1">
        <span>
          Showing <strong className="text-white">{reviews.length}</strong> reviews
          {selectedServiceLabel && <span className="ml-1 text-gold">for &quot;{selectedServiceLabel}&quot;</span>}
          {filterStatus && <span className="ml-1">· Status: <strong className="text-slate-200">{filterStatus}</strong></span>}
        </span>
        {(filterSlug || filterStatus || search) && (
          <button
            onClick={() => { setFilterSlug(""); setFilterStatus(""); setSearch(""); }}
            className="ml-auto flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
          >
            <X size={13} /> Clear Filters
          </button>
        )}
      </div>

      {/* Review Cards Grid */}
      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-navy rounded-none p-6 border border-slate-800 shadow-sm animate-pulse h-48 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-navy rounded-none border-2 border-dashed border-slate-700 p-4 md:p-16 text-center transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          <Star size={40} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-lg font-black text-slate-200">No Reviews Found</h3>
          <p className="text-sm text-slate-400 font-medium mt-1">Add your first review to get started.</p>
          <button
            onClick={openCreate}
            className="mt-5 inline-flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-sm font-bold text-sm hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} /> Add Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group bg-navy rounded-none p-6 border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 transition-all duration-300 flex flex-col h-full transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50"
            >
              {/* Stars + Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={15}
                      className={s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    review.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    review.status === "DRAFT" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-navy-light text-slate-400 border-slate-700"
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-sm font-semibold leading-relaxed text-slate-300 flex-1 line-clamp-3 mb-4">
                &quot;{review.text}&quot;
              </p>

              {/* Service badge */}
              {review.serviceSlug && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Building2 size={12} className="text-gold shrink-0" />
                  <span className="text-[11px] font-bold text-gold bg-gold/10 px-2.5 py-0.5 rounded-full truncate max-w-full">
                    {review.service || review.serviceSlug}
                  </span>
                </div>
              )}
              {!review.serviceSlug && review.isGeneral && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Globe size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-400">General Review</span>
                </div>
              )}

              {/* Reviewer */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-auto">
                <div>
                  <div className="text-sm font-extrabold text-white">{review.name}</div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {[review.company, review.location].filter(Boolean).join(", ")}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEdit(review)}
                    className="p-2 rounded-sm bg-navy-light border border-slate-700 text-slate-400 hover:bg-gold/10 hover:text-gold hover:border-gold/30 transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(review)}
                    className="p-2 rounded-sm bg-navy-light border border-slate-700 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create/Edit Modal ─────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-[1100] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative bg-navy rounded-[2rem] shadow-2xl w-full max-w-2xl my-8 animate-in slide-in-from-bottom-8 fade-in duration-400">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black text-white">
                  {editing ? "Edit Review" : "Add New Review"}
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-0.5">
                  {editing ? "Update the review details below." : "Fill in the fields to add a customer review."}
                </p>
              </div>
              <button
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="p-2 rounded-sm bg-navy-light text-slate-400 hover:bg-navy-light transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                  Star Rating *
                </label>
                <StarRating
                  value={form.rating}
                  onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                  size={36}
                />
                <p className="text-xs text-slate-400 font-medium">{form.rating} out of 5 stars</p>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                  Review Text *
                </label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  placeholder="Write the customer's review here..."
                  rows={4}
                  className="w-full px-4 py-3 bg-navy-light border border-slate-700 rounded-sm text-sm font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:bg-navy focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                  required
                />
              </div>

              {/* 2-col: Name + Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    Customer Name *
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Rahul Sharma"
                      required
                      className="w-full pl-9 pr-4 py-3 bg-navy-light border border-slate-700 rounded-sm text-sm font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:bg-navy focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    Company / Role
                  </label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                      placeholder="CEO, ABC Pvt Ltd"
                      className="w-full pl-9 pr-4 py-3 bg-navy-light border border-slate-700 rounded-sm text-sm font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:bg-navy focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                  Location (City)
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="Mumbai, India"
                    className="w-full pl-9 pr-4 py-3 bg-navy-light border border-slate-700 rounded-sm text-sm font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:bg-navy focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Service Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                  Link to Service <span className="font-normal text-slate-400 normal-case">(optional — leave blank for general review)</span>
                </label>
                <ServiceSearchDropdown
                  value={form.serviceSlug}
                  onChange={(slug) => setForm((f) => ({
                    ...f,
                    serviceSlug: slug,
                    isGeneral: !slug,
                    service: slug ? POPULAR_SERVICES.find((s) => s.slug === slug)?.label || f.service : f.service,
                  }))}
                />
                {form.serviceSlug && (
                  <p className="text-xs text-gold font-bold flex items-center gap-1.5 mt-1">
                    <Check size={12} /> This review will appear on the &quot;{POPULAR_SERVICES.find(s => s.slug === form.serviceSlug)?.label}&quot; service page.
                  </p>
                )}
                {!form.serviceSlug && (
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                    <Globe size={12} /> This is a general review — will appear on the main Reviews page and homepage.
                  </p>
                )}
              </div>

              {/* Status + Sort Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-3 bg-navy-light border border-slate-700 rounded-sm text-sm font-semibold text-slate-200 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                  >
                    <option value="PUBLISHED">Published (visible)</option>
                    <option value="DRAFT">Draft (hidden)</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-navy-light border border-slate-700 rounded-sm text-sm font-medium text-white focus:outline-none focus:border-indigo-300 focus:bg-navy focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditing(null); }}
                  className="px-5 py-2.5 rounded-sm border border-slate-700 text-sm font-bold text-slate-300 hover:bg-navy-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-black shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none transition-all duration-300"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <><Check size={16} /> {editing ? "Update Review" : "Save Review"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ──────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-navy rounded-none shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 fade-in duration-300">
            <div className="w-14 h-14 bg-rose-100 rounded-none flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-rose-600" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Delete Review?</h3>
            <p className="text-sm text-slate-400 font-medium mb-6">
              Review by <strong className="text-slate-200">&quot;{deleteConfirm.name}&quot;</strong> will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-sm border border-slate-700 text-sm font-bold text-slate-300 hover:bg-navy-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-sm bg-rose-600 text-white text-sm font-black hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
