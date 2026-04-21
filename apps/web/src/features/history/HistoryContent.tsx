"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Calendar,
  MessageSquare,
  Trash2,
  Star,
  StarOff,
  MoreHorizontal,
  Clock,
  Filter,
  ArrowUpDown,
  Menu,
} from "lucide-react";

import { useChatStore } from "@/contexts/ChatStoreProvider";
import { useToast } from "@/contexts/ToastProvider";
import type { Conversation } from "@/lib/firebase/chats";

type FilterTab = "all" | "starred";

interface DateGroup {
  label: string;
  items: Conversation[];
}

function groupByDate(list: Conversation[]): DateGroup[] {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfDay - 24 * 60 * 60 * 1000;
  const startOf7Days = startOfDay - 7 * 24 * 60 * 60 * 1000;

  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const week: Conversation[] = [];
  const earlier: Conversation[] = [];

  for (const c of list) {
    const ts = c.updatedAt || c.createdAt;
    if (ts >= startOfDay) today.push(c);
    else if (ts >= startOfYesterday) yesterday.push(c);
    else if (ts >= startOf7Days) week.push(c);
    else earlier.push(c);
  }

  return [
    { label: "Today", items: today },
    { label: "Yesterday", items: yesterday },
    { label: "This Week", items: week },
    { label: "Earlier", items: earlier },
  ].filter((g) => g.items.length > 0);
}

function formatRelativeDate(ts: number): string {
  if (!ts) return "—";
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfDay - 24 * 60 * 60 * 1000;
  const date = new Date(ts);
  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (ts >= startOfDay) return `Today, ${time}`;
  if (ts >= startOfYesterday) return `Yesterday, ${time}`;
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export default function HistoryContent({
  onMobileMenuOpen,
  onOpenConversation,
}: {
  onMobileMenuOpen?: () => void;
  onOpenConversation?: (id: string) => void;
}) {
  const { conversations, removeConversation, toggleStar } = useChatStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter((c) => {
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q);
      if (activeTab === "starred") return matchesSearch && c.starred;
      return matchesSearch;
    });
  }, [conversations, searchQuery, activeTab]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All Chats", count: conversations.length },
    { key: "starred", label: "Starred", count: conversations.filter((c) => c.starred).length },
  ];

  const handleToggleStar = (c: Conversation) => {
    toggleStar(c.id, !c.starred).catch((err) =>
      toast("Failed to update", {
        type: "warning",
        description: err instanceof Error ? err.message : String(err),
      }),
    );
  };

  const handleDelete = (id: string) => {
    removeConversation(id).catch((err) =>
      toast("Failed to delete", {
        type: "warning",
        description: err instanceof Error ? err.message : String(err),
      }),
    );
  };

  const handleClearAll = async () => {
    if (conversations.length === 0) return;
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Delete all ${conversations.length} conversations? This can't be undone.`)
    ) {
      return;
    }
    try {
      await Promise.all(conversations.map((c) => removeConversation(c.id)));
      toast("All conversations deleted", { type: "success" });
    } catch (err) {
      toast("Failed to clear all", {
        type: "warning",
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 md:px-8 pt-6 pb-4 border-b border-border-light">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <button onClick={onMobileMenuOpen} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-hover-bg text-text-muted">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-[20px] md:text-[24px] font-bold text-text-primary">History</h1>
              <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600 text-[11px] font-semibold">
                {conversations.length} chats
              </span>
            </div>
            <button
              onClick={handleClearAll}
              disabled={conversations.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 text-[12.5px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          </div>
          <p className="text-[14px] text-text-secondary mb-5">
            Browse and manage your past conversations
          </p>

          {/* Search + Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light bg-input-bg text-[14px] text-text-primary placeholder:text-text-muted outline-none focus:border-primary-300 focus:bg-card transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border-light text-text-muted hover:bg-card-hover text-[12.5px] transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border-light text-text-muted hover:bg-card-hover text-[12.5px] transition-colors">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-primary-50 text-primary-600"
                    : "text-text-muted hover:bg-card-hover"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 text-[11px] ${
                    activeTab === tab.key ? "text-primary-400" : "text-text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
        <div className="max-w-[960px] mx-auto space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-border-light" />
              </div>
              <div className="space-y-1.5">
                {group.items.map((chat) => (
                  <ChatHistoryCard
                    key={chat.id}
                    chat={chat}
                    onOpen={onOpenConversation}
                    onToggleStar={handleToggleStar}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-input-bg flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-text-muted" />
              </div>
              <p className="text-[15px] font-medium text-text-primary mb-1">No conversations found</p>
              <p className="text-[13px] text-text-muted">
                {searchQuery
                  ? "Try a different search term"
                  : activeTab === "starred"
                    ? "Star conversations to find them here"
                    : "Start a new chat to see it here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ChatHistoryCard({
  chat,
  onOpen,
  onToggleStar,
  onDelete,
}: {
  chat: Conversation;
  onOpen?: (id: string) => void;
  onToggleStar: (chat: Conversation) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onOpen?.(chat.id)}
      className="group flex items-start gap-3 p-3.5 rounded-xl border border-transparent hover:border-primary-500/20 hover:bg-primary-500/10 transition-all cursor-pointer"
    >
      <div className="w-9 h-9 rounded-xl bg-primary-500/15 flex items-center justify-center shrink-0 mt-0.5">
        <MessageSquare className="w-4 h-4 text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-primary-700 transition-colors line-clamp-1">
            {chat.title || "Untitled chat"}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(chat);
              }}
              className={`p-1 rounded-md hover:bg-primary-500/15 transition-colors ${
                chat.starred ? "text-amber-400 opacity-100" : "text-text-muted"
              }`}
            >
              {chat.starred ? (
                <Star className="w-3.5 h-3.5 fill-current" />
              ) : (
                <StarOff className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(chat.id);
              }}
              className="p-1 rounded-md hover:bg-red-500/15 text-text-muted hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md hover:bg-primary-500/15 text-text-muted transition-colors"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {chat.lastMessage && (
          <p className="text-[12px] text-text-muted mt-0.5 line-clamp-1">{chat.lastMessage}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {chat.model?.provider && (
            <span className="px-2 py-0.5 rounded-md bg-hover-bg text-[10.5px] font-medium text-text-muted">
              {chat.model.provider}
            </span>
          )}
          <div className="flex items-center gap-1 text-[11px] text-text-muted">
            <MessageSquare className="w-3 h-3" />
            {chat.messageCount} messages
          </div>
          <div className="flex items-center gap-1 text-[11px] text-text-muted">
            <Clock className="w-3 h-3" />
            {formatRelativeDate(chat.updatedAt || chat.createdAt)}
          </div>
          {chat.starred && (
            <Star className="w-3 h-3 text-amber-400 fill-current" />
          )}
        </div>
      </div>
    </div>
  );
}
