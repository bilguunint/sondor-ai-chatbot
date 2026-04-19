"use client";

import { useState } from "react";
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

type FilterTab = "all" | "starred" | "archived";

interface ChatHistory {
  id: number;
  title: string;
  preview: string;
  date: string;
  messageCount: number;
  starred: boolean;
  category: string;
}

const initialHistory: ChatHistory[] = [
  {
    id: 1,
    title: "Create a detailed 7-day sprint plan for mobile app",
    preview: "I need a comprehensive sprint plan that covers UI design, backend API development, testing phases...",
    date: "Today, 2:34 PM",
    messageCount: 12,
    starred: true,
    category: "Productivity",
  },
  {
    id: 2,
    title: "Draft a concise email to stakeholders about Q3 results",
    preview: "Help me write a professional email summarizing our Q3 performance metrics, highlighting key wins...",
    date: "Today, 11:20 AM",
    messageCount: 8,
    starred: false,
    category: "Writing",
  },
  {
    id: 3,
    title: "Analyze the Eisenhower Matrix for task prioritization",
    preview: "Can you explain the Eisenhower Matrix framework and help me categorize my current tasks...",
    date: "Today, 9:05 AM",
    messageCount: 15,
    starred: false,
    category: "Productivity",
  },
  {
    id: 4,
    title: "Summarize main differences between React and Vue",
    preview: "I'm evaluating frontend frameworks for a new project. Compare React and Vue.js in terms of...",
    date: "Yesterday, 4:15 PM",
    messageCount: 20,
    starred: true,
    category: "Development",
  },
  {
    id: 5,
    title: "Negotiate an extension for project deadline",
    preview: "I need to ask my manager for a 2-week extension on the current project. Help me draft a...",
    date: "Yesterday, 10:30 AM",
    messageCount: 6,
    starred: false,
    category: "Writing",
  },
  {
    id: 6,
    title: "Generate 5 effective morning habits for developers",
    preview: "What are the best morning routines that successful software developers follow to boost...",
    date: "Apr 14, 2026",
    messageCount: 10,
    starred: false,
    category: "Lifestyle",
  },
  {
    id: 7,
    title: "List 5 crucial metrics for a non-technical PM",
    preview: "As a product manager without a technical background, which key metrics should I track...",
    date: "Apr 14, 2026",
    messageCount: 14,
    starred: true,
    category: "Productivity",
  },
  {
    id: 8,
    title: "Help me allocate 8 hours tomorrow efficiently",
    preview: "I have meetings at 10am and 2pm, need to finish a report, review 3 PRs, and prepare...",
    date: "Apr 13, 2026",
    messageCount: 9,
    starred: false,
    category: "Productivity",
  },
  {
    id: 9,
    title: "Creative name for our new AI productivity tool",
    preview: "We're launching an AI-powered productivity suite. Brainstorm creative, memorable names...",
    date: "Apr 12, 2026",
    messageCount: 18,
    starred: true,
    category: "Creative",
  },
  {
    id: 10,
    title: "Write positive feedback for my team member",
    preview: "I need to write a 100-word positive performance review for a junior developer who has...",
    date: "Apr 12, 2026",
    messageCount: 5,
    starred: false,
    category: "Writing",
  },
];

const dateGroups = [
  { label: "Today", filter: (d: string) => d.startsWith("Today") },
  { label: "Yesterday", filter: (d: string) => d.startsWith("Yesterday") },
  { label: "This Week", filter: (d: string) => d.startsWith("Apr 14") || d.startsWith("Apr 13") },
  { label: "Earlier", filter: (d: string) => d.startsWith("Apr 12") },
];

export default function HistoryContent({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const [history, setHistory] = useState(initialHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const toggleStar = (id: number) => {
    setHistory((prev) =>
      prev.map((h) => (h.id === id ? { ...h, starred: !h.starred } : h))
    );
  };

  const deleteChat = (id: number) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const filtered = history.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.preview.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "starred") return matchesSearch && h.starred;
    return matchesSearch;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All Chats", count: history.length },
    { key: "starred", label: "Starred", count: history.filter((h) => h.starred).length },
  ];

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
                {history.length} chats
              </span>
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 text-[12.5px] font-medium transition-colors cursor-pointer">
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
          {dateGroups.map((group) => {
            const items = filtered.filter((h) => group.filter(h.date));
            if (items.length === 0) return null;
            return (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">
                    {group.label}
                  </span>
                  <div className="flex-1 h-px bg-border-light" />
                </div>
                <div className="space-y-1.5">
                  {items.map((chat) => (
                    <ChatHistoryCard
                      key={chat.id}
                      chat={chat}
                      onToggleStar={toggleStar}
                      onDelete={deleteChat}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-input-bg flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-text-muted" />
              </div>
              <p className="text-[15px] font-medium text-text-primary mb-1">No conversations found</p>
              <p className="text-[13px] text-text-muted">
                {searchQuery ? "Try a different search term" : "Start a new chat to see it here"}
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
  onToggleStar,
  onDelete,
}: {
  chat: ChatHistory;
  onToggleStar: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="group flex items-start gap-3 p-3.5 rounded-xl border border-transparent hover:border-primary-500/20 hover:bg-primary-500/10 transition-all cursor-pointer">
      <div className="w-9 h-9 rounded-xl bg-primary-500/15 flex items-center justify-center shrink-0 mt-0.5">
        <MessageSquare className="w-4 h-4 text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-primary-700 transition-colors line-clamp-1">
            {chat.title}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(chat.id);
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
            <button className="p-1 rounded-md hover:bg-primary-500/15 text-text-muted transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-[12px] text-text-muted mt-0.5 line-clamp-1">{chat.preview}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="px-2 py-0.5 rounded-md bg-hover-bg text-[10.5px] font-medium text-text-muted">
            {chat.category}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-text-muted">
            <MessageSquare className="w-3 h-3" />
            {chat.messageCount} messages
          </div>
          <div className="flex items-center gap-1 text-[11px] text-text-muted">
            <Clock className="w-3 h-3" />
            {chat.date}
          </div>
          {chat.starred && (
            <Star className="w-3 h-3 text-amber-400 fill-current" />
          )}
        </div>
      </div>
    </div>
  );
}
