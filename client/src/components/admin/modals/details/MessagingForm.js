"use client";

import { useState } from "react";
import { CheckCircle2, FileSearch, MessageSquareText, Paperclip, PlusCircle, Upload, ShieldCheck } from "lucide-react";

export default function MessagingForm({
  messageText, setMessageText,
  isDocRequest, setIsDocRequest,
  requestedDocName, setRequestedDocName,
  attachment, setAttachment,
  selectedRepoDocId, setSelectedRepoDocId,
  repoDocs,
  handleSend,
  isUploading,
  simpleMode = false
}) {
  const [repoCategoryFilter, setRepoCategoryFilter] = useState("ALL");
  const filteredRepoDocs = repoCategoryFilter === "ALL" 
    ? repoDocs 
    : repoDocs.filter(doc => doc.category === repoCategoryFilter);
  return (
    <div className={`overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white ${simpleMode ? "mt-4 shadow-sm" : "mt-8 shadow-[0_28px_80px_-32px_rgba(15,23,42,0.35)]"}`}>
      <div className="space-y-10 p-6 sm:p-8 xl:p-10">
        {!simpleMode && (
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              <ShieldCheck size={13} />
              Secure Outreach
            </div>
            <h4 className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)]">
                <MessageSquareText size={20} />
              </span>
              Dispatch To User
            </h4>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-500">
              Send a clear update, attach platform resources, or request a specific document from the client dashboard.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Ready</span>
          </div>
          </div>
        )}

        <div className={simpleMode ? "space-y-6" : "space-y-8"}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.18em] text-slate-600">
              <PlusCircle className="text-indigo-600" size={18} />
              Message Content
            </div>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Compose a professional update for the client..."
              className="min-h-[180px] w-full rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-5 text-[1rem] font-medium leading-relaxed text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.18em] text-slate-600">
              <Paperclip className="text-indigo-600" size={18} />
              Attachments & Requests
            </div>

            <div className={`grid grid-cols-1 gap-5 ${simpleMode ? "" : "xl:grid-cols-[1.2fr,1fr]"}`}>
              {!simpleMode && (
                <div
                className={`rounded-[2rem] border p-5 transition-all sm:p-6 ${
                  isDocRequest
                    ? "border-indigo-300 bg-gradient-to-br from-indigo-50 via-white to-violet-50 shadow-[0_18px_50px_-28px_rgba(79,70,229,0.45)]"
                    : "border-slate-200 bg-slate-50/70"
                }`}
              >
                <div className="flex flex-col gap-5">
                  <label className="flex cursor-pointer items-start gap-4 select-none">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-md rounded-lg border-2 border-slate-300 bg-white checked:border-indigo-600 checked:bg-indigo-600"
                        checked={isDocRequest}
                        onChange={(e) => setIsDocRequest(e.target.checked)}
                      />
                    </div>
                    <div>
                      <h5 className="text-lg font-black tracking-tight text-slate-900">Require Document?</h5>
                      <p className="mt-1 max-w-lg text-sm font-medium leading-relaxed text-slate-500">
                        Ask the client to upload a required document directly from their dashboard before the case proceeds.
                      </p>
                    </div>
                  </label>

                  {isDocRequest && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-indigo-600">
                        Requested Document Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. GST Certificate"
                          className="h-14 w-full rounded-2xl border border-indigo-200 bg-white px-5 pr-12 text-sm font-bold text-slate-900 outline-none shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                          value={requestedDocName}
                          onChange={(e) => setRequestedDocName(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600">
                          <CheckCircle2 size={20} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              )}

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-3 rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600">
                    <FileSearch className="text-indigo-600" size={16} />
                    Share From Repository
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100">
                      <select
                        className="h-14 w-full appearance-none bg-transparent pr-8 text-sm font-bold text-slate-800 outline-none"
                        value={repoCategoryFilter}
                        onChange={(e) => {
                          setRepoCategoryFilter(e.target.value);
                          setSelectedRepoDocId("");
                        }}
                      >
                        <option value="ALL">All Categories</option>
                        <option value="TEMPLATE">Template</option>
                        <option value="COMPLIANCE">Compliance Form</option>
                        <option value="GUIDE">User Guide</option>
                        <option value="OTHER">Other</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>

                    <div className="relative rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100">
                      <select
                        className="h-14 w-full appearance-none bg-transparent pr-8 text-sm font-bold text-slate-800 outline-none"
                        value={selectedRepoDocId}
                        onChange={(e) => setSelectedRepoDocId(e.target.value)}
                        disabled={filteredRepoDocs.length === 0}
                      >
                        <option value="">{filteredRepoDocs.length === 0 ? "No docs found" : "Select document..."}</option>
                        {filteredRepoDocs.map((doc) => (
                          <option key={doc.id} value={doc.id}>{doc.fileName}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                  
                  {selectedRepoDocId && (
                    <div className="animate-in fade-in slide-in-from-top-1 flex flex-wrap gap-2 pt-1">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm transition-all hover:border-indigo-300">
                        <FileSearch size={14} className="text-indigo-500" />
                        <span className="truncate max-w-[200px]">
                          {repoDocs.find(d => d.id === selectedRepoDocId)?.fileName || "Document Selected"}
                        </span>
                        <button 
                          onClick={() => setSelectedRepoDocId("")}
                          className="ml-1 rounded-full p-0.5 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
                          title="Remove selection"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600">
                    <Upload className="text-indigo-600" size={16} />
                    Upload New File
                  </div>
                  <label className="flex min-h-[88px] cursor-pointer items-center justify-between gap-4 rounded-[1.4rem] border border-dashed border-slate-300 bg-white px-5 py-4 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50/40">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)]">
                        <Upload size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900">
                          {attachment ? "File Selected" : "Choose a document to upload"}
                        </p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                          {attachment ? attachment.name : "PDF, image, or supporting case file"}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-xl bg-slate-900 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white">
                      Browse
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-8">
          <button
            className="group inline-flex h-14 items-center gap-3 rounded-[1.25rem] bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-[13px] font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_40px_rgba(79,70,229,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(79,70,229,0.34)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            onClick={handleSend}
            disabled={isUploading || (!messageText && !attachment && !selectedRepoDocId && !isDocRequest)}
          >
            {isUploading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <>
                <PlusCircle size={20} className="transition-transform duration-300 group-hover:rotate-90" />
                Dispatch Message
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
