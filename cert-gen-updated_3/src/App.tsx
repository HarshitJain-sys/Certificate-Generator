import { useRef, useState } from "react";
import { Download, FileImage, Printer, ShieldCheck } from "lucide-react";
import AppHeader from "./components/AppHeader";
import CertificateForm from "./components/CertificateForm";
import CertificatePreview from "./components/CertificatePreview";
import Toast, { type ToastState } from "./components/Toast";
import { useTheme } from "./hooks/useTheme";
import { exportToPdf, exportToPng, printCertificate } from "./lib/exportUtils";
import { formDataEquals, verifyAttendance, VERIFICATION_FAILURE_MESSAGE, type AttendanceRecord } from "./lib/verification";
import type { CertificateFormData } from "./types/certificate";

const EMPTY_FORM: CertificateFormData = { fullName: "", email: "", department: "", phone: "" };

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<CertificateFormData>(EMPTY_FORM);

  // The certificate is gated entirely behind `verifiedRecord`. It is the
  // *database* record that matched, not the raw form input — the
  // certificate is always rendered from this, never from user-typed values.
  const [verifiedRecord, setVerifiedRecord] = useState<AttendanceRecord | null>(null);
  // Snapshot of the form data at the moment verification succeeded, so we
  // can detect post-verification edits and invalidate immediately.
  const [verifiedSnapshot, setVerifiedSnapshot] = useState<CertificateFormData | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const certificateRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, variant: ToastState["variant"] = "success") =>
    setToast({ message, variant });

  const invalidateVerification = () => {
    setVerifiedRecord(null);
    setVerifiedSnapshot(null);
  };

  const handleGenerate = (data: CertificateFormData) => {
    setFormData(data);

    const match = verifyAttendance(data);
    if (!match) {
      invalidateVerification();
      showToast(VERIFICATION_FAILURE_MESSAGE, "error");
      return;
    }

    setVerifiedRecord(match);
    setVerifiedSnapshot(data);
    showToast("Attendance verified — certificate generated.");
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    invalidateVerification();
  };

  // Live-typing handler: keeps the form in sync, and immediately
  // invalidates a verified certificate the moment any field is edited.
  const handleLiveChange = (data: CertificateFormData) => {
    setFormData(data);
    if (verifiedRecord && verifiedSnapshot && !formDataEquals(data, verifiedSnapshot)) {
      invalidateVerification();
    }
  };

  const withExportGuard = async (label: string, fn: () => Promise<void>) => {
    if (!certificateRef.current || !verifiedRecord) {
      showToast("Verify your attendance details first.", "error");
      return;
    }
    setIsExporting(true);
    try {
      await fn();
      showToast(`${label} ready.`);
    } catch {
      showToast(`Couldn't export ${label.toLowerCase()}. Try again.`, "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePng = () =>
    withExportGuard("PNG", () => exportToPng(certificateRef.current as HTMLDivElement, (verifiedRecord!.full_name ?? verifiedRecord!.name ?? "")));

  const handlePdf = () =>
    withExportGuard("PDF", () => exportToPdf(certificateRef.current as HTMLDivElement, (verifiedRecord!.full_name ?? verifiedRecord!.name ?? "")));

  const handlePrint = () =>
    withExportGuard("Print", () => printCertificate(certificateRef.current as HTMLDivElement));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[380px_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <CertificateForm
            defaultValues={formData}
            onLiveChange={handleLiveChange}
            onGenerate={handleGenerate}
            onReset={handleReset}
            isVerified={!!verifiedRecord}
          />
        </section>

        <section className="flex flex-col gap-4">
          {verifiedRecord ? (
            <CertificatePreview ref={certificateRef} fullName={(verifiedRecord.full_name ?? verifiedRecord.name ?? "")} />
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <ShieldCheck className="text-slate-300 dark:text-slate-600" size={28} />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please verify your attendance to access your certificate.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <ExportButton
              icon={<FileImage size={16} />}
              label="PNG"
              onClick={handlePng}
              disabled={isExporting || !verifiedRecord}
            />
            <ExportButton
              icon={<Download size={16} />}
              label="PDF"
              onClick={handlePdf}
              disabled={isExporting || !verifiedRecord}
            />
            <ExportButton
              icon={<Printer size={16} />}
              label="Print"
              onClick={handlePrint}
              disabled={isExporting || !verifiedRecord}
            />
          </div>

          {!verifiedRecord && (
            <p className="text-sm text-slate-400">
              Fill in your details exactly as recorded at the workshop and click{" "}
              <span className="font-medium">Verify &amp; generate certificate</span>. All four fields must match a
              single attendance record.
            </p>
          )}
        </section>
      </main>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function ExportButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {icon}
      {label}
    </button>
  );
}
