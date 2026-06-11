"use client";
import { useState } from "react";
import { useGetRepositoryQuery, useUploadToRepositoryMutation, useDeleteFromRepositoryMutation, useUpdateRepositoryDocumentMutation } from "../../../store/api/adminApi";
import AdminTable from "./AdminTable";
import { Upload, X, FileText, Tag, AlignLeft, Paperclip, Search, Send } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RepositoryView({ allUsers, onSendMessage, permissions = {} }) {
  const { data: response, isLoading } = useGetRepositoryQuery();
  const [uploadToRepo, { isLoading: isUploading }] = useUploadToRepositoryMutation();
  const [deleteFromRepo] = useDeleteFromRepositoryMutation();
  const [updateRepoDoc, { isLoading: isUpdating }] = useUpdateRepositoryDocumentMutation();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({ fileName: "", description: "", category: "TEMPLATE" });
  const [file, setFile] = useState(null);

  // Sharing state
  const [sharingDoc, setSharingDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const docs = response?.data || [];
  const filteredDocs = docs.filter(doc => categoryFilter === "ALL" || doc.category === categoryFilter);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file && !editingDoc) return toast.error("Please select a file");

    const fd = new FormData();
    if (file) fd.append("document", file);
    fd.append("fileName", formData.fileName);
    fd.append("description", formData.description);
    fd.append("category", formData.category);

    try {
      if (editingDoc) {
        await updateRepoDoc({ id: editingDoc.id, body: fd }).unwrap();
        toast.success("Document updated successfully!");
      } else {
        await uploadToRepo(fd).unwrap();
        toast.success("Document saved successfully!");
      }
      setShowUploadForm(false);
      setEditingDoc(null);
      setFormData({ fileName: "", description: "", category: "TEMPLATE" });
      setFile(null);
    } catch (err) {
      toast.error(err.data?.message || "Operation failed.");
    }
  };

  const startEdit = (doc) => {
    setEditingDoc(doc);
    setFormData({
      fileName: doc.fileName || "",
      description: doc.description || "",
      category: doc.category || "TEMPLATE",
    });
    setShowUploadForm(true);
    setFile(null);
  };

  const handleShare = async (user) => {
    if (!sharingDoc || !onSendMessage) return;
    const fd = new FormData();
    fd.append("receiverId", user.id);
    fd.append("repositoryDocId", sharingDoc.id);
    fd.append("content", `Sharing document: ${sharingDoc.fileName}`);
    try {
      const success = await onSendMessage(fd);
      if (success) {
        setSharingDoc(null);
        toast.success(`Document shared with ${user.name}`);
      }
    } catch {
      toast.error("Failed to share document");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Remove this document from the library?")) {
      await deleteFromRepo(id).unwrap();
    }
  };

  const filteredUsers =
    allUsers?.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading) return (
    <div className="flex items-center justify-center py-24 gap-3 opacity-50">
      <span className="loading loading-spinner loading-md text-primary"></span>
      <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Loading Library...</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Document Library</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Manage and share compliance documents, templates & guides</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          >
            <option value="ALL">All Categories</option>
            <option value="TEMPLATE">Template</option>
            <option value="COMPLIANCE">Compliance Form</option>
            <option value="GUIDE">User Guide</option>
            <option value="OTHER">Other</option>
          </select>
          
          {permissions.canUpload && (
          <button
            onClick={() => {
              setShowUploadForm(!showUploadForm);
              if (showUploadForm) {
                setEditingDoc(null);
                setFormData({ fileName: "", description: "", category: "TEMPLATE" });
                setFile(null);
              }
            }}
            className={`btn rounded-2xl font-black gap-2 transition-all shadow-sm ${
              showUploadForm
                ? "btn-ghost border border-slate-200 text-slate-600 hover:bg-slate-100"
                : "btn-primary px-6"
            }`}
          >
            {showUploadForm ? (
              <><X size={16} /> Cancel</>
            ) : (
              <><Upload size={16} /> Upload to Library</>
            )}
          </button>
          )}
        </div>
      </div>

      {/* Upload / Edit Form */}
      {showUploadForm && (
        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">

          {/* Form Header */}
          <div className="bg-slate-900 px-8 py-5 flex items-center gap-3">
            <div className="p-2.5 bg-primary/15 rounded-xl text-primary">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {editingDoc ? "Edit Document" : "Upload New Document"}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                {editingDoc ? `Updating: ${editingDoc.fileName}` : "Add a file to the shared library"}
              </p>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleUpload} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <FileText size={12} /> Display Name
                </label>
                <input
                  type="text"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  placeholder="e.g. GST Registration Template"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <Tag size={12} /> Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="TEMPLATE">Template</option>
                  <option value="COMPLIANCE">Compliance Form</option>
                  <option value="GUIDE">User Guide</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Description — full width */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <AlignLeft size={12} /> Description <span className="text-slate-400 normal-case font-medium">(optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe what this document is for..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* File Upload — full width */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <Paperclip size={12} /> File {editingDoc && <span className="text-slate-400 normal-case font-medium">(leave empty to keep current)</span>}
                </label>
                <label className="flex items-center gap-4 px-5 py-4 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/[0.02] rounded-xl cursor-pointer transition-all group">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl group-hover:border-primary/30 transition-all shrink-0">
                    <Upload size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {file ? (
                      <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                    ) : (
                      <p className="text-sm font-semibold text-slate-500">
                        Click to browse or drag & drop a file
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-0.5">PDF, DOCX, XLSX, PNG supported</p>
                  </div>
                  <input
                    type="file"
                    required={!editingDoc}
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(false);
                  setEditingDoc(null);
                  setFormData({ fileName: "", description: "", category: "TEMPLATE" });
                  setFile(null);
                }}
                className="btn btn-ghost rounded-xl px-6 font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || isUpdating}
                className="btn btn-primary rounded-xl px-8 font-black gap-2 shadow-sm"
              >
                {isUploading || isUpdating ? (
                  <><span className="loading loading-spinner loading-xs"></span> Processing...</>
                ) : (
                  <><FileText size={15} /> {editingDoc ? "Update Document" : "Save to Library"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents Table */}
      <AdminTable
        title="Shared Documents"
        columns={["FileName", "Category", "Date"]}
        items={filteredDocs}
        type="document"
        onEdit={permissions.canUpdate ? startEdit : undefined}
        onDelete={permissions.canDelete ? handleDelete : undefined}
        onShare={permissions.canShare ? (doc) => setSharingDoc(doc) : undefined}
        onViewDetails={(doc) =>
          window.open(
            doc.fileUrl.startsWith("http")
              ? doc.fileUrl
              : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003"}${doc.fileUrl}`,
            "_blank"
          )
        }
      />

      {/* Share Modal */}
      {sharingDoc && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md rounded-[2rem] p-0 overflow-hidden bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/15 rounded-xl text-primary">
                  <Send size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">Share Document</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-black tracking-widest uppercase">{sharingDoc.category}</span>
                    <p className="text-[11px] text-slate-400 font-semibold truncate max-w-[150px]">{sharingDoc.fileName}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setSharingDoc(null); setSearchTerm(""); }}
                className="btn btn-circle btn-sm border-none bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="px-5 pt-5 pb-3 shrink-0">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-primary/20 hover:bg-primary/[0.015] transition-all"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleShare(user)}
                      className="btn btn-primary btn-sm rounded-xl font-black gap-1.5"
                    >
                      <Send size={13} /> Share
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Search size={32} className="opacity-30 mb-2" />
                  <p className="text-sm font-semibold">No users found</p>
                </div>
              )}
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
