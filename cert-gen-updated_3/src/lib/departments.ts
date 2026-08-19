import attendanceData from "../data/attendance.json";

interface AttendanceRow {
  department?: string;
}

// Maps known raw-data variants to a single canonical display label.
// Add more entries here as you spot new inconsistent spellings in the data.
const CANONICAL_DEPARTMENTS: Record<string, string> = {
  "cse": "CSE",
  "cs": "CSE",
  "aiml": "AIML",
  "cyber security": "Cybersecurity",
  "cybersecurity": "Cybersecurity",
  "electronics": "Electronics",
  "electronics eng": "Electronics",
  "mechanical": "Mechanical",
};

function canonicalize(raw: string): string {
  const key = raw.trim().toLowerCase();
  return CANONICAL_DEPARTMENTS[key] ?? raw.trim();
}

export const DEPARTMENT_OPTIONS: string[] = Array.from(
  new Set(
    (attendanceData as AttendanceRow[])
      .map((row) => row.department ?? "")
      .filter(Boolean)
      .map(canonicalize),
  ),
).sort((a, b) => a.localeCompare(b));
