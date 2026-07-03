export const rolePath = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  USER: "user",
};

export function getDashboardPath(role) {
  return `/dashboard/${rolePath[role] || "user"}`;
}

export function formatRole(role) {
  return String(role || "USER").replaceAll("_", " ");
}
