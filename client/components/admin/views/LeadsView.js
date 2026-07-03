"use client";
import AdminTable from "./AdminTable";
import { useMemo } from "react";

export default function LeadsView({ 
  searchTerm, 
  searchResults, 
  leads, 
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
  onDelete,
  title = "Service Leads",
  columns = ["Name", "Email", "Service", "Status", "Date"]
}) {
  // Helper to resolve category for a lead
  const resolveCategory = (l) => {
    if (l.service?.category?.name) return l.service.category.name;
    if (l.mainCategory) return l.mainCategory;
    
    const sName = (l.serviceName || l.service?.name || "").toLowerCase();
    
    // Exact mapping overrides
    const exactMapping = {
      "Limited Liability Partnership (LLP)": "Business Registration",
      "private limited company": "Business Registration",
      "gst registration": "Tax & Compliance",
      "trademark registration": "Trademark & IP",
      "copyright registration": "Trademark & IP",
    };
    
    for (const [key, cat] of Object.entries(exactMapping)) {
      if (sName === key) return cat;
    }
    
    // Heuristic 1: Exact match in allServices
    const exactMatch = (allServices || []).find(s => s.name.toLowerCase() === sName);
    if (exactMatch?.category?.name) return exactMatch.category.name;
    
    // Heuristic 2: Keywords
    if (sName.includes("consult") || sName.includes("talk to") || sName.includes("expert") || sName.includes("lawyer") || sName.includes("ca") || sName.includes("cs")) {
      return "Consult an Expert";
    }
    if (sName.includes("registration") || sName.includes("company") || sName.includes("llp") || sName.includes("pvt ltd") || sName.includes("incorporation") || sName.includes("startup") || sName.includes("sole") || sName.includes("partnership")) {
      return "Business Registration";
    }
    if (sName.includes("gst") || sName.includes("tax") || sName.includes("itr") || sName.includes("filing") || sName.includes("compliance") || sName.includes("accounting") || sName.includes("audit") || sName.includes("tds")) {
      return "Tax & Compliance";
    }
    if (sName.includes("trademark") || sName.includes("ip") || sName.includes("patent") || sName.includes("copyright") || sName.includes("design") || sName.includes("infringement")) {
      return "Trademark & IP";
    }
    if (sName.includes("legal") || sName.includes("notice") || sName.includes("litigation") || sName.includes("divorce") || sName.includes("court")) {
      return "Lawyer Services";
    }
    if (sName.includes("contract") || sName.includes("agreement") || sName.includes("deed") || sName.includes("policy") || sName.includes("document")) {
      return "Documentation";
    }
    if (sName.includes("ngo") || sName.includes("trust") || sName.includes("society") || sName.includes("fundraising") || sName.includes("loan") || sName.includes("calculator")) {
      return "Others";
    }
    
    return "Other Services";
  };

  const categories = useMemo(() => {
    // 1. Get all categories from platform services
    const catsFromServices = allServices.map(s => s.category?.name).filter(Boolean);
    
    // 2. Get all categories from existing leads (including resolved ones)
    const catsFromLeads = (leads || []).map(resolveCategory).filter(Boolean);

    // 3. Combine and sort
    return ["ALL", ...new Set([...catsFromServices, ...catsFromLeads])].sort();
  }, [allServices, leads]);

  const subServices = useMemo(() => {
    if (serviceFilter === "ALL") return ["ALL"];
    
    const subsFromServices = allServices
      .filter(s => s.category?.name === serviceFilter)
      .map(s => s.name);
      
    const subsFromLeads = (leads || [])
      .filter(l => resolveCategory(l) === serviceFilter)
      .map(l => l.serviceName || l.service?.name)
      .filter(Boolean);

    return ["ALL", ...new Set([...subsFromServices, ...subsFromLeads])].sort();
  }, [allServices, leads, serviceFilter]);

  let items = searchTerm ? (searchResults || []) : (leads || []);

  // Apply filters
  if (statusFilter !== "ALL") {
    items = items.filter(item => item.status === statusFilter);
  }

  if (serviceFilter !== "ALL") {
    items = items.filter(item => resolveCategory(item) === serviceFilter);
  }

  if (subServiceFilter !== "ALL") {
    items = items.filter(item => {
      const sName = item.serviceName || item.service?.name;
      return sName === subServiceFilter;
    });
  }

  if (onlyUserFilter) {
    items = items.filter(item => !!item.userId);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] rounded-[2rem] overflow-visible">
        <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
          
          <div className="flex flex-wrap items-center gap-5">
            {/* Filter: Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Status</span>
              <select 
                className="select select-bordered select-sm rounded-xl font-bold h-10 border-slate-200 focus:border-primary text-slate-800 bg-white min-w-[130px]"
                value={statusFilter} 
                onChange={(e) => onStatusFilterChange(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="CONVERTED">Converted</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Filter: Main Service */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Main Service</span>
              <select 
                className="select select-bordered select-sm rounded-xl font-bold h-10 border-slate-200 focus:border-primary text-slate-800 bg-white min-w-[160px]"
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
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Sub Service</span>
                <select 
                  className="select select-bordered select-sm rounded-xl font-bold h-10 border-slate-200 focus:border-primary text-slate-800 bg-white min-w-[160px]"
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
                  className="checkbox checkbox-primary checkbox-sm rounded-md border-2 border-slate-300 bg-white checked:bg-gold checked:border-primary transition-all duration-200" 
                  checked={onlyUserFilter}
                  onChange={(e) => onOnlyUserFilterChange(e.target.checked)}
                />
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Only Registered</span>
              </label>
            </div>
          </div>

          <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-sm shrink-0 text-center lg:text-left">
            Showing {items.length} records
          </div>
        </div>
      </div>

      <AdminTable 
        title={title}
        columns={columns}
        items={items}
        type="lead"
        onViewDetails={onViewDetails}
        onDelete={onDelete}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        isSearching={isSearching}
      />
    </div>
  );
}
