"use client";

export default function ContactQueryCard({ contact, onMarkAsRead, onDelete }) {
  if (!contact) return null;

  return (
    <div 
      style={{ 
        padding: "24px", 
        borderRadius: "20px",
        background: contact.isRead ? "transparent" : "#f8fafc",
        border: "1px solid #f1f5f9",
        transition: "all 0.2s",
        cursor: "default"
      }}
    >
      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
        <span>{contact.name}</span>
        {!contact.isRead && (
          <span style={{ fontSize: "0.6rem", background: "#f59e0b", color: "white", padding: "2px 8px", borderRadius: "10px" }}>NEW</span>
        )}
      </div>
      
      <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1rem" }}>📧</span> {contact.email || "No email"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1rem" }}>📞</span> {contact.phone}
        </div>
      </div>

      <div style={{ 
        fontSize: "1rem", 
        color: "#334155", 
        lineHeight: 1.7, 
        marginBottom: "20px", 
        padding: "16px", 
        background: "white", 
        borderRadius: "14px", 
        border: "1px solid #e2e8f0" 
      }}>
        {contact.message}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
        <span style={{ color: "#94a3b8" }}>{new Date(contact.createdAt).toLocaleString()}</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(contact.id);
            }}
            style={{ color: "#f59e0b", background: "#fffbeb", border: "1px solid #fef3c7", fontWeight: 700, cursor: "pointer", padding: "6px 12px", borderRadius: "8px" }}
          >
            Done
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Delete this query?")) onDelete(contact.id);
            }}
            style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2", fontWeight: 700, cursor: "pointer", padding: "6px 12px", borderRadius: "8px" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
