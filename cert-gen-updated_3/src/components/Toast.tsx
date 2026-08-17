import { useEffect } from "react";

export interface ToastState {
  message: string;
  variant: "success" | "error";
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.variant === "success";

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        role="status"
        className={[
          "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg",
          isSuccess ? "bg-emerald-600" : "bg-red-600",
        ].join(" ")}
      >
        {toast.message}
      </div>
    </div>
  );
}
