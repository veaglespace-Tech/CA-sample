"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ClipboardList, Clock, CheckCircle, 
  Sparkles, Briefcase, MapPin,
  ChevronRight, Folder,
  MessageSquareMore, Mail, Link2, Copy, Check,
  Upload, Trash2, Eye, Download, AlertCircle, FileText
} from "lucide-react";
import { useGetMyReferralsQuery } from "../../../../store/api/authApi";
import { 
  useGetMyDocumentsQuery, 
  useUploadDocumentMutation, 
  useDeleteDocumentMutation 
} from "../../../../store/api/documentApi";
import toast from "react-hot-toast";
import { forceDownload } from "../../../../lib/utils";
import { serviceData } from "../../../../data/services";

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

  // Document Upload States
  const { data: myDocsData } = useGetMyDocumentsQuery();
  const [uploadDocument] = useUploadDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();
  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [expandedServiceId, setExpandedServiceId] = useState(null); // To track which service docs are shown

  const myDocuments = myDocsData?.data || [];

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
    return "bg-navy-light text-slate-400 border-slate-700/60";
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

  const getServiceRequiredDocs = (item) => {
    let slug = item.sourcePageSlug || item.service?.slug;
    if (!slug && (item.service?.name || item.serviceName)) {
      slug = (item.service?.name || item.serviceName).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    const defaultDocs = ["PAN Card", "Aadhaar Card", "Address Proof", "Passport Size Photo"];
    if (slug && serviceData[slug] && serviceData[slug].documents) {
      return serviceData[slug].documents;
    }
    return defaultDocs;
  };

  // Returns { uploaded, total, missingDocs } for a service item
  const getDocSummary = (item) => {
    const requiredDocs = getServiceRequiredDocs(item);
    const isDocReg = item.isReg;
    const uploaded = requiredDocs.filter(docTypeStr =>
      myDocuments.some(
        doc => doc.documentType === docTypeStr &&
          (isDocReg ? doc.registrationId === item.id : doc.leadId === item.id)
      )
    );
    return { uploaded: uploaded.length, total: requiredDocs.length, allDocs: requiredDocs };
  };

  const handleFileChange = async (e, docType, registrationId, leadId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocType(docType);

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", docType);
      if (registrationId) formData.append("registrationId", registrationId);
      if (leadId) formData.append("leadId", leadId);
      
      await uploadDocument(formData).unwrap();
      toast.success(`"${docType}" uploaded successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to upload document. Please try again.");
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    try {
      await deleteDocument(docId).unwrap();
      toast.success("Document deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete document.");
    }
  };

  const getDocStatusBadge = (status) => {
    const s = String(status || "PENDING").toUpperCase();
    if (s === "VERIFIED" || s === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={10} /> Verified
        </span>
      );
    }
    if (s === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle size={10} /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock size={10} /> Under Review
      </span>
    );
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
          className="btn btn-primary btn-xs h-9 rounded-sm font-black text-[10px] tracking-wider uppercase px-4 flex items-center gap-1.5 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all text-white border-none"
        >
          Complete Details Form <ChevronRight size={13} />
        </Link>
      );
    }
    
    if (s === "IN_PROGRESS" || s === "QUALIFIED") {
      return (
        <Link 
          href={`/payment-step?leadId=${item.id}`}
          className="btn bg-amber-500 hover:bg-amber-600 text-white btn-xs h-9 rounded-sm font-black text-[10px] tracking-wider uppercase px-4 flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:shadow-lg hover:-translate-y-0.5 border-none transition-all"
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
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white px-6 py-8 text-slate-900 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-3xl md:px-10 md:py-8 md:py-10 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.05),transparent_40%)]"></div>
        <div className="absolute inset-y-0 right-[22%] hidden w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent lg:block"></div>
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3.5 py-1">
              <Sparkles className="text-gold text-xs" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Legal & Compliance Dashboard</span>
            </div>
            <h1 className="max-w-[12ch] text-4xl font-black leading-[0.95] tracking-tight md:text-5xl lg:text-[3.7rem] text-slate-900">
              Hello, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="max-w-2xl text-base font-medium leading-8 text-slate-600 md:text-lg">
              Welcome back to your Veagle Space Technology client portal. Track your application status, view dynamic progress maps, and securely upload verification documents.
            </p>
          </div>

        </div>
      </div>

      {/* Client Key Metrics Block */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric: Active Registrations */}
        <div className="relative overflow-hidden bg-white p-7 rounded-3xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center justify-between group hover:border-gold/30 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/15 transition-all duration-700 ease-out scale-150 group-hover:scale-110 translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0"></div>
          <div className="relative z-10 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block">Active Filings</span>
            <div className="text-4xl md:text-3xl md:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">{activeServicesCount}</div>
            <span className="text-[11px] font-semibold text-slate-600">Total service filings in progress</span>
          </div>
          <div className="relative z-10 p-4 bg-gradient-to-br from-gold/10 to-gold/5 text-gold rounded-2xl shadow-sm border border-gold/20 transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-gold/20 group-hover:bg-gold/20">
            <ClipboardList size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* Metric: Required Action items */}
        <div className="relative overflow-hidden bg-white p-7 rounded-3xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center justify-between group hover:border-amber-500/30 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/15 transition-all duration-700 ease-out scale-150 group-hover:scale-110 translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0"></div>
          {pendingItemsCount > 0 && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>}
          <div className="relative z-10 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block">Pending Actions</span>
            <div className="text-4xl md:text-3xl md:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">{pendingItemsCount}</div>
            <span className="text-[11px] font-semibold text-slate-600">Files requested by compliance desk</span>
          </div>
          <div className={`relative z-10 p-4 rounded-2xl shadow-sm border transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 ${pendingItemsCount > 0 ? 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 text-amber-500 border-amber-500/30 group-hover:shadow-amber-500/20' : 'bg-slate-50 text-slate-400 border-slate-200 group-hover:shadow-md'}`}>
            <Clock size={28} strokeWidth={2.5} />
          </div>
        </div>
      </div>



      {/* Referred Friends History */}
      {myReferrals.length > 0 && (
        <div className="bg-navy p-8 rounded-[2.5rem] border border-slate-700/60 shadow-xl space-y-6 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-extrabold text-white text-lg uppercase tracking-wider flex items-center gap-2">
              <span>👥</span> Referred Friends History ({myReferrals.length})
            </h3>
            <span className="text-[10px] font-bold text-gold bg-gold/10 border border-gold/20 px-3.5 py-1 rounded-full uppercase tracking-wider">
              Syncing Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  <th className="pb-3 pl-4">Friend Name</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Referred Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-4 text-right">Service Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myReferrals.map((ref) => (
                  <tr key={ref.id} className="group hover:bg-navy-light/40 transition-colors">
                    <td className="py-4 pl-4 font-bold text-white text-sm">{ref.friendName}</td>
                    <td className="py-4 text-xs font-semibold text-slate-400">
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
                        ref.status === "CONVERTED" ? "bg-gold/10 text-gold border-gold/30" :
                        "bg-navy-light text-slate-300 border-slate-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ref.status === "NEW" ? "bg-emerald-500" :
                          ref.status === "CONVERTED" ? "bg-gold" :
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
        <h2 className="text-xl font-black text-white uppercase tracking-wider px-2">Track Business Registration & Tax Filings</h2>
        
        {myServicesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
            {myServicesList.map((item) => {
              const serviceName = getServiceName(item);
              const progress = getProgressDetails(item);
              const isReg = isRegistrationService(item);
              
              return (
                <div 
                  key={item.id} 
                  className="bg-navy p-6 rounded-[2rem] border border-slate-700/60 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all space-y-6 flex flex-col h-full justify-between transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50"
                >
                  <div className="space-y-4">
                    {/* Header: Service Name & Status Badge */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-extrabold text-white text-lg leading-tight">{serviceName}</h3>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">REF: #{item.id?.slice(-8).toUpperCase()}</span>
                      </div>
                      <span className={`badge badge-outline border badge-sm py-2 px-2.5 rounded-sm text-[9px] uppercase font-black tracking-wide shrink-0 ${getStatusBadgeClass(item.status)}`}>
                        {String(item.status || "NEW").replace("_", " ")}
                      </span>
                    </div>
 
                    {/* Details: Proposed business or City if provided */}
                    {(item.businessName || item.city) && (
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-300">
                        {item.businessName && (
                          <div className="flex items-center gap-2 bg-navy-light/70 border border-slate-800 rounded-sm p-2.5 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                            <Briefcase className="text-slate-400 text-base" />
                            <div className="truncate">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none mb-0.5">Proposed Entity</span>
                              <span className="text-white font-bold text-xs truncate block">{item.businessName}</span>
                            </div>
                          </div>
                        )}
                        {item.city && (
                          <div className="flex items-center gap-2 bg-navy-light/70 border border-slate-800 rounded-sm p-2.5 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                            <MapPin className="text-slate-400 text-base" />
                            <div className="truncate">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none mb-0.5">Location</span>
                              <span className="text-white font-bold text-xs truncate block">{item.city}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
 
                    {/* Milestone Progress bar */}
                    <div className="pt-4 space-y-3">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <span>{isReg ? "Filing Progress Timeline" : "Consultation Progress"}</span>
                        <span className="text-gold font-black">{progress.label}</span>
                      </div>
                      
                      {/* Horizontal bar */}
                      {isReg && (
                        <div className="w-full bg-navy-light h-2.5 rounded-full overflow-hidden flex gap-1 p-0.5">
                          <div className={`h-full rounded-full transition-all duration-500 ${progress.step >= 1 ? 'bg-gold' : 'bg-slate-200'} flex-1`}></div>
                          <div className={`h-full rounded-full transition-all duration-500 ${progress.step >= 2 ? 'bg-gold' : 'bg-slate-200'} flex-1`}></div>
                          <div className={`h-full rounded-full transition-all duration-500 ${progress.step >= 3 ? 'bg-gold' : 'bg-slate-200'} flex-1`}></div>
                        </div>
                      )}
 
                      {/* Info alert bubble */}
                      <div className="bg-gold/[0.02] border border-primary/5 rounded-none p-4 text-[12px] text-slate-400 leading-relaxed font-semibold flex gap-2.5 items-start">
                        <CheckCircle className="text-gold text-lg shrink-0 mt-0.5" />
                        <p>{progress.message}</p>
                      </div>
                    </div>
                  </div>
 
                  {/* Document upload summary banner — always visible for registration services */}
                  {isReg && (() => {
                    const { uploaded, total } = getDocSummary(item);
                    const allUploaded = uploaded === total;
                    return (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setExpandedServiceId(expandedServiceId === item.id ? null : item.id)}
                        onKeyDown={e => e.key === "Enter" && setExpandedServiceId(expandedServiceId === item.id ? null : item.id)}
                        className={`mt-2 flex items-center justify-between gap-3 rounded-lg px-4 py-3 border cursor-pointer transition-all duration-200 ${
                          allUploaded
                            ? "bg-emerald-950/40 border-emerald-700/40 hover:border-emerald-500/60"
                            : "bg-amber-950/40 border-amber-700/40 hover:border-amber-500/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {allUploaded
                            ? <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                            : <AlertCircle size={15} className="text-amber-400 shrink-0" />}
                          <span className={`text-[11px] font-bold ${
                            allUploaded ? "text-emerald-300" : "text-amber-300"
                          }`}>
                            {allUploaded
                              ? "All documents uploaded"
                              : `${total - uploaded} document${total - uploaded !== 1 ? "s" : ""} not yet uploaded`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            allUploaded
                              ? "bg-emerald-900/60 text-emerald-300 border-emerald-700/50"
                              : "bg-amber-900/60 text-amber-300 border-amber-700/50"
                          }`}>
                            {uploaded}/{total}
                          </span>
                          <ChevronRight size={13} className={`text-slate-400 transition-transform duration-200 ${
                            expandedServiceId === item.id ? "rotate-90" : ""
                          }`} />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Submission date & action buttons */}
                  <div className="border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-bold text-slate-400 mt-auto">
                    <span>Applied: {new Date(item.createdAt).toLocaleDateString()}</span>
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                      {isReg && renderActionButtons(item)}
                    </div>
                  </div>

                  {/* Inline Document Upload Panel — expands on click of summary banner */}
                  {isReg && expandedServiceId === item.id && (
                    <div className="border-t border-slate-700/60 pt-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText size={15} className="text-gold" />
                        <h4 className="text-sm font-black text-white">Required Documents</h4>
                        <span className="text-[9px] text-slate-400 font-semibold ml-1">for {serviceName}</span>
                      </div>

                      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                        {getServiceRequiredDocs(item).map((docTypeStr, idx) => {
                          // No truncation — use full string for correct matching
                          const isDocReg = item.isReg;
                          const matchedDoc = myDocuments.find(
                            doc => doc.documentType === docTypeStr &&
                              (isDocReg ? doc.registrationId === item.id : doc.leadId === item.id)
                          );
                          const isUploading = uploadingDocType === docTypeStr;

                          return (
                            <div
                              key={idx}
                              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded-lg p-3 border transition-all ${
                                matchedDoc
                                  ? "bg-emerald-950/30 border-emerald-800/40"
                                  : "bg-navy-light/60 border-slate-800"
                              }`}
                            >
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                {matchedDoc
                                  ? <CheckCircle size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                                  : <AlertCircle size={13} className="text-amber-400 mt-0.5 shrink-0" />}
                                <div className="min-w-0">
                                  <h5 className="text-[11px] font-bold text-white leading-snug">{docTypeStr}</h5>
                                  {matchedDoc && (
                                    <span className="text-[9px] text-slate-400 truncate block" title={matchedDoc.fileName}>
                                      {matchedDoc.fileName}
                                    </span>
                                  )}
                                  {!matchedDoc && (
                                    <span className="text-[9px] text-amber-400/80">Not uploaded</span>
                                  )}
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                {matchedDoc ? (
                                  <>
                                    {getDocStatusBadge(matchedDoc.status)}
                                    <a
                                      href={matchedDoc.fileUrl.startsWith("http") ? matchedDoc.fileUrl : `${process.env.NEXT_PUBLIC_API_URL || ""}${matchedDoc.fileUrl}`}
                                      target="_blank" rel="noreferrer"
                                      className="text-slate-400 hover:text-white transition-colors" title="Preview"
                                    >
                                      <Eye size={13} />
                                    </a>
                                    <button
                                      onClick={() => handleDelete(matchedDoc.id)}
                                      className="text-rose-500 hover:text-rose-400 transition-colors" title="Delete"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </>
                                ) : (
                                  <label className="btn btn-xs bg-gold/10 border border-gold/40 hover:bg-gold hover:text-white text-gold rounded-sm font-bold cursor-pointer flex items-center gap-1.5 px-3">
                                    <input
                                      type="file"
                                      accept=".pdf,.png,.jpg,.jpeg"
                                      onChange={e => handleFileChange(
                                        e,
                                        docTypeStr,
                                        isDocReg ? item.id : null,
                                        !isDocReg ? item.id : null
                                      )}
                                      disabled={isUploading}
                                      className="hidden"
                                    />
                                    {isUploading
                                      ? <span className="loading loading-spinner loading-xs"></span>
                                      : <><Upload size={11} /> Upload</>}
                                  </label>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card bg-navy border-2 border-dashed border-slate-700/80 p-4 md:p-12 text-center rounded-[2.5rem] space-y-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <div className="p-4 bg-navy-light text-slate-400 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <Folder size={36} />
            </div>
            <div className="max-w-xs mx-auto space-y-1">
              <h3 className="text-lg font-black text-white">No active filings yet</h3>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed">You haven&apos;t filed any business services or GST registrations under this account yet.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}



