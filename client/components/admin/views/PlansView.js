"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FilterX,
  LayoutGrid,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useGetAllPlansQuery } from "../../../store/api/planApi";
import { PLAN_PAGE_SIZE, normalizeSlug } from "../../../lib/plans";

function PagerButton({ disabled, active, onClick, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-sm border px-3 text-sm font-black transition-all ${
        active
          ? "border-gold bg-gold text-white shadow-[0_12px_28px_rgba(218,165,32,0.25)]"
          : disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
            : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function PlansView({ serviceCategories = [], users = [], onAdd, onEdit, onAssignPlan, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [subcategoryFilter, setSubcategoryFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [assigningPlan, setAssigningPlan] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [assignNote, setAssignNote] = useState("");
  const [assignError, setAssignError] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const deferredSearch = useDeferredValue(searchTerm);
  const normalizedServiceSlug = serviceFilter === "ALL" ? "" : normalizeSlug(serviceFilter);

  const queryArgs = useMemo(() => ({
    page,
    limit: PLAN_PAGE_SIZE,
    search: deferredSearch.trim(),
    categoryId: normalizedServiceSlug ? undefined : categoryFilter,
    subcategoryId: normalizedServiceSlug ? undefined : subcategoryFilter,
    serviceSlug: normalizedServiceSlug || undefined,
  }), [page, deferredSearch, categoryFilter, subcategoryFilter, normalizedServiceSlug]);

  const {
    data: plansResponse,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllPlansQuery(queryArgs, { refetchOnMountOrArgChange: true });

  const plans = plansResponse?.data || [];
  const meta = plansResponse?.meta || { page: 1, totalPages: 0, total: 0, hasNextPage: false, hasPrevPage: false };

  const activeCategory = useMemo(
    () => serviceCategories.find((category) => category.id === categoryFilter) || null,
    [serviceCategories, categoryFilter],
  );
  const allSubcategories = useMemo(
    () => serviceCategories.flatMap((category) => category.subcategories || []),
    [serviceCategories],
  );
  const subcategoryOptions = useMemo(
    () => (categoryFilter === "ALL" ? allSubcategories : activeCategory?.subcategories || []),
    [allSubcategories, activeCategory, categoryFilter],
  );
  const selectedSubcategory = subcategoryOptions.find((subcategory) => subcategory.id === subcategoryFilter) || null;
  const directServices = useMemo(
    () => (categoryFilter === "ALL"
      ? serviceCategories.flatMap((category) => category.services || [])
      : activeCategory?.services || []),
    [serviceCategories, activeCategory, categoryFilter],
  );
  const targetServices = useMemo(() => {
    if (selectedSubcategory) return selectedSubcategory.services || [];
    return [
      ...directServices,
      ...subcategoryOptions.flatMap((subcategory) => subcategory.services || []),
    ];
  }, [selectedSubcategory, directServices, subcategoryOptions]);
  const targetServiceOptions = useMemo(() => {
    const seen = new Set();
    return targetServices.filter((service) => {
      const key = service?.slug || service?.id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [targetServices]);

  const paginationNumbers = useMemo(() => {
    if (!meta.totalPages) return [];
    const start = Math.max(1, meta.page - 1);
    const end = Math.min(meta.totalPages, start + 2);
    const adjustedStart = Math.max(1, end - 2);
    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
  }, [meta.page, meta.totalPages]);

  const summaryLabel = meta.total === 0
    ? "No plans found"
    : `Showing ${(meta.page - 1) * PLAN_PAGE_SIZE + 1}-${Math.min(meta.page * PLAN_PAGE_SIZE, meta.total)} of ${meta.total} plans`;

  const categoryName = activeCategory?.name || null;
  const subcategoryName = selectedSubcategory?.name || null;
  const selectedServiceName = targetServiceOptions.find((service) => service.slug === normalizedServiceSlug)?.name || null;

  const activeChips = [
    categoryName ? `Main: ${categoryName}` : null,
    subcategoryName ? `Sub: ${subcategoryName}` : null,
    selectedServiceName ? `Service: ${selectedServiceName}` : null,
    deferredSearch.trim() ? `Search: "${deferredSearch.trim()}"` : null,
  ].filter(Boolean);

  const filteredUsers = useMemo(() => {
    const term = userSearch.trim().toLowerCase();
    if (!term) return users.slice(0, 30);
    return users.filter((user) => {
      const haystack = `${user.name || ""} ${user.email || ""} ${user.phone || ""}`.toLowerCase();
      return haystack.includes(term);
    }).slice(0, 30);
  }, [users, userSearch]);

  const controlShellClass =
    "group relative overflow-hidden rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 focus-within:border-gold focus-within:bg-white focus-within:shadow-[0_0_30px_rgba(210,144,82,0.15)]";
  const controlFieldClass =
    "h-[3.25rem] w-full appearance-none bg-transparent px-4 py-3 pr-11 text-sm font-semibold text-slate-900 outline-none";
  const selectFieldClass =
    "h-[3.25rem] w-full appearance-none bg-transparent px-4 py-3 pr-11 text-sm font-semibold text-slate-900 outline-none";
  const controlIconClass =
    "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300 group-hover:text-slate-600";

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("ALL");
    setSubcategoryFilter("ALL");
    setServiceFilter("ALL");
    setPage(1);
  };

  const openAssignModal = (plan) => {
    setAssigningPlan(plan);
    setSelectedUserId("");
    setUserSearch("");
    setAssignNote("");
    setAssignError("");
  };

  const closeAssignModal = () => {
    if (isAssigning) return;
    setAssigningPlan(null);
    setSelectedUserId("");
    setUserSearch("");
    setAssignNote("");
    setAssignError("");
  };

  const submitAssignment = async (event) => {
    event.preventDefault();
    setAssignError("");

    if (!assigningPlan?.id) {
      setAssignError("Please select a valid plan.");
      return;
    }
    if (!selectedUserId) {
      setAssignError("Please select a client account.");
      return;
    }

    setIsAssigning(true);
    const success = await onAssignPlan?.({
      planId: assigningPlan.id,
      userId: selectedUserId,
      note: assignNote,
    });
    setIsAssigning(false);

    if (success !== false) {
      closeAssignModal();
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-visible rounded-[2rem] border border-slate-100 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
              <SlidersHorizontal size={13} />
              Database Filters
            </div>
            <h3 className="text-xl font-black tracking-tight text-slate-900">Plan Search & Segmentation</h3>
            <p className="max-w-2xl text-sm font-medium text-slate-500">
              Search plans directly from the database and narrow results by service hierarchy. Only 10 records are loaded per page for a faster admin experience.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Plan Inventory</p>
            <p className="mt-1 text-sm font-black text-slate-800">{summaryLabel}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-6 space-y-6">
          <div className="grid gap-4 xl:grid-cols-3">
            <label className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Main Service</span>
              <div className={controlShellClass}>
                <select
                  className={`${selectFieldClass} focus:ring-0`}
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setSubcategoryFilter("ALL");
                    setServiceFilter("ALL");
                    setPage(1);
                  }}
                >
                  <option value="ALL">All Services</option>
                  {serviceCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown size={15} className={controlIconClass} />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Sub Service</span>
              <div className={controlShellClass}>
                <select
                  className={`${selectFieldClass} focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-500`}
                  value={subcategoryFilter}
                  onChange={(e) => {
                    setSubcategoryFilter(e.target.value);
                    setServiceFilter("ALL");
                    setPage(1);
                  }}
                >
                  <option value="ALL">All Sub Services</option>
                  {subcategoryOptions.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <ChevronDown size={15} className={controlIconClass} />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Target Service</span>
              <div className={`${controlShellClass} ring-1 ring-transparent transition-all duration-300 focus-within:ring-gold/30`}>
                <select
                  className={`${selectFieldClass} focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-500`}
                  value={serviceFilter}
                  onChange={(e) => {
                    setServiceFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="ALL">All Target Services</option>
                  {selectedSubcategory ? (
                    targetServiceOptions.map((service) => (
                      <option key={service.id} value={service.slug}>{service.name}</option>
                    ))
                  ) : (
                    <>
                      {targetServiceOptions.filter((service) => !service.subcategoryId).map((service) => (
                        <option key={service.id} value={service.slug}>{service.name}</option>
                      ))}
                      {subcategoryOptions.map((sub) => (
                        sub.services?.length ? (
                          <optgroup key={sub.id} label={sub.name}>
                            {sub.services.map((service) => (
                              <option key={service.id} value={service.slug}>{service.name}</option>
                            ))}
                          </optgroup>
                        ) : null
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown size={15} className={controlIconClass} />
              </div>
            </label>
          </div>

          <div>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-[2.5rem] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50"
            >
              <FilterX size={15} />
              Clear Filters
            </button>
          </div>

          <div className="pt-2">
            <label className="space-y-2 block">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Search Plans</span>
              <div className={controlShellClass}>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gold/0 via-yellow-400/0 to-gold/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center">
                  <Search size={16} className="pointer-events-none absolute left-4 text-slate-400 transition-colors duration-300 group-hover:text-gold" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Plan name, service name, category, or tag..."
                    className={`${controlFieldClass} pl-11`}
                  />
                </div>
              </div>
            </label>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-6 py-4">
            {activeChips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[12px] font-black tracking-wide text-indigo-700"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[1.75rem] font-black tracking-tight text-slate-900">Purchase Plans</h2>
            <p className="text-sm font-semibold text-slate-500">Database-backed plans with service-aware filtering.</p>
          </div>

          {onAdd && (
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-gold px-4 text-sm font-black text-slate-900 shadow-[0_10px_24px_rgba(79,70,229,0.25)] transition-all hover:bg-gold"
              onClick={onAdd}
            >
              <Plus size={16} />
              Add Plan
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Name</th>
                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Service</th>
                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Price</th>
                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Tag</th>
                <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: PLAN_PAGE_SIZE }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="border-b border-slate-100">
                  <td className="px-6 py-4">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-50" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-48 animate-pulse rounded bg-slate-50" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-50" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-50" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="ml-auto h-8 w-24 animate-pulse rounded bg-slate-50" />
                  </td>
                </tr>
              ))}

              {!isLoading && plans.map((plan) => {
                const numericPrice = String(plan.price || "").replace(/[^0-9.]/g, "");
                const canAssignThisPlan = numericPrice && !Number.isNaN(Number.parseFloat(numericPrice));

                return (
                <tr key={plan.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/70">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{plan.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-sm border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {plan.serviceName || plan.serviceSlug}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{plan.price}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600">{plan.tag || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {onAssignPlan && (
                        <button
                          type="button"
                          onClick={() => openAssignModal(plan)}
                          disabled={!canAssignThisPlan}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-600 transition-all hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-600"
                          aria-label="Assign plan to user"
                          title={canAssignThisPlan ? "Assign plan to user" : "Custom quote plans cannot open direct payment"}
                        >
                          <UserPlus size={14} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(plan)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-slate-200 text-slate-500 transition-all hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
                          aria-label="Edit plan"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(plan.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-slate-200 text-rose-500 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Delete plan"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}

              {!isLoading && plans.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 md:py-16 text-center">
                    <p className="text-base font-black text-slate-800">No plans matched your current filters.</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Try clearing filters or changing service selection.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isError && (
        <div className="rounded-none border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          Failed to load plans from database. {error?.data?.message || error?.data?.error || "Please retry."}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <span className="flex h-10 w-10 items-center justify-center rounded-none bg-gold/10 text-gold">
            <LayoutGrid size={18} />
          </span>
          <div>
            <p className="font-black text-slate-900">{isLoading ? "Loading plans..." : summaryLabel}</p>
            <p className="text-xs text-slate-500">Server-side filtered results with 10 plans per page.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PagerButton disabled={!meta.hasPrevPage || isFetching} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
            <ChevronLeft size={16} />
          </PagerButton>

          {paginationNumbers.map((pageNumber) => (
            <PagerButton
              key={pageNumber}
              active={pageNumber === meta.page}
              disabled={isFetching}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </PagerButton>
          ))}

          <PagerButton disabled={!meta.hasNextPage || isFetching} onClick={() => setPage((prev) => prev + 1)}>
            <ChevronRight size={16} />
          </PagerButton>
        </div>
      </div>

      {assigningPlan && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <form
            onSubmit={submitAssignment}
            className="w-full max-w-2xl overflow-hidden rounded-none border border-slate-200 bg-white shadow-2xl transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                  <UserPlus size={13} />
                  Assign Plan
                </div>
                <h3 className="text-xl font-black text-slate-900">{assigningPlan.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {assigningPlan.serviceSlug} - {assigningPlan.price === "Custom Quote" ? "Custom Quote" : `Rs. ${assigningPlan.price}`}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAssignModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 text-slate-500 transition-all hover:bg-slate-50"
                aria-label="Close assign plan modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <label className="block space-y-2">
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Find Client</span>
                <div className="flex h-11 items-center gap-3 rounded-sm border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                  <Search size={15} className="text-slate-500" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    placeholder="Search by name, email, or phone..."
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-500"
                  />
                </div>
              </label>

              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUserId === user.id;
                  return (
                    <button
                      type="button"
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`flex w-full items-center gap-3 rounded-sm border px-4 py-3 text-left transition-all ${
                        isSelected
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-sm font-black ${
                        isSelected ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-600"
                      }`}>
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black text-slate-900">{user.name}</span>
                        <span className="block truncate text-xs font-semibold text-slate-500">
                          {user.email || "No email"} - {user.phone || "No phone"}
                        </span>
                      </span>
                      {isSelected && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check size={14} />
                        </span>
                      )}
                    </button>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <div className="rounded-sm border border-dashed border-slate-200 px-4 py-8 text-center">
                    <p className="text-sm font-black text-slate-800">No client account found</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Create the client user first, then assign this plan.</p>
                  </div>
                )}
              </div>

              <label className="block space-y-2">
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Internal Note</span>
                <textarea
                  value={assignNote}
                  onChange={(event) => setAssignNote(event.target.value)}
                  rows={3}
                  placeholder="Optional note for this assignment..."
                  className="w-full resize-none rounded-sm border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              {assignError && (
                <div className="flex items-start gap-2 rounded-sm border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {assignError}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeAssignModal}
                className="inline-flex h-11 items-center justify-center rounded-sm border border-slate-200 px-5 text-sm font-black text-slate-600 transition-all hover:bg-slate-50"
                disabled={isAssigning}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-emerald-600 px-5 text-sm font-black text-slate-900 shadow-[0_10px_24px_rgba(5,150,105,0.2)] transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isAssigning || !selectedUserId || filteredUsers.length === 0}
              >
                {isAssigning ? <span className="loading loading-spinner loading-sm" /> : <UserPlus size={16} />}
                Assign & Open Payment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
