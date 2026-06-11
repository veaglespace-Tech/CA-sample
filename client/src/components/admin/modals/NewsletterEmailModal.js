import { useState } from "react";
import { toast } from "react-hot-toast";
import { useGetRepositoryQuery } from "../../../store/api/adminApi";
import { useReplyToContactMutation } from "../../../store/api/contactApi"; // We can reuse this or create a new one.

export default function NewsletterEmailModal({ subscriber, onClose }) {
  const [subject, setSubject] = useState("Update from Your Company Name");
  const [messageText, setMessageText] = useState("Hi,\n\nWe have some updates for you!\n\nBest,\nYour Company Name Team");
  const [selectedRepoDocId, setSelectedRepoDocId] = useState("");
  const [replyToContact, { isLoading: isSending }] = useReplyToContactMutation();

  const { data: repoResponse } = useGetRepositoryQuery();
  const repoDocs = repoResponse?.data || [];

  if (!subscriber) return null;

  const handleSend = async () => {
    if (!messageText.trim()) return;
    
    try {
      const payload = {
        email: subscriber.email,
        subject,
        message: messageText,
        repositoryDocId: selectedRepoDocId
      };

      // Reusing the replyToContact endpoint since it can just send emails
      // If we pass undefined for id, the backend skips updating the ContactQuery status.
      await replyToContact({ id: "undefined", body: payload }).unwrap();
      onClose();
      toast.success("Email sent successfully!");
    } catch (err) {
      toast.error("Failed to send email: " + (err.data?.message || err.data?.error || "Unknown error"));
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
      <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "500px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto" }}>
        <h3 style={{ margin: "0 0 1rem 0" }}>Email Subscriber</h3>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem" }}>
          To: {subscriber.email}
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

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>Attach Document from Repository</label>
            <select 
              value={selectedRepoDocId}
              onChange={(e) => setSelectedRepoDocId(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem" }}
            >
              <option value="">-- No attachment --</option>
              {repoDocs.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.fileName} ({doc.category})</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={() => onClose()} className="vs-auth-ghost" style={{ padding: "8px 20px" }}>Cancel</button>
          <button 
            onClick={handleSend}
            disabled={isSending || !messageText.trim()}
            className="vs-auth-btn"
            style={{ padding: "8px 24px", opacity: (isSending || !messageText.trim()) ? 0.5 : 1 }}
          >
            {isSending ? "Sending..." : "Send Mail"}
          </button>
        </div>
      </div>
    </div>
  );
}
