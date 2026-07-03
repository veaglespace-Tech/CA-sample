import crypto from "crypto";

function getEnv(key, fallback = "") {
  return (process.env[key] || fallback).trim();
}

export function getPayuConfig() {
  return {
    key: getEnv("PAYU_KEY"),
    salt: getEnv("PAYU_SALT"),
    baseUrl: getEnv("PAYU_BASE_URL", "https://test.payu.in/_payment"),
    isTest: getEnv("NODE_ENV") !== "production",
  };
}

/**
 * Generate PayU hash for initiating a payment.
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
export function generatePayuHash({ key, txnid, amount, productinfo, firstname, email, udf1 = "", udf2 = "", udf3 = "", udf4 = "", udf5 = "", salt }) {
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

/**
 * Verify PayU response hash (reverse hash).
 * Formula: sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayuHash(params) {
  const { salt } = getPayuConfig();
  const {
    key, txnid, amount, productinfo, firstname, email,
    udf1 = "", udf2 = "", udf3 = "", udf4 = "", udf5 = "",
    status, hash,
  } = params;

  const reverseHashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const computedHash = crypto.createHash("sha512").update(reverseHashString).digest("hex");
  return computedHash === hash;
}

/**
 * Generate a unique transaction ID
 */
export function generateTxnId(leadId) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const prefix = leadId ? leadId.slice(-6).toUpperCase() : "VX";
  return `VX${prefix}${timestamp}${random}`.slice(0, 25);
}
