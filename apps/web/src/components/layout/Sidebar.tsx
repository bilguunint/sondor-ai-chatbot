"use client";

import React, { useMemo } from "react";
import {
  Plus,
  Search,
  Compass,
  BookOpen,
  FileText,
  History,
  LogIn,
  LogOut,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  LayoutGrid,
  X,
} from "lucide-react";

import { useTheme } from "@/contexts/ThemeProvider";
import { useToast } from "@/contexts/ToastProvider";
import { useChatStore } from "@/contexts/ChatStoreProvider";
import { useFirebase } from "@/contexts/FirebaseProvider";
import { useUserProfile } from "@/contexts/UserProfileProvider";
import type { Conversation } from "@/lib/firebase/chats";
import type { ActiveView } from "@/types";

interface ConversationGroup {
  label: string;
  items: Conversation[];
}

/** Bucket conversations by `updatedAt` into Today / Yesterday / 7 days / Older. */
function groupConversations(list: Conversation[]): ConversationGroup[] {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfDay - 24 * 60 * 60 * 1000;
  const startOf7DaysAgo = startOfDay - 7 * 24 * 60 * 60 * 1000;

  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const lastWeek: Conversation[] = [];
  const older: Conversation[] = [];

  for (const c of list) {
    const ts = c.updatedAt || c.createdAt;
    if (ts >= startOfDay) today.push(c);
    else if (ts >= startOfYesterday) yesterday.push(c);
    else if (ts >= startOf7DaysAgo) lastWeek.push(c);
    else older.push(c);
  }

  return [
    { label: "Today", items: today },
    { label: "Yesterday", items: yesterday },
    { label: "Previous 7 days", items: lastWeek },
    { label: "Older", items: older },
  ].filter((g) => g.items.length > 0);
}

