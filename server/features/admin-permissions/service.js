import { prisma } from "../../config/db.js";
import { PERMISSIONS_SCHEMA, buildDefaultPermissions, sanitizePermissions } from "./schema.js";

const SETTING_KEY = "admin_permissions";

export { PERMISSIONS_SCHEMA, buildDefaultPermissions, sanitizePermissions };

export async function getPermissionsMap() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: SETTING_KEY },
  });

  const rawValue = setting?.value;
  if (!rawValue || typeof rawValue !== "object" || Array.isArray(rawValue)) {
    return {};
  }

  return rawValue;
}

export async function getPermissionsForUser(user) {
  if (!user) return null;
  if (user.role === "SUPER_ADMIN") return buildDefaultPermissions();
  if (user.role !== "ADMIN") return null;

  const permissionsMap = await getPermissionsMap();
  return permissionsMap[user.id]
    ? sanitizePermissions(permissionsMap[user.id])
    : buildDefaultPermissions();
}

export function hasAdminPermission(user, moduleKey, actionKey) {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;
  if (user.role !== "ADMIN") return false;

  const permissions = user.adminPermissions || buildDefaultPermissions();
  if (!permissions[moduleKey]) return true;
  if (permissions[moduleKey][actionKey] === undefined) return true;
  return permissions[moduleKey][actionKey] === true;
}

export async function setPermissionsForAdmin(adminId, permissions) {
  const currentMap = await getPermissionsMap();
  const nextMap = {
    ...currentMap,
    [adminId]: sanitizePermissions(permissions),
  };

  await prisma.siteSetting.upsert({
    where: { key: SETTING_KEY },
    update: { value: nextMap },
    create: { key: SETTING_KEY, value: nextMap },
  });

  return nextMap[adminId];
}

export async function attachAdminPermissions(user) {
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return user;
  }

  return {
    ...user,
    adminPermissions: await getPermissionsForUser(user),
  };
}
