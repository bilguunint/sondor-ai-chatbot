"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { useFirebase } from "@/contexts/FirebaseProvider";
import { SetupWizard } from "@/features/setup";
import { SignInScreen } from "@/features/auth";

/**
 * Renders the appropriate boot screen based on Firebase status:
 *   - loading       → spinner
 *   - needs-config  → SetupWizard
 *   - needs-auth    → SignInScreen
 *   - ready         → children (the actual app)
 *   - error         → error screen with retry / reset
 */
export default function AuthGate({ children }: { children: ReactNode }) {
  const { status, error, resetConfig } = useFirebase();

  if (status === "loading") {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-background text-text-secondary">
        <div className="flex items-center gap-2 text-[13px]">
          <Loader2 className="w-4 h-4 animate-spin" /> Connecting to Firebase…
        </div>
      </main>
    );
  }

  if (status === "needs-config") return <SetupWizard />;
  if (status === "needs-auth") return <SignInScreen />;

  if (status === "error") {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-background px-4">
        <div className="max-w-[420px] w-full rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
          <TriangleAlert className="w-8 h-8 text-rose-500 mx-auto mb-3" />
          <h1 className="text-[16px] font-semibold text-text-primary mb-1">
            Firebase initialisation failed
          </h1>
          <p className="text-[13px] text-text-secondary mb-4 break-words">{error}</p>
          <button
            type="button"
            onClick={resetConfig}
            className="px-4 py-2 rounded-lg bg-primary-500 text-white text-[13px] font-medium hover:bg-primary-600 cursor-pointer transition-colors"
          >
            Reconfigure
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
