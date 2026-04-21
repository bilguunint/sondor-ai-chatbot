"use client";

import { useState } from "react";
import { LogOut, RefreshCw, Sparkles } from "lucide-react";

import { useFirebase } from "@/contexts/FirebaseProvider";

export default function SignInScreen() {
  const { signInWithGoogle, resetConfig, config, configSource, error } = useFirebase();
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setBusy(true);
    setLocalError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  const errorMessage = localError ?? error;

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[420px] rounded-2xl border border-border-light bg-card p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-primary-500/15 text-primary-500 mb-5">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-[20px] font-bold text-text-primary mb-1">Sign in to Sondor</h1>
        <p className="text-[13px] text-text-secondary mb-6">
          You&apos;re connected to Firebase project{" "}
          <span className="font-mono text-text-primary">{config?.projectId ?? "—"}</span>.
          Sign in to start chatting.
        </p>

        <button
          type="button"
          onClick={handleSignIn}
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border-light bg-input-bg text-text-primary text-[14px] font-medium hover:bg-hover-bg disabled:opacity-60 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
        >
          <GoogleIcon className="w-5 h-5" />
          {busy ? "Opening Google…" : "Continue with Google"}
        </button>

        {errorMessage && (
          <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12.5px] text-rose-500 text-left">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between text-[12px] text-text-muted">
          {configSource === "env" ? (
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Configured via environment variables
            </span>
          ) : (
            <button
              type="button"
              onClick={resetConfig}
              className="inline-flex items-center gap-1.5 hover:text-text-primary cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Use a different Firebase project
            </button>
          )}
          <span className="inline-flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Stays in your browser
          </span>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.8 0 19.5-8.7 19.5-19.5 0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.7 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 16.5 4.5 10 8.7 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-1.9 13.2-5l-6.1-5.2c-2 1.5-4.5 2.4-7.1 2.4-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.9 39.2 16.4 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.1 5.2c-.4.4 6.7-4.9 6.7-14.6 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
