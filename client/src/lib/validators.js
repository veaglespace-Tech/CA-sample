/**
 * Form Validation Utilities for Veagle Space Technology Pvt. Ltd.
 *
 * Central validation library used by every client-side form.
 * Each validator returns a string error message or null if valid.
 */

// ── Regular Expressions ──────────────────────────────────────────────
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^\+?[0-9]{10,15}$/; // Mobile: 10 to 15 digits with optional +
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const PINCODE_REGEX = /^\d{6}$/;
export const URL_REGEX = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/;
export const NAME_REGEX = /^[a-zA-Z\s.'\-]+$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const GSTIN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/;

// ── Indian States List ───────────────────────────────────────────────
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

// ── Core Validators ─────────────────────────────────────────────────

/**
 * Validate full name
 * @param {string} name
 * @returns {string|null} Error message or null if valid
 */
export const validateName = (name) => {
  if (!name || !name.trim()) return "Required";
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Min 2 characters";
  if (trimmed.length > 50) return "Max 50 characters";
  if (!NAME_REGEX.test(trimmed)) {
    return "Invalid characters";
  }
  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) {
    return "Must contain letter";
  }
  return null;
};

/**
 * Validate email address
 * @param {string} email
 * @param {boolean} isOptional
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email, isOptional = false) => {
  if (!email || !email.trim()) {
    return isOptional ? null : "Required";
  }
  const emailStr = email.trim().toLowerCase();

  if (emailStr.length > 254) {
    return "Too long";
  }

  if (/\s/.test(emailStr)) {
    return "No spaces allowed";
  }

  if (!EMAIL_REGEX.test(emailStr)) {
    return "Invalid email";
  }

  // Check for common domain typos
  const typoChecks = [
    { bad: "@gmail.co", hint: "Did you mean @gmail.com?" },
    { bad: "@yahoo.co", hint: "Did you mean @yahoo.com?" },
    { bad: "@hotmail.co", hint: "Did you mean @hotmail.com?" },
    { bad: "@gmial.com", hint: "Did you mean @gmail.com?" },
    { bad: "@gmal.com", hint: "Did you mean @gmail.com?" },
    { bad: "@yaho.com", hint: "Did you mean @yahoo.com?" },
    { bad: "@outloo.com", hint: "Did you mean @outlook.com?" },
  ];
  for (const check of typoChecks) {
    if (emailStr.endsWith(check.bad)) return check.hint;
  }

  // Prevent gibberish after common domains (like @gmail.comsjndkj)
  if (/@(gmail|yahoo|hotmail|outlook)\.com[a-zA-Z0-9]+/.test(emailStr)) {
    return "Invalid domain";
  }

  // Catch overly long TLDs
  const tld = emailStr.split('.').pop();
  if (tld && tld.length > 15) {
    return "Invalid domain";
  }

  // Block disposable email domains
  const disposable = ["mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email", "yopmail.com"];
  const domain = emailStr.split("@")[1];
  if (disposable.includes(domain)) {
    return "Disposable email not allowed";
  }

  return null;
};

/**
 * Validate phone number (Indian)
 * @param {string} phone
 * @param {boolean} isOptional
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (phone, isOptional = false) => {
  if (!phone || !phone.trim()) {
    return isOptional ? null : "Required";
  }
  // The phone input component will now handle country code. We just ensure 10 digits min for India or validate whatever string length.
  // We'll update PHONE_REGEX if needed, or simply check length.
  const cleanPhone = phone.trim().replace(/[\s\-()]/g, "");

  // If using react-phone-input-2, it provides the phone string. We can be lenient here since the component handles formatting.
  if (cleanPhone.length < 5) {
    return "Invalid phone";
  }

  return null;
};

/**
 * Validate password with strength rules
 * @param {string} password
 * @param {boolean} isOptional
 * @param {number} minLength
 * @param {boolean} requireStrength - If true, enforce uppercase, lowercase, digit, special char
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password, isOptional = false, minLength = 8, requireStrength = false) => {
  if (isOptional && !password) return null;
  if (!password) return "Password is required";
  if (password.length > 128) return "Password cannot exceed 128 characters";

  const missing = [];

  if (password.length < minLength) missing.push(`at least ${minLength} characters`);

  if (requireStrength) {
    if (!/[A-Z]/.test(password)) missing.push("an uppercase letter");
    if (!/[a-z]/.test(password)) missing.push("a lowercase letter");
    if (!/\d/.test(password)) missing.push("a number");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) missing.push("a special symbol");
  }

  if (missing.length > 0) {
    if (missing.length === 1) return `Password must include ${missing[0]}`;
    const last = missing.pop();
    return `Password must include ${missing.join(", ")} and ${last}`;
  }

  // Check for common weak passwords
  const weakPasswords = ["password", "12345678", "qwerty12", "abcdefgh", "password1"];
  if (weakPasswords.includes(password.toLowerCase())) {
    return "This password is too common. Please choose a stronger password";
  }

  return null;
};

/**
 * Get detailed password requirements and their met status
 * @param {string} password
 * @returns {Array<{label: string, met: boolean}>}
 */
export const getPasswordRequirements = (password) => {
  const pwd = password || "";
  return [
    { label: "8+ characters", met: pwd.length >= 8 },
    { label: "1 uppercase letter", met: /[A-Z]/.test(pwd) },
    { label: "1 lowercase letter", met: /[a-z]/.test(pwd) },
    { label: "1 number", met: /\d/.test(pwd) },
    { label: "1 special character", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd) },
  ];
};

