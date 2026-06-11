export const ADMIN_PERMISSION_GROUPS = [
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

export const ADMIN_PERMISSION_KEYS = ADMIN_PERMISSION_GROUPS.flatMap((group) =>
  group.permissions.map((permission) => permission.key),
);

export const ADMIN_VIEW_PERMISSIONS = ADMIN_PERMISSION_KEYS.filter((key) => key.endsWith(".view"));

const permissionKeySet = new Set(ADMIN_PERMISSION_KEYS);

export function normalizePermissionKeys(permissions = []) {
  const rawKeys = Array.isArray(permissions) ? permissions : [];
  return [...new Set(rawKeys.map((permission) => {
    if (typeof permission === "string") return permission;
    return permission?.key;
  }).filter((key) => permissionKeySet.has(key)))];
}

export function formatUserForResponse(user) {
  if (!user) return user;
  const keys = user.role === "SUPER_ADMIN"
    ? ADMIN_PERMISSION_KEYS
    : normalizePermissionKeys(user.permissions);
  return { ...user, permissions: keys };
}

export function hasPermission(user, ...keys) {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;
  const allowed = new Set(normalizePermissionKeys(user.permissions));
  return keys.flat().some((key) => allowed.has(key));
}

export function hasAnyAdminView(user) {
  return hasPermission(user, ADMIN_VIEW_PERMISSIONS);
}

export function requirePermission(...keys) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Authentication required." });
    if (hasPermission(req.user, keys)) return next();
    return res.status(403).json({ ok: false, message: "You do not have access to this resource." });
  };
}
