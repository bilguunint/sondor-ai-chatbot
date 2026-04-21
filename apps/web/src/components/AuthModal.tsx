"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { useFirebase } from "@/contexts/FirebaseProvider";
import { SetupWizard } from "@/features/setup";
import { SignInScreen } from "@/features/auth";

/**
 * Modal wrapper that surfaces the setup or sign-in flow on demand. Used by
 * the sidebar Sign-in button so guest visitors can opt in to authentication
 * without being forced through it on first load.
 */
export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { status } = useFirebase();

  // Auto-close once the user has fully authenticated.
  useEffect(() => {
    if (open && status === "ready") onClose();
  }, [open, status, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[460px] max-h-[90vh] overflow-y-auto rounded-2xl bg-background shadow-2xl border border-border-light">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-sidebar-hover text-text-muted cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        {status === "needs-config" ? <SetupWizard /> : <SignInScreen />}
      </div>
    </div>
  );
}
