"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "info" | "warning";
type Toast = { id: number; type: ToastType; title: string; description?: string };

type ToastContextValue = {
  toast: (title: string, options?: { type?: ToastType; description?: string }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>((title, options) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, type: options?.type ?? "info", title, description: options?.description }]);
    setTimeout(() => dismiss(id), 2800);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "warning" ? AlertTriangle : Info;
  const iconColor =
    toast.type === "success" ? "text-emerald-500" : toast.type === "warning" ? "text-amber-500" : "text-primary-500";

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 min-w-[260px] max-w-[340px] rounded-xl border border-border-light bg-card shadow-lg px-4 py-3 transition-all duration-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-text-primary">{toast.title}</p>
        {toast.description && (
          <p className="text-[11.5px] text-text-muted mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded-md hover:bg-hover-bg text-text-muted shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
