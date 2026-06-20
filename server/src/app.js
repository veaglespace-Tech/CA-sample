import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { prisma } from "./config/db.js";
import { adminRouter } from "./routes/adminRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { eventRouter } from "./routes/eventRouter.js";
import { leadRouter } from "./routes/leadRouter.js";
import messageRouter from "./routes/messageRouter.js";
import { miscRouter } from "./routes/miscRouter.js";
import { serviceRouter } from "./routes/serviceRouter.js";
import { documentRouter } from "./routes/documentRouter.js";
import { contactRouter } from "./routes/contactRouter.js";
import { planRouter } from "./routes/planRouter.js";
import articleRouter from "./routes/articleRouter.js";
import { newsletterRouter } from "./routes/newsletterRouter.js";
import { referralRouter } from "./routes/referralRouter.js";
import { paymentRouter } from "./routes/paymentRouter.js";
import { reviewRouter } from "./routes/reviewRouter.js";

const getEnv = (key, fallback = "") => (process.env[key] || fallback).trim();

const envAllowedOrigins = [process.env.CLIENT_URL, process.env.CLIENT_ORIGINS, process.env.FRONTEND_ORIGIN]
  .filter(Boolean)
  .join(",")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...envAllowedOrigins,
]);
const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|82\.112\.237\.155)(:\d+)?$/;
const corsOptions = {
  origin: (origin, callback) => {
    console.log(`[CORS CHECK] Incoming Origin: ${origin}`);
    console.log(`[CORS CHECK] Allowed Origins:`, Array.from(allowedOrigins));
    
    if (!origin || origin === "null" || allowedOrigins.has(origin) || localOriginPattern.test(origin)) {
      console.log(`[CORS CHECK] Result: SUCCESS for ${origin}`);
      return callback(null, true);
    }

    console.warn(`[CORS CHECK] Result: FAILED for ${origin}. Proceeding without CORS headers.`);
    return callback(null, false);
  },
  credentials: true,
};

const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests, please try again later.",
  },
});

export const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression({ threshold: 1024 }));
app.use(cors(corsOptions));
app.use("/api", apiRateLimiter);
app.use(express.json({ limit: getEnv("JSON_BODY_LIMIT", "6mb") }));
// PayU sends success/failure as application/x-www-form-urlencoded POST
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  if (req.url === "/api/documents/upload") {
    console.log(`[REQ] ${req.method} ${req.url} - Body Keys:`, Object.keys(req.body || {}));
  } else {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    status: "ok",
    service: "democa-api",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Number(process.uptime().toFixed(0)),
  });
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "democa-api",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Number(process.uptime().toFixed(0)),
  });
});

app.get("/readyz", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      status: "not_ready",
      database: "disconnected",
      message: "Database connection check failed",
    });
  }
});

// Use routers
app.use("/api", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api", eventRouter);
app.use("/api", leadRouter);
app.use("/api", miscRouter);
app.use("/api", referralRouter);
app.use("/api", serviceRouter);
app.use("/api/documents", documentRouter);
app.use("/api/messages", messageRouter);
app.use("/api/contacts", contactRouter);
app.use("/api", planRouter);
app.use("/api/articles", articleRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api", paymentRouter);
app.use("/api", reviewRouter);

app.use((_req, res) => {
  res.status(404).json({ ok: false, message: "resource not found" });
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    ok: false,
    message: err.message || "Server Error",
    error: getEnv("NODE_ENV") === "production" ? null : err.stack,
  });
});
