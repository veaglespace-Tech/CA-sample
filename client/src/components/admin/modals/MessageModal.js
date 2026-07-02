"use client";

import { useState } from "react";
import { FileUp, Send, X } from "lucide-react";
import { useGetRepositoryQuery } from "../../../store/api/adminApi";

export default function MessageModal({ messagingUser, onClose, onSendMessage, canAccessRepository = false, canRequestDocuments = false }) {
  const [quickMessageText, setQuickMessageText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [selectedRepoDocId, setSelectedRepoDocId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: repoResponse } = useGetRepositoryQuery(undefined, { skip: !canAccessRepository });
  const repoDocs = repoResponse?.data || [];

  if (!messagingUser) return null;

  const handleSend = async () => {
    if (!quickMessageText.trim() && !attachment && !selectedRepoDocId) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("receiverId", messagingUser.id);
      formData.append("content", quickMessageText);
      formData.append("isDocRequest", !!messagingUser.isDocRequest);
      if (messagingUser.contactQueryId) {
        formData.append("contactQueryId", messagingUser.contactQueryId);
      }
      if (messagingUser.requestedDocName) {
        formData.append("requestedDocName", messagingUser.requestedDocName);
      }
      if (attachment) {
        formData.append("attachment", attachment);
      }
      if (selectedRepoDocId) {
        formData.append("repositoryDocId", selectedRepoDocId);
      }

      const success = await onSendMessage(formData);
      if (success) {
        setQuickMessageText("");
        setAttachment(null);
        setSelectedRepoDocId("");
        onClose();
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-lg overflow-hidden rounded-[1.5rem] border border-slate-700 bg-navy p-0 shadow-2xl transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5 text-white">
          <div>
            <h3 className="text-lg font-black tracking-tight">Message to {messagingUser.name}</h3>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">Send a platform message, document request, or attachment.</p>
          </div>
          <button onClick={() => onClose(null)} className="btn btn-circle btn-sm border-none bg-navy/10 text-white hover:bg-navy/20">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <textarea
            value={quickMessageText}
            onChange={(event) => setQuickMessageText(event.target.value)}
            placeholder="Type your message here..."
            className="textarea textarea-bordered min-h-28 w-full rounded-sm border-slate-700 bg-navy-light font-semibold"
          />

          {canRequestDocuments && <div className="rounded-sm border border-slate-700 bg-navy-light p-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-slate-200">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm rounded"
                checked={messagingUser.isDocRequest || false}
                onChange={(event) => onClose({ ...messagingUser, isDocRequest: event.target.checked })}
              />
              Request a document from client
            </label>

            {messagingUser.isDocRequest && (
              <input
                type="text"
                value={messagingUser.requestedDocName || ""}
                onChange={(event) => onClose({ ...messagingUser, requestedDocName: event.target.value })}
                placeholder="Document name"
                className="input input-bordered mt-3 h-10 w-full rounded-sm border-slate-700 bg-navy text-sm font-semibold"
              />
            )}
          </div>}

          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400">Attachments</div>
            <label className={`flex cursor-pointer items-center gap-3 rounded-sm border border-dashed border-slate-700 bg-navy p-4 transition ${selectedRepoDocId ? "pointer-events-none opacity-50" : "hover:border-gold/50 hover:bg-gold/10/30"}`}>
              <span className="rounded-sm bg-navy-light p-2 text-slate-400">
                <FileUp size={18} />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-200">
                {attachment ? attachment.name : "Upload new file"}
              </span>
              <input
                type="file"
                hidden
                disabled={!!selectedRepoDocId}
                onChange={(event) => setAttachment(event.target.files?.[0] || null)}
              />
            </label>

            {attachment && (
              <button onClick={() => setAttachment(null)} className="text-xs font-black uppercase tracking-wider text-rose-600">
                Remove file
              </button>
            )}

            {canAccessRepository && (
              <select
                value={selectedRepoDocId}
                onChange={(event) => setSelectedRepoDocId(event.target.value)}
                disabled={!!attachment}
                className="select select-bordered h-10 w-full rounded-sm border-slate-700 bg-navy text-sm font-semibold"
              >
                <option value="">Select from document library</option>
                {repoDocs.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.fileName} ({doc.category})</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button onClick={() => onClose(null)} className="btn btn-ghost rounded-sm px-6">Cancel</button>
            <button
              onClick={handleSend}
              disabled={isUploading || (!quickMessageText.trim() && !attachment && !selectedRepoDocId)}
              className="btn btn-primary rounded-sm px-7"
            >
              {isUploading ? <span className="loading loading-spinner loading-xs" /> : <Send size={16} />}
              {isUploading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-sm transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" onClick={() => onClose(null)}>
        <button>close</button>
      </form>
    </dialog>
  );
}
