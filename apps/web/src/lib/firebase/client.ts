import { initializeApp, getApps, getApp, deleteApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

import type { FirebaseUserConfig } from "./config";

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

const APP_NAME = "sondor-user-app";

/**
 * Initialise (or re-initialise) the user's Firebase project.
 * Safe to call multiple times — it tears down the previous app instance
 * if the config changed so we never end up with a stale connection.
 */
export async function initFirebaseServices(
  config: FirebaseUserConfig,
): Promise<FirebaseServices> {
  const existing = getApps().find((a) => a.name === APP_NAME);
  if (existing) {
    const sameProject = (existing.options as FirebaseUserConfig).projectId === config.projectId
      && (existing.options as FirebaseUserConfig).apiKey === config.apiKey;
    if (sameProject) {
      return buildServices(existing);
    }
    await deleteApp(existing);
  }

  const app = initializeApp(config, APP_NAME);
  return buildServices(app);
}

function buildServices(app: FirebaseApp): FirebaseServices {
  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
}

export function getCurrentApp(): FirebaseApp | null {
  return getApps().find((a) => a.name === APP_NAME) ?? null;
}

export async function teardownFirebase(): Promise<void> {
  const existing = getCurrentApp();
  if (existing) await deleteApp(existing);
}

export { getApp };
