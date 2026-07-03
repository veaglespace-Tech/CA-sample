/**
 * useOtpVerification Hook
 *
 * Reusable hook for Firebase Phone Authentication with OTP.
 * Handles: reCAPTCHA setup, OTP sending, OTP verification, error handling.
 * Used by: ConsultForm (registration pages), LeadForm (contact/callback pages).
 *
 * Supports Mock Mode for development via OTP_CONFIG.MOCK_MODE.
 */

"use client";

import { useState, useCallback } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../lib/firebase";
import { OTP_CONFIG } from "../lib/otp-config";

export default function useOtpVerification() {
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const setupRecaptcha = useCallback((containerId) => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified"),
          "expired-callback": () => {
            window.recaptchaVerifier?.clear();
            window.recaptchaVerifier = null;
          },
        });
      }
    } catch (err) {
      console.warn("reCAPTCHA setup failed:", err.message);
    }
  }, []);

  const sendOtp = useCallback(async (phoneNumber, recaptchaContainerId = "recaptcha-container") => {
    setOtpLoading(true);
    setOtpError("");

    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      setOtpLoading(false);
      return false;
    }

    // Mock Mode: simulate OTP sending
    if (OTP_CONFIG.MOCK_MODE) {
      console.log(`[OTP Mock] Simulating send to ${phoneNumber}`);
      await new Promise((r) => setTimeout(r, OTP_CONFIG.MOCK_DELAY_MS));
      setShowOtp(true);
      setOtpLoading(false);
      return true;
    }

    // Real Firebase OTP
    try {
      setupRecaptcha(recaptchaContainerId);
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `${OTP_CONFIG.COUNTRY_CODE}${phoneNumber}`;

      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setShowOtp(true);
      setOtpLoading(false);
      return true;
    } catch (err) {
      console.error("[OTP] Send failed:", err);
      const friendlyMessage = getErrorMessage(err);
      setOtpError(friendlyMessage);
      setOtpLoading(false);

      // Clean up reCAPTCHA on failure
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (_) {}
        window.recaptchaVerifier = null;
      }
      return false;
    }
  }, [setupRecaptcha]);

  const verifyOtp = useCallback(async (otpCode) => {
    setOtpLoading(true);

    try {
      // Mock Mode: accept any 6-digit code
      if (OTP_CONFIG.MOCK_MODE) {
        console.log(`[OTP Mock] Verifying code: ${otpCode}`);
        await new Promise((r) => setTimeout(r, OTP_CONFIG.VERIFY_DELAY_MS));
        setShowOtp(false);
        setOtpLoading(false);
        return true;
      }

      // Real Firebase verification
      await confirmationResult.confirm(otpCode);
      setShowOtp(false);
      setOtpLoading(false);
      return true;
    } catch (err) {
      console.error("[OTP] Verification failed:", err);
      setOtpError("Invalid OTP. Please check the code and try again.");
      setOtpLoading(false);
      return false;
    }
  }, [confirmationResult]);

  const closeOtp = useCallback(() => {
    setShowOtp(false);
    setOtpError("");
  }, []);

  return {
    showOtp,
    otpLoading,
    otpError,
    sendOtp,
    verifyOtp,
    closeOtp,
  };
}

/**
 * Translates Firebase error codes into user-friendly messages.
 */
function getErrorMessage(err) {
  const code = err.code || "";
  const msg = err.message || "";

  if (code === "auth/invalid-phone-number" || msg.includes("invalid-phone-number")) {
    return "Invalid phone number. Please enter a valid 10-digit number.";
  }
  if (code === "auth/too-many-requests" || msg.includes("too-many-requests")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  if (code === "auth/billing-not-enabled" || msg.includes("billing")) {
    return "SMS service is temporarily unavailable. Please try again later.";
  }
  if (code === "auth/captcha-check-failed" || msg.includes("captcha")) {
    return "Security check failed. Please refresh the page and try again.";
  }
  if (msg.includes("api-key")) {
    return "Service configuration error. Please contact support.";
  }

  return msg || "Failed to send OTP. Please try again.";
}
