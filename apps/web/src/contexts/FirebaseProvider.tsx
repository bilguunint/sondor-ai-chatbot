"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import {
  clearFirebaseConfig,
  loadEnvFirebaseConfig,
  loadStoredFirebaseConfig,
  saveFirebaseConfig,
  type FirebaseUserConfig,
} from "@/lib/firebase/config";
import {
  initFirebaseServices,
  teardownFirebase,
  type FirebaseServices,
} from "@/lib/firebase/client";

type Status = "loading" | "needs-config" | "needs-auth" | "ready" | "error";
export type ConfigSource = "env" | "local-storage" | null;

interface FirebaseContextValue {
  status: Status;
  error: string | null;
  config: FirebaseUserConfig | null;
  /** Where the active config came from. `env` configs cannot be reset from the UI. */
  configSource: ConfigSource;
  services: FirebaseServices | null;
  user: User | null;
  /** Persist a new config and re-initialise. Returns true on success. */
  setConfig: (config: FirebaseUserConfig) => Promise<boolean>;
  /** Forget the saved config + sign the user out. */
  resetConfig: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error("useFirebase must be used within FirebaseProvider");
  return ctx;
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [config, setConfigState] = useState<FirebaseUserConfig | null>(null);
  const [configSource, setConfigSource] = useState<ConfigSource>(null);
  const [services, setServices] = useState<FirebaseServices | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 1) Initial boot: prefer env vars, otherwise fall back to localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const envConfig = loadEnvFirebaseConfig();
      const stored = envConfig ?? loadStoredFirebaseConfig();
      const source: ConfigSource = envConfig ? "env" : stored ? "local-storage" : null;
      if (!stored) {
        if (!cancelled) setStatus("needs-config");
        return;
      }
      try {
        const svc = await initFirebaseServices(stored);
        if (cancelled) return;
        setConfigState(stored);
        setConfigSource(source);
        setServices(svc);
        // status will be moved to needs-auth/ready by the auth listener below
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to initialise Firebase");
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Subscribe to auth state whenever services change
  useEffect(() => {
    if (!services) return;
    const unsub = onAuthStateChanged(
      services.auth,
      (u) => {
        setUser(u);
        setStatus(u ? "ready" : "needs-auth");
      },
      (err) => {
        setError(err.message);
        setStatus("error");
      },
    );
    return unsub;
  }, [services]);

  const setConfig = useCallback(async (next: FirebaseUserConfig) => {
    setStatus("loading");
    setError(null);
    try {
      const svc = await initFirebaseServices(next);
      saveFirebaseConfig(next);
      setConfigState(next);
      setConfigSource("local-storage");
      setServices(svc);
      // Auth listener will set status; for the brief moment between init
      // and the first auth event we expose needs-auth as a sensible default.
      setStatus("needs-auth");
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to initialise Firebase";
      setError(msg);
      setStatus("error");
      return false;
    }
  }, []);

  const resetConfig = useCallback(async () => {
    if (configSource === "env") {
      // Env-supplied configs are owned by the deployment; the UI must not
      // be able to disconnect them or the app would brick on next boot.
      setError("This deployment is configured via environment variables and cannot be reset from the UI.");
      return;
    }
    try {
      if (services) await fbSignOut(services.auth).catch(() => undefined);
      await teardownFirebase();
    } finally {
      clearFirebaseConfig();
      setConfigState(null);
      setConfigSource(null);
      setServices(null);
      setUser(null);
      setError(null);
      setStatus("needs-config");
    }
  }, [services, configSource]);

  const signInWithGoogle = useCallback(async () => {
    if (!services) throw new Error("Firebase is not initialised yet");
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(services.auth, provider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setError(msg);
      throw err;
    }
  }, [services]);

  const signOut = useCallback(async () => {
    if (!services) return;
    await fbSignOut(services.auth);
  }, [services]);

  const value = useMemo<FirebaseContextValue>(
    () => ({
      status,
      error,
      config,
      configSource,
      services,
      user,
      setConfig,
      resetConfig,
      signInWithGoogle,
      signOut,
    }),
    [status, error, config, configSource, services, user, setConfig, resetConfig, signInWithGoogle, signOut],
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}
