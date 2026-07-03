import jwt from "jsonwebtoken";
import * as authModule from "../../services/auth.js";
import { getClientMeta } from "../../utils/core.js";
import { prisma } from "../../config/db.js";
import { validatePassword } from "../../utils/passwordValidation.js";
import { attachAdminPermissions } from "../../features/admin-permissions/service.js";

function getEnv(key, fallback = "") {
  return (process.env[key] || fallback).trim();
}

function getJwtSecret() {
  const secret = getEnv("JWT_SECRET");
  if (!secret) {
    throw new Error("JWT_SECRET is missing in server/.env");
  }
  return secret;
}

function getPublicOrigin() {
  return getEnv(
    "FRONTEND_ORIGIN",
    getEnv("CLIENT_URL", "http://localhost:3003"),
  );
}

function cookieOptions() {
  const days = Number(getEnv("AUTH_COOKIE_MAX_AGE_DAYS", "7")) || 7;
  const publicOrigin = getPublicOrigin();
  const isHttps = /^https:\/\//i.test(publicOrigin);
  return {
    httpOnly: true,
    // Use a secure cross-site cookie only when the public origin is HTTPS.
    // On HTTP deployments, browsers will drop SameSite=None + Secure cookies.
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    path: "/",
    maxAge: days * 24 * 60 * 60 * 1000,
  };
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    getJwtSecret(),
    {
      expiresIn: getEnv("JWT_EXPIRES_IN", "7d"),
    },
  );
}

