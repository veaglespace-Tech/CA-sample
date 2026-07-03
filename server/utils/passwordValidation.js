/**
 * passwordValidation.js  (server-side)
 * Same rules as client — single source of truth for the regex.
 *
 * Rules:
 *  - At least 1 uppercase letter  (A-Z)
 *  - At least 1 lowercase letter  (a-z)
 *  - At least 1 digit             (0-9)
 *  - At least 1 special char or _ (\W or _)
 *  - Minimum 8 characters
 */

export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])(?=.*\d).{8,}$/;

/**
 * Returns null if valid, or an error string if invalid.
 * @param {string} password
 * @returns {string|null}
 */
export function validatePassword(password) {
  if (!password || password.length === 0) return "Password is required.";
  if (password.length < 8)              return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))          return "Password must include at least one uppercase letter (A-Z).";
  if (!/[a-z]/.test(password))          return "Password must include at least one lowercase letter (a-z).";
  if (!/\d/.test(password))             return "Password must include at least one number (0-9).";
  if (!/[\W_]/.test(password))          return "Password must include at least one special character (!@#$%^&* etc.).";
  return null; // valid ✓
}
