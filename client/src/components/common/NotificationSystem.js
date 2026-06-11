"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { X, MessageSquare } from "lucide-react";

// API Hooks
import { 
  useGetMyMessagesQuery, 
  useGetUnreadCountQuery,
  useMarkMessageAsReadMutation 
} from "../../store/api/messageApi";
import { 
  useGetUnreadContactsQuery, 
  useMarkContactAsReadMutation, 
  useDeleteContactMutation 
} from "../../store/api/contactApi";
import { useVerifyDocumentMutation } from "../../store/api/adminApi";

// Modularized Sub-Components
import ToastNotification from "./notifications/ToastNotification";
import ContactQueryCard from "./notifications/ContactQueryCard";
import MessageNotificationCard from "./notifications/MessageNotificationCard";

export default function NotificationSystem({ user, isStaff, onNavigateToMessages, onNavigateToSection }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  
  // Queries
  const { data: unreadData } = useGetUnreadCountQuery(null, {
    skip: !user,
    pollingInterval: 30000,
  });
  
  const { data: messagesData } = useGetMyMessagesQuery(null, { 
    skip: !user,
    pollingInterval: 30000
  });
  
  const { data: contactsData } = useGetUnreadContactsQuery(null, { 
    skip: !isStaff,
    pollingInterval: 30000
  });

  // Mutations
  const [markAsRead] = useMarkMessageAsReadMutation();
  const [markContactRead] = useMarkContactAsReadMutation();
  const [deleteContact] = useDeleteContactMutation();
  const [verifyDocument] = useVerifyDocumentMutation();

  const messages = messagesData?.data || [];
  const contacts = contactsData?.data || [];
  const unreadCount = (unreadData?.count || 0) + (isStaff ? (contacts?.length || 0) : 0);

  const allNotifications = [
    ...(isStaff ? contacts.map(c => ({ ...c, _type: 'contact' })) : []),
    ...messages.map(m => ({ ...m, _type: 'message' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const prevUnreadRef = useRef(unreadCount);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Monitor for new notifications to show a Toast
  useEffect(() => {
    if (unreadData !== undefined && (isStaff ? contactsData !== undefined : true)) {
      if (isInitialLoad) {
        prevUnreadRef.current = unreadCount;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsInitialLoad(false);
      } else if (unreadCount > prevUnreadRef.current) {
        const latestMsg = messages.find(m => !m.isRead && m.receiverId === user?.id);
        const latestContact = contacts.find(c => !c.isRead);
        
        if (latestMsg) {
          const serviceName = latestMsg.lead?.serviceName || latestMsg.registrationLead?.registrationType?.replace(/_/g, " ");
          setActiveToast({
            title: "New Message",
            content: latestMsg.content,
            type: latestMsg.isDocRequest ? "doc" : "msg",
            serviceName: serviceName || null
          });
        } else if (latestContact) {
          setActiveToast({
            title: "New Query",
            content: `${latestContact.name} sent a contact inquiry.`,
            type: "contact"
          });
        }
        const timer = setTimeout(() => setActiveToast(null), 5000);
        prevUnreadRef.current = unreadCount;
        return () => clearTimeout(timer);
      }
    }
  }, [unreadCount, unreadData, contactsData, messages, contacts, user?.id, isStaff, isInitialLoad]);

  return (
    <>
      {/* Toast Alert */}
      <ToastNotification 
        toast={activeToast} 
        onClose={() => setActiveToast(null)} 
        onNavigateToSection={onNavigateToSection} 
        onViewDetails={() => setShowNotifications(true)} 
      />
      
      {/* Notification Bell */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          id="vs-notification-bell"
          type="button"
          style={{ 
            position: "relative", 
            display: "flex", 
            alignItems: "center", 
            padding: "8px", 
            color: "white", 
            background: "#012b5d", 
            border: "none", 
            borderRadius: "50%",
            cursor: "pointer",
            width: "40px",
            height: "40px",
            justifyContent: "center",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Toggle notifications"
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute",
              top: "0",
              right: "0",
              background: "#ef4444",
              color: "white",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              border: "2px solid #012b5d",
              zIndex: 10
            }}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
 
      {/* Notification Drawer */}
      {showNotifications && (
        <>
          <div 
            onClick={() => setShowNotifications(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
              cursor: "default"
            }}
          />
          
          <div style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "600px",
            maxWidth: "98vw",
            height: "100vh",
            background: "white",
            boxShadow: "-10px 0 50px rgba(0, 0, 0, 0.2)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            animation: "vs-slide-in-right 0.3s ease-out"
          }}>
            <div style={{ 
              padding: "32px 24px", 
              borderBottom: "1px solid #f1f5f9", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              background: "var(--gold-gradient, linear-gradient(135deg, #fbc02d 0%, #f9a825 100%))",
              color: "white"
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900 }}>Notifications</h3>
                <span style={{ fontSize: "0.95rem", opacity: 0.9 }}>{unreadCount} pending queries</span>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={20} />
              </button>
            </div>
 
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {allNotifications.length > 0 ? (
                  <>
                    <div style={{ padding: "8px 4px", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Latest Activity
                    </div>
                    {allNotifications.slice(0, 20).map(item => {
                      if (item._type === 'contact') {
                        return (
                          <ContactQueryCard 
                            key={`contact-${item.id}`} 
                            contact={item} 
                            onMarkAsRead={markContactRead} 
                            onDelete={deleteContact} 
                          />
                        );
                      } else {
                        return (
                          <MessageNotificationCard 
                            key={`msg-${item.id}`} 
                            msg={item} 
                            user={user} 
                            isStaff={isStaff} 
                            onMarkAsRead={markAsRead} 
                            onVerifyDocument={verifyDocument} 
                            onNavigateToSection={onNavigateToSection} 
                            onCloseDrawer={() => setShowNotifications(false)} 
                          />
                        );
                      }
                    })}
                  </>
                ) : (
                  <div style={{ padding: "60px 20px", textAlign: "center", opacity: 0.2 }}>
                    <MessageSquare size={40} style={{ margin: "0 auto 10px" }} />
                    <div style={{ fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em" }}>No new alerts</div>
                  </div>
                )}
              </div>
            </div>
 
            <div style={{ padding: "24px", borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
              <button 
                onClick={() => {
                  if (onNavigateToMessages) onNavigateToMessages();
                  setShowNotifications(false);
                }}
                style={{ 
                  width: "100%", 
                  padding: "16px", 
                  background: "#012b5d", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "16px", 
                  fontWeight: 900, 
                  fontSize: "0.9rem", 
                  cursor: "pointer",
                  boxShadow: "0 10px 15px -3px rgba(1, 43, 93, 0.3)"
                }}
              >
                VIEW ALL COMMUNICATIONS
              </button>
            </div>
          </div>
        </>
      )}
 
      {/* Slide-in animation style */}
      <style jsx global>{`
        @keyframes vs-slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

