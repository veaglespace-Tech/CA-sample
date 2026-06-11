/**
 * Server-side Validation Middleware
 *
 * Validates incoming request bodies before they reach controllers.
 * Mirrors client-side validators.js rules for defense-in-depth.
 */

import { badRequest } from "../utils/core.js";

// ── Regex Patterns ──
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const NAME_REGEX = /^[a-zA-Z\s.'\-]+$/;
const PINCODE_REGEX = /^\d{6}$/;

// ── Validator Functions ──

function validateName(value, label = "Full name") {
  if (!value || !String(value).trim()) return `${label} is required`;
  const trimmed = String(value).trim();
  if (trimmed.length < 2) return `${label} must be at least 2 characters`;
  if (trimmed.length > 50) return `${label} cannot exceed 50 characters`;
  // Removed regex validation as requested by user
  return null;
}

function validateEmail(value, required = true) {
  if (!value || !String(value).trim()) return required ? "Email is required" : null;
  const email = String(value).trim().toLowerCase();
  if (email.length > 254) return "Email is too long";
  if (/\s/.test(email)) return "Email address cannot contain spaces";
  if (!EMAIL_REGEX.test(email)) return "Invalid email format";
  return null;
}

function validatePhone(value, required = true) {
  if (!value || !String(value).trim()) return required ? "Phone number is required" : null;
  const clean = String(value).trim().replace(/[\s\-()]/g, "");
  if (!PHONE_REGEX.test(clean)) return "Invalid mobile number (must include country code if outside India)";
  return null;
}

function validatePinCode(value) {
  if (!value || !String(value).trim()) return "PIN Code is required";
  const clean = String(value).trim();
  if (!PINCODE_REGEX.test(clean)) return "Invalid 6-digit PIN Code";
  if (clean.startsWith("0")) return "PIN Code cannot start with 0";
  return null;
}

function validatePassword(value, minLength = 8) {
  if (!value) return "Password is required";
  if (String(value).length < minLength) return `Password must be at least ${minLength} characters`;
  if (String(value).length > 128) return "Password is too long";
  return null;
}

function validateMaxLength(value, maxLen, label) {
  if (value && String(value).trim().length > maxLen) {
    return `${label} cannot exceed ${maxLen} characters`;
  }
  return null;
}

// ── Collect Errors Utility ──
function collectErrors(checks) {
  const errors = {};
  for (const [field, error] of checks) {
    if (error) errors[field] = error;
  }
  return errors;
}

// ═══════════════════════════════════════════════════
// Middleware Factory — validates req.body and returns
// 400 with detailed field errors on failure.
// ═══════════════════════════════════════════════════

/**
 * Validate lead/contact/consult form submissions
 * Fields: fullName (required), phone (required), email (required), message (optional, max 1000)
 */
export function validateLeadBody(req, res, next) {
  const body = req.body || {};

  const errors = collectErrors([
    ["fullName", validateName(body.fullName || body.name)],
    ["phone", validatePhone(body.phone || body.mobile)],
    ["email", validateEmail(body.email)],
    ["message", validateMaxLength(body.message, 1000, "Message")],
  ]);

  if (Object.keys(errors).length > 0) {
    return badRequest(res, "Validation failed", errors);
  }
  next();
}

/**
 * Validate talk-to-expert form submissions
 * Fields: fullName, phone, email, language (required via metadata)
 */
export function validateExpertBody(req, res, next) {
  const body = req.body || {};

  const errors = collectErrors([
    ["fullName", validateName(body.fullName || body.name)],
    ["phone", validatePhone(body.phone || body.mobile)],
    ["email", validateEmail(body.email)],
    ["message", validateMaxLength(body.message, 1000, "Message")],
  ]);

  if (Object.keys(errors).length > 0) {
    return badRequest(res, "Validation failed", errors);
  }
  next();
}

/**
 * Validate registration form submissions
 * Fields: fullName, phone, email
 */
export function validateRegistrationBody(req, res, next) {
  const body = req.body || {};

  const errors = collectErrors([
    ["fullName", validateName(body.fullName || body.name)],
    ["phone", validatePhone(body.phone || body.mobile)],
    ["email", validateEmail(body.email)],
  ]);

  if (Object.keys(errors).length > 0) {
    return badRequest(res, "Validation failed", errors);
  }
  next();
}

/**
 * Validate registration next-step form (business details)
 * Fields: city, state, pinCode, address, natureOfBusiness
 */
export function validateNextStepBody(req, res, next) {
  const body = req.body || {};

  const checks = [
    ["address", body.address && String(body.address).trim().length < 10 ? "Address must be at least 10 characters" : null],
    ["pinCode", body.pinCode ? validatePinCode(body.pinCode) : null],
    ["message", validateMaxLength(body.message, 1000, "Message")],
  ];

  const errors = collectErrors(checks);

  if (Object.keys(errors).length > 0) {
    return badRequest(res, "Validation failed", errors);
  }
  next();
}

/**
 * Validate auth registration
 * Fields: name, email, password, phone (optional)
 */
export function validateAuthRegisterBody(req, res, next) {
  const body = req.body || {};

  const errors = collectErrors([
    ["name", validateName(body.name)],
    ["email", validateEmail(body.email)],
    ["password", validatePassword(body.password, 8)],
    ["phone", validatePhone(body.phone, false)],
  ]);

  if (Object.keys(errors).length > 0) {
    return badRequest(res, "Validation failed", errors);
  }
  next();
}

/**
 * Validate auth login
 * Fields: email, password
 */
export function validateAuthLoginBody(req, res, next) {
  const body = req.body || {};

  const errors = collectErrors([
    ["email", validateEmail(body.email)],
    ["password", body.password ? null : "Password is required"],
  ]);

  if (Object.keys(errors).length > 0) {
    return badRequest(res, "Validation failed", errors);
  }
  next();
}

/**
 * Validate newsletter subscription
 * Fields: email
 */
export function validateNewsletterBody(req, res, next) {
  const body = req.body || {};

  const emailErr = validateEmail(body.email);
  if (emailErr) {
    return badRequest(res, emailErr);
  }
  next();
}
