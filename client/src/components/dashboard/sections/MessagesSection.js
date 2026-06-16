"use client";

import { useState, useEffect } from "react";
import { HiOutlineDocumentAdd, HiOutlineUpload, HiOutlineCheckCircle } from "react-icons/hi";
import { MessageSquare, Bell, Eye, Download } from "lucide-react";
import { useUploadDocumentMutation, useGetMyDocumentsQuery } from "../../../store/api/documentApi";
import { useMarkMessageAsReadMutation } from "../../../store/api/messageApi";
import { forceDownload } from "../../../lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

const getFullFileUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${API_URL}${cleanUrl}`;
};

export default function MessagesSection({ messages, user, onNavigateToSection }) {
  const [uploadDocument] = useUploadDocumentMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();
  const { data: myDocsData } = useGetMyDocumentsQuery();
  const myDocuments = myDocsData?.data || [];

  const [uploadingForMsg, setUploadingForMsg] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ id: null, type: "", text: "" });

  useEffect(() => {
    const unreadCount = messages.filter(m => !m.isRead && m.receiverId === user?.id).length;
    if (unreadCount > 0) {
      markAsRead("all").unwrap().catch(err => console.error("Failed to mark all as read:", err));
    }
  }, [messages, user, markAsRead]);

  const handleFileUpload = async (e, msg) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingForMsg(msg.id);
    setStatusMsg({ id: null, type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", msg.requestedDocName);
      if (msg.registrationId) formData.append("registrationId", msg.registrationId);
      if (msg.leadId) formData.append("leadId", msg.leadId);
      formData.append("messageId", msg.id);

      await uploadDocument(formData).unwrap();
      setStatusMsg({ id: msg.id, type: "success", text: "Document uploaded successfully!" });
    } catch (err) {
      console.error(err);
      setStatusMsg({ id: msg.id, type: "error", text: err?.data?.message || "Failed to upload document." });
    } finally {
      setUploadingForMsg(null);
      e.target.value = null; // Reset input
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Block with glowing accent */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50/30 text-white rounded-[2.5rem] p-8 shadow-[0_10px_35px_rgba(99,102,241,0.03)] relative border border-gold/20/70 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.06),transparent_50%)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-100/70 rounded-full border border-gold/30/50">
              <Bell size={14} className="text-gold" />
              <span className="text-[10px] font-black uppercase tracking-wider text-gold">Inbox & Alerts</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white">My Communications</h1>
            <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-xl">
              Stay updated with important messages, document requests, and notifications from the compliance team.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {messages.filter(msg => msg.senderId !== user?.id).length > 0 ? messages.filter(msg => msg.senderId !== user?.id).map(msg => (
          <div key={msg.id} className={`p-6 md:p-8 rounded-[2.5rem] border shadow-xl transition-all duration-300 relative overflow-hidden group ${msg.isRead ? 'bg-navy/90 backdrop-blur-xl border-slate-700/60 hover:shadow-2xl hover:border-slate-300/80' : 'bg-gold/10/50 backdrop-blur-xl border-gold/30/60 hover:shadow-2xl hover:border-indigo-300'}`}>
            {/* Subtle background glow */}
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -z-10 pointer-events-none transition-colors duration-500 ${msg.isRead ? 'bg-navy-light0/5 group-hover:bg-navy-light0/10' : 'bg-gold/10 group-hover:bg-gold/20'}`}></div>
            <div className="flex justify-between items-start mb-4">
               <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                 {new Date(msg.createdAt).toLocaleString()}
               </span>
               {!msg.isRead && msg.receiverId === user?.id && (
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gold text-white shadow-md shadow-indigo-500/20">
                   New
                 </span>
               )}
            </div>
            <p className="text-base md:text-lg text-white font-medium leading-relaxed">{msg.content}</p>

            {/* Attached Documents / Shared by Admin */}
            {msg.documents && msg.documents.length > 0 && (
              <div className="mt-6 flex flex-col gap-4">
                {msg.documents.map(doc => {
                  const isPdf = doc.fileName.toLowerCase().endsWith(".pdf") || doc.fileUrl.toLowerCase().endsWith(".pdf");
                  const fullUrl = getFullFileUrl(doc.fileUrl);

                  return (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[1.5rem] bg-navy-light border border-slate-800 hover:bg-navy-light/80 hover:border-slate-700 transition-all duration-300 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-navy shadow-sm text-gold rounded-none shrink-0 border border-slate-800 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                          {isPdf ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-white truncate max-w-[200px] sm:max-w-md">
                            {doc.fileName}
                          </span>
                          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-0.5">
                            {doc.isSentByAdmin ? "Shared by Admin" : "Your Upload"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* View PDF / Image - Opens directly in a new tab */}
                        <a
                          href={fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm bg-gold hover:bg-gold text-white border-none rounded-sm h-10 w-10 px-0 shadow-lg shadow-indigo-600/20 transition-all duration-300 flex items-center justify-center"
                          title={`Preview ${isPdf ? "PDF" : "Image"}`}
                        >
                          <Eye size={18} />
                        </a>

                        <button 
                          type="button"
                          onClick={() => forceDownload(fullUrl, doc.fileName || "document")}
                          className="btn btn-sm bg-navy border border-slate-700 hover:border-slate-300 hover:bg-navy-light text-slate-200 rounded-sm h-10 w-10 px-0 transition-all duration-300 shadow-sm flex items-center justify-center"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {msg.isDocRequest && msg.requestedDocName && (
              <div className="mt-8 p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-amber-50 via-orange-50/40 to-white border border-amber-200/50 shadow-sm flex flex-col gap-4 relative overflow-hidden group/alert">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover/alert:bg-amber-500/20 transition-colors duration-500"></div>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500"></div>
                <div className="flex items-start gap-5 relative z-10">
                  <div className="p-3.5 bg-navy text-amber-500 rounded-none shrink-0 mt-0.5 shadow-sm border border-amber-100 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                    <HiOutlineDocumentAdd size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1.5">Action Required</h4>
                    <p className="text-[14px] text-amber-800 font-medium leading-relaxed">
                      The compliance team has requested a document: <span className="font-bold bg-amber-100/50 px-2 py-0.5 rounded text-amber-900">{msg.requestedDocName}</span>.
                    </p>
                    
                    {/* Check if uploaded and not rejected */}
                    {myDocuments.some(doc => doc.documentType === msg.requestedDocName && (msg.registrationId ? doc.registrationId === msg.registrationId : true) && (msg.leadId ? doc.leadId === msg.leadId : true) && doc.status !== "REJECTED") ? (
                      <div className="mt-5 flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-sm border border-emerald-200/50 w-fit shadow-sm">
                        <HiOutlineCheckCircle className="text-xl" />
                        <span className="text-xs font-black uppercase tracking-widest">Document Uploaded Successfully</span>
                      </div>
                    ) : (
                      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className={`btn h-12 px-8 rounded-none gap-3 cursor-pointer transition-all duration-300 font-black uppercase text-[11px] tracking-[0.15em] border-none shadow-[0_8px_20px_-6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_-6px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 ${uploadingForMsg === msg.id ? 'btn-disabled bg-slate-200 text-slate-400' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-500/30 hover:shadow-orange-500/40'}`}>
                          {uploadingForMsg === msg.id ? (
                            <span className="loading loading-spinner loading-sm text-amber-600"></span>
                          ) : (
                            <HiOutlineUpload size={20} />
                          )}
                          {uploadingForMsg === msg.id ? <span className="text-amber-800">Uploading...</span> : 'Upload Required File'}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileUpload(e, msg)}
                            disabled={uploadingForMsg === msg.id}
                          />
                        </label>
                        <span className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest">
                          Max 10MB (PDF, PNG, JPG)
                        </span>
                      </div>
                    )}
                    
                    {statusMsg.id === msg.id && (
                      <p className={`mt-4 text-[11px] font-black uppercase tracking-wider ${statusMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {statusMsg.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="py-8 md:py-24 text-center bg-navy-light/50 rounded-[2.5rem] border border-dashed border-slate-700">
            <div className="w-20 h-20 bg-navy shadow-sm rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-black text-white mb-2">No messages yet</h3>
            <p className="text-sm font-semibold text-slate-400 max-w-sm mx-auto">You&apos;re all caught up! New updates, alerts, and requests will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

