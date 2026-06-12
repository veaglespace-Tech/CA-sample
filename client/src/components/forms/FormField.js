"use client";

import FormFeedback from "./FormFeedback";

/**
 * FormField – Reusable form field wrapper
 * Provides consistent label, input container, and error display across all forms.
 *
 * Props:
 *  - label: string (field label)
 *  - htmlFor: string (input id for a11y)
 *  - error: string|null (error message)
 *  - required: boolean (shows * next to label)
 *  - children: the actual input/select/textarea element
 *  - className: string (extra wrapper class)
 *  - hint: string (optional help text below input)
 */
export default function FormField({
  label,
  htmlFor,
  error,
  success = false,
  successMessage = "Looks good",
  required = false,
  children,
  className = "",
  hint = "",
}) {
  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="label pt-0 pb-2 px-1">
          <span className="label-text font-bold text-slate-500 text-xs uppercase tracking-wider">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </span>
        </label>
      )}
      {children}
      {hint && !error && !success && (
        <span className="text-xs font-medium text-slate-400 mt-1.5 ml-1">{hint}</span>
      )}
      <FormFeedback error={error} success={success} successMessage={successMessage} />
    </div>
  );
}
