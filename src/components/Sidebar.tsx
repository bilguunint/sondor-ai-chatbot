"use client";

import React from "react";
import {
  Plus,
  Search,
  Compass,
  BookOpen,
  FileText,
  History,
  LogOut,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  LayoutGrid,
  X,
} from "lucide-react";

import { useTheme } from "./ThemeProvider";
import type { ActiveView } from "@/app/page";

const chatHistoryToday = [
  "Create a detailed 7-day sprint plan f...",
  "Draft a concise email to stakeholder...",
  "Analyze the 'Eisenhower Matrix' an...",
];

const chatHistoryYesterday = [
  "Summarize the main differences be...",
  "I need to negotiate an extension for ...",
];

const chatHistory7Days = [
  "Generate 5 effective morning habits...",
  "As a non-technical PM, list 5 crucial...",
  "Help me allocate 8 hours tomorrow:...",
  "We need a creative name for our ne...",
  "Write a 100-word positive feedback...",
];

export default function Sidebar({
  activeView,
  onNewChat,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: {
  activeView: ActiveView;
  onNewChat?: () => void;
  onNavigate?: (view: ActiveView) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const { primaryKey } = useTheme();

  const navItems = [
    { icon: Compass, label: "Explore", view: "explore" as ActiveView },
    { icon: BookOpen, label: "Library", view: "library" as ActiveView },
    { icon: FileText, label: "Files", view: "files" as ActiveView },
    { icon: History, label: "History", view: "history" as ActiveView },
    { icon: LayoutGrid, label: "Widgets", view: "widgets" as ActiveView },
    { icon: Palette, label: "Theme", view: "theme" as ActiveView },
  ];

  if (collapsed) {
    return (
      <>
        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
            <aside className="relative w-[260px] h-screen flex flex-col bg-sidebar border-r border-border-light shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <img src={`/assets/logo-${primaryKey}.png`} alt="Sondor AI" className="w-8 h-8 rounded-lg object-contain" />
                  <span className="text-[17px] font-bold text-text-primary">Sondor AI</span>
                </div>
                <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-sidebar-hover text-text-muted cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <MobileSidebarContent activeView={activeView} onNewChat={onNewChat} onNavigate={onNavigate} navItems={navItems} primaryKey={primaryKey} />
            </aside>
          </div>
        )}
        {/* Desktop collapsed sidebar */}
        <aside className="hidden md:flex w-[56px] min-w-[56px] h-screen flex-col items-center bg-sidebar border-r border-border-light transition-all duration-200">
        {/* Logo + expand */}
        <div className="flex flex-col items-center pt-3 pb-1 gap-1">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-sidebar-hover cursor-pointer"
            title="Expand sidebar"
          >
            <img
              src={`/assets/logo-${primaryKey}.png`}
              alt="Sondor AI"
              className="w-6 h-6 rounded-md object-contain"
            />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-2 pt-1 pb-1 w-full">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors cursor-pointer"
            title="New chat"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Search */}
        <div className="px-2 pb-1 w-full">
          <button
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-sidebar-hover text-text-muted cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Nav icons */}
        <nav className="px-2 space-y-[2px] w-full">
          {navItems.map(({ icon: Icon, label, view }) => {
            const isActive = activeView === view;
            return (
              <button
                key={label}
                onClick={() => onNavigate?.(view)}
                className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-sidebar-active text-primary-500"
                    : "text-text-secondary hover:bg-sidebar-hover"
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User avatar */}
        <div className="pb-3">
          <button
            onClick={() => onNavigate?.("profile" as ActiveView)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white text-[11px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
            title="Profile"
          >
            BN
          </button>
        </div>
      </aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative w-[260px] h-screen flex flex-col bg-sidebar border-r border-border-light shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <img src={`/assets/logo-${primaryKey}.png`} alt="Sondor AI" className="w-8 h-8 rounded-lg object-contain" />
                <span className="text-[17px] font-bold text-text-primary">Sondor AI</span>
              </div>
              <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-sidebar-hover text-text-muted cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MobileSidebarContent activeView={activeView} onNewChat={onNewChat} onNavigate={onNavigate} navItems={navItems} primaryKey={primaryKey} />
          </aside>
        </div>
      )}
    <aside className="hidden md:flex w-[240px] min-w-[240px] h-screen flex-col bg-sidebar border-r border-border-light transition-all duration-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <img
            src={`/assets/logo-${primaryKey}.png`}
            alt="Sondor AI"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="text-[17px] font-bold text-text-primary">
            Sondor AI
          </span>
        </div>
        <button onClick={onToggleCollapse} className="p-1 rounded-md hover:bg-sidebar-hover text-text-muted cursor-pointer">
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pt-2 pb-1">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          New chat
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-3 py-[6px] rounded-lg border border-border-light bg-card text-text-muted text-[13px]">
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <div className="ml-auto">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-1 space-y-[2px]">
        {navItems.map(({ icon: Icon, label, view }) => {
          const isActive = activeView === view;
          return (
            <button
              key={label}
              onClick={() => onNavigate?.(view)}
              className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-colors ${
                isActive
                  ? "bg-sidebar-active text-primary-600 font-medium"
                  : "text-text-primary hover:bg-sidebar-hover"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-primary-500" : "text-text-secondary"
                }`}
              />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 space-y-4">
        <ChatGroup label="Today" items={chatHistoryToday} />
        <ChatGroup label="Yesterday" items={chatHistoryYesterday} />
        <ChatGroup label="7 days" items={chatHistory7Days} />
      </div>

      {/* User Profile */}
      <div className="px-3 py-3 border-t border-border-light">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate?.("profile" as ActiveView)}
            className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
              BN
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium text-text-primary truncate">
                Bilguun Nyamlhagva
              </p>
              <p className="text-[11px] text-text-muted truncate">
                bilguunint@gmail.com
              </p>
            </div>
          </button>
          <button className="p-1 rounded-md hover:bg-sidebar-hover text-text-muted">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}

function MobileSidebarContent({
  activeView,
  onNewChat,
  onNavigate,
  navItems,
  primaryKey,
}: {
  activeView: ActiveView;
  onNewChat?: () => void;
  onNavigate?: (view: ActiveView) => void;
  navItems: { icon: React.ComponentType<{ className?: string }>; label: string; view: ActiveView }[];
  primaryKey: string;
}) {
  return (
    <>
      <div className="px-3 pt-2 pb-1">
        <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-medium transition-colors cursor-pointer">
          <Plus className="w-4 h-4" strokeWidth={2} /> New chat
        </button>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-3 py-[6px] rounded-lg border border-border-light bg-card text-text-muted text-[13px]">
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <div className="ml-auto"><Sparkles className="w-3.5 h-3.5 text-primary-400" /></div>
        </div>
      </div>
      <nav className="px-3 py-1 space-y-[2px]">
        {navItems.map(({ icon: Icon, label, view }) => {
          const isActive = activeView === view;
          return (
            <button key={label} onClick={() => onNavigate?.(view)}
              className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-colors ${
                isActive ? "bg-sidebar-active text-primary-600 font-medium" : "text-text-primary hover:bg-sidebar-hover"
              }`}>
              <Icon className={`w-4 h-4 ${isActive ? "text-primary-500" : "text-text-secondary"}`} />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="flex-1 overflow-y-auto px-3 pt-3 space-y-4">
        <ChatGroup label="Today" items={chatHistoryToday} />
        <ChatGroup label="Yesterday" items={chatHistoryYesterday} />
        <ChatGroup label="7 days" items={chatHistory7Days} />
      </div>
      <div className="px-3 py-3 border-t border-border-light">
        <button onClick={() => onNavigate?.("profile" as ActiveView)}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white text-[11px] font-semibold shrink-0">BN</div>
          <div className="text-left">
            <p className="text-[13px] font-medium text-text-primary">Bilguun Nyamlhagva</p>
            <p className="text-[11px] text-text-muted">bilguunint@gmail.com</p>
          </div>
        </button>
      </div>
    </>
  );
}

function ChatGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-text-muted px-3 pb-1">
        {label}
      </p>
      <div className="space-y-[1px]">
        {items.map((item, i) => (
          <button
            key={i}
            className="w-full text-left px-3 py-[6px] rounded-lg text-[12.5px] text-text-secondary hover:bg-sidebar-hover transition-colors truncate"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
