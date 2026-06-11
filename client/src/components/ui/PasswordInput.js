"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getPasswordStrength, validatePassword } from "../../lib/passwordValidation";

/**
 * PasswordInput — reusable password field with:
 *  - Show/hide toggle
 *  - Live strength bar (4 segments)
 *  - Inline error message
 *
 * Props:
 *   id         — input id (required for accessibility)
 *   value      — controlled value
 *   onChange   — change handler (receives the event)
 *   placeholder
 *   required   — boolean (default true)
 *   showStrength — show strength bar (default true, set false for confirm-password)
 *   className  — extra classes on the wrapper div
 *   inputClassName — extra classes on the <input>
 *   label      — label text (optional, renders a <label> if provided)
 *   error      — external error string to show (overrides internal)
 */
export default function PasswordInput({
  id,
  value = "",
  onChange,
  placeholder = "Enter password",
  required = true,
  showStrength = true,
  className = "",
  inputClassName = "",
  label,
  error: externalError,
}) {
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  const strength = getPasswordStrength(value);
  const internalError = touched && value ? validatePassword(value) : null;
  const error = externalError ?? internalError;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      {/* Input row */}
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          required={required}
          autoComplete={showStrength ? "new-password" : "current-password"}
          className={`w-full rounded-xl border pr-11 transition-all duration-200
            ${error
              ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : value && !error && touched
                ? "border-emerald-400 bg-emerald-50/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                : "border-slate-300 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            }
            ${inputClassName}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Strength bar */}
      {showStrength && value.length > 0 && (
        <div className="mt-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((seg) => (
              <div
                key={seg}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  seg <= strength.score ? strength.color : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <p className={`mt-1 text-[0.7rem] font-bold ${
            strength.score <= 1 ? "text-red-500"
            : strength.score === 2 ? "text-amber-500"
            : strength.score === 3 ? "text-blue-500"
            : "text-emerald-600"
          }`}>
            {strength.label}
          </p>
        </div>
      )}

      {/* Error / hint */}
      {error ? (
        <p className="text-[0.72rem] font-semibold text-red-500">{error}</p>
      ) : showStrength && !touched ? (
        <p className="text-[0.7rem] text-slate-400">
          Min 8 chars · uppercase · lowercase · number · special char
        </p>
      ) : null}
    </div>
  );
}
