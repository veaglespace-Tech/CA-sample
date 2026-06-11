/**
 * OTP Configuration
 *
 * Central configuration for OTP verification flows.
 * Toggle MOCK_MODE for development without SMS provider.
 */

export const OTP_CONFIG = {
  /** Number of OTP digits */
  OTP_LENGTH: 6,

  /** Cooldown seconds before user can request a resend */
  RESEND_COOLDOWN_SECONDS: 30,

  /** Country code prefix for phone numbers */
  COUNTRY_CODE: "+91",

  /** Enable mock mode for development (no real SMS sent) */
  MOCK_MODE: process.env.NEXT_PUBLIC_OTP_MOCK === "true",

  /** Mock OTP code accepted in development */
  MOCK_OTP: "123456",

  /** Simulated delay for mock OTP request (ms) */
  MOCK_DELAY_MS: 800,

  /** Simulated delay for mock OTP verification (ms) */
  VERIFY_DELAY_MS: 600,
};
