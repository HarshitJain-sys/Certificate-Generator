// Indian mobile numbers: 10 digits, starting 6-9. Accepts optional +91 / 0 prefix
// and common separators, which are stripped before validation.
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeIndianPhone(raw: string): string {
  let digits = raw.replace(/[\s\-()]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return digits;
}

export function isValidIndianPhone(raw: string): boolean {
  const digits = normalizeIndianPhone(raw);
  return INDIAN_PHONE_REGEX.test(digits);
}

export function isValidEmail(raw: string): boolean {
  return EMAIL_REGEX.test(raw.trim());
}

export function isValidFullName(raw: string): boolean {
  const trimmed = raw.trim();
  return trimmed.length >= 2 && /^[A-Za-z][A-Za-z.'\- ]*$/.test(trimmed);
}

export function isValidDepartment(raw: string): boolean {
  return raw.trim().length >= 2;
}
