"use client";

import { useState } from "react";

export default function MessageNotificationCard({ 
  msg, 
  user, 
  isStaff, 
  onMarkAsRead, 
  onVerifyDocument, 
  onNavigateToSection,
  onCloseDrawer 
}) {
  const [docStates, setDocStates] = useState({});

  if (!msg) return null;

  const isReceivedByMe = msg.receiverId === user?.id;
  const isSentByMe = msg.senderId === user?.id;
  const serviceName = msg.lead?.serviceName || msg.registrationLead?.registrationType?.replace(/_/g, " ");

  return (
    <div 
      style={{ 
        padding: "16px", 
        borderRadius: "12px",
        border: "1px solid #f1f5f9", 
        background: (isReceivedByMe && !msg.isRead) ? "#fffbeb" : "transparent",
        position: "relative",
        transition: "background 0.3s ease"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "start" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#012b5d", textTransform: "uppercase" }}>
          {isSentByMe ? (
            <>To: <span style={{ color: "#334155" }}>{msg.receiver?.name || "User"}</span></>
          ) : (
            <>From: <span style={{ color: "#334155" }}>{msg.sender?.name || "System"}</span></>
          )}
        </div>
        {isSentByMe && (
          <div style={{ 
            fontSize: "0.65rem", 
            fontWeight: 800, 
            padding: "2px 8px", 
            borderRadius: "10px",
            background: msg.isRead ? "#dcfce7" : "#fee2e2",
            color: msg.isRead ? "#166534" : "#991b1b"
          }}>
            {msg.isRead ? "READ" : "UNREAD"}
          </div>
        )}
      </div>

      {serviceName && (
        <div style={{ marginBottom: "10px" }}>
          <span style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "4px",
            fontSize: "0.65rem", 
            fontWeight: 800, 
            background: "#eff6ff", 
            color: "#1e40af", 
            border: "1px solid #dbeafe",
            padding: "3px 8px", 
            borderRadius: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.03em"
          }}>
            📁 Service: {serviceName}
          </span>
        </div>
      )}

      <div style={{ fontSize: "0.9rem", color: "#1e293b", lineHeight: 1.5, marginBottom: "8px" }}>
        {msg.content}
      </div>

      {msg.isDocRequest && isReceivedByMe && (
        <div style={{ marginTop: "12px", marginBottom: "12px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!msg.isRead) onMarkAsRead(msg.id);
              if (onNavigateToSection) onNavigateToSection("messages");
              if (onCloseDrawer) onCloseDrawer();
            }}
            style={{
              background: "linear-gradient(135deg, #012b5d 0%, #024b94 100%)",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 10px rgba(1, 43, 93, 0.15)",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 14px rgba(1, 43, 93, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(1, 43, 93, 0.15)";
            }}
          >
            📤 Upload Document Now
          </button>
        </div>
      )}

      {/* Document Logic */}
      {msg.documents && msg.documents.length > 0 && (
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {msg.documents.map(doc => (
            <div key={doc.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <a 
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003'}${doc.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  fontSize: "0.75rem", 
                  padding: "6px 12px", 
                  background: "#eff6ff", 
                  color: "#1e40af", 
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 700,
                  border: "1px solid #dbeafe"
                }}
              >
                📄 View {doc.documentType || "File"}
              </a>
              {isStaff && doc.status === "PENDING" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  
                  {!docStates[doc.id]?.isRejecting && docStates[doc.id]?.status !== 'success' && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          setDocStates(prev => ({ ...prev, [doc.id]: { status: 'verifying' } }));
                          try {
                            await onVerifyDocument({ id: doc.id, status: "VERIFIED" }).unwrap();
                            onMarkAsRead(msg.id);
                            setDocStates(prev => ({ ...prev, [doc.id]: { status: 'success', text: 'Verified successfully!' } }));
                          } catch (err) { 
                            setDocStates(prev => ({ ...prev, [doc.id]: { status: 'error', text: 'Error verifying' } }));
                          }
                        }}
                        disabled={docStates[doc.id]?.status === 'verifying'}
                        style={{ flex: 1, fontSize: "0.7rem", padding: "6px", background: "#dcfce7", color: "#166534", borderRadius: "6px", border: "1px solid #bbf7d0", fontWeight: 900, cursor: "pointer", opacity: docStates[doc.id]?.status === 'verifying' ? 0.7 : 1 }}
                      >
                        {docStates[doc.id]?.status === 'verifying' ? '⏳ Verifying...' : '✅ Verify'}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocStates(prev => ({ ...prev, [doc.id]: { isRejecting: true } }));
                        }}
                        style={{ flex: 1, fontSize: "0.7rem", padding: "6px", background: "#fee2e2", color: "#991b1b", borderRadius: "6px", border: "1px solid #fecaca", fontWeight: 900, cursor: "pointer" }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}

                  {docStates[doc.id]?.isRejecting && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", background: "#fff5f5", padding: "8px", borderRadius: "6px", border: "1px solid #fed7d7" }}>
                      <input 
                        type="text" 
                        placeholder="Reason for rejection..." 
                        autoFocus
                        style={{ fontSize: "0.7rem", padding: "6px", borderRadius: "4px", border: "1px solid #feb2b2", width: "100%", outline: "none" }}
                        onClick={e => e.stopPropagation()}
                        onChange={(e) => setDocStates(prev => ({ ...prev, [doc.id]: { ...prev[doc.id], reason: e.target.value } }))}
                      />
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const reason = docStates[doc.id]?.reason;
                            if (!reason) return;
                            setDocStates(prev => ({ ...prev, [doc.id]: { ...prev[doc.id], status: 'rejecting' } }));
                            try {
                              await onVerifyDocument({ id: doc.id, status: "REJECTED", reason }).unwrap();
                              onMarkAsRead(msg.id);
                              setDocStates(prev => ({ ...prev, [doc.id]: { status: 'success', text: 'Rejected successfully!' } }));
                            } catch (err) { 
                              setDocStates(prev => ({ ...prev, [doc.id]: { ...prev[doc.id], status: 'error', text: 'Error rejecting document' } }));
                            }
                          }}
                          disabled={!docStates[doc.id]?.reason || docStates[doc.id]?.status === 'rejecting'}
                          style={{ flex: 1, fontSize: "0.65rem", padding: "4px", background: "#e53e3e", color: "white", borderRadius: "4px", border: "none", fontWeight: 800, cursor: docStates[doc.id]?.reason ? "pointer" : "not-allowed", opacity: !docStates[doc.id]?.reason || docStates[doc.id]?.status === 'rejecting' ? 0.6 : 1 }}
                        >
                          {docStates[doc.id]?.status === 'rejecting' ? '⏳ Processing...' : 'Confirm Reject'}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDocStates(prev => ({ ...prev, [doc.id]: { isRejecting: false } }));
                          }}
                          style={{ flex: 1, fontSize: "0.65rem", padding: "4px", background: "#e2e8f0", color: "#4a5568", borderRadius: "4px", border: "none", fontWeight: 800, cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {docStates[doc.id]?.status === 'error' && (
                    <div style={{ fontSize: "0.65rem", color: "#c53030", fontWeight: 700 }}>
                      {docStates[doc.id].text}
                    </div>
                  )}
                  
                  {docStates[doc.id]?.status === 'success' && (
                    <div style={{ fontSize: "0.65rem", color: "#2f855a", fontWeight: 700, background: "#f0fff4", padding: "4px 8px", borderRadius: "4px", border: "1px solid #c6f6d5", textAlign: "center" }}>
                      {docStates[doc.id].text}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{new Date(msg.createdAt).toLocaleTimeString()}</span>
          {!msg.isRead && isReceivedByMe && (
            <button 
              onClick={() => onMarkAsRead(msg.id)}
              style={{ background: "none", border: "none", color: "#012b5d", fontSize: "0.7rem", fontWeight: 900, cursor: "pointer", textTransform: "uppercase" }}
            >
              Mark as Seen
            </button>
          )}
      </div>
    </div>
  );
}
