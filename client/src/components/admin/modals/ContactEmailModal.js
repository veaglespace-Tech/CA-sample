import { useState } from "react";

export default function ContactEmailModal({ emailingContact, onClose, onSendEmail }) {
  const [subject, setSubject] = useState(`Response to Your Company Name Inquiry`);
  const [messageText, setMessageText] = useState(`Hi ${emailingContact?.name || "there"},\n\nThank you for reaching out to Your Company Name.\n\nRegarding your query:\n"${emailingContact?.message || ""}"\n\n`);
  const [isSending, setIsSending] = useState(false);

  if (!emailingContact) return null;

  const handleSend = async () => {
    if (!messageText.trim()) return;
    
    setIsSending(true);
    try {
      const payload = {
        email: emailingContact.email,
        subject,
        message: messageText,
        isCustomPayment: emailingContact.isCustomPayment
      };

      const success = await onSendEmail(emailingContact.id, payload);
      if (success) {
        setSubject("");
        setMessageText("");
        onClose();
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
      <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "500px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto" }}>
        <h3 style={{ margin: "0 0 1rem 0" }}>Email to {emailingContact.name}</h3>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem" }}>
          To: {emailingContact.email}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>Subject</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>Message</label>
            <textarea 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your email message here..."
              style={{ width: "100%", padding: "0.8rem", minHeight: "150px", borderRadius: "8px", border: "1px solid #cbd5e1", fontFamily: "inherit" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={() => onClose()} className="vs-auth-ghost" style={{ padding: "8px 20px" }}>Cancel</button>
          <button 
            onClick={handleSend}
            disabled={isSending || !messageText.trim()}
            className="vs-auth-btn"
            style={{ padding: "8px 24px" }}
          >
            {isSending ? "Sending..." : "Send Mail"}
          </button>
        </div>
      </div>
    </div>
  );
}
