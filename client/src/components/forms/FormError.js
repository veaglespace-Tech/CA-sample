"use client";

/**
 * FormError – Consistent inline validation error message
 * Used across all forms for uniform error display.
 */
export default function FormError({ message, className = "" }) {
  if (!message) return null;

  return (
    <span
      className={`vx-form-error ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </span>
  );
}
0
