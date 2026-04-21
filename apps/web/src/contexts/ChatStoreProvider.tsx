"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useFirebase } from "@/contexts/FirebaseProvider";
import {
  addMessage as fbAddMessage,
  createConversation as fbCreateConversation,
  deleteConversation as fbDeleteConversation,
  deriveTitle,
  subscribeToConversations,
  subscribeToMessages,
  toggleStar as fbToggleStar,
  updateConversationMeta,
  type AddMessageInput,
  type Conversation,
  type ConversationModel,
  type StoredMessage,
} from "@/lib/firebase/chats";

interface ChatStoreContextValue {
  /** True when Firebase + auth are ready and the store can be used. */
  ready: boolean;
  /** All conversations for the current user, ordered newest first. */
  conversations: Conversation[];
  /** Currently active conversation id, or null when on the home/new-chat screen. */
  activeConversationId: string | null;
  /** Real-time messages for the active conversation. */
  activeMessages: StoredMessage[];
  /** True while the active conversation's messages are loading. */
  loadingMessages: boolean;
  /** Open an existing conversation. Pass null to return to the empty/new state. */
  setActiveConversation: (id: string | null) => void;
  /** Clear the active conversation (alias for setActiveConversation(null)). */
  startNewChat: () => void;
  /**
   * Create a new conversation document. Returns the generated id, which the
   * caller should pass as the active conversation immediately.
   */
  createConversation: (firstUserMessage: string, model?: ConversationModel | null) => Promise<string | null>;
  /** Append a message to a conversation and bump its metadata. */
  appendMessage: (conversationId: string, input: AddMessageInput) => Promise<void>;
  renameConversation: (conversationId: string, title: string) => Promise<void>;
  toggleStar: (conversationId: string, starred: boolean) => Promise<void>;
  removeConversation: (conversationId: string) => Promise<void>;
}

const ChatStoreContext = createContext<ChatStoreContextValue | null>(null);

