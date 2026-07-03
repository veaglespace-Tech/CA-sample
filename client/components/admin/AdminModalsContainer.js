"use client";

import DetailsModal from "./modals/DetailsModal";
import UserFormModal from "./modals/UserFormModal";
import EventFormModal from "./modals/EventFormModal";
import PlanFormModal from "./modals/PlanFormModal";
import ArticleFormModal from "./modals/ArticleFormModal";
import MessageModal from "./modals/MessageModal";
import ContactEmailModal from "./modals/ContactEmailModal";
import NewsletterEmailModal from "./modals/NewsletterEmailModal";

export default function AdminModalsContainer({
  // State
  showUserForm, setShowUserForm, editingUser, setEditingUser,
  showEventForm, setShowEventForm, editingEvent, setEditingEvent,
  showPlanForm, setShowPlanForm, editingPlan, setEditingPlan,
  showArticleForm, setShowArticleForm, editingArticle, setEditingArticle,
  messagingUser, setMessagingUser,
  emailingContact, setEmailingContact,
  emailingSubscriber, setEmailingSubscriber,
  activeItem, setActiveItem,
  data,
  currentUser,
  permissionGroups,
  canManageAccess,
  canSendMessages,
  canAccessRepository,
  canManageDocuments,
  allContacts,
  // Handlers
  handleUserSubmit,
  handleEventSubmit,
  handlePlanSubmit,
  handleArticleSubmit,
  handleSendMessage,
  handleSendEmailToContact,
  currentUserRole,
}) {
  return (
    <>
      {showUserForm && (
        <UserFormModal 
          key={editingUser?.id || "new-user"}
          editingUser={editingUser}
          currentUserRole={currentUserRole}
          onClose={() => { setShowUserForm(false); setEditingUser(null); }}
          onSubmit={handleUserSubmit}
          currentUser={currentUser}
          permissionGroups={permissionGroups}
          canManageAccess={canManageAccess}
        />
      )}

      {showEventForm && (
        <EventFormModal 
          key={editingEvent?.id || "new-event"}
          editingEvent={editingEvent}
          onClose={() => { setShowEventForm(false); setEditingEvent(null); }}
          onSubmit={handleEventSubmit}
        />
      )}

      {showPlanForm && (
        <PlanFormModal 
          key={editingPlan?.id || "new-plan"}
          editingPlan={editingPlan}
          allServices={data.services || []}
          serviceCategories={data.serviceCategories || []}
          onClose={() => { setShowPlanForm(false); setEditingPlan(null); }}
          onSubmit={handlePlanSubmit}
        />
      )}

      {showArticleForm && (
        <ArticleFormModal 
          key={editingArticle?.id || "new-article"}
          editingArticle={editingArticle}
          onClose={() => { setShowArticleForm(false); setEditingArticle(null); }}
          onSubmit={handleArticleSubmit}
        />
      )}

      {messagingUser && (
        <MessageModal 
          messagingUser={messagingUser}
          onClose={(updated) => updated ? setMessagingUser(updated) : setMessagingUser(null)}
          onSendMessage={handleSendMessage}
          canAccessRepository={canAccessRepository}
          canRequestDocuments={canManageDocuments}
        />
      )}

      {emailingContact && (
        <ContactEmailModal
          emailingContact={emailingContact}
          onClose={() => setEmailingContact(null)}
          onSendEmail={handleSendEmailToContact}
        />
      )}

      {emailingSubscriber && (
        <NewsletterEmailModal
          subscriber={emailingSubscriber}
          onClose={() => setEmailingSubscriber(null)}
        />
      )}

      {activeItem && (
        <DetailsModal 
          currentItem={data.leads?.find(l => l.id === activeItem.id) || data.registrations?.find(r => r.id === activeItem.id) || allContacts?.find(c => c.id === activeItem.id) || activeItem}
          onClose={() => setActiveItem(null)}
          onSwitchItem={setActiveItem}
          allUsers={data.users}
          allRegistrations={data.registrations || []}
          allLeads={data.leads || []}
          onSendMessage={handleSendMessage}
          canAccessRepository={canAccessRepository}
          canManageDocuments={canManageDocuments}
          setEmailingContact={setEmailingContact}
        />
      )}
    </>
  );
}
