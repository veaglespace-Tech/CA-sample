import { prisma } from "../../config/db.js";
import {
  PERMISSIONS_SCHEMA,
  buildDefaultPermissions,
  getPermissionsMap,
  sanitizePermissions,
  setPermissionsForAdmin,
} from "./service.js";

export async function getAdminPermissions(req, res) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const permissionsMap = await getPermissionsMap();

    const result = admins.map((admin) => ({
      ...admin,
      permissions: permissionsMap[admin.id]
        ? sanitizePermissions(permissionsMap[admin.id])
        : buildDefaultPermissions(),
    }));

    res.status(200).json({
      ok: true,
      data: { admins: result, schema: PERMISSIONS_SCHEMA },
    });
  } catch (error) {
    console.error("[Permissions] GET error:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch admin permissions." });
  }
}

export async function updateAdminPermissions(req, res) {
  try {
    const { adminId } = req.params;
    const { permissions } = req.body;

    if (!permissions || typeof permissions !== "object" || Array.isArray(permissions)) {
      return res.status(400).json({ ok: false, message: "permissions must be an object." });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: adminId },
      select: { id: true, role: true, name: true },
    });

    if (!targetUser) {
      return res.status(404).json({ ok: false, message: "Admin user not found." });
    }

    if (targetUser.role !== "ADMIN") {
      return res.status(400).json({
        ok: false,
        message: "Permissions can only be set for ADMIN role users.",
      });
    }

    const sanitized = await setPermissionsForAdmin(adminId, permissions);

    console.log(`[Permissions] Updated for admin "${targetUser.name}" (${adminId})`);

    res.status(200).json({ ok: true, data: { adminId, permissions: sanitized } });
  } catch (error) {
    console.error("[Permissions] PUT error:", error);
    res.status(500).json({ ok: false, message: "Failed to update admin permissions." });
  }
}
