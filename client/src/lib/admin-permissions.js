export const adminPermissionGroups = [
  {
    group: "Workspace",
    permissions: [
      { key: "dashboard.view", label: "Dashboard Overview" },
      { key: "messages.send", label: "Send Client Messages" },
      { key: "payments.view", label: "Paid Clients" },
    ],
  },
  {
    group: "Users",
    permissions: [
      { key: "users.view", label: "View Users" },
      { key: "users.create", label: "Add Users" },
      { key: "users.update", label: "Edit Users" },
      { key: "users.delete", label: "Delete Users" },
      { key: "users.permissions", label: "Manage Admin Access" },
    ],
  },
  {
    group: "Inquiries",
    permissions: [
      { key: "leads.view", label: "View Service Leads" },
      { key: "leads.update", label: "Update Service Leads" },
      { key: "leads.delete", label: "Delete Service Leads" },
      { key: "registrations.view", label: "View Registrations" },
      { key: "registrations.update", label: "Update Registrations" },
      { key: "registrations.delete", label: "Delete Registrations" },
      { key: "contacts.view", label: "View Contact Queries" },
      { key: "contacts.update", label: "Mark Contacts Read" },
      { key: "contacts.delete", label: "Delete Contact Queries" },
    ],
  },
  {
    group: "Content",
    permissions: [
      { key: "events.view", label: "View Events" },
      { key: "events.create", label: "Create Events" },
      { key: "events.update", label: "Edit Events" },
      { key: "events.delete", label: "Delete Events" },
      { key: "articles.view", label: "View Articles" },
      { key: "articles.create", label: "Create Articles" },
      { key: "articles.update", label: "Edit Articles" },
      { key: "articles.delete", label: "Delete Articles" },
    ],
  },
  {
    group: "Services",
    permissions: [
      { key: "plans.view", label: "View Service Plans" },
      { key: "plans.create", label: "Create Service Plans" },
      { key: "plans.update", label: "Edit Service Plans" },
      { key: "plans.delete", label: "Delete Service Plans" },
      { key: "repository.view", label: "View Document Repository" },
      { key: "repository.upload", label: "Upload Repository Docs" },
      { key: "repository.update", label: "Edit Repository Docs" },
      { key: "repository.delete", label: "Delete Repository Docs" },
      { key: "repository.share", label: "Share Repository Docs" },
      { key: "documents.manage", label: "Verify User Documents" },
    ],
  },
  {
    group: "Growth",
    permissions: [
      { key: "newsletter.view", label: "View Newsletter Mails" },
      { key: "referrals.view", label: "View Referrals" },
      { key: "referrals.changeStatus", label: "Change Referral Status" },
      { key: "referrals.setReward", label: "Update Referral Rewards" },
    ],
  },
];

export const adminPermissionKeys = adminPermissionGroups.flatMap((group) =>
  group.permissions.map((permission) => permission.key),
);

export const sectionPermissions = {
  overview: "dashboard.view",
  users: "users.view",
  leads: "leads.view",
  registrations: "registrations.view",
  contacts: "contacts.view",
  events: "events.view",
  plans: "plans.view",
  articles: "articles.view",
  repository: "repository.view",
  newsletter: "newsletter.view",
  referrals: "referrals.view",
  payments: "payments.view",
  profile: null,
};

export function normalizePermissions(permissions = []) {
  return permissions.map((permission) => {
    if (typeof permission === "string") return permission;
    return permission?.key;
  }).filter(Boolean);
}

export function hasAdminPermission(user, ...permissions) {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;
  const allowed = new Set(normalizePermissions(user.permissions));
  return permissions.flat().some((permission) => !permission || allowed.has(permission));
}

export function canAccessSection(user, sectionId) {
  return hasAdminPermission(user, sectionPermissions[sectionId]);
}

export function filterMenuByAccess(user, menuItems) {
  return menuItems.filter((item) => canAccessSection(user, item.id));
}
