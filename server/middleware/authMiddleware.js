import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { attachAdminPermissions, hasAdminPermission } from "../features/admin-permissions/service.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  referralCode: true,
  referredByCode: true,
};

function getEnv(key, fallback = "") {
  return (process.env[key] || fallback).trim();
}

function getToken(req) {
  const cookieName = getEnv("AUTH_COOKIE_NAME", "democa_token");
  const cookieToken = req.cookies?.[cookieName];
  if (cookieToken) return cookieToken;

  const authorization = req.headers.authorization || "";
  if (authorization.startsWith("Bearer ")) return authorization.slice("Bearer ".length).trim();

  return null;
}

export async function requireAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ ok: false, message: "Authentication required." });

    const payload = jwt.verify(token, getEnv("JWT_SECRET"));
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: publicUserSelect,
    });

    if (!user) return res.status(401).json({ ok: false, message: "User no longer exists." });

    req.user = await attachAdminPermissions(user);
    next();
  } catch {
    res.status(401).json({ ok: false, message: "Invalid or expired token." });
  }
}

export function requireRoles(...roles) {
  const allowedRoles = new Set(roles.flat());

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Authentication required." });
    if (req.user.role === "SUPER_ADMIN" || allowedRoles.has(req.user.role)) return next();

    return res.status(403).json({ ok: false, message: "You do not have access to this resource." });
  };
}

export function requireAdminPermission(moduleKey, actionKey, message) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: "Authentication required." });
    }

    if (hasAdminPermission(req.user, moduleKey, actionKey)) {
      return next();
    }

    return res.status(403).json({
      ok: false,
      message: message || `You do not have permission to ${actionKey} ${moduleKey}.`,
      code: "ADMIN_PERMISSION_DENIED",
      permission: { module: moduleKey, action: actionKey },
    });
  };
}

export async function optionalAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return next();

    const payload = jwt.verify(token, getEnv("JWT_SECRET"));
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: publicUserSelect,
    });

    if (user) req.user = await attachAdminPermissions(user);
    next();
  } catch {
    next();
  }
}
