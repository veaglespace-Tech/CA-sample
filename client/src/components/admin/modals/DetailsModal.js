"use client";

import { useState } from "react";
import { 
  useGetRepositoryQuery, 
  useUpdateLeadStatusMutation, 
  useAddLeadNoteMutation 
} from "../../../store/api/adminApi";
import { useUpdateContactStatusMutation } from "../../../store/api/contactApi";
import { 
  User, Mail, Phone, 
  FileText, Clock, MapPin,
  Briefcase, TrendingUp, Info,
  MessageSquare, Calendar, Trash2
} from "lucide-react";

import { useDeleteMessageMutation, useSendEmailReminderMutation } from "../../../store/api/messageApi";
import { useSendEventInviteMutation } from "../../../store/api/eventApi";
import { useSelector } from "react-redux";
import { useAdminPermissions } from "../../../features/admin-permissions/useAdminPermissions";

import DocumentsTable from "./details/DocumentsTable";
import MessagingForm from "./details/MessagingForm";
import NotesSection from "./details/NotesSection";
import InquiryOverview from "./details/InquiryOverview";
import UserServicesList from "./details/UserServicesList";
import DynamicFormDetails from "./details/DynamicFormDetails";

export default function DetailsModal({ currentItem, onClose, onSwitchItem, onSendMessage, allUsers, allRegistrations = [], allLeads = [], setEmailingContact }) {
  const user = useSelector((state) => state.auth.user);
  const { can } = useAdminPermissions(user);

  const [messageText, setMessageText] = useState("");
  const [isDocRequest, setIsDocRequest] = useState(false);
  const [requestedDocName, setRequestedDocName] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [selectedRepoDocId, setSelectedRepoDocId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateLeadStatusMutation();
  const [updateContactStatus, { isLoading: isUpdatingContactStatus }] = useUpdateContactStatusMutation();
  const [addNote, { isLoading: isAddingNote }] = useAddLeadNoteMutation();
  const [noteText, setNoteText] = useState("");
  
  const [deleteMessage] = useDeleteMessageMutation();
  const [deletingMsgId, setDeletingMsgId] = useState(null);

  const [sendEmailReminder, { isLoading: isEmailReminderSending }] = useSendEmailReminderMutation();
  const [sendingEmailId, setSendingEmailId] = useState(null);

  const { data: repoResponse } = useGetRepositoryQuery();
  const repoDocs = repoResponse?.data || [];

  const [sendEventInvite] = useSendEventInviteMutation();
  const [invitingId, setInvitingId] = useState(null);
  const [selectedRegForMsg, setSelectedRegForMsg] = useState(null);

  if (!currentItem) return null;

  const isRegistrationItem = currentItem.isReg === true || Boolean(currentItem.registrationType);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus({ id: currentItem.id, status: newStatus }).unwrap();
    } catch (err) {
      alert("Failed to update status: " + (err.data?.error || err.message));
    }
  };

  const handleContactStatusChange = async (newStatus) => {
    try {
      await updateContactStatus({ id: currentItem.id, status: newStatus }).unwrap();
      onSwitchItem && onSwitchItem({ ...currentItem, status: newStatus });
    } catch (err) {
      alert("Failed to update contact status: " + (err.data?.error || err.message));
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await addNote({ id: currentItem.id, note: noteText }).unwrap();
      setNoteText("");
    } catch (err) {
      alert("Failed to add note: " + (err.data?.error || err.message));
    }
  };

  const handleSendEmailReminder = async (reqId, requestedDocName) => {
    let finalUserId = currentItem.userId || currentItem.user?.id;
    if (!finalUserId) {
      alert("Cannot send email: No registered user linked to this inquiry.");
      return;
    }

    setSendingEmailId(reqId);
    try {
      await sendEmailReminder({
        userId: finalUserId,
        documentName: requestedDocName,
        serviceName: currentItem.serviceName || "Service"
      }).unwrap();
      // the alert can be shown or skipped, usually silent is better or a toast
      alert("Email sent successfully!");
    } catch (err) {
      alert("Failed to send email: " + (err.data?.message || err.message));
    } finally {
      setSendingEmailId(null);
    }
  };

  const handleDeletePendingRequest = async (msgId, docName) => {
    if (!window.confirm(`Are you sure you want to permanently delete the pending request for "${docName}"?`)) return;
    try {
      setDeletingMsgId(msgId);
      await deleteMessage(msgId).unwrap();
    } catch (err) {
      alert("Failed to delete request: " + (err.data?.message || err.message));
    } finally {
      setDeletingMsgId(null);
    }
  };

  const handleSendInvite = async (reg) => {
    setSelectedRegForMsg(reg);
  };

  const handleSendEventMessage = async () => {
    if (!selectedRegForMsg) return;
    setInvitingId(selectedRegForMsg.id);
    try {
      const formData = new FormData();
      if (messageText) formData.append("content", messageText);
      if (attachment) formData.append("attachment", attachment);
      if (selectedRepoDocId) formData.append("repositoryDocId", selectedRepoDocId);

      await sendEventInvite({ eventId: currentItem.id, registrationId: selectedRegForMsg.id, body: formData }).unwrap();
      alert("Invitation and materials sent successfully!");
      
      // Reset form
      setMessageText("");
      setAttachment(null);
      setSelectedRepoDocId("");
      setSelectedRegForMsg(null);
    } catch (err) {
      alert("Failed to send invitation: " + (err.data?.message || err.message));
    } finally {
      setInvitingId(null);
    }
  };

  const allUserDocs = [...(currentItem.documents || []), ...(currentItem.user?.documents || [])]
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    .filter(doc => doc.status !== "REJECTED");

  const commonDocTypes = ["PAN Card", "Aadhaar Card", "Photo"];
  const relevantDocs = allUserDocs.filter(doc => {
    // 1. Explicitly linked to this registration/lead
    if (doc.registrationId === currentItem.id || doc.leadId === currentItem.id) return true;
    // 2. Or is a common document type
    if (commonDocTypes.includes(doc.documentType)) return true;
    // Otherwise, ignore it for this service details view
    return false;
  });

  const userEmail = currentItem.email?.toLowerCase();
  const userPhone = currentItem.phone;
  const userId = currentItem.userId || currentItem.user?.id;

  const userRegistrations = (allRegistrations || []).filter(reg => {
    if (!can("registrations", "view")) return false;
    if (userId && reg.userId === userId) return true;
    if (userEmail && reg.email?.toLowerCase() === userEmail) return true;
    if (userPhone && reg.phone === userPhone) return true;
    return false;
  });

  const userLeads = (allLeads || []).filter(ld => {
    if (!can("leads", "view")) return false;
    if (userId && ld.userId === userId) return true;
    if (userEmail && ld.email?.toLowerCase() === userEmail) return true;
    if (userPhone && ld.phone === userPhone) return true;
    return false;
  });

  const getMiniStatusBadge = (status) => {
    const s = String(status || "NEW").toUpperCase();
    if (s === "CONVERTED" || s === "VERIFIED" || s === "APPROVED") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/40">
          Completed
        </span>
      );
    }
    if (s === "REJECTED" || s === "CLOSED") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/40">
          Closed
        </span>
      );
    }
    if (s === "IN_PROGRESS" || s === "QUALIFIED") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/10 text-gold border border-gold/30/40">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/40">
        New
      </span>
    );
  };

  const handleSend = async () => {
    if (isDocRequest && !requestedDocName.trim()) {
      alert("Please enter a document name to request.");
      return;
    }
    if (!messageText.trim() && !attachment && !selectedRepoDocId && !isDocRequest) {
      alert("Please provide a message, an attachment, or request a document.");
      return;
    }
    
    let finalUserId = currentItem.userId || currentItem.user?.id;

    // Try to match by email from allUsers list if not directly linked
    if (!finalUserId) {
      const emailToMatch = (currentItem.email || currentItem.customerEmail)?.toLowerCase();
      if (emailToMatch && allUsers?.length) {
        const matchedUser = allUsers.find(u => u.email?.toLowerCase() === emailToMatch);
        if (matchedUser) finalUserId = matchedUser.id;
      }
    }

    console.log("[DetailsModal handleSend]", {
      itemId: currentItem.id,
      userId: currentItem.userId,
      userObj: currentItem.user?.id,
      email: currentItem.email,
      registrationType: currentItem.registrationType,
      serviceName: currentItem.serviceName,
      finalUserId,
      onSendMessageIsFunction: typeof onSendMessage === "function",
    });

    if (!finalUserId) {
      alert("Cannot send message: This record is not linked to a registered user account. Please ensure the client has registered on Veagle Space Technology Pvt. Ltd. with the same email address.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("receiverId", finalUserId);
      // Only attach the relevant ID — never send both
      if (isRegistrationItem) {
        formData.append("registrationId", currentItem.id);
      } else {
        formData.append("leadId", currentItem.id);
      }
      formData.append("content", messageText || "");
      formData.append("isDocRequest", String(isDocRequest));
      if (requestedDocName) formData.append("requestedDocName", requestedDocName);
      if (attachment) formData.append("attachment", attachment);
      if (selectedRepoDocId) formData.append("repositoryDocId", selectedRepoDocId);

      if (typeof onSendMessage !== "function") {
        alert("System Error: onSendMessage is not connected. Please hard-refresh the page (Ctrl+F5).");
        return;
      }

      const success = await onSendMessage(formData);
      if (success) {
        setMessageText("");
        setIsDocRequest(false);
        setRequestedDocName("");
        setAttachment(null);
        setSelectedRepoDocId("");
      }
    } catch (err) {
      console.error("handleSend Error:", err);
      alert("An unexpected error occurred while sending: " + (err.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  // Safe parsing of custom metadata if it exists
  let parsedMetadata = null;
  if (currentItem.metadata) {
    try {
      parsedMetadata = typeof currentItem.metadata === "string" 
        ? JSON.parse(currentItem.metadata) 
        : currentItem.metadata;
    } catch (e) {
      // ignore parsing error
    }
  }

  const statuses = ["NEW", "IN_PROGRESS", "QUALIFIED", "CONVERTED", "CLOSED", "REJECTED"];

  const pendingRequests = (currentItem.messages || []).filter(reqMsg => {
    const isReq = reqMsg.isDocRequest === true || reqMsg.isDocRequest === 1 || reqMsg.isDocRequest === "true" || reqMsg.isDocRequest === "1";
    if (!isReq || !reqMsg.requestedDocName) return false;
    const isSubmitted = allUserDocs.some(doc => 
      doc.documentType?.toLowerCase() === reqMsg.requestedDocName?.toLowerCase()
    );
    return !isSubmitted;
  });

  const handleSendReminder = async (requestedDocName) => {
    let finalUserId = currentItem.userId || currentItem.user?.id;
    if (!finalUserId) {
      alert("Cannot send reminder: No registered user linked to this inquiry.");
      return;
    }

    const formData = new FormData();
    formData.append("receiverId", finalUserId);
    
    if (isRegistrationItem) {
      formData.append("registrationId", currentItem.id);
    } else if (currentItem.serviceName) {
      formData.append("leadId", currentItem.id);
    }
    
    formData.append("content", `⏳ REMINDER: Please upload your pending document: ${requestedDocName}. It is required to proceed with your service.`);
    formData.append("isDocRequest", "false");
    
    try {
      await onSendMessage(formData);
      // alert("Reminder sent successfully."); // Handled by AdminDataView
    } catch (err) {
      console.error("Failed to send reminder:", err);
    }
  };

  // --- Event View ---
  if (currentItem.isEvent) {
    const regs = currentItem.registrations || [];
    return (
      <dialog className="modal modal-open">
        <div className="modal-box w-11/12 max-w-4xl rounded-[2rem] p-0 overflow-hidden bg-navy-light shadow-2xl border border-slate-800 flex flex-col h-[85vh] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          {/* Header */}
          <div className="bg-gold px-6 py-5 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gold/50 rounded-sm text-indigo-100">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">{currentItem.title}</h3>
                <p className="text-[11px] text-indigo-200 font-semibold uppercase tracking-wider mt-0.5">Event Registrations • {regs.length} Total</p>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-circle btn-sm border-none bg-indigo-800/40 hover:bg-indigo-800 text-indigo-100 font-bold transition-all">✕</button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 bg-navy-light">
            {selectedRegForMsg ? (
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedRegForMsg(null)} 
                  className="btn btn-sm btn-ghost gap-2 text-slate-400 hover:text-white"
                >
                  ← Back to Registrations
                </button>
                <div className="bg-gold/10 border border-gold/20 rounded-none p-5">
                  <h4 className="font-black text-indigo-900 text-lg">Send Event Materials & Message</h4>
                  <p className="text-sm font-semibold text-gold/70 mt-1">
                    To: {selectedRegForMsg.name} ({selectedRegForMsg.email})
                  </p>
                </div>
                
                <MessagingForm 
                  messageText={messageText} setMessageText={setMessageText}
                  isDocRequest={isDocRequest} setIsDocRequest={setIsDocRequest}
                  requestedDocName={requestedDocName} setRequestedDocName={setRequestedDocName}
                  attachment={attachment} setAttachment={setAttachment}
                  selectedRepoDocId={selectedRepoDocId} setSelectedRepoDocId={setSelectedRepoDocId}
                  repoDocs={repoDocs} handleSend={handleSendEventMessage} isUploading={invitingId === selectedRegForMsg.id}
                  simpleMode={true}
                />
              </div>
            ) : regs.length === 0 ? (
              <div className="text-center py-8 md:py-20 text-slate-400 italic">No registrations found for this event.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm w-full bg-navy rounded-sm shadow-sm border border-slate-700">
                  <thead className="bg-navy-light text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="rounded-tl-xl py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Date Registered</th>
                      <th className="rounded-tr-xl py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regs.map(r => (
                      <tr key={r.id} className="hover:bg-navy-light/50 border-b border-slate-800 last:border-0 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">{r.name}</td>
                        <td className="py-3 px-4 text-slate-300">{r.email}</td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-xs">{r.phone}</td>
                        <td className="py-3 px-4 text-slate-300">{r.city || "—"}</td>
                        <td className="py-3 px-4 text-slate-400 text-xs">
                          {new Date(r.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleSendInvite(r)}
                            className="btn btn-xs bg-gold/10 text-gold hover:bg-indigo-100 border-none px-3 font-bold"
                          >
                            <Mail size={12} className="mr-1" /> Invite / Send Docs
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-slate-900/40 backdrop-blur-sm transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" onClick={onClose}><button>close</button></form>
      </dialog>
    );
  }

  // --- Contact Query: simple clean view ---
  const isContactQuery = !!currentItem.message && !currentItem.serviceName && !currentItem.registrationType;

  if (isContactQuery) {
    return (
      <dialog className="modal modal-open">
        <div className="modal-box w-11/12 max-w-xl rounded-[2rem] p-0 overflow-hidden bg-navy shadow-2xl border border-slate-800 flex flex-col animate-in zoom-in-95 duration-200 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          
          {/* Header */}
          <div className="bg-slate-900 px-6 py-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-500/20 rounded-sm text-violet-300">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">{currentItem.name}</h3>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Contact Query</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn btn-circle btn-sm border-none bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-5">

            {/* Sender Info */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-navy-light rounded-sm px-4 py-3 border border-slate-800 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <Mail size={15} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email</p>
                  <p className="text-sm font-bold text-white truncate">{currentItem.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-navy-light rounded-sm px-4 py-3 border border-slate-800 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <Phone size={15} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone</p>
                  <p className="text-sm font-bold text-white">{currentItem.phone || "—"}</p>
                </div>
              </div>
              {currentItem.subject && (
                <div className="flex items-center gap-3 bg-navy-light rounded-sm px-4 py-3 border border-slate-800 sm:col-span-2 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                  <Info size={15} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Subject</p>
                    <p className="text-sm font-bold text-white">{currentItem.subject}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 bg-navy-light rounded-sm px-4 py-3 border border-slate-800 sm:col-span-2 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <Calendar size={15} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Received On</p>
                  <p className="text-sm font-bold text-white">
                    {new Date(currentItem.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Message</p>
              <div className="bg-navy-light border border-slate-800 rounded-none px-5 py-4 text-sm text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">
                {currentItem.message}
              </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                 <select 
                   value={currentItem.status || "NEW"} 
                   onChange={(e) => handleContactStatusChange(e.target.value)}
                   disabled={isUpdatingContactStatus}
                   className="select select-bordered select-sm rounded-sm text-xs font-bold"
                 >
                   <option value="NEW">New</option>
                   <option value="IN_PROGRESS">In Progress</option>
                   <option value="CONVERTED">Converted</option>
                   <option value="CLOSED">Closed</option>
                   <option value="REJECTED">Rejected</option>
                 </select>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                {currentItem.email && (
                  <button
                    onClick={() => setEmailingContact && setEmailingContact(currentItem)}
                    className="btn btn-primary btn-sm rounded-sm flex-1 sm:flex-none font-black gap-2"
                  >
                    <Mail size={14} /> Reply via Email
                  </button>
                )}
                {currentItem.phone && (
                  <a
                    href={`tel:${currentItem.phone}`}
                    className="btn btn-outline btn-sm rounded-sm flex-1 sm:flex-none font-black gap-2 border-slate-700 text-slate-200 hover:bg-navy-light hover:border-slate-300"
                  >
                    <Phone size={14} /> Call
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    );
  }

  // --- Full modal for leads & registrations ---
  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-7xl rounded-[2.5rem] p-0 overflow-hidden bg-navy-light shadow-2xl border border-base-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
        
        {/* Header with deep premium slate styling */}
        <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center shrink-0 z-10 sticky top-0 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold/10 rounded-none border border-primary/20 text-gold">
              <User size={26} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">{currentItem.name || currentItem.fullName}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {currentItem.service?.name || currentItem.serviceName || currentItem.registrationType?.replace(/_/g, " ") || "Service Inquiry"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-circle btn-sm border-none bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-navy-light/50">
          {currentItem.isUserOnly ? (
            <div className="p-8 space-y-8 bg-navy min-h-full">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-black">All Shared Documents</h4>
                  <p className="text-sm opacity-50">View all files exchanged with this user</p>
                </div>
                <div className="badge badge-primary badge-lg p-4 font-bold">{allUserDocs.length} Files</div>
              </div>

              {pendingRequests.length > 0 && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-none p-5 space-y-3">
                  <h5 className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Pending Client Uploads
                  </h5>
                  <div className="flex flex-col gap-2">
                    {pendingRequests.map(req => (
                      <div key={req.id} className="bg-navy border border-amber-100 p-3.5 rounded-sm flex items-center justify-between shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                        <span className="font-bold text-slate-200 text-sm">{req.requestedDocName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md uppercase tracking-wider">Awaiting</span>
                          <button 
                            onClick={() => handleDeletePendingRequest(req.id, req.requestedDocName)}
                            disabled={deletingMsgId === req.id}
                            className="btn btn-xs btn-ghost text-red-500 hover:bg-red-50 p-1"
                            title="Delete Request"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DocumentsTable documents={allUserDocs} currentItem={currentItem} />
              <MessagingForm 
                messageText={messageText} setMessageText={setMessageText}
                isDocRequest={isDocRequest} setIsDocRequest={setIsDocRequest}
                requestedDocName={requestedDocName} setRequestedDocName={setRequestedDocName}
                attachment={attachment} setAttachment={setAttachment}
                selectedRepoDocId={selectedRepoDocId} setSelectedRepoDocId={setSelectedRepoDocId}
                repoDocs={repoDocs} handleSend={handleSend} isUploading={isUploading}
              />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row min-h-full">
              {/* Left Column: Details & Dynamic Form Fields */}
              <div className="flex-1 p-6 md:p-8 lg:border-r border-slate-700/60 space-y-8 bg-navy/40 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                
                {/* 1. Inquiry Overview Card */}
                <InquiryOverview 
                  currentItem={currentItem} 
                  handleStatusChange={handleStatusChange} 
                  isUpdatingStatus={isUpdatingStatus} 
                  statuses={statuses} 
                />

                {/* User's Registered Services & Inquiries Card */}
                <UserServicesList 
                  currentItem={currentItem} 
                  userRegistrations={userRegistrations} 
                  userLeads={userLeads} 
                  getMiniStatusBadge={getMiniStatusBadge} 
                  onSwitchItem={onSwitchItem}
                />

                {/* 2. Dynamic Service Form Submitted Data Card */}
                <DynamicFormDetails 
                  currentItem={currentItem} 
                  parsedMetadata={parsedMetadata} 
                />

                {/* 3. Internal remarks trail */}
                <NotesSection 
                  notes={currentItem.notes} noteText={noteText} setNoteText={setNoteText}
                  handleAddNote={handleAddNote} isAddingNote={isAddingNote}
                />
              </div>

              {/* Right Column: Case Documents & Messaging */}
              <div className="flex-1 p-6 md:p-8 space-y-8 bg-navy">
                <div>
                  <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-white border-b border-slate-800 pb-4">
                    <span className="p-1.5 bg-gold/10 rounded-sm text-gold">
                      <FileText size={18} />
                    </span>
                    Case Documents
                  </h4>

                  {pendingRequests.length > 0 && (
                    <div className="mb-6 bg-amber-50/50 border border-amber-200 rounded-none p-5 space-y-3">
                      <h5 className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Pending Client Uploads ({pendingRequests.length})
                      </h5>
                      <div className="flex flex-col gap-2">
                        {pendingRequests.map((req, idx) => (
                          <div key={req.id || idx} className="bg-navy border border-amber-100 p-3.5 rounded-sm flex items-center justify-between shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                            <span className="font-bold text-slate-200 text-sm">{req.requestedDocName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md uppercase tracking-wider">Awaiting</span>
                              <button 
                                onClick={() => handleSendReminder(req.requestedDocName)}
                                className="btn btn-xs bg-amber-600 hover:bg-amber-700 text-white border-none rounded-md px-3 text-[10px] uppercase tracking-wider"
                              >
                                Dashboard Msg
                              </button>
                              <button 
                                onClick={() => handleSendEmailReminder(req.id, req.requestedDocName)}
                                disabled={sendingEmailId === req.id}
                                className="btn btn-xs bg-gold hover:bg-gold text-white border-none rounded-md px-3 text-[10px] uppercase tracking-wider disabled:opacity-50"
                              >
                                {sendingEmailId === req.id ? "Sending..." : "Email"}
                              </button>
                              <button 
                                onClick={() => handleDeletePendingRequest(req.id, req.requestedDocName)}
                                disabled={deletingMsgId === req.id}
                                className="btn btn-xs btn-ghost text-red-500 hover:bg-red-50 p-1"
                                title="Delete Request"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <DocumentsTable documents={relevantDocs} currentItem={currentItem} />
                </div>

                <MessagingForm 
                  messageText={messageText} setMessageText={setMessageText}
                  isDocRequest={isDocRequest} setIsDocRequest={setIsDocRequest}
                  requestedDocName={requestedDocName} setRequestedDocName={setRequestedDocName}
                  attachment={attachment} setAttachment={setAttachment}
                  selectedRepoDocId={selectedRepoDocId} setSelectedRepoDocId={setSelectedRepoDocId}
                  repoDocs={repoDocs} handleSend={handleSend} isUploading={isUploading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
