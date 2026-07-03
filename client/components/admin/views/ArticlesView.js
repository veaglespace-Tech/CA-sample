"use client";
import AdminTable from "./AdminTable";

export default function ArticlesView({ articles, onAdd, onEdit, onDelete, onViewVideo }) {
  return (
    <AdminTable 
      title="Blog Articles"
      columns={["Title", "Category", "Status", "Video"]}
      items={articles || []}
      type="article"
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onViewVideo={onViewVideo}
    />
  );
}
