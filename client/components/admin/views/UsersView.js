"use client";
import AdminTable from "./AdminTable";

export default function UsersView({ 
  searchTerm, 
  searchResults, 
  users, 
  isSearching, 
  onSearchChange, 
  onAdd, 
  onEdit, 
  onDelete, 
  onMessage, 
  onViewDocs 
}) {
  return (
    <AdminTable 
      title="User Management"
      columns={["Name", "Email", "Phone", "Role", "Referred By", "Date"]}
      items={searchTerm ? (searchResults || []) : (users || [])}
      type="user"
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onMessage={onMessage}
      onViewDocs={onViewDocs}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      isSearching={isSearching}
    />
  );
}
