"use client";

import { X } from "lucide-react";

export default function ToastNotification({ toast, onClose, onNavigateToSection, onViewDetails }) {
  if (!toast) return null;

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "320px",
      background: "white",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      borderRadius: "16px",
      padding: "20px",
      zIndex: 10000,
      borderLeft: `6px solid ${toast.type === "doc" ? "#ef4444" : "#f59e0b"}`,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      animation: "vs-slide-in-right 0.3s ease-out"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase" }}>
          {toast.title}{toast.serviceName ? ` • ${toast.serviceName}` : ""}
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
          <X />
        </button>
      </div>
      <div style={{ fontSize: "0.95rem", color: "#1e293b", fontWeight: 600, lineHeight: 1.4 }}>
        {toast.content}
      </div>
      {toast.type === "doc" ? (
        <div style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: 700, cursor: "pointer", display: "flex", gap: "12px", marginTop: "4px" }}>
          <span onClick={() => { if (onNavigateToSection) onNavigateToSection("documents"); onClose(); }}>
            📤 Go to Uploads →
          </span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span onClick={() => { onViewDetails(); onClose(); }} style={{ color: "#64748b" }}>
            View Notification
          </span>
        </div>
      ) : (
        <div style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: 700, cursor: "pointer" }} onClick={() => { onViewDetails(); onClose(); }}>
          View details →
        </div>
      )}
    </div>
  );
}

