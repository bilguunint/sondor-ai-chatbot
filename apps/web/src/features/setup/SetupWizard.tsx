"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ClipboardPaste, Download, Flame, ShieldCheck, Sparkles } from "lucide-react";

import { useFirebase } from "@/contexts/FirebaseProvider";
import {
  configToEnvFile,
  isValidFirebaseConfig,
  parseFirebaseConfigInput,
  type FirebaseUserConfig,
} from "@/lib/firebase/config";

const PLACEHOLDER = `// Paste the snippet from
// Firebase Console → Project settings → Your apps → SDK setup & config
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};`;

const FIELD_LABELS: { key: keyof FirebaseUserConfig; label: string; required?: boolean }[] = [
  { key: "apiKey", label: "apiKey", required: true },
  { key: "authDomain", label: "authDomain", required: true },
  { key: "projectId", label: "projectId", required: true },
  { key: "storageBucket", label: "storageBucket", required: true },
  { key: "messagingSenderId", label: "messagingSenderId", required: true },
  { key: "appId", label: "appId", required: true },
  { key: "measurementId", label: "measurementId (optional)" },
];

type Mode = "paste" | "fields";

export default function SetupWizard() {
  const { setConfig, error: providerError, status } = useFirebase();
  const [mode, setMode] = useState<Mode>("paste");
  const [pasteValue, setPasteValue] = useState("");
  const [fields, setFields] = useState<FirebaseUserConfig>({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const parsedFromPaste = useMemo(
    () => (mode === "paste" ? parseFirebaseConfigInput(pasteValue) : null),
    [mode, pasteValue],
  );

  const candidate: FirebaseUserConfig | null =
    mode === "paste" ? parsedFromPaste : isValidFirebaseConfig(fields) ? fields : null;

  const canSubmit = !!candidate && !submitting;

  const handleSubmit = async () => {
    if (!candidate) {
      setLocalError("Please provide a complete Firebase config.");
      return;
    }
    setLocalError(null);
    setSubmitting(true);
    const ok = await setConfig(candidate);
    setSubmitting(false);
    if (!ok) {
      setLocalError(providerError ?? "Could not initialise Firebase. Double-check the values.");
    }
  };

  const errorMessage = localError ?? providerError;

  const handleDownloadEnv = () => {
    if (!candidate) return;
    const blob = new Blob([configToEnvFile(candidate)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".env.local";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[640px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-500/15 text-primary-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-text-primary">Connect your Firebase project</h1>
            <p className="text-[13px] text-text-secondary">
              Sondor stores your chats, files, and account in <em>your</em> Firebase project — never ours.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border-light bg-card p-5 space-y-5">
          {/* Mode switch */}
          <div className="inline-flex rounded-lg border border-border-light p-1 bg-input-bg">
            <button
              type="button"
              onClick={() => setMode("paste")}
              className={`px-3 py-1.5 text-[13px] rounded-md cursor-pointer transition-colors ${
                mode === "paste"
                  ? "bg-primary-500 text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Paste snippet
            </button>
            <button
              type="button"
              onClick={() => setMode("fields")}
              className={`px-3 py-1.5 text-[13px] rounded-md cursor-pointer transition-colors ${
                mode === "fields"
                  ? "bg-primary-500 text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Field by field
            </button>
          </div>

          {mode === "paste" ? (
            <div>
              <label className="block text-[12px] font-medium text-text-muted mb-2">
                Paste the <code className="text-text-primary">firebaseConfig</code> object
              </label>
              <textarea
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                placeholder={PLACEHOLDER}
                rows={10}
                className="w-full font-mono text-[12px] leading-relaxed rounded-xl border border-border-light bg-input-bg p-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                spellCheck={false}
              />
              <div className="mt-2 flex items-center gap-2 text-[12px] text-text-muted">
                <ClipboardPaste className="w-3.5 h-3.5" />
                JSON, JS object literals, and the full snippet from the console all work.
                {parsedFromPaste && (
                  <span className="ml-auto inline-flex items-center gap-1 text-emerald-500">
                    <ShieldCheck className="w-3.5 h-3.5" /> Looks valid
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FIELD_LABELS.map(({ key, label, required }) => (
                <label key={key} className="flex flex-col gap-1">
                  <span className="text-[11.5px] font-medium text-text-muted">
                    {label}
                    {required && <span className="text-rose-500"> *</span>}
                  </span>
                  <input
                    type="text"
                    value={fields[key] ?? ""}
                    onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="rounded-lg border border-border-light bg-input-bg px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </label>
              ))}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[13px] text-rose-500">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <p className="text-[12px] text-text-muted sm:max-w-[55%]">
              Stored in your browser only. Prefer file-based config? Save the snippet to{" "}
              <code className="text-text-primary">apps/web/.env.local</code> using the button below — see the README for the full variable list.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadEnv}
                disabled={!candidate}
                title="Download .env.local"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-light bg-input-bg text-text-primary text-[12.5px] disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:bg-hover-bg transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download .env
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:bg-primary-600 transition-colors"
              >
                {submitting || status === "loading" ? "Connecting…" : "Connect"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border-light bg-card p-5">
          <h2 className="flex items-center gap-2 text-[14px] font-semibold text-text-primary mb-2">
            <Sparkles className="w-4 h-4 text-primary-500" /> Don&apos;t have a Firebase project yet?
          </h2>
          <ol className="list-decimal pl-5 space-y-1 text-[13px] text-text-secondary">
            <li>
              Go to <a className="text-primary-500 hover:underline" href="https://console.firebase.google.com/" target="_blank" rel="noreferrer">console.firebase.google.com</a> and create a new project.
            </li>
            <li>Enable <strong>Authentication → Google</strong> as a sign-in method.</li>
            <li>Create a <strong>Firestore</strong> database (production mode is fine — we&apos;ll publish rules later).</li>
            <li>Enable <strong>Storage</strong> if you plan to upload files / images / audio.</li>
            <li>
              Open <em>Project settings → Your apps → Web app</em>, register an app, and copy the <code>firebaseConfig</code> snippet here.
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
