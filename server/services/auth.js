import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../config/db.js";
import { normalizePhone } from "../utils/core.js";
import { validatePassword } from "../utils/passwordValidation.js";
import { formatUserForResponse } from "../utils/adminPermissions.js";

const roleAliases = {
  SUPERADMIN: "SUPER_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
};

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function normalizeRole(role) {
  const key = String(role || "USER").trim().toUpperCase().replace(/[\s-]+/g, "_");
  return roleAliases[key] || "USER";
}

function getEnv(key, fallback = "") {
  return (process.env[key] || fallback).trim();
}

function validateProtectedRole(role, registrationKey, existingUserCount) {
  if (existingUserCount === 0) return;

  if (role === "SUPER_ADMIN") {
    const expected = getEnv("SUPER_ADMIN_REGISTRATION_KEY");
    if (!expected || registrationKey !== expected) {
      const error = new Error("Valid super admin registration key is required.");
      error.statusCode = 403;
      throw error;
    }
  }

  if (role === "ADMIN") {
    const expected = getEnv("ADMIN_REGISTRATION_KEY");
    if (!expected || registrationKey !== expected) {
      const error = new Error("Valid admin registration key is required.");
      error.statusCode = 403;
      throw error;
    }
  }
}

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

export async function registerUser({ name, email, phone, password, requestedRole, registrationKey, referredByCode }) {
  if (!name) throw new Error("Name is required.");
  if (!email) throw new Error("Email is required.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");

  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  const parsedRole = normalizeRole(requestedRole);

  const existingUserCount = await prisma.user.count();
  const role = existingUserCount === 0 && !requestedRole ? "SUPER_ADMIN" : parsedRole;
  validateProtectedRole(role, registrationKey, existingUserCount);

  // Generate unique referral code for the new user
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const baseName = String(name || "USER").slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "");
  const newReferralCode = `VX-${baseName || "USER"}-${randomSuffix}`;

  // Check if referred by another user
  let activeReferrerCode = null;
  let referrerUser = null;
  if (referredByCode && referredByCode.trim() !== "") {
    referrerUser = await prisma.user.findUnique({
      where: { referralCode: referredByCode.trim() }
    });
    if (referrerUser) {
      activeReferrerCode = referrerUser.referralCode;
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
        role,
        referralCode: newReferralCode,
        referredByCode: activeReferrerCode,
      },
      select: publicUserSelect,
    });

    // If successfully referred, create a Referral entry to notify Admin
    if (referrerUser) {
      try {
        const referrer = await prisma.referrer.upsert({
          where: { phone: referrerUser.phone || referrerUser.id },
          update: {
            totalReferred: { increment: 1 },
            name: referrerUser.name,
            email: referrerUser.email,
          },
          create: {
            name: referrerUser.name,
            phone: referrerUser.phone || referrerUser.id,
            email: referrerUser.email,
            totalReferred: 1,
          },
        });

        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referrerUserId: referrerUser.id,
            friendUserId: user.id,
            referrerName: referrerUser.name,
            referrerPhone: referrerUser.phone || "",
            referrerEmail: referrerUser.email,
            friendName: name,
            friendPhone: normalizedPhone || "",
            friendEmail: normalizedEmail,
            serviceName: "User Sign Up",
            message: `User registered using referral code ${activeReferrerCode} via direct sharing link for referrer user ${referrerUser.id}.`,
            status: "NEW",
          }
        });
      } catch (refError) {
        console.error("Failed to insert referral log:", refError);
      }
    }

    return formatUserForResponse(user);
  } catch (error) {
    if (error?.code === "P2002") {
      const err = new Error("User with this email or phone already exists.");
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
}

export async function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required.");
  }

  const userWithPassword = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      ...publicUserSelect,
      passwordHash: true,
    },
  });

  if (!userWithPassword) {
    const err = new Error("No account found with this email.");
    err.statusCode = 401;
    throw err;
  }

  const passwordMatches = await bcrypt.compare(password, userWithPassword.passwordHash);
  if (!passwordMatches) {
    const err = new Error("Incorrect password.");
    err.statusCode = 401;
    throw err;
  }

  const { passwordHash: _passwordHash, ...user } = userWithPassword;
  return formatUserForResponse(user);
}

