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

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<StoredMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Track per-conversation message counts so appendMessage knows what number
  // to write into the conversation doc without an extra read.
  const messageCountsRef = useRef<Map<string, number>>(new Map());

  // Subscribe to the user's conversation list.
  useEffect(() => {
    if (!ready || !db || !uid) {
      setConversations([]);
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
  }, [ready, db, uid]);

  // Subscribe to the messages of the active conversation.
  useEffect(() => {
    if (!ready || !db || !uid || !activeConversationId) {
      setActiveMessages([]);
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

  // Reset active conversation on sign-out.
  useEffect(() => {
    if (!uid) setActiveConversationId(null);
  }, [uid]);

  const setActiveConversation = useCallback((id: string | null) => {
    setActiveConversationId(id);
  }, []);

  const startNewChat = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  const createConversation = useCallback(
    async (firstUserMessage: string, model?: ConversationModel | null) => {
      if (!db || !uid) return null;
      const id = await fbCreateConversation(db, uid, {
        title: deriveTitle(firstUserMessage),
        model: model ?? null,
      });
      messageCountsRef.current.set(id, 0);
      return id;
    },
    [db, uid],
  );

  const appendMessage = useCallback(
    async (conversationId: string, input: AddMessageInput) => {
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
    [db, uid],
  );

  const renameConversation = useCallback(
    async (conversationId: string, title: string) => {
      if (!db || !uid) return;
      await updateConversationMeta(db, uid, conversationId, { title });
    },
    [db, uid],
  );

  const toggleStar = useCallback(
    async (conversationId: string, starred: boolean) => {
      if (!db || !uid) return;
      await fbToggleStar(db, uid, conversationId, starred);
    },
    [db, uid],
  );

  const removeConversation = useCallback(
    async (conversationId: string) => {
      if (!db || !uid) return;
      await fbDeleteConversation(db, uid, conversationId);
      messageCountsRef.current.delete(conversationId);
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
    },
    [db, uid, activeConversationId],
  );

  const value = useMemo<ChatStoreContextValue>(
    () => ({
      ready,
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
