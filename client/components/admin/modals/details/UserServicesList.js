"use client";

import { Briefcase, TrendingUp } from "lucide-react";

export default function UserServicesList({ currentItem, userRegistrations, userLeads, getMiniStatusBadge, onSwitchItem }) {
  if (userRegistrations.length === 0 && userLeads.length === 0) return null;

  return (
    <section className="space-y-6 rounded-[2rem] border border-slate-800 bg-navy p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] md:p-8">
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-none bg-gold/10 text-gold">
            <Briefcase size={18} />
          </span>
          Related Client Services
        </h4>
        <span className="inline-flex w-fit items-center rounded-sm border border-gold/30 bg-gold/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-gold">
          {userRegistrations.length + userLeads.length} Total
        </span>
      </div>

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
        {[
          ...userRegistrations.map(r => ({ ...r, isReg: true })),
          ...userLeads.map(l => ({ ...l, isReg: false }))
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((item) => {
            const isCurrent = item.id === currentItem.id;
            const name = item.service?.name || item.serviceName || item.registrationType?.replace(/_/g, " ") || "Service Inquiry";
            const typeLabel = item.isReg ? "Registration" : "Leads/Inquiry";
            const dateStr = new Date(item.createdAt).toLocaleDateString();

            return (
              <div 
                key={item.id} 
                onClick={() => { if (!isCurrent && onSwitchItem) onSwitchItem(item); }}
                className={`flex flex-col justify-between gap-3 rounded-[1.35rem] border p-4 transition-all sm:flex-row sm:items-center ${
                  isCurrent 
                    ? "border-gold bg-gradient-to-r from-gold/10 to-white ring-2 ring-gold/20" 
                    : "cursor-pointer border-slate-700 bg-navy hover:border-slate-300 hover:bg-navy-light hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-1">
                    {item.isReg ? (
                      <span className="p-1 bg-gold/10 text-gold rounded-md block">
                        <Briefcase size={14} />
                      </span>
                    ) : (
                      <span className="p-1 bg-sky-50 text-sky-600 rounded-md block">
                        <TrendingUp size={14} />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-white leading-snug">{name}</p>
                      {isCurrent && (
                        <span className="inline-flex items-center rounded-md bg-gold px-2 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-white">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                      <span>{typeLabel}</span>
                      <span>•</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {getMiniStatusBadge(item.status)}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
