"use client";

import BrandLogo from "../layout/BrandLogo";
import { LogOut } from "lucide-react";

export default function DashboardSidebar({ menuItems, activeSection, onSectionChange, onLogout }) {
  return (
    <div className="menu flex min-h-full w-[21rem] flex-col border-r border-slate-200 bg-white px-6 py-7 text-slate-900 shadow-[18px_0_50px_rgba(15,23,42,0.04)]">
      <div className="mb-8 flex items-center gap-4 px-2">
        <BrandLogo width={180} height={50} />
      </div>

      <div className="mb-4 px-2">
        <span className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
          Navigation
        </span>
      </div>
      
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isSuperOnly = !!item.superAdminOnly;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                const el = document.getElementById("dashboard-drawer");
                if (el) el.checked = false;
              }}
              className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                isActive
                  ? isSuperOnly
                    ? "border-amber-400/30 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_14px_30px_rgba(245,158,11,0.30)]"
                    : "border-primary/20 bg-gradient-to-r from-primary to-violet-600 text-white shadow-[0_14px_30px_rgba(79,70,229,0.25)]"
                  : "border-transparent bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:shadow-[0_10px_25px_rgba(15,23,42,0.06)]"
              }`}
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-2xl transition-all duration-300 ${
                isActive
                  ? "bg-white/14 text-white shadow-inner"
                  : isSuperOnly
                    ? "bg-amber-50 text-amber-500 group-hover:scale-105 group-hover:bg-amber-100"
                    : "bg-slate-100 text-slate-500 group-hover:scale-105 group-hover:bg-indigo-50 group-hover:text-primary"
              }`}>
                {item.icon}
              </span>
              <span className="flex-1 text-sm font-extrabold leading-5 tracking-[0.08em]">
                {item.label}
              </span>
              {isSuperOnly && (
                <span className={`flex-shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                  isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-600"
                }`}>
                  CA
                </span>
              )}
              {item.count > 0 && (
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black transition-all duration-300 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-slate-200 pt-8">
        <button 
          onClick={onLogout} 
          className="group flex w-full items-center gap-4 rounded-2xl border border-transparent px-4 py-4 font-black text-rose-500 transition-all duration-300 hover:border-rose-100 hover:bg-rose-50"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-2xl text-rose-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-rose-100">
            <LogOut />
          </span>
          <span className="flex-1 text-left text-sm tracking-[0.08em]">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

