// Schema for the user-supplied Firebase web config that we persist in
// localStorage and feed to initializeApp() at runtime.
//
// These are the same fields you get from
//   Firebase Console → Project settings → Your apps → SDK setup & config
// and the `apiKey` is publishable (security is enforced by Firestore /
// Storage rules), so storing it in localStorage is acceptable.

export interface FirebaseUserConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const FIREBASE_CONFIG_STORAGE_KEY = "sondor.firebase-config.v1";

const REQUIRED_KEYS: (keyof FirebaseUserConfig)[] = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

export function isValidFirebaseConfig(value: unknown): value is FirebaseUserConfig {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return REQUIRED_KEYS.every((k) => typeof obj[k] === "string" && (obj[k] as string).length > 0);
}

export function loadStoredFirebaseConfig(): FirebaseUserConfig | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isValidFirebaseConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Read a Firebase config from `NEXT_PUBLIC_FIREBASE_*` environment variables.
 * Returns null if any required variable is missing.
 *
 * Note: these vars are inlined into the client bundle at build time, which is
 * fine because the Firebase web `apiKey` is publishable. Security is enforced
 * by Firestore / Storage rules, not by hiding the key.
 */
export function loadEnvFirebaseConfig(): FirebaseUserConfig | null {
  const candidate: FirebaseUserConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  return isValidFirebaseConfig(candidate) ? candidate : null;
}

/** Pretty-print a config as `.env` lines for the export-to-env button. */
export function configToEnvFile(config: FirebaseUserConfig): string {
  const lines = [
    `NEXT_PUBLIC_FIREBASE_API_KEY=${config.apiKey}`,
    `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${config.authDomain}`,
    `NEXT_PUBLIC_FIREBASE_PROJECT_ID=${config.projectId}`,
    `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${config.storageBucket}`,
    `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}`,
    `NEXT_PUBLIC_FIREBASE_APP_ID=${config.appId}`,
  ];
  if (config.measurementId) {
    lines.push(`NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${config.measurementId}`);
  }
  return lines.join("\n") + "\n";
}

export function saveFirebaseConfig(config: FirebaseUserConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
}

export function clearFirebaseConfig(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
}

/**
 * Best-effort parser for whatever the user pastes into the setup wizard:
 *  - the literal `firebaseConfig = { ... }` snippet copied from the console
 *  - a JSON object
 *  - a JS object literal with unquoted keys / single quotes
 */
export function parseFirebaseConfigInput(input: string): FirebaseUserConfig | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try to isolate the {...} block in case the user pasted the whole snippet.
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const objectLiteral = trimmed.slice(start, end + 1);

  // 1) Strict JSON
  try {
    const parsed = JSON.parse(objectLiteral);
    return isValidFirebaseConfig(parsed) ? parsed : null;
  } catch {
    // fall through
  }

  // 2) JS object literal — quote keys, swap single -> double quotes, drop trailing commas
  try {
    const normalised = objectLiteral
      .replace(/([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
      .replace(/'([^']*)'/g, '"$1"')
      .replace(/,\s*([}\]])/g, "$1");
    const parsed = JSON.parse(normalised);
    return isValidFirebaseConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
