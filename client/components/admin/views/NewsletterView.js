"use client";
import AdminTable from "./AdminTable";

export default function NewsletterView({ subscribers, onEmail }) {
  return (
    <AdminTable 
      title="Newsletter Mails"
      columns={["Email", "Date"]}
      items={subscribers || []}
      type="newsletter"
      onEmail={onEmail}
    />
  );
}
