"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ClipboardList, Clock, CheckCircle, 
  Sparkles, Briefcase, MapPin,
  ChevronRight, Folder,
  MessageSquareMore, Mail, Link2, Copy, Check
} from "lucide-react";
import { useGetMyReferralsQuery } from "../../../../store/api/authApi";

export default function ClientOverview({ 
  user, 
  activeServicesCount, 
  pendingItemsCount, 
  myServicesList = [], 
  onNavigateToSection 
}) {
  const { data: referralsData } = useGetMyReferralsQuery(undefined, {
    pollingInterval: 15000
  });
  const myReferrals = referralsData?.data || [];
  const [copiedKey, setCopiedKey] = useState(null); // 'code' | 'link' | null

  const myRefCode = user?.referralCode || `VX-${user?.name?.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "") || "USER"}-${user?.id?.slice(-4).toUpperCase() || "ABCD"}`;

  // Reliable copy with execCommand fallback
  const copyToClipboard = (text, key) => {
    const done = () => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    };
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => {
        execCopy(text);
        done();
      });
    } else {
      execCopy(text);
      done();
    }
  };

  const execCopy = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const isRegistrationService = (item) => {
    // If it's explicitly tagged as a registration or has a registrationType, it is a registration.
    // If it's explicitly tagged as NOT a registration (isReg === false), it's a standard lead.
    if (item.isReg !== undefined) {
      return item.isReg;
    }
    if (item.registrationType !== undefined) {
      return true;
    }
    
    // Fallback for any legacy data that doesn't have the explicit flags
    const name = getServiceName(item).toLowerCase();
    return !(
      name.includes("lawyer") || 
      name.includes("expert") || 
      name.includes("consultation") ||
      name.includes("notice") ||
      name.includes("litigation") ||
      name.includes("callback") ||
      item.formType === "CALLBACK" ||
      item.formType === "CONTACT" ||
      item.formType === "CONSULTATION"
    );
  };

  const getStatusBadgeClass = (status) => {
    const s = String(status || "NEW").toUpperCase();
    if (s === "NEW") return "bg-sky-50 text-sky-700 border-sky-200/60";
    if (s === "IN_PROGRESS") return "bg-amber-50 text-amber-700 border-amber-200/60";
    if (s === "QUALIFIED") return "bg-violet-50 text-violet-700 border-violet-200/60";
    if (s === "CONVERTED" || s === "COMPLETED") return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    if (s === "REJECTED") return "bg-rose-50 text-rose-700 border-rose-200/60";
    return "bg-slate-100 text-slate-500 border-slate-200/60";
  };

  const getServiceName = (item) => {
    if (item.service?.name || item.serviceName) {
      return item.service?.name || item.serviceName;
    }
    if (item.registrationType) {
      return item.registrationType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    return "Dynamic Service File";
  };

  const getProgressDetails = (item) => {
    const s = String(item.status || "NEW").toUpperCase();
    const isReg = isRegistrationService(item);
    
    // Custom workflow timeline for Lawyer callback / Talk to Expert requests
    if (!isReg) {
      if (s === "NEW") {
        return {
          step: 1,
          message: "Our senior legal advisor has been assigned to your request. Callback schedule initiating shortly.",
          label: "Lawyer Assigned"
        };
      }
      if (s === "IN_PROGRESS" || s === "QUALIFIED") {
        return {
          step: 2,
          message: "Lawyer consultation scheduled or currently in progress.",
          label: "Scheduled & Active"
        };
      }
      if (s === "CONVERTED" || s === "COMPLETED") {
        return {
          step: 3,
          message: "Legal consultation completed successfully.",
          label: "Consultation Completed"
        };
      }
      return {
        step: 3,
        message: "Request processed or finalized.",
        label: "Closed"
      };
    }

    // Standard 3-page registration filing workflow
    if (s === "NEW") {
      return {
        step: 1,
        message: "Initial request received. Please complete the details form to proceed.",
        label: "Pending Details"
      };
    }
    if (s === "IN_PROGRESS" || s === "QUALIFIED") {
      return {
        step: 2,
        message: "Details submitted. Compiling legal drafts & preparing professional checkout.",
        label: "Filing Forms Filled"
      };
    }
    if (s === "CONVERTED" || s === "COMPLETED") {
      return {
        step: 3,
        message: "Filing completed. Certification handover accomplished.",
        label: "Filing Completed"
      };
    }
    return {
      step: 3,
      message: "Case review finalized or closed.",
      label: "Filing Closed"
    };
  };

  const renderActionButtons = (item) => {
    const s = String(item.status || "NEW").toUpperCase();
    const isReg = isRegistrationService(item);
    
    if (!isReg) return null;
    
    if (s === "NEW") {
      return (
        <Link 
          href={`/nextstep-registration?leadId=${item.id}`}
          className="btn btn-primary btn-xs h-9 rounded-xl font-black text-[10px] tracking-wider uppercase px-4 flex items-center gap-1.5 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all text-white border-none"
        >
          Complete Details Form <ChevronRight size={13} />
        </Link>
      );
    }
    
    if (s === "IN_PROGRESS" || s === "QUALIFIED") {
      return (
        <Link 
          href={`/payment-step?leadId=${item.id}`}
          className="btn bg-amber-500 hover:bg-amber-600 text-white btn-xs h-9 rounded-xl font-black text-[10px] tracking-wider uppercase px-4 flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:shadow-lg hover:-translate-y-0.5 border-none transition-all"
        >
          Pay Filing Fee <ChevronRight size={13} />
        </Link>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Client Welcome Banner with deep premium color meshes */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-gradient-to-r from-blue-50 via-indigo-50/60 to-white px-6 py-8 text-slate-900 shadow-xl shadow-indigo-100/40 md:px-10 md:py-10 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_34%)]"></div>
        <div className="absolute inset-y-0 right-[22%] hidden w-px bg-slate-200/50 lg:block"></div>
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1">
              <Sparkles className="text-primary text-xs" />
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Legal & Compliance Dashboard</span>
            </div>
            <h1 className="max-w-[12ch] text-4xl font-black leading-[0.95] tracking-tight md:text-5xl lg:text-[3.7rem] text-slate-900">
              Hello, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="max-w-2xl text-base font-medium leading-8 text-slate-600 md:text-lg">
              Welcome back to your Valuexpert client portal. Track your application status, view dynamic progress maps, and securely upload verification documents.
            </p>
          </div>

        </div>
      </div>

      {/* Client Key Metrics Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Metric: Active Registrations */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-7 rounded-[2rem] border border-slate-200/60 shadow-lg flex items-center justify-between group hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
          <div className="relative z-10 space-y-1.5">
            <span className="text-[10px] font-black text-indigo-500/80 uppercase tracking-[0.2em] block">Active Filings</span>
            <div className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{activeServicesCount}</div>
            <span className="text-[11px] font-bold text-slate-400">Total service filings in progress</span>
          </div>
          <div className="relative z-10 p-4 bg-gradient-to-br from-indigo-50 to-white text-indigo-500 rounded-2xl shadow-sm border border-indigo-100/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-indigo-500/20 group-hover:bg-indigo-50">
            <ClipboardList size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* Metric: Required Action items */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-7 rounded-[2rem] border border-slate-200/60 shadow-lg flex items-center justify-between group hover:border-amber-200 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
          {pendingItemsCount > 0 && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>}
          <div className="relative z-10 space-y-1.5">
            <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.2em] block">Pending Actions</span>
            <div className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{pendingItemsCount}</div>
            <span className="text-[11px] font-bold text-slate-400">Files requested by compliance desk</span>
          </div>
          <div className={`relative z-10 p-4 rounded-2xl shadow-sm border transition-all duration-300 group-hover:scale-110 ${pendingItemsCount > 0 ? 'bg-gradient-to-br from-amber-50 to-white text-amber-500 border-amber-100/50 group-hover:shadow-amber-500/20' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
            <Clock size={28} strokeWidth={2.5} />
          </div>
        </div>
      </div>



      {/* Referred Friends History */}
      {myReferrals.length > 0 && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-extrabold text-slate-800 text-lg uppercase tracking-wider flex items-center gap-2">
              <span>👥</span> Referred Friends History ({myReferrals.length})
            </h3>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
              Syncing Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  <th className="pb-3 pl-4">Friend Name</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Referred Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-4 text-right">Service Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myReferrals.map((ref) => (
                  <tr key={ref.id} className="group hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 pl-4 font-bold text-slate-800 text-sm">{ref.friendName}</td>
                    <td className="py-4 text-xs font-semibold text-slate-500">
                      <div className="flex flex-col">
                        <span>{ref.friendEmail}</span>
                        <span className="text-[10px] text-slate-400">{ref.friendPhone || "No Phone"}</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-400">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        ref.status === "NEW" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        ref.status === "CONVERTED" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                        "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ref.status === "NEW" ? "bg-emerald-500" :
                          ref.status === "CONVERTED" ? "bg-indigo-500" :
                          "bg-slate-400"
                        }`} />
                        {ref.status === "NEW" ? "Registered" : ref.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right text-xs font-extrabold text-indigo-900">{ref.serviceName || "Sign Up"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dynamic "Your Filings & Registrations" Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider px-2">Track Business Registration & Tax Filings</h2>
        
        {myServicesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myServicesList.map((item) => {
              const serviceName = getServiceName(item);
              const progress = getProgressDetails(item);
              const isReg = isRegistrationService(item);
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all space-y-6 flex flex-col h-full justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Service Name & Status Badge */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{serviceName}</h3>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">REF: #{item.id?.slice(-8).toUpperCase()}</span>
                      </div>
                      <span className={`badge badge-outline border badge-sm py-2 px-2.5 rounded-lg text-[9px] uppercase font-black tracking-wide shrink-0 ${getStatusBadgeClass(item.status)}`}>
                        {String(item.status || "NEW").replace("_", " ")}
                      </span>
                    </div>
 
                    {/* Details: Proposed business or City if provided */}
                    {(item.businessName || item.city) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-600">
                        {item.businessName && (
                          <div className="flex items-center gap-2 bg-slate-50/70 border border-slate-100 rounded-xl p-2.5">
                            <Briefcase className="text-slate-400 text-base" />
                            <div className="truncate">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none mb-0.5">Proposed Entity</span>
                              <span className="text-slate-800 font-bold text-xs truncate block">{item.businessName}</span>
                            </div>
                          </div>
                        )}
                        {item.city && (
                          <div className="flex items-center gap-2 bg-slate-50/70 border border-slate-100 rounded-xl p-2.5">
                            <MapPin className="text-slate-400 text-base" />
                            <div className="truncate">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none mb-0.5">Location</span>
                              <span className="text-slate-800 font-bold text-xs truncate block">{item.city}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
 
                    {/* Milestone Progress bar */}
                    <div className="pt-4 space-y-3">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <span>{isReg ? "Filing Progress Timeline" : "Consultation Progress"}</span>
                        <span className="text-primary font-black">{progress.label}</span>
                      </div>
                      
                      {/* Horizontal bar */}
                      {isReg && (
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex gap-1 p-0.5">
                          <div className={`h-full rounded-full transition-all duration-500 ${progress.step >= 1 ? 'bg-primary' : 'bg-slate-200'} flex-1`}></div>
                          <div className={`h-full rounded-full transition-all duration-500 ${progress.step >= 2 ? 'bg-primary' : 'bg-slate-200'} flex-1`}></div>
                          <div className={`h-full rounded-full transition-all duration-500 ${progress.step >= 3 ? 'bg-primary' : 'bg-slate-200'} flex-1`}></div>
                        </div>
                      )}
 
                      {/* Info alert bubble */}
                      <div className="bg-primary/[0.02] border border-primary/5 rounded-2xl p-4 text-[12px] text-slate-500 leading-relaxed font-semibold flex gap-2.5 items-start">
                        <CheckCircle className="text-primary text-lg shrink-0 mt-0.5" />
                        <p>{progress.message}</p>
                      </div>
                    </div>
                  </div>
 
                  {/* Submission date & Call actions */}
                  <div className="border-t border-slate-50 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-bold text-slate-400 mt-auto">
                    <span>Applied: {new Date(item.createdAt).toLocaleDateString()}</span>
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                      {isReg && renderActionButtons(item)}
                      {isReg && onNavigateToSection && (
                        <button 
                          onClick={() => onNavigateToSection("documents")}
                          className="btn btn-ghost btn-xs text-primary font-black hover:bg-primary/10 rounded-lg py-2 px-3"
                        >
                          Upload Documents
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card bg-white border-2 border-dashed border-slate-200/80 p-12 text-center rounded-[2.5rem] space-y-4">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <Folder size={36} />
            </div>
            <div className="max-w-xs mx-auto space-y-1">
              <h3 className="text-lg font-black text-slate-800">No active filings yet</h3>
              <p className="text-sm text-slate-500 font-semibold leading-relaxed">You haven&apos;t filed any business services or GST registrations under this account yet.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}



