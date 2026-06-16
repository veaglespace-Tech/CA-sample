"use client";

import { DownloadCloud, Loader2, Trash2, RefreshCw, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDeleteDocumentMutation } from "../../../../store/api/documentApi";
import { useSendMessageMutation } from "../../../../store/api/messageApi";
import { forceDownload } from "../../../../lib/utils";
import { downloadApiFile, getApiUrl } from "../../../../lib/api/client";

export default function DocumentsTable({ documents, currentItem }) {
  const token = useSelector((state) => state.auth?.token);
  const [isDownloading, setIsDownloading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [deleteDocument] = useDeleteDocumentMutation();
  const [sendMessage] = useSendMessageMutation();

  // Determine if this is a lead or registration for the download API
  const itemType = currentItem?.isReg || currentItem?.registrationType ? "registration" : "lead";
  const itemId = currentItem?.id;
  const canDownloadAll = documents.length > 0 && itemId;

  const handleDownloadAll = async () => {
    try {
      setIsDownloading(true);
      const clientName = currentItem?.name || currentItem?.fullName || "Client";
      const serviceName = currentItem?.service?.name || currentItem?.serviceName || currentItem?.registrationType || "Service";
      const safeClientName = clientName.replace(/[^a-zA-Z0-9]/g, '_');
      const safeServiceName = serviceName.replace(/[^a-zA-Z0-9]/g, '_');
      await downloadApiFile(`/api/admin/documents/download-all?type=${itemType}&id=${itemId}`, {
        token,
        filename: `${safeClientName}_${safeServiceName}_Documents.zip`,
      });
    } catch (err) {
      toast.error("Download failed: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to permanently delete this document?")) return;
    try {
      setProcessingId(docId);
      await deleteDocument(docId).unwrap();
    } catch (err) {
      toast.error("Failed to delete document: " + (err?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleRequestReupload = async (doc) => {
    if (!window.confirm(`Delete "${doc.fileName}" and request a re-upload for ${doc.documentType}?`)) return;
    try {
      setProcessingId(doc.id);
      await deleteDocument(doc.id).unwrap();
      
      const receiverId = currentItem?.userId || currentItem?.user?.id;
      if (receiverId) {
        await sendMessage({
          receiverId,
          registrationId: itemType === "registration" ? itemId : null,
          leadId: itemType === "lead" ? itemId : null,
          content: `Your document "${doc.fileName}" was rejected by the admin. Please re-upload your ${doc.documentType.replace("_", " ")}.`,
          isDocRequest: true,
          requestedDocName: doc.documentType
        }).unwrap();
      }
    } catch (err) {
      toast.error("Failed to process request: " + (err?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {canDownloadAll && (
        <div className="flex justify-end">
          <button
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="btn btn-sm btn-primary bg-gold hover:bg-gold border-none text-white rounded-sm font-bold gap-2 disabled:opacity-70"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />}
            {isDownloading ? "Zipping..." : "Download All (ZIP)"}
          </button>
        </div>
      )}
      <div className="overflow-x-auto bg-navy-light rounded-none border border-base-200 shadow-sm">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-base-200/50">
            <th className="text-[10px] uppercase tracking-widest opacity-50">Document Name</th>
            <th className="text-[10px] uppercase tracking-widest opacity-50">Source</th>
            <th className="text-[10px] uppercase tracking-widest opacity-50">Type</th>
            <th className="text-[10px] uppercase tracking-widest opacity-50">Date</th>
            <th className="text-[10px] uppercase tracking-widest opacity-50 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map(doc => (
              <tr key={doc.id} className="hover:bg-gold/5 transition-colors">
                <td>
                  <div className="font-bold text-sm">{doc.fileName}</div>
                </td>
                <td>
                  {doc.isSentByAdmin ? (
                    <div className="badge badge-info badge-sm gap-1 font-bold">Admin</div>
                  ) : (
                    <div className="badge badge-success badge-sm gap-1 font-bold">Client</div>
                  )}
                </td>
                <td>
                  <div className="text-xs opacity-60 uppercase font-bold">{doc.documentType?.replace("_", " ")}</div>
                </td>
                <td>
                  <div className="text-xs opacity-60">{new Date(doc.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a 
                      href={doc.fileUrl?.startsWith("http") ? doc.fileUrl : getApiUrl(doc.fileUrl)}
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-primary btn-xs w-8 h-8 px-0 rounded-sm flex items-center justify-center"
                      title="Preview Document"
                    >
                      <Eye size={14} />
                    </a>
                    <button 
                      type="button"
                      onClick={() => forceDownload(
                        doc.fileUrl?.startsWith("http") ? doc.fileUrl : getApiUrl(doc.fileUrl),
                        doc.fileName || "document"
                      )}
                      className="btn btn-neutral btn-xs w-8 h-8 px-0 rounded-sm flex items-center justify-center"
                      title="Download Document"
                    >
                      <DownloadCloud size={14} />
                    </button>
                    <button 
                      className="btn btn-error btn-xs w-8 h-8 px-0 rounded-sm text-white flex items-center justify-center" 
                      title="Delete Document"
                      onClick={() => handleDelete(doc.id)}
                      disabled={processingId === doc.id}
                    >
                      {processingId === doc.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                    <button 
                      className="btn btn-warning btn-xs w-8 h-8 px-0 rounded-sm text-white flex items-center justify-center" 
                      title="Reject & Request Re-upload"
                      onClick={() => handleRequestReupload(doc)}
                      disabled={processingId === doc.id}
                    >
                      {processingId === doc.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 md:py-20 text-center opacity-30 italic">No documents found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
