"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  Users,
  Folder,
  UserCheck,
  MessageSquare,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import PaginationControls from "../../../admin/PaginationControls";

const statusStyles = {
  NEW: "bg-sky-50 text-sky-700 border-sky-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
  QUALIFIED: "bg-violet-50 text-violet-700 border-violet-200",
  CONVERTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  CLOSED: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function StaffOverview({ user, summary, onNavigateToSection }) {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [activityPage, setActivityPage] = useState(1);
  const [activityPageSize, setActivityPageSize] = useState(10);

  const statsCounts = useMemo(() => ({
    total: summary?.totalLeads || 0,
    new: summary?.newLeads || 0,
    converted: summary?.convertedLeads || 0,
    services: summary?.serviceFilings || 0,
    contacted: summary?.totalContacts || 0,
    general: summary?.totalContacts || 0,
  }), [summary]);

  const filterCards = [
    {
      id: "ALL",
      title: "Total Inquiries",
      value: statsCounts.total,
      description: "Every lead, registration, and contact query received across the platform.",
      icon: ClipboardList,
      tone: "blue",
    },
    {
      id: "NEW",
      title: "New Inquiries",
      value: statsCounts.new,
      description: "Fresh submissions that need first response or qualification.",
      icon: Clock,
      tone: "amber",
    },
    {
      id: "CONVERTED",
      title: "Converted Clients",
      value: statsCounts.converted,
      description: "Leads successfully moved into paid or completed work.",
      icon: Users,
      tone: "emerald",
    },
    {
      id: "SERVICES",
      title: "Service Filings",
      value: statsCounts.services,
      description: "Registration, tax, compliance, and service form submissions.",
      icon: Folder,
      tone: "indigo",
    },
    {
      id: "CONTACTED",
      title: "Contact Queries",
      value: statsCounts.contacted,
      description: "People who reached out from the contact and support forms.",
      icon: UserCheck,
      tone: "violet",
    },
    {
      id: "GENERAL",
      title: "General Queries",
      value: statsCounts.general,
      description: "Open-ended platform questions and support requests.",
      icon: MessageSquare,
      tone: "rose",
    },
  ];

  const filteredLeads = useMemo(() => {
    const leads = summary?.latestLeads || [];
    if (filterStatus === "ALL") return leads;
    if (filterStatus === "NEW") {
      return leads.filter((lead) => {
        const status = String(lead.status || "NEW").toUpperCase();
        return status === "NEW" || status === "PENDING" || status === "REQUIRES_ACTION";
      });
    }
    if (filterStatus === "CONVERTED") {
      return leads.filter((lead) => {
        const status = String(lead.status || "").toUpperCase();
        return status === "CONVERTED" || status === "COMPLETED";
      });
    }
    if (filterStatus === "SERVICES") {
      return leads.filter((lead) => lead.formType === "REGISTRATION" || lead.serviceName || lead.service);
    }
    return leads.filter((lead) => lead.formType === "CONTACT" || lead.type === "contact");
  }, [summary?.latestLeads, filterStatus]);

  const getStatusBadgeClass = (status) => {
    const key = String(status || "NEW").toUpperCase();
    return statusStyles[key] || "bg-slate-100 text-slate-500 border-slate-200";
  };
  const activityTotalPages = Math.max(1, Math.ceil(filteredLeads.length / activityPageSize));
  const paginatedLeads = filteredLeads.slice((activityPage - 1) * activityPageSize, activityPage * activityPageSize);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivityPage(1);
  }, [filterStatus, activityPageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activityPage > activityTotalPages) setActivityPage(activityTotalPages);
  }, [activityPage, activityTotalPages]);

  const toneClasses = {
    blue: { gradient: "from-blue-50 to-cyan-50", border: "border-blue-100", text: "text-blue-600", iconBg: "bg-blue-500" },
    amber: { gradient: "from-amber-50 to-orange-50", border: "border-amber-100", text: "text-amber-600", iconBg: "bg-amber-500" },
    emerald: { gradient: "from-emerald-50 to-teal-50", border: "border-emerald-100", text: "text-emerald-600", iconBg: "bg-emerald-500" },
    indigo: { gradient: "from-indigo-50 to-blue-50", border: "border-indigo-100", text: "text-indigo-600", iconBg: "bg-indigo-500" },
    violet: { gradient: "from-violet-50 to-fuchsia-50", border: "border-violet-100", text: "text-violet-600", iconBg: "bg-violet-500" },
    rose: { gradient: "from-rose-50 to-pink-50", border: "border-rose-100", text: "text-rose-600", iconBg: "bg-rose-500" },
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-gradient-to-br from-blue-50 via-indigo-50/60 to-white p-8 shadow-xl shadow-indigo-100/40 md:p-10 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_34%)]"></div>
        <div className="absolute inset-y-0 right-[22%] hidden w-px bg-slate-200/50 lg:block"></div>
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-4 text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Veagle Space Technology Admin Control Center
            </span>
            <h1 className="text-4xl font-black leading-[0.95] tracking-tight text-slate-900 md:text-5xl lg:text-[3.7rem]">
              Hello, {user?.name?.split(" ")[0]}.
            </h1>
            <p className="max-w-2xl text-base font-medium leading-8 text-slate-600 md:text-lg">
              Monitor inquiries, manage services, verify documents, and control admin access from one workspace.
            </p>
          </div>


        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">Key Performance Indicators</h2>
          {filterStatus !== "ALL" && (
            <button
              onClick={() => setFilterStatus("ALL")}
              className="w-fit rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-indigo-700 transition hover:bg-indigo-100"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filterCards.map((card) => {
            const Icon = card.icon;
            const active = filterStatus === card.id;
            const tone = toneClasses[card.tone];
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setFilterStatus(card.id)}
                className={`group relative flex flex-col h-full overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/90 backdrop-blur-xl p-7 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  active 
                    ? `border-${card.tone}-300/60 shadow-${card.tone}-500/10` 
                    : "border-white hover:border-slate-200"
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${tone.iconBg.replace('bg-', 'bg-').replace('500', '500/5')} rounded-full blur-3xl group-hover:${tone.iconBg.replace('bg-', 'bg-').replace('500', '500/10')} transition-colors duration-500`}></div>
                {active && <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tone.gradient}`}></div>}
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className={`block text-[10px] font-black uppercase tracking-[0.2em] ${active ? tone.text : 'text-slate-400'}`}>{card.title}</span>
                    <strong className="block text-4xl md:text-5xl font-black tracking-tight text-slate-800">{card.value}</strong>
                  </div>
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110 ${active ? `bg-gradient-to-br ${tone.gradient} ${tone.text} border border-${card.tone}-100/50 shadow-${card.tone}-500/20` : `bg-slate-50 text-slate-300 border border-slate-100`}`}>
                    <Icon size={28} strokeWidth={2.5} />
                  </span>
                </div>
                <p className="relative z-10 mt-5 min-h-[42px] text-[11px] font-bold leading-relaxed text-slate-400">{card.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {summary?.latestLeads?.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-600">
              Recent Activity
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] tracking-normal text-slate-500">
                {filteredLeads.length}
              </span>
            </h2>
            {onNavigateToSection && (
              <button
                onClick={() => onNavigateToSection("leads")}
                className="btn btn-ghost btn-sm w-fit rounded-xl text-[11px] font-black uppercase tracking-wider text-indigo-700 hover:bg-indigo-50"
              >
                View All <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="table w-full text-slate-800">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-400">
                    <th className="py-4">Name</th>
                    <th className="py-4">Service</th>
                    <th className="py-4">Form Category</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Submitted Date</th>
                    {onNavigateToSection && <th className="py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold">
                  {paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="transition-colors hover:bg-slate-50">
                      <td className="py-4 font-extrabold text-slate-900">{lead.fullName || lead.name}</td>
                      <td className="py-4 text-slate-700">{lead.serviceName || lead.service?.name || "General Inquiry"}</td>
                      <td className="py-4">
                        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] uppercase tracking-wider text-slate-500">
                          {lead.formType || "CONTACT"}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`badge badge-outline badge-sm rounded-lg border px-2.5 py-2 text-[10px] font-black uppercase tracking-wide ${getStatusBadgeClass(lead.status)}`}>
                          {String(lead.status || "NEW").replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 text-xs font-semibold text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      {onNavigateToSection && (
                        <td className="py-4 text-right">
                          <button
                            onClick={() => onNavigateToSection(lead.type === "contact" || lead.formType === "CONTACT" ? "contacts" : "leads")}
                            className="btn btn-ghost btn-xs rounded-lg font-black text-indigo-700 hover:bg-indigo-50"
                          >
                            Manage
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={onNavigateToSection ? 6 : 5} className="bg-slate-50/40 py-16 text-center text-sm font-semibold italic text-slate-400">
                        No inquiries match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls
              totalItems={filteredLeads.length}
              page={activityPage}
              pageSize={activityPageSize}
              onPageChange={setActivityPage}
              onPageSizeChange={(size) => {
                setActivityPageSize(size);
                setActivityPage(1);
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
