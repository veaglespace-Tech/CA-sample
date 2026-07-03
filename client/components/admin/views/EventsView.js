"use client";
import AdminTable from "./AdminTable";

export default function EventsView({ events, onAdd, onEdit, onDelete, onViewDetails }) {
  return (
    <AdminTable 
      title="Events Management"
      columns={["Title", "Date", "Status", "Registrations"]}
      items={events || []}
      type="event"
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onViewDetails={onViewDetails}
    />
  );
}
