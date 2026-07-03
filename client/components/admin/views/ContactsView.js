"use client";

import { useState } from "react";
import AdminTable from "./AdminTable";

export default function ContactsView({ 
  contacts, 
  onDelete, 
  onMessage, 
  onEmail,
  onViewDetails 
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = (contacts || []).filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(term) ||
      (c.email || "").toLowerCase().includes(term) ||
      (c.phone || "").includes(term) ||
      (c.subject || "").toLowerCase().includes(term) ||
      (c.message || "").toLowerCase().includes(term)
    );
  });

  return (
    <AdminTable 
      title="Contact Queries"
      columns={["Name", "Email", "Phone", "Subject", "Message", "Status", "Date"]}
      items={filteredContacts}
      type="contact"
      onDelete={onDelete}
      onMessage={onMessage}
      onEmail={onEmail}
      onViewDetails={onViewDetails}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    />
  );
}