export function useChatStore(): ChatStoreContextValue {
  const ctx = useContext(ChatStoreContext);
  if (!ctx) throw new Error("useChatStore must be used within ChatStoreProvider");
  return ctx;
}

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const { services, user, status } = useFirebase();
  const db = services?.db ?? null;
  const uid = user?.uid ?? null;
  const ready = status === "ready" && !!db && !!uid;
  // While Firebase isn't ready (or the user is signed out) we keep an
  // in-memory store so the app remains fully usable as a "guest". Nothing
  // is persisted; new chats live for the lifetime of the tab.
  const guestMode = !ready && status !== "loading" && status !== "error";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<StoredMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  // Guest-only message store keyed by conversation id. Lives in a ref so we
  // can mutate without forcing extra renders, and we mirror the active
  // conversation into `activeMessages` whenever it changes.
  const guestMessagesRef = useRef<Map<string, StoredMessage[]>>(new Map());
  // Mirrors `activeConversationId` so async callbacks (which may have been
  // captured before the state update committed) can read the latest value.
  const activeConversationIdRef = useRef<string | null>(null);
  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // Track per-conversation message counts so appendMessage knows what number
  // to write into the conversation doc without an extra read.
  const messageCountsRef = useRef<Map<string, number>>(new Map());

  // Subscribe to the user's conversation list.
  useEffect(() => {
    if (!ready || !db || !uid) {
      // In guest mode we keep whatever local conversations exist instead of
      // wiping them. Only clear when we transition into a state where guest
      // mode is impossible (loading / error).
      if (!guestMode) {
        setConversations([]);
        setActiveConversationId(null);
        guestMessagesRef.current.clear();
        messageCountsRef.current.clear();
      }
      return;
    }
    const unsub = subscribeToConversations(
      db,
      uid,
      (list) => {
        setConversations(list);
        // Keep our message-count cache in sync with what Firestore reports.
        for (const c of list) {
          messageCountsRef.current.set(c.id, c.messageCount);
        }
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error("[ChatStore] conversations subscription error", err);
      },
    );
    return unsub;
  }, [ready, db, uid, guestMode]);

  // Subscribe to the messages of the active conversation.
  useEffect(() => {
    if (!ready || !db || !uid || !activeConversationId) {
      if (guestMode && activeConversationId) {
        setActiveMessages(guestMessagesRef.current.get(activeConversationId) ?? []);
      } else {
        setActiveMessages([]);
      }
      setLoadingMessages(false);
      return;
    }
    setLoadingMessages(true);
    const unsub = subscribeToMessages(
      db,
      uid,
      activeConversationId,
      (list) => {
        setActiveMessages(list);
        setLoadingMessages(false);
        messageCountsRef.current.set(activeConversationId, list.length);
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error("[ChatStore] messages subscription error", err);
        setLoadingMessages(false);
      },
    );
    return unsub;
  }, [ready, db, uid, activeConversationId]);

  // Reset active conversation on sign-out — but only when we're leaving
  // guest mode entirely (e.g. error / loading). Going from signed-in to
  // signed-out (which lands us in guest mode) is handled by the conversation
  // subscription effect above.
  useEffect(() => {
    if (!uid && !guestMode) setActiveConversationId(null);
  }, [uid, guestMode]);

  const setActiveConversation = useCallback((id: string | null) => {
    setActiveConversationId(id);
  }, []);

  const startNewChat = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  const createConversation = useCallback(
    async (firstUserMessage: string, model?: ConversationModel | null) => {
      if (guestMode) {
        const id = `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        const now = Date.now();
        const conv: Conversation = {
          id,
          title: deriveTitle(firstUserMessage),
          lastMessage: "",
          messageCount: 0,
          starred: false,
          model: model ?? null,
          createdAt: now,
          updatedAt: now,
        };
        setConversations((prev) => [conv, ...prev]);
        guestMessagesRef.current.set(id, []);
        messageCountsRef.current.set(id, 0);
        return id;
      }
      if (!db || !uid) return null;
      const id = await fbCreateConversation(db, uid, {
        title: deriveTitle(firstUserMessage),
        model: model ?? null,
      });
      messageCountsRef.current.set(id, 0);
      return id;
    },
    [db, uid, guestMode],
  );

  const appendMessage = useCallback(
    async (conversationId: string, input: AddMessageInput) => {
      if (guestMode) {
        const now = Date.now();
        const message: StoredMessage = {
          id: `m-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          role: input.role,
          content: input.content,
          responseType: input.responseType,
          thinkingTime: input.thinkingTime,
          createdAt: now,
        };
        const list = guestMessagesRef.current.get(conversationId) ?? [];
        const next = [...list, message];
        guestMessagesRef.current.set(conversationId, next);
        messageCountsRef.current.set(conversationId, next.length);
        if (conversationId === activeConversationIdRef.current) {
          setActiveMessages(next);
        }
        const preview = input.content.replace(/\s+/g, " ").trim().slice(0, 200);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: preview, messageCount: next.length, updatedAt: now }
              : c,
          ),
        );
        return;
      }
      if (!db || !uid) return;
      const current = messageCountsRef.current.get(conversationId) ?? 0;
      const next = current + 1;
      messageCountsRef.current.set(conversationId, next);
      try {
        await fbAddMessage(db, uid, conversationId, input, next);
      } catch (err) {
        // Roll back the local counter so a retry stays consistent.
        messageCountsRef.current.set(conversationId, current);
        throw err;
      }
    },
    [db, uid, guestMode],
  );

  const renameConversation = useCallback(
    async (conversationId: string, title: string) => {
      if (guestMode) {
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, title } : c)),
        );
        return;
      }
      if (!db || !uid) return;
      await updateConversationMeta(db, uid, conversationId, { title });
    },
    [db, uid, guestMode],
  );

  const toggleStar = useCallback(
    async (conversationId: string, starred: boolean) => {
      if (guestMode) {
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, starred } : c)),
        );
        return;
      }
      if (!db || !uid) return;
      await fbToggleStar(db, uid, conversationId, starred);
    },
    [db, uid, guestMode],
  );

  const removeConversation = useCallback(
    async (conversationId: string) => {
      if (guestMode) {
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
        guestMessagesRef.current.delete(conversationId);
        messageCountsRef.current.delete(conversationId);
        if (activeConversationId === conversationId) {
          setActiveConversationId(null);
        }
        return;
      }
      if (!db || !uid) return;
      await fbDeleteConversation(db, uid, conversationId);
      messageCountsRef.current.delete(conversationId);
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
    },
    [db, uid, guestMode, activeConversationId],
  );

  const value = useMemo<ChatStoreContextValue>(
    () => ({
      ready: ready || guestMode,
      conversations,
      activeConversationId,
      activeMessages,
      loadingMessages,
      setActiveConversation,
      startNewChat,
      createConversation,
      appendMessage,
      renameConversation,
      toggleStar,
      removeConversation,
    }),
    [
      ready,
      guestMode,
      conversations,
      activeConversationId,
      activeMessages,
      loadingMessages,
      setActiveConversation,
      startNewChat,
      createConversation,
      appendMessage,
      renameConversation,
      toggleStar,
      removeConversation,
    ],
  );

  return <ChatStoreContext.Provider value={value}>{children}</ChatStoreContext.Provider>;
}