function createOtp() {
  return String(crypto.randomInt(100000, 999999));
}

function hashOtp(phone, otp) {
  return crypto.createHash("sha256").update(`${phone}:${otp}:${process.env.OTP_SECRET || "caproject-dev"}`).digest("hex");
}

export async function generateOtp({ phoneRaw, ipAddress, userAgent }) {
  const phone = normalizePhone(phoneRaw);
  if (!phone) throw new Error("Phone is required.");

  const otp = createOtp();
  await prisma.loginOtp.create({
    data: {
      phone,
      otpHash: hashOtp(phone, otp),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ipAddress,
      userAgent,
    },
  });

  return { phone, otp };
}

export async function validateOtp({ phoneRaw, otp }) {
  const phone = normalizePhone(phoneRaw);
  if (!phone) throw new Error("Phone is required.");
  if (!otp) throw new Error("OTP is required.");

  const record = await prisma.loginOtp.findFirst({
    where: {
      phone,
      purpose: "LOGIN",
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) throw new Error("OTP expired or not found");

  if (record.otpHash !== hashOtp(phone, otp)) {
    await prisma.loginOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error("Invalid OTP");
  }

  await prisma.loginOtp.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return true;
}

export async function generateEmailOtp(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) throw new Error("Email is required.");

  await prisma.loginOtp.deleteMany({
    where: {
      phone: normalizedEmail,
      purpose: "LOGIN",
      consumedAt: null,
    },
  });

  const otp = createOtp();
  await prisma.loginOtp.create({
    data: {
      phone: normalizedEmail, // reusing phone field to store email for simplicity
      otpHash: hashOtp(normalizedEmail, otp),
      purpose: "LOGIN",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return { otp };
}

export async function requestAdminPasswordReset(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) throw new Error("Email is required.");

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    const err = new Error("Account not found.");
    err.statusCode = 404;
    throw err;
  }

  if (user.role === "SUPER_ADMIN") {
    const err = new Error("Super Admin passwords cannot be reset via email. Please contact VeagleSpace support for assistance.");
    err.statusCode = 403;
    throw err;
  }

  const { otp } = await generateEmailOtp(normalizedEmail);
  return { user, otp };
}

export async function resetAdminPassword({ email, otp, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) throw new Error("Email is required.");
  if (!otp) throw new Error("OTP is required.");

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, role: true },
  });

  if (!user) {
    const err = new Error("Account not found.");
    err.statusCode = 404;
    throw err;
  }

  if (user.role === "SUPER_ADMIN") {
    const err = new Error("Super Admin passwords cannot be reset via email. Please contact VeagleSpace support for assistance.");
    err.statusCode = 403;
    throw err;
  }

  const passErr = validatePassword(password);
  if (passErr) throw new Error(passErr);

  await validateEmailOtp(normalizedEmail, otp);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  return { ok: true };
}

export async function validateEmailOtp(email, otp) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) throw new Error("Email is required.");
  if (!otp) throw new Error("OTP is required.");

  const record = await prisma.loginOtp.findFirst({
    where: {
      phone: normalizedEmail,
      purpose: "LOGIN",
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) throw new Error("OTP expired or not found");

  if (record.otpHash !== hashOtp(normalizedEmail, otp)) {
    await prisma.loginOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error("Invalid OTP");
  }

  await prisma.loginOtp.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  // return the user for token creation
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: publicUserSelect,
  });
  
  if (!user) throw new Error("User not found");
  
  return formatUserForResponse(user);
}

export async function updateProfile(userId, { name, email, phone, password, oldPassword }) {
  const data = {};
  if (name) data.name = name;
  if (email) data.email = normalizeEmail(email);
  if (phone) data.phone = normalizePhone(phone);
  
  if (password) {
    if (!oldPassword) throw new Error("Current password is required to set a new one.");
    
    // Fetch user to verify old password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true }
    });
    
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) throw new Error("Incorrect current password.");
    
    const passErr = validatePassword(password);
    if (passErr) throw new Error(passErr);
    
    data.passwordHash = await bcrypt.hash(password, 12);
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: publicUserSelect,
    });
    return formatUserForResponse(user);
  } catch (error) {
    if (error?.code === "P2002") {
      throw new Error("User with this email or phone already exists.");
    }
    throw error;
  }
}
