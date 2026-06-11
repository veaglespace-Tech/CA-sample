"use client";

import { Info, Mail, Phone, Clock, MapPin } from "lucide-react";

export default function InquiryOverview({ currentItem, handleStatusChange, isUpdatingStatus, statuses }) {
  return (
    <section className="space-y-6 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] md:p-8">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Info size={18} /></span>
          Inquiry Status & Info
        </h4>
        {currentItem.status && (
          <select 
            className={`h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 ${isUpdatingStatus ? "loading" : ""}`}
            value={currentItem.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {statuses.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400"><Mail size={12} /> Email Address</span>
          <p className="text-sm font-bold truncate text-slate-800">{currentItem.email || "N/A"}</p>
        </div>
        
        <div className="space-y-1 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400"><Phone size={12} /> Phone Number</span>
          <p className="text-sm font-bold text-slate-800">{currentItem.phone || "N/A"}</p>
        </div>
        
        <div className="space-y-1 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400"><Clock size={12} /> Applied On</span>
          <p className="text-sm font-bold text-slate-800">
            {new Date(currentItem.createdAt).toLocaleDateString()} {new Date(currentItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {(currentItem.city) && (
          <div className="space-y-1 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400"><MapPin size={12} /> City / Location</span>
            <p className="text-sm font-bold text-slate-800">{currentItem.city}</p>
          </div>
        )}
      </div>
    </section>
  );
}
