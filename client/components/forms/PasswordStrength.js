"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { getPasswordStrength, getPasswordRequirements } from "../../lib/validators";

/**
 * PasswordStrength – Visual password strength indicator and live checklist
 * Shows a colored bar, strength label, and a live validation checklist.
 */
export default function PasswordStrength({ password }) {
  const { score, label, color } = getPasswordStrength(password);
  const requirements = getPasswordRequirements(password);

  // If there's no password, we still show the requirements checklist so the user knows the rules beforehand.
  return (
    <div className="w-full mt-3 space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-sm">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-bold mb-1">
          <span className="text-slate-600">Password Strength</span>
          <span style={{ color: color || "#f43f5e" }}>{label || "None"}</span>
        </div>
        <div className="flex gap-1 h-1.5 w-full">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: level <= score ? color : "#ffe4e6",
              }}
            />
          ))}
        </div>
      </div>

      {/* Checklist */}
      <ul className="space-y-2 mt-3 pt-3 border-t border-slate-200">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={`flex items-center gap-2 text-xs font-semibold transition-colors duration-300 ${
              req.met ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {req.met ? (
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            ) : (
              <Circle size={16} className="text-rose-500 shrink-0" />
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
