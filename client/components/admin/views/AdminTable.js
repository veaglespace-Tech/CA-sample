"use client";
import { formatRole } from "../../../lib/auth";
import { Pencil, Trash2, Mail, Eye, Plus, Share2, FolderOpen, MessageSquare } from "lucide-react";

export default function AdminTable({ 
  title, 
  columns, 
  items, 
  type, 
  onEdit, 
  onDelete, 
  onMessage, 
  onEmail,
  onViewDetails,
  onViewVideo,
  onShare,
  onViewDocs,
  onAdd,
  searchTerm,
  onSearchChange,
  isSearching
}) {
  const renderValue = (item, col) => {
    const camelKey = col.charAt(0).toLowerCase() + col.slice(1).replace(" ", "");
    const lowerKey = col.toLowerCase().replace(" ", "");
    let val = item[col] || item[camelKey] || item[lowerKey];

    if (col === "Name" || col === "FullName") val = item.fullName || item.name;
    if (col === "Role") {
      const role = String(item.role || val || "USER").toUpperCase();
      let badgeClasses = "bg-slate-50 text-slate-500 border-slate-200";
      
      if (role === "SUPER_ADMIN") {
        badgeClasses = "bg-navy text-white border-transparent";
      } else if (role === "ADMIN") {
        badgeClasses = "bg-sky-100 text-sky-800 border-transparent";
      } else if (role === "STAFF") {
        badgeClasses = "bg-teal-100 text-teal-800 border-transparent";
      }
      
      return (
        <div className={`badge badge-outline badge-sm py-2.5 px-3 rounded-full font-black tracking-wide text-[9px] uppercase border whitespace-nowrap ${badgeClasses}`}>
          {formatRole(item.role)}
        </div>
      );
    }
    
    if (col === "Date") {
      return new Date(item.createdAt).toLocaleDateString();
    }

    if (col === "Referred By") {
      if (item.referredByCode) {
        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-navy-light/10 text-navy border border-gold/20">
              🎁 Via Referral
            </span>
            <span className="text-[9px] font-bold text-slate-500 mt-0.5">Code: {item.referredByCode}</span>
          </div>
        );
      }
      return <span className="text-[10px] text-slate-600 font-semibold">—</span>;
    }
    
    if (col === "Status") {
      const status = String(item.status || val || "NEW").toUpperCase();
      let badgeClasses = "bg-slate-50 text-slate-800 border-slate-200";
      
      if (status === "NEW") {
        badgeClasses = "bg-sky-100 text-sky-800 border-transparent";
      } else if (status === "IN_PROGRESS") {
        badgeClasses = "bg-amber-100 text-amber-800 border-transparent";
      } else if (status === "QUALIFIED") {
        badgeClasses = "bg-indigo-100 text-indigo-800 border-transparent";
      } else if (status === "CONVERTED" || status === "COMPLETED") {
        badgeClasses = "bg-emerald-100 text-emerald-800 border-transparent";
      } else if (status === "REJECTED") {
        badgeClasses = "bg-rose-100 text-rose-800 border-transparent";
      } else if (status === "CLOSED" || status === "PAST") {
        badgeClasses = "bg-slate-100 text-slate-600 border-transparent";
      } else if (status === "UPCOMING" || status === "PUBLISHED") {
        badgeClasses = "bg-navy text-white border-transparent";
      } else if (status === "DRAFT") {
        badgeClasses = "bg-slate-100 text-slate-600 border-transparent";
      }
      
      return (
        <div className={`badge badge-outline badge-sm py-2.5 px-3 rounded-full font-black tracking-wide text-[9px] uppercase border ${badgeClasses}`}>
          {status.replace("_", " ")}
        </div>
      );
    }
    
    if (col === "Service") {
      const category = item.service?.category?.name || item.mainCategory;
      const subService = item.service?.name || item.serviceName || item.registrationType;
      
      let displayVal = subService;
      if (category && subService && category !== subService) {
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black uppercase opacity-40 tracking-widest leading-none">{category}</span>
            <span className="text-sm font-bold leading-tight">{subService.replace(/_/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")}</span>
          </div>
        );
      }
      
      val = subService;
      // Format internal enum strings if needed
      if (val && typeof val === "string" && val.includes("_")) {
        val = val.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      }
    }
    if (col === "Video") val = item.videoUrl || item.video;
    
    if (col === "Message" || col === "Subject" || col === "Description") {
      if (val && typeof val === "string" && val.length > 50) {
        return (
          <span title={val} className="cursor-help font-semibold text-slate-600">
            {val.slice(0, 47)}...
          </span>
        );
      }
    }

    if (col === "Registrations") {
      const count = item.registrations ? item.registrations.length : 0;
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); onViewDetails && onViewDetails(item); }}
          className="btn btn-xs rounded-full border-none bg-gold/10 text-gold hover:bg-gold/20 font-bold px-3 gap-1 shadow-sm"
        >
          <span className="text-[10px]">👥</span> {count} {count === 1 ? "User" : "Users"}
        </button>
      );
    }

    if (col === "Video") {
      return val ? (
        <a 
          href={val} 
          target="_blank" 
          rel="noreferrer"
          className="btn btn-ghost btn-xs text-error gap-1 hover:bg-error/10"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[8px]">▶</span> Watch
        </a>
      ) : (
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(item); }}
          className="btn btn-ghost btn-xs opacity-30 hover:opacity-100 gap-1"
        >
          <span className="text-[10px]">＋</span> Add
        </button>
      );
    }
    
    return val;
  };

  return (
    <div className="card bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
      <div className="card-body p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="card-title text-2xl font-black text-slate-900">{title}</h2>
          <div className="flex items-center gap-3">
            {onSearchChange && (
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={`Search ${type}s...`}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="input input-bordered input-sm h-10 rounded-lg bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 w-48 md:w-64 focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                />
                {isSearching && <span className="loading loading-spinner loading-xs absolute right-3 top-3 text-navy"></span>}
              </div>
            )}
            {onAdd && (
              <button className="btn btn-sm h-10 rounded-lg px-4 gap-2 border-none bg-navy text-white hover:bg-navy-light transition-all shadow-sm" onClick={onAdd}>
                <Plus size={16} /> Add {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
          <table className="table w-full text-slate-800">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map(col => <th key={col} className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 py-5">{col}</th>)}
                <th className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/80">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors duration-300">
                  {columns.map(col => (
                    <td key={col} className="text-sm font-medium py-4">
                      {renderValue(item, col)}
                    </td>
                  ))}
                  <td className="text-right space-x-1">
                    <div className="join">
                      {onViewDetails && (
                        <button className="btn btn-ghost btn-xs join-item tooltip" data-tip="Details" onClick={() => onViewDetails(item)}>
                          <Eye size={16} />
                        </button>
                      )}
                      {onEdit && (
                        <button className="btn btn-ghost btn-xs join-item tooltip" data-tip="Edit" onClick={() => onEdit(item)}>
                          <Pencil size={16} />
                        </button>
                      )}
                      {onMessage && (
                        <button className="btn btn-ghost btn-xs join-item tooltip text-info" data-tip="Platform Message" onClick={() => onMessage(item)}>
                          <MessageSquare size={16} />
                        </button>
                      )}
                      {onEmail && (
                        <button className="btn btn-ghost btn-xs join-item tooltip text-gold" data-tip="Send Email" onClick={() => onEmail(item)}>
                          <Mail size={16} />
                        </button>
                      )}
                      {onShare && (
                        <button className="btn btn-ghost btn-xs join-item tooltip text-secondary" data-tip="Share" onClick={() => onShare(item)}>
                          <Share2 size={16} />
                        </button>
                      )}
                      {onViewDocs && (
                        <button className="btn btn-ghost btn-xs join-item tooltip text-warning" data-tip="Shared Files" onClick={() => onViewDocs(item)}>
                          <FolderOpen size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button className="btn btn-ghost btn-xs join-item tooltip text-error" data-tip="Delete" onClick={() => onDelete(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="py-8 md:py-20 text-center opacity-40 italic">
                    No records found in this section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

