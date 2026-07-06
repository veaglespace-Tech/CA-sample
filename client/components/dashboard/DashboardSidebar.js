"use client";

import BrandLogo from "../layout/BrandLogo";
import { LogOut } from "lucide-react";

export default function DashboardSidebar({ menuItems, activeSection, onSectionChange, onLogout }) {
  return (
    <div className="menu flex min-h-full w-[16.5rem] flex-col border-r border-slate-100 bg-white/95 px-5 py-8 text-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.02)] backdrop-blur-xl">
      <div className="mb-6 flex w-full justify-center px-2">
        <BrandLogo
          width={48}
          height={48}
          className="mx-auto flex justify-center"
          imageClassName="block"
        />
      </div>

      <div className="mb-4 px-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Main Navigation
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
              className={`group relative flex w-full items-center gap-3.5 rounded-lg border px-4 py-3.5 text-left transition-all duration-300 overflow-hidden ${
                isActive
                  ? "border-transparent bg-slate-100 text-navy font-bold shadow-sm"
                  : "border-transparent bg-transparent text-slate-500 font-medium hover:bg-slate-50 hover:text-navy"
              }`}
            >
              {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-gold rounded-r-full shadow-sm"></div>}
              <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[1.1rem] transition-all duration-300 ${
                isActive
                  ? "bg-navy text-white shadow-sm"
                  : isSuperOnly
                    ? "bg-amber-50 text-amber-500 group-hover:bg-amber-100"
                    : "bg-slate-50 text-slate-400 group-hover:bg-slate-200 group-hover:text-navy"
              }`}>
                {item.icon}
              </span>
              <span className="flex-1 text-sm font-semibold tracking-wide">
                {item.label}
              </span>
              {isSuperOnly && (
                <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  isActive ? "bg-gold/20 text-gold" : "bg-amber-500/10 text-amber-500"
                }`}>
                  SA
                </span>
              )}
              {item.count > 0 && (
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-gold/20 text-gold"
                    : "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-slate-200 pt-6">
        <button 
          onClick={onLogout} 
          className="group flex w-full items-center gap-3.5 rounded-lg border border-transparent px-4 py-3 text-slate-500 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-50 text-[1.1rem] text-slate-400 transition-all duration-300 group-hover:bg-rose-100 group-hover:text-rose-600">
            <LogOut size={18} />
          </span>
          <span className="flex-1 text-left text-sm font-semibold tracking-wide">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