/**
 * Get password strength score (0-5) for visual indicators
 * @param {string} password
 * @returns {{ score: number, label: string, color: string }}
 */
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  const reqs = getPasswordRequirements(password);
  const score = reqs.filter(r => r.met).length;

  const levels = [
    { score: 0, label: "", color: "" },
    { score: 1, label: "Very Weak", color: "#ef4444" },
    { score: 2, label: "Weak", color: "#f97316" },
    { score: 3, label: "Fair", color: "#eab308" },
    { score: 4, label: "Good", color: "#84cc16" },
    { score: 5, label: "Strong", color: "#22c55e" },
  ];

  return levels[score];
};

/**
 * Validate PIN Code (Indian 6-digit)
 * @param {string} pincode
 * @returns {string|null} Error message or null if valid
 */
export const validatePinCode = (pincode) => {
  if (!pincode || !pincode.trim()) return "Required";
  const clean = pincode.trim();
  if (!/^\d+$/.test(clean)) return "Digits only";
  if (!PINCODE_REGEX.test(clean)) return "Invalid PIN Code";
  // Indian pin codes start with 1-9
  if (clean.startsWith("0")) return "Cannot start with 0";
  return null;
};

/**
 * Validate URL Slug
 * @param {string} slug
 * @returns {string|null} Error message or null if valid
 */
export const validateSlug = (slug) => {
  if (!slug || !slug.trim()) return "Required";
  if (!SLUG_REGEX.test(slug.trim())) return "Invalid format";
  return null;
};

/**
 * Validate URL
 * @param {string} url
 * @param {boolean} isOptional
 * @returns {string|null} Error message or null if valid
 */
export const validateUrl = (url, isOptional = true) => {
  if (isOptional && !url) return null;
  if (!url || !url.trim()) return "Required";
  if (!URL_REGEX.test(url.trim())) return "Invalid URL";
  return null;
};

/**
 * Validate generic required field
 * @param {string} value
 * @param {string} fieldName
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `Required`;
  }
  return null;
};

// ── New Validators ──────────────────────────────────────────────────

/**
 * Validate business/company name (optional field)
 * @param {string} name
 * @param {boolean} isOptional
 * @returns {string|null}
 */
export const validateBusinessName = (name, isOptional = true) => {
  if (!name || !name.trim()) {
    return isOptional ? null : "Required";
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Min 2 chars";
  if (trimmed.length > 100) return "Max 100 chars";
  // Allow letters, numbers, spaces, &, -, ., ', ()
  if (!/^[a-zA-Z0-9\s&\-.'()]+$/.test(trimmed)) {
    return "Invalid characters";
  }
  return null;
};

/**
 * Validate city name
 * @param {string} city
 * @returns {string|null}
 */
export const validateCity = (city, isRequired = true) => {
  if (!city || !city.trim()) return isRequired ? "Required" : null;
  const trimmed = city.trim();
  if (trimmed.length < 2) return "Min 2 chars";
  if (trimmed.length > 50) return "Max 50 chars";
  if (!/^[a-zA-Z\s\-.]+$/.test(trimmed)) {
    return "Invalid characters";
  }
  return null;
};

/**
 * Validate state (from Indian states list)
 * @param {string} state
 * @returns {string|null}
 */
export const validateState = (state, isRequired = true) => {
  if (!state || !state.trim()) return isRequired ? "Required" : null;
  if (!INDIAN_STATES.includes(state.trim())) {
    return "Invalid state";
  }
  return null;
};

/**
 * Validate address
 * @param {string} address
 * @param {number} minLength
 * @returns {string|null}
 */
export const validateAddress = (address, minLength = 10) => {
  if (!address || !address.trim()) return "Required";
  const trimmed = address.trim();
  if (trimmed.length < minLength) return `Min ${minLength} chars`;
  if (trimmed.length > 300) return "Max 300 chars";
  return null;
};

/**
 * Validate message / requirements (optional with max length)
 * @param {string} message
 * @param {boolean} isOptional
 * @param {number} maxLength
 * @returns {string|null}
 */
export const validateMessage = (message, isOptional = true, maxLength = 1000) => {
  if (!message || !message.trim()) {
    return isOptional ? null : "Required";
  }
  if (message.trim().length > maxLength) {
    return `Max ${maxLength} chars`;
  }
  return null;
};

/**
 * Validate PAN number
 * @param {string} pan
 * @param {boolean} isOptional
 * @returns {string|null}
 */
export const validatePan = (pan, isOptional = true) => {
  if (!pan || !pan.trim()) return isOptional ? null : "Required";
  if (!PAN_REGEX.test(pan.trim().toUpperCase())) {
    return "Invalid PAN";
  }
  return null;
};

/**
 * Validate GSTIN
 * @param {string} gstin
 * @param {boolean} isOptional
 * @returns {string|null}
 */
export const validateGstin = (gstin, isOptional = true) => {
  if (!gstin || !gstin.trim()) return isOptional ? null : "Required";
  if (!GSTIN_REGEX.test(gstin.trim().toUpperCase())) {
    return "Invalid GSTIN";
  }
  return null;
};

/**
 * Run multiple validations and collect errors
 * @param {Array<[string, string|null]>} validations - Array of [fieldName, errorMessage] pairs
 * @returns {Object} errors object (empty if all valid)
 */
export const collectErrors = (validations) => {
  const errors = {};
  for (const [field, error] of validations) {
    if (error) errors[field] = error;
  }
  return errors;
};
