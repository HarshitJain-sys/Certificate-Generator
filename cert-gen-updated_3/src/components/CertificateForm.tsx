import { useForm } from "react-hook-form";
import type { CertificateFormData } from "../types/certificate";
import { isValidEmail, isValidIndianPhone, isValidFullName } from "../lib/validation";
import { DEPARTMENT_OPTIONS } from "../lib/departments";

interface CertificateFormProps {
  defaultValues: CertificateFormData;
  onLiveChange: (data: CertificateFormData) => void;
  onGenerate: (data: CertificateFormData) => void;
  onReset: () => void;
  isVerified: boolean;
}

export default function CertificateForm({
  defaultValues,
  onLiveChange,
  onGenerate,
  onReset,
  isVerified,
}: CertificateFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CertificateFormData>({ defaultValues, mode: "onBlur" });

  // Keep the live preview in sync on every keystroke.
  watch((values) => onLiveChange(values as CertificateFormData));

  const submit = handleSubmit((data) => onGenerate(data));

  const handleReset = () => {
    reset({ fullName: "", email: "", department: "", phone: "" });
    onReset();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Verify attendance</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your email and phone number exactly as recorded at the workshop. Both fields are checked against the
          official attendance records before your certificate is generated.
        </p>
      </div>

      <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
        <input
          id="fullName"
          type="text"
          placeholder="e.g. Harshit Sharma"
          className={inputClass(!!errors.fullName)}
          {...register("fullName", {
            required: "Full name is required",
            validate: (value) => isValidFullName(value) || "Enter a valid full name",
          })}
        />
      </Field>

      <Field label="Email ID" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          placeholder="e.g. harshit@example.com"
          className={inputClass(!!errors.email)}
          {...register("email", {
            required: "Email ID is required",
            validate: (value) => isValidEmail(value) || "Enter a valid email address",
          })}
        />
      </Field>

      <Field label="Department" htmlFor="department" error={errors.department?.message}>
        <select
          id="department"
          defaultValue=""
          className={inputClass(!!errors.department)}
          {...register("department", {
            required: "Department is required",
          })}
        >
          <option value="" disabled>
            Select department
          </option>
          {DEPARTMENT_OPTIONS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Phone number" htmlFor="phone" error={errors.phone?.message}>
        <div className="flex items-center">
          <span className="rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
            +91
          </span>
          <input
            id="phone"
            type="tel"
            placeholder="10-digit mobile number"
            className={inputClass(!!errors.phone, "rounded-l-none")}
            {...register("phone", {
              required: "Phone number is required",
              validate: (value) => isValidIndianPhone(value) || "Enter a valid Indian mobile number",
            })}
          />
        </div>
      </Field>

      <div className="mt-2 flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-[#7c93b3] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6a80a0]"
        >
          {isVerified ? "Re-verify & regenerate" : "Verify & generate certificate"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean, extra = "") {
  return [
    "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition",
    "bg-white text-slate-900 placeholder:text-slate-400",
    "dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500",
    hasError
      ? "border-red-400 focus:ring-2 focus:ring-red-200"
      : "border-slate-300 focus:border-[#7c93b3] focus:ring-2 focus:ring-[#7c93b3]/30 dark:border-slate-600",
    extra,
  ].join(" ");
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}