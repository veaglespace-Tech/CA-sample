"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { 
  useGetAllDataQuery, useSearchUsersQuery, useSearchLeadsQuery,
  useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation,
  useGetArticlesQuery, useCreateArticleMutation, useUpdateArticleMutation, useDeleteArticleMutation,
  useGetNewsletterSubscribersQuery,
  useDeleteLeadMutation, useDeleteRegistrationMutation
} from "../../store/api/adminApi";
import { useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from "../../store/api/eventApi";
import { useSendMessageMutation } from "../../store/api/messageApi";
import { useCreatePlanMutation, useUpdatePlanMutation, useAssignPlanToUserMutation, useDeletePlanMutation } from "../../store/api/planApi";
import { useGetMeQuery } from "../../store/api/authApi";
import { useAdminPermissions } from "../../features/admin-permissions/useAdminPermissions";
import PermissionDeniedModal from "../../features/admin-permissions/PermissionDeniedModal";

// Sub-components
import AdminModalsContainer from "./AdminModalsContainer";

// Views
import UsersView from "./views/UsersView";
import LeadsView from "./views/LeadsView";
import RegistrationsView from "./views/RegistrationsView";
import EventsView from "./views/EventsView";
import PlansView from "./views/PlansView";
import ArticlesView from "./views/ArticlesView";
import RepositoryView from "./views/RepositoryView";
import AdminTable from "./views/AdminTable";
import NewsletterView from "./views/NewsletterView";
import ReferralsView from "./views/ReferralsView";
import ContactsView from "./views/ContactsView";
import PaymentsView from "./views/PaymentsView";
import { useGetAllContactsQuery, useDeleteContactMutation, useReplyToContactMutation } from "../../store/api/contactApi";
import { apiFetch, readApiError } from "../../lib/api/client";

export default function AdminDataView({ activeSection }) {
  // ── Auth & Permissions ────────────────────────────────────────────────
  const token = useSelector((state) => state.auth?.token);
  const { data: meData } = useGetMeQuery(undefined, { skip: !token });
  const user = meData?.user || null;
  const { can } = useAdminPermissions(user);

  // Permission denied modal state
  const [deniedModal, setDeniedModal] = useState({ open: false, action: "" });
  function deny(action) {
    setDeniedModal({ open: true, action });
  }

  // ── 1. Queries & Data ─────────────────────────────────────────────────
  const { data: response, isLoading, isError } = useGetAllDataQuery();
  const data = response?.data || {};

  const { data: articlesResponse } = useGetArticlesQuery(undefined, { skip: activeSection !== "articles" });
  const { data: newsletterResponse } = useGetNewsletterSubscribersQuery(undefined, { skip: activeSection !== "newsletter" });
  const newsletterSubscribers = newsletterResponse?.data || [];
  
  const { data: contactsResponse } = useGetAllContactsQuery(undefined, { skip: activeSection !== "contacts" });
  const [deleteContact] = useDeleteContactMutation();
  
  // ── 2. Search States ──────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults, isFetching: isSearchingUsers } = useSearchUsersQuery(searchTerm, { skip: !searchTerm || activeSection !== "users" });
  
  const [leadSearchTerm, setLeadSearchTerm] = useState("");
  const { data: leadSearchResults, isFetching: isSearchingLeads } = useSearchLeadsQuery(leadSearchTerm, { skip: !leadSearchTerm || activeSection !== "leads" });
  
  const [regSearchTerm, setRegSearchTerm] = useState("");
  const { data: regSearchResults, isFetching: isSearchingRegs } = useSearchLeadsQuery(regSearchTerm, { skip: !regSearchTerm || activeSection !== "registrations" });

  // ── 3. Filters ────────────────────────────────────────────────────────
  const [regStatusFilter, setRegStatusFilter] = useState("ALL");
  const [leadStatusFilter, setLeadStatusFilter] = useState("ALL");
  const [leadServiceFilter, setLeadServiceFilter] = useState("ALL");
  const [leadSubServiceFilter, setLeadSubServiceFilter] = useState("ALL");
  const [leadOnlyUserFilter, setLeadOnlyUserFilter] = useState(false);
  const [regServiceFilter, setRegServiceFilter] = useState("ALL");
  const [regSubServiceFilter, setRegSubServiceFilter] = useState("ALL");
  const [regOnlyUserFilter, setRegOnlyUserFilter] = useState(false);

  // ── 4. Modal State ────────────────────────────────────────────────────
  const [activeItem, setActiveItem] = useState(null);
  const [messagingUser, setMessagingUser] = useState(null);
  const [emailingContact, setEmailingContact] = useState(null);
  const [emailingSubscriber, setEmailingSubscriber] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formMessage, setFormMessage] = useState("");

  // ── 5. Mutations ──────────────────────────────────────────────────────
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [sendMessage] = useSendMessageMutation();
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [assignPlanToUser] = useAssignPlanToUserMutation();
  const [deletePlan] = useDeletePlanMutation();
  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [deleteArticle] = useDeleteArticleMutation();
  const [deleteLead] = useDeleteLeadMutation();
  const [deleteRegistration] = useDeleteRegistrationMutation();
  const [replyToContact] = useReplyToContactMutation();

  // ── 6. Permission-gated handlers ──────────────────────────────────────

  const handleUserSubmit = async (formData) => {
    const isEdit = !!editingUser;
    if (!can("users", isEdit ? "edit" : "create")) {
      return deny(isEdit ? "edit user accounts" : "create user accounts");
    }
    try {
      if (isEdit) await updateUser({ id: editingUser.id, ...formData }).unwrap();
      else await createUser(formData).unwrap();
      setShowUserForm(false);
      setEditingUser(null);
    } catch (err) { setFormMessage(err.data?.message || "Operation failed"); }
  };

  const handleEventSubmit = async (formData) => {
    const isEdit = !!editingEvent;
    if (!can("events", isEdit ? "edit" : "create")) {
      return deny(isEdit ? "edit events" : "create events");
    }
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === "image" && formData[key] instanceof File) fd.append("image", formData[key]);
        else if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") fd.append(key, formData[key]);
      });
      if (isEdit) await updateEvent({ id: editingEvent.id, body: fd }).unwrap();
      else await createEvent(fd).unwrap();
      setShowEventForm(false);
      setEditingEvent(null);
    } catch (err) { setFormMessage(err.data?.message || "Operation failed"); }
  };

  const handlePlanSubmit = async (formData) => {
    const isEdit = !!editingPlan;
    if (!can("plans", isEdit ? "edit" : "create")) {
      return deny(isEdit ? "edit service plans" : "create service plans");
    }
    try {
      const payload = { ...formData, price: String(formData.price), oldPrice: formData.oldPrice ? String(formData.oldPrice) : null, features: formData.features.split("\n").filter(f => f.trim()), sortOrder: Number(formData.sortOrder || 0) };
      if (isEdit) await updatePlan({ id: editingPlan.id, ...payload }).unwrap();
      else await createPlan(payload).unwrap();
      setShowPlanForm(false);
      setEditingPlan(null);
    } catch (err) { alert(err.data?.message || "Failed to save plan."); }
  };

  const handleAssignPlanToUser = async ({ planId, userId, note }) => {
    if (!can("plans", "assign")) {
      deny("assign service plans to clients");
      return false;
    }

    try {
      await assignPlanToUser({ id: planId, userId, note }).unwrap();
      alert("Plan assigned successfully. The client can now complete payment from their dashboard.");
      return true;
    } catch (err) {
      const message = err?.data?.error || err?.data?.message || "Failed to assign plan.";
      alert(message);
      return false;
    }
  };

  const handleArticleSubmit = async (formData) => {
    const isEdit = !!editingArticle;
    if (!can("articles", isEdit ? "edit" : "create")) {
      return deny(isEdit ? "edit articles" : "write new articles");
    }
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === "image" && formData[key] instanceof File) fd.append("image", formData[key]);
        else if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") fd.append(key, formData[key]);
      });
      if (isEdit) await updateArticle({ id: editingArticle.id, body: fd }).unwrap();
      else await createArticle(fd).unwrap();
      setShowArticleForm(false);
      setEditingArticle(null);
    } catch (err) { alert(err.data?.message || "Failed to save article"); }
  };

  const handleSendMessage = async (payload) => {
    // Determine the module from context (leads or registrations)
    const moduleKey = activeSection === "registrations" ? "registrations" : "leads";
    if (!can(moduleKey, "sendMessage") && !can("users", "sendMessage") && !can("contacts", "sendMessage") && !can("payments", "sendMessage")) {
      deny("send messages to clients");
      return false;
    }
    try {
      // Use raw fetch for FormData so the browser correctly sets Content-Type: multipart/form-data
      // RTK Query serializes body to JSON which breaks file/FormData uploads
      const response = await apiFetch("/api/messages/send", {
        method: "POST",
        token,
        // NO Content-Type header — browser sets it automatically with correct boundary for FormData
        body: payload, // FormData object
      });
      if (!response.ok) {
        alert("Failed to send message: " + await readApiError(response, "Unknown error"));
        return false;
      }
      alert("Message sent successfully!");
      return true;
    } catch (err) {
      console.error("handleSendMessage error:", err);
      alert("Failed to send message: " + (err.message || "Unknown error"));
      return false;
    }
  };

  const handleSendEmailToContact = async (id, payload) => {
    const isCustomPayment = payload?.isCustomPayment === true || payload?.isCustomPayment === "true";
    const allowed = isCustomPayment ? can("payments", "sendMessage") : can("contacts", "sendMessage");
    if (!allowed) {
      deny(isCustomPayment ? "email paid clients" : "send emails to contacts");
      return false;
    }
    try {
      await replyToContact({ id, body: payload }).unwrap();
      alert("Email sent successfully!");
      return true;
    } catch (err) {
      alert("Failed to send email: " + (err.data?.message || err.data?.error || "Unknown error"));
      return false;
    }
  };

  const handleDelete = async (type, id) => {
    // Map type to module + action
    const moduleMap = {
      user: "users", event: "events", plan: "plans", article: "articles",
      contact: "contacts", lead: "leads", registration: "registrations",
    };
    const moduleKey = moduleMap[type] || type;
    if (!can(moduleKey, "delete")) {
      return deny(`delete this ${type}`);
    }
    const confirmed = window.confirm(`Are you sure you want to delete this ${type}?`);
    if (!confirmed) return;
    
    try {
      if (type === "user") await deleteUser(id).unwrap();
      else if (type === "event") await deleteEvent(id).unwrap();
      else if (type === "plan") await deletePlan(id).unwrap();
      else if (type === "article") await deleteArticle(id).unwrap();
      else if (type === "contact") await deleteContact(id).unwrap();
      else if (type === "lead") await deleteLead(id).unwrap();
      else if (type === "registration") await deleteRegistration(id).unwrap();
      alert(`Successfully deleted ${type}.`);
    } catch (err) { 
      console.error(`Delete ${type} failed:`, err);
      alert(`Failed to delete ${type}: ${err?.data?.message || err?.message || JSON.stringify(err)}`); 
    }
  };

  // Permission-gated action openers
  function openAddUser() {
    if (!can("users", "create")) return deny("create user accounts");
    setEditingUser(null); setShowUserForm(true); setFormMessage("");
  }
  function openEditUser(u) {
    if (!can("users", "edit")) return deny("edit user accounts");
    setEditingUser(u); setShowUserForm(true); setFormMessage("");
  }
  function openMessageUser(u) {
    if (!can("users", "sendMessage") && !can("leads", "sendMessage") && !can("registrations", "sendMessage")) {
      return deny("send messages to clients");
    }
    setMessagingUser({ id: u.id, name: u.name });
  }
  function openAddEvent() {
    if (!can("events", "create")) return deny("create events");
    setEditingEvent(null); setShowEventForm(true); setFormMessage("");
  }
  function openEditEvent(e) {
    if (!can("events", "edit")) return deny("edit events");
    setEditingEvent(e); setShowEventForm(true); setFormMessage("");
  }
  function openAddPlan() {
    if (!can("plans", "create")) return deny("create service plans");
    setEditingPlan(null); setShowPlanForm(true);
  }
  function openEditPlan(p) {
    if (!can("plans", "edit")) return deny("edit service plans");
    setEditingPlan(p); setShowPlanForm(true);
  }
  function openAddArticle() {
    if (!can("articles", "create")) return deny("write new articles");
    setEditingArticle(null); setShowArticleForm(true);
  }
  function openEditArticle(a) {
    if (!can("articles", "edit")) return deny("edit articles");
    setEditingArticle(a); setShowArticleForm(true);
  }

  function handleSetActiveItem(item) {
    if (item === null) return setActiveItem(null);
    
    // Determine module type
    let moduleName = "leads";
    if (item.isReg || item.registrationType) moduleName = "registrations";
    else if (item.isEvent) moduleName = "events";
    else if (item.message && !item.serviceName && !item.registrationType) moduleName = "contacts";
    else if (item.isUserOnly) moduleName = "users";

    if (!can(moduleName, "view")) {
      return deny(`view ${moduleName} details`);
    }
    setActiveItem(item);
  }

  // ── Loading / Error states ────────────────────────────────────────────
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <span className="text-sm font-bold uppercase tracking-widest">Synchronizing Data...</span>
    </div>
  );

  if (isError) return (
    <div className="alert alert-error rounded-2xl shadow-lg mx-6">
      <X size={20} />
      <span>Failed to load platform data. Please check your connection.</span>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Permission Denied Modal ── */}
      <PermissionDeniedModal
        open={deniedModal.open}
        action={deniedModal.action}
        onClose={() => setDeniedModal({ open: false, action: "" })}
      />

      {/* ── View Components ── */}
      {activeSection === "users" && can("users", "view") && (
        <UsersView 
          searchTerm={searchTerm} searchResults={searchResults?.data} users={data.users} isSearching={isSearchingUsers} onSearchChange={setSearchTerm}
          onAdd={can("users", "create") ? openAddUser : undefined}
          onEdit={can("users", "edit") ? openEditUser : undefined}
          onDelete={can("users", "delete") ? (id) => handleDelete("user", id) : undefined}
          onMessage={can("users", "sendMessage") ? openMessageUser : undefined}
          onViewDocs={(u) => handleSetActiveItem({ ...u, isUserOnly: true })}
        />
      )}

      {activeSection === "leads" && can("leads", "view") && (
        <LeadsView 
          searchTerm={leadSearchTerm} searchResults={leadSearchResults?.data?.leads?.filter(l => l.formType !== "CALLBACK")} leads={(data.leads || []).filter(l => l.formType !== "CALLBACK")} isSearching={isSearchingLeads} onSearchChange={setLeadSearchTerm} 
          onViewDetails={(item) => handleSetActiveItem(item)}
          statusFilter={leadStatusFilter} onStatusFilterChange={setLeadStatusFilter}
          serviceFilter={leadServiceFilter} onServiceFilterChange={setLeadServiceFilter} subServiceFilter={leadSubServiceFilter} onSubServiceFilterChange={setLeadSubServiceFilter} onlyUserFilter={leadOnlyUserFilter} onOnlyUserFilterChange={setLeadOnlyUserFilter} allServices={data.services}
          onDelete={can("leads", "delete") ? (id) => handleDelete("lead", id) : undefined}
          title="Service Leads"
        />
      )}

      {activeSection === "callbacks" && can("leads", "view") && (
        <LeadsView 
          searchTerm={leadSearchTerm} searchResults={leadSearchResults?.data?.leads?.filter(l => l.formType === "CALLBACK")} leads={(data.leads || []).filter(l => l.formType === "CALLBACK")} isSearching={isSearchingLeads} onSearchChange={setLeadSearchTerm} 
          onViewDetails={(item) => handleSetActiveItem(item)}
          statusFilter={leadStatusFilter} onStatusFilterChange={setLeadStatusFilter}
          serviceFilter={leadServiceFilter} onServiceFilterChange={setLeadServiceFilter} subServiceFilter={leadSubServiceFilter} onSubServiceFilterChange={setLeadSubServiceFilter} onlyUserFilter={leadOnlyUserFilter} onOnlyUserFilterChange={setLeadOnlyUserFilter} allServices={data.services}
          onDelete={can("leads", "delete") ? (id) => handleDelete("lead", id) : undefined}
          title="Callback Requests"
          columns={["Name", "Phone", "Service", "Message", "Date"]}
        />
      )}

      {activeSection === "registrations" && can("registrations", "view") && (
        <RegistrationsView 
          searchTerm={regSearchTerm} searchResults={regSearchResults?.data?.registrations} registrations={data.registrations} isSearching={isSearchingRegs} onSearchChange={setRegSearchTerm} 
          onViewDetails={(item) => handleSetActiveItem({ ...item, isReg: true })}
          statusFilter={regStatusFilter} onStatusFilterChange={setRegStatusFilter} serviceFilter={regServiceFilter} onServiceFilterChange={setRegServiceFilter} subServiceFilter={regSubServiceFilter} onSubServiceFilterChange={setRegSubServiceFilter} onlyUserFilter={regOnlyUserFilter} onOnlyUserFilterChange={setRegOnlyUserFilter} allServices={data.services}
          onDelete={can("registrations", "delete") ? (id) => handleDelete("registration", id) : undefined}
        />
      )}

      {activeSection === "events" && can("events", "view") && (
        <EventsView events={data.events}
          onAdd={can("events", "create") ? openAddEvent : undefined}
          onEdit={can("events", "edit") ? openEditEvent : undefined}
          onDelete={can("events", "delete") ? (id) => handleDelete("event", id) : undefined}
          onViewDetails={(item) => handleSetActiveItem({ ...item, isEvent: true })}
        />
      )}

      {activeSection === "plans" && can("plans", "view") && (
        <PlansView serviceCategories={data.serviceCategories || []}
          users={(data.users || []).filter((u) => u.role === "USER")}
          onAdd={can("plans", "create") ? openAddPlan : undefined}
          onEdit={can("plans", "edit") ? openEditPlan : undefined}
          onAssignPlan={can("plans", "assign") ? handleAssignPlanToUser : undefined}
          onDelete={can("plans", "delete") ? (id) => handleDelete("plan", id) : undefined}
        />
      )}

      {activeSection === "articles" && can("articles", "view") && (
        <ArticlesView articles={articlesResponse?.data || []}
          onAdd={can("articles", "create") ? openAddArticle : undefined}
          onEdit={can("articles", "edit") ? openEditArticle : undefined}
          onDelete={can("articles", "delete") ? (id) => handleDelete("article", id) : undefined}
          onViewVideo={(url) => window.open(url, "_blank")}
        />
      )}
      
      {activeSection === "referrals" && can("referrals", "view") && (
        <ReferralsView referrals={data.referrals || []} referrers={data.referrers || []} rewardSettings={data.referralRewardSettings || []} />
      )}

      {activeSection === "repository" && can("repository", "view") && (
        <RepositoryView 
          allUsers={data.users || []} 
          onSendMessage={handleSendMessage}
          permissions={{
            canUpload: can("repository", "upload"),
            canUpdate: can("repository", "edit"),
            canShare: can("repository", "share"),
            canDelete: can("repository", "delete")
          }}
        />
      )}

      {activeSection === "newsletter" && can("newsletter", "view") && (
        <NewsletterView subscribers={newsletterSubscribers} onEmail={can("newsletter", "sendEmail") ? (subscriber) => {
          setEmailingSubscriber(subscriber);
        } : undefined} />
      )}

      {activeSection === "contacts" && can("contacts", "view") && (
        <ContactsView 
          contacts={contactsResponse?.data || []}
          onDelete={can("contacts", "delete") ? (id) => handleDelete("contact", id) : undefined}
          onMessage={can("contacts", "sendMessage") ? (c) => {
            const matchedUser = (data.users || []).find(
              u => (c.email && u.email?.toLowerCase() === c.email.toLowerCase()) || 
                   (c.phone && u.phone === c.phone)
            );
            if (matchedUser) {
              setMessagingUser({ id: matchedUser.id, name: matchedUser.name, contactQueryId: c.id });
            } else {
              alert(`"${c.name}" does not have a registered account. Please use the "Send Email" button instead.`);
            }
          } : undefined}
          onEmail={can("contacts", "sendMessage") ? (c) => {
            if (c.email) setEmailingContact(c);
            else alert("This inquiry does not have an email address provided.");
          } : undefined}
          onViewDetails={(item) => handleSetActiveItem(item)}
        />
      )}

      {activeSection === "payments" && can("payments", "view") && (
        <PaymentsView 
          payments={data.paymentRecords || []}
          onEmail={can("payments", "sendMessage") ? (p) => {
            setEmailingContact({
              id: p.id,
              name: p.user?.name || p.customerName || "Customer",
              email: p.user?.email || p.customerEmail,
              message: `Your Custom Plan request for ${p.serviceName}.${p.customRequirements ? `\n\nYour Requirements:\n"${p.customRequirements}"` : ''}`,
              isCustomPayment: true
            });
          } : undefined}
          onMessage={(can("leads", "sendMessage") || can("registrations", "sendMessage")) ? (p) => {
            if (p.userId || p.user) {
              setMessagingUser({ id: p.userId || p.user?.id, name: p.user?.name || p.customerName });
            } else {
              alert("This payment record is not linked to a registered user account yet. Please use 'Negotiate via Email' instead.");
            }
          } : undefined}
        />
      )}

      {/* Modals Container */}
      <AdminModalsContainer 
        showUserForm={showUserForm} setShowUserForm={setShowUserForm} editingUser={editingUser} setEditingUser={setEditingUser}
        showEventForm={showEventForm} setShowEventForm={setShowEventForm} editingEvent={editingEvent} setEditingEvent={setEditingEvent}
        showPlanForm={showPlanForm} setShowPlanForm={setShowPlanForm} editingPlan={editingPlan} setEditingPlan={setEditingPlan}
        showArticleForm={showArticleForm} setShowArticleForm={setShowArticleForm} editingArticle={editingArticle} setEditingArticle={setEditingArticle}
        messagingUser={messagingUser} setMessagingUser={setMessagingUser}
        emailingContact={emailingContact} setEmailingContact={setEmailingContact}
        emailingSubscriber={emailingSubscriber} setEmailingSubscriber={setEmailingSubscriber}
        activeItem={activeItem} setActiveItem={handleSetActiveItem}
        formMessage={formMessage} data={data} allContacts={contactsResponse?.data || []}
        handleUserSubmit={handleUserSubmit} handleEventSubmit={handleEventSubmit} handlePlanSubmit={handlePlanSubmit} handleArticleSubmit={handleArticleSubmit} handleSendMessage={handleSendMessage} handleSendEmailToContact={handleSendEmailToContact}
        currentUserRole={user?.role}
        canManageAccess={can("users", "manageAccess")}
        canAccessRepository={can("repository", "view")}
        canManageDocuments={can("repository", "create")}
      />
    </div>
  );
}
