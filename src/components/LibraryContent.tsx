"use client";

import { useState } from "react";
import {
  Search,
  FolderOpen,
  Star,
  Clock,
  Sparkles,
  MessageSquare,
  FileText,
  Code,
  PenTool,
  BarChart3,
  Lightbulb,
  ArrowRight,
  MoreHorizontal,
  Plus,
  BookmarkCheck,
  Menu,
} from "lucide-react";

type Tab = "all" | "prompts" | "collections" | "starred";

const savedPrompts = [
  {
    id: 1,
    title: "Weekly Sprint Summary",
    content: "Summarize our sprint progress, blockers, and action items for the team standup...",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    category: "Work",
    starred: true,
    usedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Code Review Helper",
    content: "Review this code for bugs, performance issues, and best practices. Suggest improvements...",
    icon: Code,
    color: "from-emerald-500 to-teal-500",
    category: "Development",
    starred: true,
    usedAt: "Yesterday",
  },
  {
    id: 3,
    title: "Blog Post Writer",
    content: "Write an engaging blog post about the given topic with SEO-friendly structure...",
    icon: PenTool,
    color: "from-pink-500 to-rose-500",
    category: "Writing",
    starred: false,
    usedAt: "2 days ago",
  },
  {
    id: 4,
    title: "Data Analysis Prompt",
    content: "Analyze the following dataset and provide key insights, trends, and recommendations...",
    icon: BarChart3,
    color: "from-amber-500 to-orange-500",
    category: "Analysis",
    starred: false,
    usedAt: "3 days ago",
  },
  {
    id: 5,
    title: "Brainstorm Ideas",
    content: "Generate 10 creative ideas for the given topic. Consider different angles and perspectives...",
    icon: Lightbulb,
    color: "from-violet-500 to-primary-500",
    category: "Creative",
    starred: true,
    usedAt: "5 days ago",
  },
  {
    id: 6,
    title: "Meeting Notes Template",
    content: "Create structured meeting notes with attendees, discussion points, decisions, and action items...",
    icon: MessageSquare,
    color: "from-sky-500 to-blue-500",
    category: "Work",
    starred: false,
    usedAt: "1 week ago",
  },
];

const collections = [
  {
    id: 1,
    name: "Work Essentials",
    count: 8,
    color: "from-primary-500 to-indigo-500",
    icon: FolderOpen,
  },
  {
    id: 2,
    name: "Development",
    count: 12,
    color: "from-emerald-500 to-teal-500",
    icon: Code,
  },
  {
    id: 3,
    name: "Content Creation",
    count: 6,
    color: "from-pink-500 to-rose-500",
    icon: PenTool,
  },
  {
    id: 4,
    name: "Research",
    count: 5,
    color: "from-amber-500 to-orange-500",
    icon: Sparkles,
  },
];

export default function LibraryContent({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "all", label: "All", icon: BookmarkCheck },
    { key: "prompts", label: "Prompts", icon: MessageSquare },
    { key: "collections", label: "Collections", icon: FolderOpen },
    { key: "starred", label: "Starred", icon: Star },
  ];

  const filteredPrompts = savedPrompts.filter((p) => {
    if (activeTab === "starred") return p.starred;
    return true;
  });

  return (
    <main className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 md:px-8 pt-6 pb-4 border-b border-border-light">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <button onClick={onMobileMenuOpen} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-hover-bg text-text-muted">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-[20px] md:text-[24px] font-bold text-text-primary">Library</h1>
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-[12.5px] font-medium transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              New prompt
            </button>
          </div>
          <p className="text-[14px] text-text-secondary mb-5">
            Your saved prompts, templates, and collections
          </p>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your library..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light bg-input-bg text-[14px] text-text-primary placeholder:text-text-muted outline-none focus:border-primary-300 focus:bg-card transition-colors"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-border-light -mx-4 px-4 md:-mx-8 md:px-8 overflow-x-auto">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-[1px] ${
                  activeTab === key
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-[960px] mx-auto space-y-8">
          {/* Collections (show on all & collections tabs) */}
          {(activeTab === "all" || activeTab === "collections") && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-text-primary">Collections</h2>
                <button className="flex items-center gap-1 text-[12.5px] text-primary-500 font-medium hover:text-primary-600 transition-colors">
                  View all
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {collections.map((col) => (
                  <button
                    key={col.id}
                    className="flex flex-col p-4 rounded-xl border border-border-light bg-card hover:border-primary-200 hover:shadow-sm transition-all text-left cursor-pointer group"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${col.color} flex items-center justify-center mb-3`}
                    >
                      <col.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[13px] font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                      {col.name}
                    </p>
                    <p className="text-[11.5px] text-text-muted mt-0.5">
                      {col.count} prompts
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Saved Prompts */}
          {(activeTab === "all" || activeTab === "prompts" || activeTab === "starred") && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-text-primary">
                  {activeTab === "starred" ? "Starred Prompts" : "Saved Prompts"}
                </h2>
                <div className="flex items-center gap-2 text-[12px] text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  Recently used
                </div>
              </div>
              <div className="space-y-2">
                {filteredPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border-light bg-card hover:border-primary-200 hover:shadow-sm transition-all text-left group cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${prompt.color} flex items-center justify-center shrink-0`}
                    >
                      <prompt.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                          {prompt.title}
                        </h3>
                        {prompt.starred && (
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                      <p className="text-[12px] text-text-secondary truncate mt-0.5">
                        {prompt.content}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-hover-bg text-text-muted">
                          {prompt.category}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          Used {prompt.usedAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <div className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
                        <MoreHorizontal className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
