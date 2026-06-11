"use client";

import { AlignLeft, UserCircle, LogOut } from "lucide-react";
import NotificationSystem from "../common/NotificationSystem";
import { formatRole } from "../../lib/auth";

export default function DashboardHeader({ 
  activeSection, 
  user, 
  isStaff, 
  onLogout, 
  onNavigateToSection 
}) {
  return (
    <header className="navbar sticky top-0 z-40 h-20 shrink-0 border-b border-white/60 bg-white/80 px-4 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.03)] backdrop-blur-2xl md:px-6">
      <div className="flex-none lg:hidden">
        <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle drawer-button bg-slate-100 text-slate-700">
          <AlignLeft size={24} />
        </label>
      </div>
      
      <div className="flex-1 px-4">
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 drop-shadow-sm">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace("_", " ")}
        </h2>
      </div>

      <div className="flex-none flex items-center gap-2">
        <NotificationSystem 
          user={user} 
          isStaff={isStaff} 
          onNavigateToMessages={() => onNavigateToSection("messages")} 
          onNavigateToSection={onNavigateToSection}
        />

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="group flex cursor-pointer items-center gap-3.5 rounded-full border border-white bg-white/60 px-2 py-2 pr-4 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all duration-300 ease-out hover:border-indigo-100 hover:bg-white hover:shadow-[0_8px_25px_-5px_rgba(79,70,229,0.15)] md:px-2 md:pr-5">
            <div className="avatar placeholder rounded-full shadow-inner ring-2 ring-indigo-50 transition-all duration-300 group-hover:ring-indigo-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-sm font-black text-white shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[13px] font-black leading-tight text-slate-800 transition-colors duration-300 group-hover:text-indigo-700">{user?.name}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-tight mt-0.5">{formatRole(user?.role)}</div>
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-md dropdown-content z-[50] mt-4 w-64 rounded-3xl border border-white/80 bg-white/95 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-3 text-[10px] uppercase font-black tracking-[0.15em] text-slate-400 select-none">
              Account Control
            </div>
            <li>
              <button onClick={() => onNavigateToSection("profile")} className="rounded-2xl py-3.5 px-4 font-bold text-slate-600 flex items-center gap-3 transition-all duration-300 hover:bg-indigo-50/80 hover:text-indigo-700">
                <UserCircle className="text-xl" /> 
                <span className="tracking-wide">Profile Settings</span>
              </button>
            </li>
            <div className="divider my-1.5 opacity-40"></div>
            <li>
              <button onClick={onLogout} className="rounded-2xl py-3.5 px-4 font-bold text-rose-500 flex items-center gap-3 transition-all duration-300 hover:bg-rose-50/80 hover:text-rose-600">
                <LogOut className="text-xl" /> 
                <span className="tracking-wide">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
