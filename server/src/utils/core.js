export function createError(statusCode, message, details = undefined) {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details !== undefined) {
    error.details = details;
  }
  return error;
}

export function jsonResponse(res, statusCode, payload) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(payload);
  }
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

export function notFound(res) {
  jsonResponse(res, 404, { ok: false, error: "Route not found" });
}

export function badRequest(res, message, details = undefined) {
  jsonResponse(res, 400, { ok: false, error: message, details });
}

export async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) return {};

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};

  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("Invalid JSON body");
    error.statusCode = 400;
    throw error;
  }
}

export function applyCors(req, res) {
  const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
  const requestOrigin = req.headers.origin;
  const origin = requestOrigin === allowedOrigin || !requestOrigin ? allowedOrigin : requestOrigin;

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }

  return false;
}

export function getClientMeta(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ipAddress = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0]?.trim() || req.socket.remoteAddress || null;

  return {
    ipAddress,
    userAgent: req.headers["user-agent"] || null,
  };
}

export function requireString(body, keys, label) {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  throw createError(400, `${label} is required`);
}

export function optionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizePhone(value) {
  return String(value || "").replace(/[^\d+]/g, "").trim();
}
