"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatView from "@/features/chat";
import ExploreContent from "@/features/explore";
import LibraryContent from "@/features/library";
import FilesContent from "@/features/files";
import HistoryContent from "@/features/history";
import WidgetsContent from "@/features/widgets";
import ThemeContent from "@/features/theme";
import ProfileContent from "@/features/profile";
import { useChatStore } from "@/contexts/ChatStoreProvider";
import type { ActiveView } from "@/types";

export type { ActiveView };

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { startNewChat, setActiveConversation } = useChatStore();

  const handleNewChat = () => {
    startNewChat();
    setActiveView("home");
    setMobileSidebarOpen(false);
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    setMobileSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setActiveView("home");
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        activeView={activeView}
        onNewChat={handleNewChat}
        onNavigate={handleNavigate}
        onSelectConversation={handleSelectConversation}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      {activeView === "explore" ? (
        <ExploreContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : activeView === "library" ? (
        <LibraryContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : activeView === "files" ? (
        <FilesContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : activeView === "history" ? (
        <HistoryContent
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
          onOpenConversation={handleSelectConversation}
        />
      ) : activeView === "widgets" ? (
        <WidgetsContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : activeView === "theme" ? (
        <ThemeContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : activeView === "profile" ? (
        <ProfileContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : (
        <ChatView onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      )}
    </div>
  );
}
