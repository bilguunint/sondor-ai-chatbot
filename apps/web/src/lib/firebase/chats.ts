/**
 * Firestore data layer for chat conversations.
 *
 * Schema:
 *   users/{uid}/conversations/{conversationId}
 *   users/{uid}/conversations/{conversationId}/messages/{messageId}
 *
 * Security rule (configure in the Firebase console):
 *   match /users/{uid}/{document=**} {
 *     allow read, write: if request.auth != null && request.auth.uid == uid;
 *   }
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Firestore,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";

import type { ResponseType } from "@/types";

export interface ConversationModel {
  provider: string;
  model: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  starred: boolean;
  model: ConversationModel | null;
  /** Milliseconds since epoch (Firestore Timestamp converted for the UI). */
  createdAt: number;
  updatedAt: number;
}

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  responseType?: ResponseType;
  thinkingTime?: number;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

const conversationsPath = (uid: string) => `users/${uid}/conversations`;
const messagesPath = (uid: string, convId: string) =>
  `users/${uid}/conversations/${convId}/messages`;

// ---------------------------------------------------------------------------
// Converters
// ---------------------------------------------------------------------------

function tsToMillis(value: unknown): number {
  if (!value) return 0;
  // Firestore Timestamp has a toMillis() method.
  const ts = value as Timestamp;
  return typeof ts.toMillis === "function" ? ts.toMillis() : 0;
}

function toConversation(id: string, data: Record<string, unknown>): Conversation {
  return {
    id,
    title: (data.title as string) ?? "Untitled chat",
    lastMessage: (data.lastMessage as string) ?? "",
    messageCount: (data.messageCount as number) ?? 0,
    starred: Boolean(data.starred),
    model: (data.model as ConversationModel) ?? null,
    createdAt: tsToMillis(data.createdAt),
    updatedAt: tsToMillis(data.updatedAt),
  };
}

function toMessage(id: string, data: Record<string, unknown>): StoredMessage {
  return {
    id,
    role: (data.role as "user" | "assistant") ?? "assistant",
    content: (data.content as string) ?? "",
    responseType: data.responseType as ResponseType | undefined,
    thinkingTime: data.thinkingTime as number | undefined,
    createdAt: tsToMillis(data.createdAt),
  };
}

// ---------------------------------------------------------------------------
// Subscriptions (real-time)
// ---------------------------------------------------------------------------

export function subscribeToConversations(
  db: Firestore,
  uid: string,
  callback: (conversations: Conversation[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(collection(db, conversationsPath(uid)), orderBy("updatedAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => toConversation(d.id, d.data()));
      callback(list);
    },
    (err) => onError?.(err),
  );
}

export function subscribeToMessages(
  db: Firestore,
  uid: string,
  conversationId: string,
  callback: (messages: StoredMessage[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, messagesPath(uid, conversationId)),
    orderBy("createdAt", "asc"),
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => toMessage(d.id, d.data()));
      callback(list);
    },
    (err) => onError?.(err),
  );
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export interface CreateConversationInput {
  title: string;
  model?: ConversationModel | null;
}

/** Create a new conversation. Returns the generated id. */
export async function createConversation(
  db: Firestore,
  uid: string,
  input: CreateConversationInput,
): Promise<string> {
  const ref = doc(collection(db, conversationsPath(uid)));
  await setDoc(ref, {
    title: input.title.slice(0, 120),
    lastMessage: "",
    messageCount: 0,
    starred: false,
    model: input.model ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export interface AddMessageInput {
  role: "user" | "assistant";
  content: string;
  responseType?: ResponseType;
  thinkingTime?: number;
}

/**
 * Append a message to a conversation and bump the parent conversation's
 * lastMessage / messageCount / updatedAt fields in the same logical step.
 */
export async function addMessage(
  db: Firestore,
  uid: string,
  conversationId: string,
  input: AddMessageInput,
  totalMessageCount: number,
): Promise<string> {
  const messagesRef = collection(db, messagesPath(uid, conversationId));
  const ref = await addDoc(messagesRef, {
    role: input.role,
    content: input.content,
    responseType: input.responseType ?? null,
    thinkingTime: input.thinkingTime ?? null,
    createdAt: serverTimestamp(),
  });

  const preview = input.content.replace(/\s+/g, " ").trim().slice(0, 200);
  const convRef = doc(db, conversationsPath(uid), conversationId);
  await updateDoc(convRef, {
    lastMessage: preview,
    messageCount: totalMessageCount,
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function updateConversationMeta(
  db: Firestore,
  uid: string,
  conversationId: string,
  patch: Partial<Pick<Conversation, "title" | "starred">> & {
    model?: ConversationModel | null;
  },
): Promise<void> {
  const convRef = doc(db, conversationsPath(uid), conversationId);
  await updateDoc(convRef, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function toggleStar(
  db: Firestore,
  uid: string,
  conversationId: string,
  starred: boolean,
): Promise<void> {
  await updateConversationMeta(db, uid, conversationId, { starred });
}

/**
 * Delete a conversation and all of its messages. Firestore does not cascade,
 * so we manually remove the messages subcollection first.
 */
export async function deleteConversation(
  db: Firestore,
  uid: string,
  conversationId: string,
): Promise<void> {
  const messagesSnap = await getDocs(collection(db, messagesPath(uid, conversationId)));
  await Promise.all(messagesSnap.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(db, conversationsPath(uid), conversationId));
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Derive a short title from the first user message. */
export function deriveTitle(firstUserMessage: string): string {
  const cleaned = firstUserMessage.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 60) return cleaned || "New chat";
  return cleaned.slice(0, 57) + "…";
}
