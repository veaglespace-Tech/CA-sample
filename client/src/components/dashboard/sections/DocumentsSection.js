"use client";

import { useState, useMemo } from "react";
import { 
  useGetMyDocumentsQuery, 
  useUploadDocumentMutation, 
  useDeleteDocumentMutation 
} from "../../../store/api/documentApi";
import { 
  FileText, Upload, CheckCircle, 
  AlertCircle, Clock, Trash2, 
  Download, Briefcase, Sparkles,
  ShieldCheck, Eye
} from "lucide-react";
import toast from "react-hot-toast";
import { forceDownload } from "../../../lib/utils";

export default function DocumentsSection({ myServicesList = [], myMessages = [] }) {
  // Queries & Mutations
  const { data: myDocsData, isLoading: isDocsLoading } = useGetMyDocumentsQuery();
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [uploadingDocType, setUploadingDocType] = useState(null);

  const myDocuments = useMemo(() => myDocsData?.data || [], [myDocsData]);

  // Only require standard common documents
  const allDocRequirements = useMemo(() => {
    return [
      { type: "PAN Card", description: "Permanent Account Number Card copy (PDF/Image)", required: true },
      { type: "Aadhaar Card", description: "Aadhaar Card Front & Back combined copy (PDF/Image)", required: true },
      { type: "Photo", description: "Recent passport size formal photograph (PNG/JPG)", required: true }
    ];
  }, []);

  const handleFileChange = async (e, reqDoc) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocType(reqDoc.type);

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", reqDoc.type);
      await uploadDocument(formData).unwrap();
      toast.success(`"${reqDoc.type}" uploaded successfully!`);
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

  const getStatusBadge = (status) => {
    const s = String(status || "PENDING").toUpperCase();
    if (s === "VERIFIED" || s === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
          <CheckCircle className="text-sm" /> Verified
        </span>
      );
    }
    if (s === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/50">
          <AlertCircle className="text-sm" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
        <Clock className="text-sm" /> Under Review
      </span>
    );
  };



  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Block with glowing accent */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50/30 text-white rounded-[2.5rem] p-8 shadow-[0_10px_35px_rgba(99,102,241,0.03)] relative border border-gold/20/70 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.06),transparent_50%)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-100/70 rounded-full border border-gold/30/50">
              <ShieldCheck size={14} className="text-gold" />
              <span className="text-[10px] font-black uppercase tracking-wider text-gold">Compliance Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white">Document Workspace</h1>
            <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-xl">
              Securely upload and manage your core identity documents. Once uploaded, they are safely shared across all your active filings for seamless compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Required Documents List */}
      <div className="space-y-6">
        <div className="px-2 flex justify-between items-center">
          <h2 className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-3">
            <span className="w-1.5 h-6 bg-slate-800 rounded-full"></span>
            Required Documents 
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {allDocRequirements.map((reqDoc) => {
            // Try finding a document explicitly uploaded for this type
            let matchedDoc = myDocuments.find(
              doc => doc.documentType === reqDoc.type
            );

            return (
              <div 
                key={reqDoc.type}
                className="bg-navy/90 backdrop-blur-xl border border-slate-700/60 shadow-xl rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-2xl hover:border-slate-300/80 transition-all duration-300 relative overflow-hidden group transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50"
              >
                {/* Subtle gradient background mesh */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors duration-500 -z-10 pointer-events-none"></div>
                <div className="space-y-2 max-w-md">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-white text-xl tracking-tight">{reqDoc.type}</h3>
                    {reqDoc.required && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-rose-50 border border-rose-100/50 text-rose-600 rounded-sm">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    {reqDoc.description}
                  </p>
                </div>

                {matchedDoc ? (
                  /* Document is Uploaded - Show Status and Controls */
                  <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gradient-to-br from-slate-50/80 to-white border border-slate-800/60 p-5 rounded-[2rem] self-stretch md:self-auto justify-between sm:justify-start hover:border-gold/20/60 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)] transition-all">
                    <div className="space-y-1">
                      <div className="text-sm font-black text-white truncate max-w-[200px]" title={matchedDoc.fileName}>
                        {matchedDoc.fileName}
                      </div>
                      <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                        {new Date(matchedDoc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:justify-start pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-700/50 mt-1 sm:mt-0">
                      {getStatusBadge(matchedDoc.status)}

                      {/* Actions */}
                      <a 
                        href={matchedDoc.fileUrl.startsWith("http") ? matchedDoc.fileUrl : `${process.env.NEXT_PUBLIC_API_URL || ""}${matchedDoc.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm bg-gold hover:bg-gold text-white border-none rounded-sm h-10 w-10 px-0 shadow-lg shadow-indigo-600/20 transition-all duration-300 flex items-center justify-center"
                        title="Preview file"
                      >
                        <Eye size={18} />
                      </a>

                      <button 
                        type="button"
                        onClick={() => forceDownload(
                          matchedDoc.fileUrl.startsWith("http") ? matchedDoc.fileUrl : `${process.env.NEXT_PUBLIC_API_URL || ""}${matchedDoc.fileUrl}`,
                          matchedDoc.fileName || "document"
                        )}
                        className="btn btn-sm bg-navy border border-slate-700 hover:border-slate-300 hover:bg-navy-light text-slate-200 rounded-sm h-10 w-10 px-0 transition-all duration-300 shadow-sm flex items-center justify-center"
                        title="Download file"
                      >
                        <Download size={18} />
                      </button>

                      <button 
                        onClick={() => handleDelete(matchedDoc.id)}
                        className="btn btn-sm bg-rose-50 border-none hover:bg-rose-100 text-rose-600 rounded-sm h-10 w-10 px-0 transition-all duration-300 shadow-sm flex items-center justify-center"
                        title="Delete file"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Document is missing - Show beautiful Drag/Upload block */
                  <div className="w-full md:w-auto self-stretch md:self-auto shrink-0">
                    <label className="relative flex flex-col items-center justify-center border-[1.5px] border-dashed border-slate-300 hover:border-indigo-400 bg-navy-light hover:bg-gold/10/40 rounded-none p-6 cursor-pointer text-center group transition-all duration-300 w-full md:min-w-[280px] shadow-sm hover:shadow-md">
                      <input 
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, reqDoc)}
                        disabled={uploadingDocType !== null}
                        className="hidden"
                      />
                      
                      {uploadingDocType === reqDoc.type ? (
                        <div className="flex flex-col items-center gap-3 py-2">
                          <span className="loading loading-spinner text-gold loading-md"></span>
                          <span className="text-[11px] font-black text-gold uppercase tracking-widest">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="p-3 bg-navy shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                            <Upload size={20} className="text-slate-400 group-hover:text-gold transition-colors" />
                          </div>
                          <div className="text-[11px] font-black uppercase text-slate-400 group-hover:text-gold tracking-widest transition-colors">
                            Click to Upload
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">
                            Max 10MB (PDF, JPG)
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


