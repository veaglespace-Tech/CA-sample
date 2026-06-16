"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
        setMessage("Subscribed successfully!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="w-full lg:max-w-md flex flex-col items-center text-center lg:items-start lg:text-left">
      <h4 className="mb-2 text-lg font-bold tracking-tight text-white">Get GST, Tax & Compliance Updates Monthly</h4>
      <p className="mb-5 text-sm font-medium leading-relaxed text-white/70">
        Get the latest legal &amp; tax updates delivered to your inbox.
      </p>
      
      <form 
        className="flex w-full flex-col gap-2 rounded-none bg-navy-light border border-white/10 p-1.5 shadow-sm focus-within:border-gold focus-within:ring-1 focus-within:ring-gold transition-all duration-300 sm:flex-row relative transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" 
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          disabled={status === "loading" || status === "success"}
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm font-medium text-white placeholder:text-white/40 outline-none border-none disabled:opacity-50"
          required
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="rounded-sm bg-gold px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:bg-gold hover:-translate-y-0.5 disabled:opacity-50 disabled:bg-gold flex items-center justify-center shrink-0 border border-transparent"
          aria-label="Subscribe"
        >
          {status === "loading" ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Send size={15} className="text-white" />
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status === "success" && (
        <div className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-600">
          <CheckCircle size={15} />
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="mt-3 flex items-center gap-2 text-sm font-bold text-rose-600">
          <AlertCircle size={15} />
          {message}
        </div>
      )}
    </div>
  );
}