function setAuthCookie(res, token) {
  res.cookie(getEnv("AUTH_COOKIE_NAME", "democa_token"), token, cookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(getEnv("AUTH_COOKIE_NAME", "democa_token"), {
    ...cookieOptions(),
    maxAge: undefined,
  });
}

async function serializeAuthUser(user) {
  return attachAdminPermissions(user);
}

export async function register(req, res, next) {
  try {
    // ── Password strength validation ──
    const pwdError = validatePassword(req.body?.password);
    if (pwdError) {
      return res.status(400).json({ ok: false, message: pwdError });
    }

    const user = await authModule.registerUser({
      name: req.body?.name || req.body?.fullName,
      email: req.body?.email,
      phone: req.body?.phone,
      password: req.body?.password,
      requestedRole: req.body?.role,
      registrationKey: req.body?.registrationKey,
      referredByCode: req.body?.referredByCode || req.body?.ref,
    });

    const authUser = await serializeAuthUser(user);
    const token = createToken(authUser);
    setAuthCookie(res, token);

    res.status(201).json({
      ok: true,
      message: "Registration successful.",
      token,
      user: authUser,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ ok: false, message: error.message });
    }
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function login(req, res, next) {
  try {
    const user = await authModule.loginUser({
      email: req.body?.email,
      password: req.body?.password,
    });

    if (req.body?.expectedRole) {
      const allowedRoles = Array.isArray(req.body.expectedRole) ? req.body.expectedRole : [req.body.expectedRole];
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ ok: false, message: "Unauthorized account type for this portal." });
      }
    }

    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      const { otp } = await authModule.generateEmailOtp(user.email);

      // ── Dev mode: print OTP to console immediately
      if (getEnv("NODE_ENV") !== "production") {
        console.log(`\n[DEV] Admin OTP for ${user.email}: \x1b[33m${otp}\x1b[0m  (expires in 10 min)\n`);
      }

      // ── Respond to client IMMEDIATELY — do NOT await email
      // The OTP is already saved in DB; email sends in the background
      res.status(200).json({
        ok: true,
        message: "OTP sent to your email.",
        requiresOtp: true,
        email: user.email,
      });

      // ── Send email in background (non-blocking)
      import("../../utils/mailer.js").then(({ sendEmail }) => {
        sendEmail({
          to: user.email,
          subject: "Admin Login OTP - Veagle Space Technology Pvt. Ltd.",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Your Admin Login OTP</h2>
              <p>Your one-time password to access the Veagle Space Technology Pvt. Ltd. Admin Dashboard is:</p>
              <h1 style="background: #f4f4f5; padding: 10px 20px; letter-spacing: 5px; text-align: center;">${otp}</h1>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you did not request this, please secure your account immediately.</p>
            </div>
          `,
        }).catch(err => console.error("[BG] Failed to send Admin OTP email:", err));
      });

      return;
    }

    const authUser = await serializeAuthUser(user);
    const token = createToken(authUser);
    setAuthCookie(res, token);

    res.status(200).json({
      ok: true,
      message: "Login successful.",
      token,
      user: authUser,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ ok: false, message: error.message });
    }
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function verifyAdminOtp(req, res) {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ ok: false, message: "Email and OTP are required." });
    }

    const user = await authModule.validateEmailOtp(email, otp);
    
    const authUser = await serializeAuthUser(user);
    const token = createToken(authUser);
    setAuthCookie(res, token);

    res.status(200).json({
      ok: true,
      message: "Login successful.",
      token,
      user: authUser,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ ok: false, message: error.message });
    }
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function requestAdminPasswordReset(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ ok: false, message: "Email is required." });
    }

    const { user, otp } = await authModule.requestAdminPasswordReset(email);
    const { sendEmail } = await import("../../utils/mailer.js");

    if (getEnv("NODE_ENV") !== "production") {
      console.log(`\n[DEV] Admin reset OTP for ${user.email}: \x1b[33m${otp}\x1b[0m  (expires in 10 min)\n`);
    }

    // ── Respond immediately, send email in background
    res.status(200).json({
      ok: true,
      message: "Password reset OTP sent to your email.",
      email: user.email,
    });

    // ── Send email in background (non-blocking)
    import("../../utils/mailer.js").then(({ sendEmail }) => {
      sendEmail({
        to: user.email,
        subject: "Password Reset OTP - Veagle Space Technology Pvt. Ltd.",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>Use the one-time password below to reset your Veagle Space Technology Pvt. Ltd. password:</p>
            <h1 style="background: #f4f4f5; padding: 10px 20px; letter-spacing: 5px; text-align: center;">${otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you did not request this reset, please ignore this email and contact support if needed.</p>
          </div>
        `,
      }).catch(err => console.error("[BG] Failed to send Admin reset OTP email:", err));
    });

    return;
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ ok: false, message: error.message });
    }
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function resetAdminPassword(req, res) {
  try {
    const { email, otp, password } = req.body;
    await authModule.resetAdminPassword({ email, otp, password });
    return res.status(200).json({
      ok: true,
      message: "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ ok: false, message: error.message });
    }
    return res.status(400).json({ ok: false, message: error.message });
  }
}

export async function logout(_req, res) {
  clearAuthCookie(res);
  res.status(200).json({ ok: true, message: "Logged out." });
}

export async function me(req, res) {
  let user = req.user;
  if (user && !user.referralCode) {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const baseName = String(user.name || "USER").slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "");
    const referralCode = `VX-${baseName || "USER"}-${randomSuffix}`;
    try {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { referralCode },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          referralCode: true,
          referredByCode: true,
        }
      });
    } catch (err) {
      console.error("Failed to generate healing referral code:", err);
    }
  }
  const authUser = await serializeAuthUser(user);
  res.status(200).json({ ok: true, user: authUser });
}

export async function requestOtp(req, res) {
  try {
    const meta = getClientMeta(req);
    const { otp } = await authModule.generateOtp({
      phoneRaw: req.body?.phone || req.body?.mobile || req.body?.mobileNumber,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    res.status(201).json({
      ok: true,
      message: "OTP generated",
      devOtp: process.env.NODE_ENV === "production" ? undefined : otp,
    });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    await authModule.validateOtp({
      phoneRaw: req.body?.phone || req.body?.mobile || req.body?.mobileNumber,
      otp: req.body?.otp,
    });

    res.status(200).json({ ok: true, message: "OTP verified" });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

export async function updateMe(req, res) {
  try {
    const user = await authModule.updateProfile(req.user.id, req.body);
    res.status(200).json({ ok: true, message: "Profile updated.", user });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}
