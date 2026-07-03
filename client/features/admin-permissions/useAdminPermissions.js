"use client";

export function useAdminPermissions(user) {
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isAdmin = user?.role === "ADMIN";
  const permissions = isAdmin ? user?.adminPermissions || null : null;

  function can(moduleKey, actionKey) {
    if (isSuperAdmin) return true;
    if (!isAdmin) return false;
    if (!permissions) return true;
    if (!permissions[moduleKey]) return true;
    if (permissions[moduleKey][actionKey] === undefined) return true;
    return permissions[moduleKey][actionKey] === true;
  }

  return {
    can,
    permissions,
    isLoaded: !isAdmin || !!permissions || isSuperAdmin,
  };
}
