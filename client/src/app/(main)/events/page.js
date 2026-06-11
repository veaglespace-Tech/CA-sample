"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Monitor, Users } from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from "react-hot-toast";
import { useGetEventsQuery, useRegisterForEventMutation } from "../../../store/api/eventApi";

const plannedSessions = [
  {
    title: "Startup Registration Readiness",
    date: "Monthly",
    time: "Online",
    description: "Understand entity choice, basic documents, timelines, and first compliance steps before registering your business.",
  },
  {
    title: "GST and Income Tax Clinic",
    date: "Fortnightly",
    time: "Online",
    description: "A practical session for founders and SMEs on GST registration, return filing, and tax documentation.",
  },
  {
    title: "Trademark Protection Basics",
    date: "Monthly",
    time: "Online",
    description: "Learn trademark search, class selection, filing, objections, and brand protection basics.",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

export default function EventsPage() {
  const { data: response, isLoading, isError } = useGetEventsQuery();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", city: "" });
  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation();

  const handleRegisterClick = (e, event) => {
    e.preventDefault();
    setRegisteringEvent(event);
    setFormData({ name: "", email: "", phone: "", city: "" });
    setFormError("");
    setSubmitSuccess(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const { name, email, phone } = formData;
    
    if (name.trim().length < 3) {
      return setFormError("Please enter your full name (at least 3 characters).");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setFormError("Please enter a valid email address.");
    }
    
    if (!formData.phone || formData.phone.length < 10) {
      return setFormError("Please enter a valid phone number.");
    }

    try {
      await registerForEvent({ id: registeringEvent.id, ...formData }).unwrap();
      setSubmitSuccess(true);
      setTimeout(() => setRegisteringEvent(null), 3000);
    } catch (err) {
      toast.error("Failed to register. Please try again.");
    }
  };

  const events = response?.data || [];
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (activeTab === "upcoming") {
      return event.status === "UPCOMING" || (event.status === "PUBLISHED" && eventDate >= now);
    }
    
    if (activeTab === "past") {
      return event.status === "PAST" || (event.status === "PUBLISHED" && eventDate < now);
    }
    
    return false;
  });

  const showFallback = !isLoading && (isError || filteredEvents.length === 0);

  return (
    <main className="vs-events-page">
      <section className="vs-page-hero vx-page-hero">
        <div className="vs-container">
          <h1>Events and Masterclasses</h1>
          <p className="vs-hero-sub">Learn from Veagle Space Technology Pvt. Ltd. advisors and stay ahead with curated legal, tax, registration, and compliance sessions.</p>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container">
          <div className="vs-events-tabs vx-tabs">
            <button className={`vs-event-tab ${activeTab === "upcoming" ? "active" : ""}`} onClick={() => setActiveTab("upcoming")}>
              Upcoming Events
            </button>
            <button className={`vs-event-tab ${activeTab === "past" ? "active" : ""}`} onClick={() => setActiveTab("past")}>
              Past Sessions
            </button>
          </div>

          {isLoading ? (
            <div className="vx-empty-state">
              <h2>Loading events...</h2>
              <p>Fetching the latest Veagle Space Technology Pvt. Ltd. sessions.</p>
            </div>
          ) : !showFallback ? (
            <div className="vs-events-grid">
              {filteredEvents.map((event) => (
                <article key={event.id} className="vs-event-card">
                  <img 
                    src={event.imageUrl ? (event.imageUrl.startsWith("/") ? `${API_URL}${event.imageUrl}` : event.imageUrl) : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000"} 
                    alt={event.title} 
                    className="vs-event-image" 
                  />
                  <div className="vs-event-content">
                    <div className="vs-event-date-badge">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <h3>{event.title}</h3>
                    <div className="vs-event-meta">
                      <div className="vs-event-meta-item"><Calendar /> {event.time || "TBA"}</div>
                      <div className="vs-event-meta-item"><MapPin /> {event.location || "Online"}</div>
                    </div>
                    <p className="vx-muted">{event.description?.substring(0, 140)}...</p>
                  </div>
                  <div className="vs-event-speakers">
                    <span className="vx-muted">{event.speakers?.[0]?.name || "Veagle Space Technology Pvt. Ltd. Expert"}</span>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
                      {event.videoUrl && (
                        <a 
                          href={event.videoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="vs-event-btn" 
                          style={{ background: "#ef4444", color: "white", textDecoration: "none", padding: "6px 12px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap", height: "32px", borderRadius: "6px" }}
                        >
                          ▶ Watch Video
                        </a>
                      )}
                      <button
                        className="vs-event-btn"
                        onClick={(e) => handleRegisterClick(e, event)}
                        style={{ border: "none", cursor: "pointer", fontFamily: "inherit", padding: "6px 12px", fontSize: "0.75rem", whiteSpace: "nowrap", height: "32px", borderRadius: "6px" }}
                      >
                        {activeTab === "upcoming" ? "Register Now" : "Register to Access"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="vx-card-grid vx-card-grid-3">
              {plannedSessions.map((session) => (
                <article key={session.title} className="vx-info-card">
                  <span className="vx-card-icon"><Monitor /></span>
                  <h2>{session.title}</h2>
                  <p>{session.description}</p>
                  <div className="vx-meta-row">
                    <span><Calendar /> {session.date}</span>
                    <span><Users /> {session.time}</span>
                  </div>
                  <Link href="/talk-to-expert">Notify me</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {registeringEvent && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "450px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Register for Event</h2>
              <button onClick={() => setRegisteringEvent(null)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.5rem" }}>&times;</button>
            </div>
            
            {submitSuccess ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ color: "#10b981", fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
                <h3>Registration Successful!</h3>
                <p style={{ color: "#64748b", marginTop: "0.5rem" }}>We&apos;ve sent the details to {formData.email}</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{registeringEvent.title}</p>
                {formError && <div style={{ background: "#fee2e2", color: "#ef4444", padding: "0.75rem", borderRadius: "6px", fontSize: "0.9rem", fontWeight: "bold" }}>{formError}</div>}
                <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                <div style={{ width: "100%", marginBottom: "0.5rem" }}>
                  <PhoneInput
                    country={'in'}
                    value={formData.phone}
                    onChange={(phone) => setFormData({...formData, phone})}
                    inputProps={{
                      name: 'phone',
                      required: true,
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '3rem',
                      paddingLeft: '3.5rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                    buttonStyle={{
                      border: '1px solid #cbd5e1',
                      borderRight: 'none',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px 0 0 6px',
                      paddingLeft: '0.5rem'
                    }}
                    containerStyle={{
                      width: '100%'
                    }}
                  />
                </div>
                <input type="text" placeholder="City (Optional)" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                <button type="submit" disabled={isRegistering} style={{ width: "100%", padding: "0.8rem", borderRadius: "6px", background: "#4f46e5", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}>
                  {isRegistering ? "Registering..." : "Confirm Registration"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

