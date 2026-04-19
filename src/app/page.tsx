"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import ExploreContent from "@/components/ExploreContent";
import LibraryContent from "@/components/LibraryContent";
import FilesContent from "@/components/FilesContent";
import HistoryContent from "@/components/HistoryContent";
import WidgetsContent from "@/components/WidgetsContent";
import ThemeContent from "@/components/ThemeContent";
import ProfileContent from "@/components/ProfileContent";

export type ActiveView = "home" | "explore" | "library" | "files" | "history" | "widgets" | "theme" | "profile";

export default function Home() {
  const [chatKey, setChatKey] = useState(0);
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleNewChat = () => {
    setChatKey((k) => k + 1);
    setActiveView("home");
    setMobileSidebarOpen(false);
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        activeView={activeView}
        onNewChat={handleNewChat}
        onNavigate={handleNavigate}
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
        <HistoryContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : activeView === "widgets" ? (
        <WidgetsContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : activeView === "theme" ? (
        <ThemeContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : activeView === "profile" ? (
        <ProfileContent onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      ) : (
        <MainContent key={chatKey} onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
      )}
    </div>
  );
}
