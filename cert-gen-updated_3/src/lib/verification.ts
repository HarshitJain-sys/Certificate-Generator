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

// Index by email once at module load. Keep all records for an email so a
// duplicate email cannot silently overwrite another attendance record.
const RECORDS_BY_EMAIL = new Map<string, AttendanceRecord[]>();
for (const record of RECORDS) {
  const email = normalizeText(record.email);
  const recordsForEmail = RECORDS_BY_EMAIL.get(email) ?? [];
  recordsForEmail.push(record);
  RECORDS_BY_EMAIL.set(email, recordsForEmail);
}

/**
 * Verifies form input against the attendance dataset. Only `email` and
 * `phone` are checked against a single record — name and department are
 * NOT part of the match. The student's typed full name is used as-is for
 * rendering the certificate; only the matched record is used to gate access.
 *
 * Returns the matched database record, or null if no record matches.
 *
 * NOTE: this project is a static, client-only app with no backend, so this
 * check runs in the browser and the dataset ships inside the client bundle.
 * That means it is a usability gate, not a real access-control boundary —
 * anyone who opens devtools can read src/data/attendance.json. Genuine
 * security (hiding the dataset, rate limiting, audit logging) requires
 * moving this check to a server.
 */
export function verifyAttendance(data: CertificateFormData): AttendanceRecord | null {
  const email = normalizeText(data.email);
  const phone = normalizeIndianPhone(data.phone);

  if (!email || !phone) return null;

  const candidates = RECORDS_BY_EMAIL.get(email) ?? [];
  const matches = candidates.filter((candidate) => normalizeIndianPhone(candidate.phone) === phone);

  return matches.length === 1 ? matches[0] : null;
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