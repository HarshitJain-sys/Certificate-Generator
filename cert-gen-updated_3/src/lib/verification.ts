import attendanceData from "../data/attendance.json";
import { normalizeIndianPhone } from "./validation";
import type { CertificateFormData } from "../types/certificate";

export interface AttendanceRecord {
  full_name?: string;
  name?: string;
  email: string;
  phone: string;
  department: string;
}

const RECORDS = attendanceData as AttendanceRecord[];

export const VERIFICATION_FAILURE_MESSAGE =
  "Attendance record not found. You are not eligible to download this certificate.";

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

// Index the dataset by normalized email once at module load. Email is the
// most selective field, so this turns lookup from an O(n) scan into an O(1)
// map hit, with the remaining three fields checked only against that one
// candidate record instead of every record in the dataset.
const RECORDS_BY_EMAIL = new Map<string, AttendanceRecord>(
  RECORDS.map((record) => [normalizeText(record.email), record]),
);

/**
 * Verifies form input against the attendance dataset. All four fields
 * (full name, email, phone, department) must match a single record,
 * compared case-insensitively with whitespace trimmed and phone numbers
 * normalized (spaces/hyphens/country code stripped).
 *
 * Returns the matched database record — the source of truth for what gets
 * printed on the certificate — or null if no record matches.
 *
 * NOTE: this project is a static, client-only app with no backend, so this
 * check runs in the browser and the dataset ships inside the client bundle.
 * That means it is a usability gate, not a real access-control boundary —
 * anyone who opens devtools can read src/data/attendance.json. Genuine
 * security (hiding the dataset, rate limiting, audit logging) requires
 * moving this check to a server.
 */
export function verifyAttendance(data: CertificateFormData): AttendanceRecord | null {
  const name = normalizeText(data.fullName);
  const email = normalizeText(data.email);
  const phone = normalizeIndianPhone(data.phone);
  const department = normalizeText(data.department);

  if (!name || !email || !phone || !department) return null;

  const candidate = RECORDS_BY_EMAIL.get(email);
  if (!candidate) return null;

  const isMatch =
    normalizeText((candidate.full_name ?? candidate.name ?? "")) === name &&
    normalizeIndianPhone(candidate.phone) === phone &&
    normalizeText(candidate.department) === department;

  return isMatch ? candidate : null;
}

/** True if two form snapshots are identical field-for-field (used to detect
 * post-verification edits that should invalidate the verified state). */
export function formDataEquals(a: CertificateFormData, b: CertificateFormData): boolean {
  return (
    a.fullName.trim() === b.fullName.trim() &&
    a.email.trim() === b.email.trim() &&
    a.phone.trim() === b.phone.trim() &&
    a.department.trim() === b.department.trim()
  );
}
