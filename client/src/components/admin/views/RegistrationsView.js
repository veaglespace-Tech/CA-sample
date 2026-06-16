"use client";
import AdminTable from "./AdminTable";
import { useMemo } from "react";

export default function RegistrationsView({ 
  searchTerm, 
  searchResults, 
  registrations, 
  isSearching, 
  onSearchChange, 
  onViewDetails,
  statusFilter,
  onStatusFilterChange,
  serviceFilter,
  onServiceFilterChange,
  subServiceFilter,
  onSubServiceFilterChange,
  onlyUserFilter,
  onOnlyUserFilterChange,
  allServices = [],
  onDelete
}) {
  const categories = useMemo(() => {
    const catsFromServices = allServices.map(s => s.category?.name).filter(Boolean);
    const catsFromItems = (registrations || []).map(r => r.mainCategory || r.service?.category?.name).filter(Boolean);
    return ["ALL", ...new Set([...catsFromServices, ...catsFromItems])].sort();
  }, [allServices, registrations]);

  const subServices = useMemo(() => {
    if (serviceFilter === "ALL") return ["ALL"];
    
    const subsFromServices = allServices
      .filter(s => s.category?.name === serviceFilter)
      .map(s => s.name);
      
    const subsFromItems = (registrations || [])
      .filter(r => (r.mainCategory || r.service?.category?.name) === serviceFilter)
      .map(r => r.serviceName || r.service?.name)
      .filter(Boolean);

    return ["ALL", ...new Set([...subsFromServices, ...subsFromItems])].sort();
  }, [allServices, registrations, serviceFilter]);

  let items = searchTerm ? (searchResults || []) : (registrations || []);

  // Apply filters
  if (statusFilter !== "ALL") {
    items = items.filter(item => item.status === statusFilter);
  }



  if (serviceFilter !== "ALL") {
    items = items.filter(item => {
      if (item.service?.category?.name === serviceFilter) return true;
      return item.mainCategory === serviceFilter;
    });
  }

  if (subServiceFilter !== "ALL") {
    items = items.filter(item => {
      return item.service?.name === subServiceFilter || item.serviceName === subServiceFilter;
    });
  }

  if (onlyUserFilter) {
    items = items.filter(item => !!item.userId);
  }

  return (
    <div className="space-y-6">
      <div className="bg-navy border border-slate-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.015)] rounded-none overflow-visible">
        <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
          
          <div className="flex flex-wrap items-center gap-5">
            {/* Filter: Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Status</span>
              <select 
                className="select select-bordered select-sm rounded-sm font-bold h-10 border-slate-700 focus:border-primary text-slate-200 bg-navy min-w-[130px]"
                value={statusFilter} 
                onChange={(e) => onStatusFilterChange(e.target.value)}
              >
                <option value="ALL">All Applications</option>
                <option value="NEW">New Leads</option>
                <option value="IN_PROGRESS">Active Work</option>
                <option value="CONVERTED">Completed</option>
                <option value="REJECTED">Closed/Rejected</option>
              </select>
            </div>

            {/* Filter: Main Service */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Main Service</span>
              <select 
                className="select select-bordered select-sm rounded-sm font-bold h-10 border-slate-700 focus:border-primary text-slate-200 bg-navy min-w-[160px]"
                value={serviceFilter} 
                onChange={(e) => {
                  onServiceFilterChange(e.target.value);
                  onSubServiceFilterChange("ALL");
                }}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Filter: Sub Service */}
            {serviceFilter !== "ALL" && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Sub Service</span>
                <select 
                  className="select select-bordered select-sm rounded-sm font-bold h-10 border-slate-700 focus:border-primary text-slate-200 bg-navy min-w-[160px]"
                  value={subServiceFilter} 
                  onChange={(e) => onSubServiceFilterChange(e.target.value)}
                >
                  {subServices.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            )}

            {/* Toggle: Registered Users */}
            <div className="flex items-center">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary checkbox-sm rounded-md border-2 border-slate-300 bg-navy checked:bg-gold checked:border-primary transition-all duration-200" 
                  checked={onlyUserFilter}
                  onChange={(e) => onOnlyUserFilterChange(e.target.checked)}
                />
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Only Registered</span>
              </label>
            </div>
          </div>

          <div className="text-[10px] font-black uppercase text-slate-400/80 tracking-widest bg-navy-light border border-slate-800 px-3.5 py-1.5 rounded-sm shrink-0 text-center lg:text-left">
            Showing {items.length} records
          </div>
        </div>
      </div>
      
      <AdminTable 
        title="Active Registrations"
        columns={["FullName", "Email", "Service", "Status", "Date"]}
        items={items}
        type="registration"
        onViewDetails={onViewDetails}
        onDelete={onDelete}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        isSearching={isSearching}
      />
    </div>
  );
}