export default function Sidebar({
  activeView,
  onNewChat,
  onNavigate,
  onSelectConversation,
  onRequestSignIn,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: {
  activeView: ActiveView;
  onNewChat?: () => void;
  onNavigate?: (view: ActiveView) => void;
  /** Activate a conversation in the store and switch to the chat view. */
  onSelectConversation?: (id: string) => void;
  /** Open the sign-in / setup modal (used when no user is signed in). */
  onRequestSignIn?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const { primaryKey } = useTheme();
  const { toast } = useToast();
  const { conversations, activeConversationId } = useChatStore();
  const { user, signOut } = useFirebase();
  const { profile } = useUserProfile();

  const isGuest = !user;
  const groups = useMemo(() => groupConversations(conversations), [conversations]);
  const displayName = profile?.displayName || user?.displayName || (isGuest ? "Guest" : "Anonymous");
  const email = profile?.email || user?.email || (isGuest ? "Not signed in" : "");
  const photoURL = profile?.photoURL || user?.photoURL || "";
  const initials = (displayName || "S A")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSearch = () => {
    toast("Search", { description: "⌘K / Ctrl+K — full search coming soon" });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast("Signed out", { type: "success" });
    } catch (err) {
      toast("Sign out failed", {
        type: "warning",
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleConversationClick = (id: string) => {
    onSelectConversation?.(id);
    onMobileClose?.();
  };

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
              <MobileSidebarContent
                activeView={activeView}
                activeConversationId={activeConversationId}
                groups={groups}
                displayName={displayName}
                email={email}
                initials={initials}
                photoURL={photoURL}
                isGuest={isGuest}
                onNewChat={onNewChat}
                onNavigate={onNavigate}
                onSelectConversation={handleConversationClick}
                onSignOut={handleLogout}
                onRequestSignIn={onRequestSignIn}
                navItems={navItems}
                primaryKey={primaryKey}
              />
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
            onClick={handleSearch}
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

        {/* User avatar / sign-in */}
        <div className="pb-3">
          {isGuest ? (
            <button
              onClick={onRequestSignIn}
              className="w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center cursor-pointer transition-colors"
              title="Sign in"
            >
              <LogIn className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate?.("profile" as ActiveView)}
              className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white text-[11px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              title="Profile"
            >
              {photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials || "SA"
              )}
            </button>
          )}
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
            <MobileSidebarContent
              activeView={activeView}
              activeConversationId={activeConversationId}
              groups={groups}
              displayName={displayName}
              email={email}
              initials={initials}
              photoURL={photoURL}
              isGuest={isGuest}
              onNewChat={onNewChat}
              onNavigate={onNavigate}
              onSelectConversation={handleConversationClick}
              onSignOut={handleLogout}
              onRequestSignIn={onRequestSignIn}
              navItems={navItems}
              primaryKey={primaryKey}
            />
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
        <button
          onClick={handleSearch}
          className="w-full flex items-center gap-2 px-3 py-[6px] rounded-lg border border-border-light bg-card text-text-muted text-[13px] hover:bg-sidebar-hover cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <div className="ml-auto">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          </div>
        </button>
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
        {groups.length === 0 ? (
          <p className="px-3 text-[12px] text-text-muted">
            No conversations yet. Start a new chat to see it here.
          </p>
        ) : (
          groups.map((group) => (
            <ConversationGroupView
              key={group.label}
              label={group.label}
              items={group.items}
              activeId={activeConversationId}
              onItemClick={handleConversationClick}
            />
          ))
        )}
      </div>

      {/* User Profile / Sign-in */}
      <div className="px-3 py-3 border-t border-border-light">
        {isGuest ? (
          <button
            onClick={onRequestSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-medium transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate?.("profile" as ActiveView)}
              className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
                {photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initials || "SA"
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[13px] font-medium text-text-primary truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-text-muted truncate">
                  {email}
                </p>
              </div>
            </button>
            <button onClick={handleLogout} className="p-1 rounded-md hover:bg-sidebar-hover text-text-muted cursor-pointer" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}

function MobileSidebarContent({
  activeView,
  activeConversationId,
  groups,
  displayName,
  email,
  initials,
  photoURL,
  isGuest,
  onNewChat,
  onNavigate,
  onSelectConversation,
  onSignOut,
  onRequestSignIn,
  navItems,
  primaryKey: _primaryKey,
}: {
  activeView: ActiveView;
  activeConversationId: string | null;
  groups: ConversationGroup[];
  displayName: string;
  email: string;
  initials: string;
  photoURL: string;
  isGuest: boolean;
  onNewChat?: () => void;
  onNavigate?: (view: ActiveView) => void;
  onSelectConversation: (id: string) => void;
  onSignOut: () => void;
  onRequestSignIn?: () => void;
  navItems: { icon: React.ComponentType<{ className?: string }>; label: string; view: ActiveView }[];
  primaryKey: string;
}) {
  const { toast } = useToast();
  const handleSearch = () => toast("Search", { description: "⌘K / Ctrl+K — full search coming soon" });
  return (
    <>
      <div className="px-3 pt-2 pb-1">
        <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-medium transition-colors cursor-pointer">
          <Plus className="w-4 h-4" strokeWidth={2} /> New chat
        </button>
      </div>
      <div className="px-3 py-2">
        <button
          onClick={handleSearch}
          className="w-full flex items-center gap-2 px-3 py-[6px] rounded-lg border border-border-light bg-card text-text-muted text-[13px] hover:bg-sidebar-hover cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <div className="ml-auto"><Sparkles className="w-3.5 h-3.5 text-primary-400" /></div>
        </button>
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
        {groups.length === 0 ? (
          <p className="px-3 text-[12px] text-text-muted">
            No conversations yet.
          </p>
        ) : (
          groups.map((group) => (
            <ConversationGroupView
              key={group.label}
              label={group.label}
              items={group.items}
              activeId={activeConversationId}
              onItemClick={onSelectConversation}
            />
          ))
        )}
      </div>
      <div className="px-3 py-3 border-t border-border-light flex items-center gap-2">
        {isGuest ? (
          <button
            onClick={onRequestSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-medium transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </button>
        ) : (
          <>
            <button onClick={() => onNavigate?.("profile" as ActiveView)}
              className="flex items-center gap-2.5 flex-1 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
                {photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initials || "SA"
                )}
              </div>
              <div className="text-left min-w-0">
                <p className="text-[13px] font-medium text-text-primary truncate">{displayName}</p>
                <p className="text-[11px] text-text-muted truncate">{email}</p>
              </div>
            </button>
            <button onClick={onSignOut} className="p-1 rounded-md hover:bg-sidebar-hover text-text-muted cursor-pointer" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </>
  );
}

function ConversationGroupView({
  label,
  items,
  activeId,
  onItemClick,
}: {
  label: string;
  items: Conversation[];
  activeId: string | null;
  onItemClick: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium text-text-muted px-3 pb-1">{label}</p>
      <div className="space-y-[1px]">
        {items.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => onItemClick(c.id)}
              title={c.title}
              className={`w-full text-left px-3 py-[6px] rounded-lg text-[12.5px] transition-colors truncate cursor-pointer ${
                isActive
                  ? "bg-sidebar-active text-primary-600 font-medium"
                  : "text-text-secondary hover:bg-sidebar-hover"
              }`}
            >
              {c.title || "Untitled chat"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
