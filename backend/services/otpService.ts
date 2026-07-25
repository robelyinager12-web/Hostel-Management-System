/**
 * Generates a 6-digit numeric OTP code used for email verification.
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}