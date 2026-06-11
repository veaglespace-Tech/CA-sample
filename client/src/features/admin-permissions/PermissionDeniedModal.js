"use client";

import { ShieldX, X, Mail } from "lucide-react";

export default function PermissionDeniedModal({ open, onClose, action = "perform this action" }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 flex flex-col items-center gap-5 animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center shadow-inner">
          <ShieldX size={32} className="text-rose-500" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-lg font-black text-slate-900">Access Restricted</h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            You don&apos;t have permission to{" "}
            <span className="font-bold text-slate-700">{action}</span>.
          </p>
          <p className="text-xs font-semibold text-slate-400 leading-relaxed">
            Please contact your Super Admin (CA) to request access to this feature.
          </p>
        </div>

        <div className="w-full h-px bg-slate-100" />

        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
            <Mail size={14} className="text-indigo-500 flex-shrink-0" />
            <p className="text-xs font-bold text-indigo-700">
              Reach out to your Super Admin (CA) to enable this permission.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-black transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
