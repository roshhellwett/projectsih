/**
 * SAHYOG Portal — Citizen Data Privacy & PII Masking Utilities
 * Compliance: Digital Personal Data Protection Act (DPDPA) 2023
 * Government of Jharkhand · Directorate of Higher & Technical Education
 */

/**
 * Masks a 10-digit Indian phone number: e.g. "9876543210" -> "+91 98*** **210"
 */
export function maskPhone(phone) {
  if (!phone) return "";
  const cleaned = String(phone).replace(/\D/g, "");
  if (cleaned.length < 10) return "******";
  const last10 = cleaned.slice(-10);
  return `+91 ${last10.slice(0, 2)}*** **${last10.slice(-3)}`;
}

/**
 * Masks an email address: e.g. "priya.devi@gov.in" -> "pr***@gov.in"
 */
export function maskEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) return "";
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }
  return `${local.slice(0, 2)}***@${domain}`;
}

/**
 * Masks an Aadhaar or National ID number: e.g. "123456789012" -> "XXXX-XXXX-9012"
 */
export function maskAadhaar(id) {
  if (!id) return "";
  const cleaned = String(id).replace(/\D/g, "");
  if (cleaned.length < 4) return "XXXX-XXXX-XXXX";
  return `XXXX-XXXX-${cleaned.slice(-4)}`;
}

/**
 * Sanitizes user-submitted plain text to prevent XSS and tag injection
 */
export function sanitizeText(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}
