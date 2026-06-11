/**
 * OtpModal Component
 *
 * A professional 6-digit OTP verification modal with:
 * - Auto-focus navigation between input fields
 * - Countdown-based resend logic
 * - Backspace navigation support
 * - Auto-submit when all digits are entered
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { X, Shield } from "lucide-react";
import { OTP_CONFIG } from "../../lib/otp-config";

export default function OtpModal({ phone, onVerify, onResend, onClose }) {
  const [otp, setOtp] = useState(Array(OTP_CONFIG.OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(OTP_CONFIG.RESEND_COOLDOWN_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const inputs = useRef([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  // Handle digit input
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_CONFIG.OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (newOtp.every((digit) => digit !== "")) {
      setVerifying(true);
      onVerify(newOtp.join(""));
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_CONFIG.OTP_LENGTH);
    if (pasted.length === OTP_CONFIG.OTP_LENGTH) {
      const digits = pasted.split("");
      setOtp(digits);
      setVerifying(true);
      onVerify(digits.join(""));
    }
  };

  // Handle resend
  const handleResend = () => {
    setTimer(OTP_CONFIG.RESEND_COOLDOWN_SECONDS);
    setOtp(Array(OTP_CONFIG.OTP_LENGTH).fill(""));
    setVerifying(false);
    onResend();
  };

  return (
    <div className="otp-overlay" id="otp-modal">
      <div className="otp-modal">
        <button
          className="otp-close-btn"
          onClick={onClose}
          aria-label="Close OTP modal"
        >
          <X size={22} />
        </button>

        <div className="otp-header">
          <Shield size={32} color="var(--navy, #001A3D)" />
          <h2>Verify Your Number</h2>
          <p>
            Enter the 6-digit code sent to <strong>{phone}</strong>
          </p>
        </div>

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              className={`otp-input ${digit ? "filled" : ""}`}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              maxLength={1}
              autoFocus={i === 0}
              disabled={verifying}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {verifying && (
          <p className="otp-verifying">Verifying...</p>
        )}

        <button
          className="otp-resend"
          disabled={timer > 0 || verifying}
          onClick={handleResend}
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

