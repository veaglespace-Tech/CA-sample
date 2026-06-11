/**
 * passwordValidation.js
 * Shared password validation used across all forms.
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

/** Returns null if valid, or an error string if invalid. */
export function validatePassword(password) {
  if (!password || password.length === 0) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Must include at least one uppercase letter (A-Z).";
  if (!/[a-z]/.test(password)) return "Must include at least one lowercase letter (a-z).";
  if (!/\d/.test(password)) return "Must include at least one number (0-9).";
  if (!/[\W_]/.test(password)) return "Must include at least one special character (!@#$%^&* etc.).";
  return null; // valid
}

/**
 * Returns a strength score 0–4 and a label.
 * 0 = too short, 1 = weak, 2 = fair, 3 = good, 4 = strong
 */
export function getPasswordStrength(password) {
  if (!password || password.length < 4) return { score: 0, label: "Too short", color: "bg-red-400" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[\W_]/.test(password)) score++;

  const levels = [
    { score: 0, label: "Too short", color: "bg-red-400" },
    { score: 1, label: "Weak",      color: "bg-red-400" },
    { score: 2, label: "Fair",      color: "bg-amber-400" },
    { score: 3, label: "Good",      color: "bg-blue-400" },
    { score: 4, label: "Strong",    color: "bg-emerald-500" },
  ];

  return levels[score];
}
