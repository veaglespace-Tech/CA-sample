"use client";

import { Menu, UserCircle, LogOut } from "lucide-react";
import NotificationSystem from "../common/NotificationSystem";
import BrandLogo from "../layout/BrandLogo";
import { formatRole } from "../../lib/auth";

export default function DashboardHeader({ 
  activeSection, 
  user, 
  isStaff, 
  onLogout, 
  onNavigateToSection 
}) {
  return (
    <header className="navbar sticky top-0 z-40 h-20 shrink-0 border-b border-white/40 bg-white/70 px-4 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-3xl md:px-6 transition-all duration-500">
      
      <div className="flex-1 px-4">
        {/* Mobile: Show Brand Logo */}
        <div className="lg:hidden mt-1">
          <BrandLogo width={40} height={40} className="scale-90 origin-left" />
        </div>
        
        {/* Desktop: Show Active Section */}
        <h2 className="hidden lg:block text-xl md:text-2xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
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
          <div tabIndex={0} role="button" className="group flex cursor-pointer items-center gap-3.5 rounded-full border border-white/60 bg-white/50 px-2 py-1.5 pr-4 shadow-sm backdrop-blur-xl transition-all duration-500 ease-out hover:border-gold/30 hover:bg-white hover:shadow-md md:px-2 md:pr-5 hover:-translate-y-0.5">
            <div className="avatar placeholder rounded-full shadow-inner ring-2 ring-transparent transition-all duration-500 group-hover:ring-gold/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold/80 to-gold text-sm font-bold text-navy shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[13px] font-bold leading-tight text-slate-800 transition-colors duration-300 group-hover:text-navy">{user?.name}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.15em] leading-tight mt-0.5 group-hover:text-gold transition-colors">{formatRole(user?.role)}</div>
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-md dropdown-content z-[50] mt-4 w-64 rounded-2xl border border-white/60 bg-white/90 p-3 shadow-[0_8px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300">
            <div className="px-4 py-3 text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400 select-none">
              Account Control
            </div>
            <li>
              <button onClick={() => onNavigateToSection("profile")} className="rounded-lg py-3 px-4 font-semibold text-slate-700 flex items-center gap-3 transition-all duration-300 hover:bg-slate-50 hover:text-navy">
                <UserCircle className="text-xl text-slate-500" /> 
                <span className="tracking-wide">Profile Settings</span>
              </button>
            </li>
            <div className="divider my-1 border-slate-100 opacity-40"></div>
            <li>
              <button onClick={onLogout} className="rounded-lg py-3 px-4 font-semibold text-rose-600 flex items-center gap-3 transition-all duration-300 hover:bg-rose-50 hover:text-rose-700">
                <LogOut className="text-xl" /> 
                <span className="tracking-wide">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Toggle Button (Moved to Right) */}
        <div className="lg:hidden ml-1 flex items-center">
          <label 
            htmlFor="dashboard-drawer" 
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200/60 bg-white/50 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-gold/50 drawer-button"
          >
            <Menu size={22} className="pointer-events-none" />
          </label>
        </div>
      </div>
    </header>
  );
}
