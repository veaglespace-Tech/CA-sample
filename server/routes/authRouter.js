import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { login, register, me, logout, requestOtp, verifyOtp, updateMe, verifyAdminOtp, requestAdminPasswordReset, resetAdminPassword } from "../controllers/auth/authController.js";
import { validateAuthRegisterBody, validateAuthLoginBody } from "../middleware/validateRequest.js";
import rateLimit from "express-rate-limit";

const getEnv = (key, fallback = "") => (process.env[key] || fallback).trim();

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(getEnv("LOGIN_RATE_LIMIT_MAX", "20")) || 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
});

export const authRouter = Router();

authRouter.post("/auth/register", validateAuthRegisterBody, register);
authRouter.post("/auth/login", loginRateLimiter, validateAuthLoginBody, login);
authRouter.post("/auth/verify-admin-otp", loginRateLimiter, verifyAdminOtp);
authRouter.post("/auth/admin/forgot-password", loginRateLimiter, requestAdminPasswordReset);
authRouter.post("/auth/admin/reset-password", loginRateLimiter, resetAdminPassword);
authRouter.post("/auth/logout", logout);
authRouter.get("/auth/me", requireAuth, me);
authRouter.put("/auth/me", requireAuth, updateMe);

authRouter.post("/login/request-otp", requestOtp);
authRouter.post("/login/verify-otp", verifyOtp);
