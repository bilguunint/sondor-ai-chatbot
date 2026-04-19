"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Bell,
  Shield,
  Globe,
  CreditCard,
  KeyRound,
  LogOut,
  Camera,
  ChevronRight,
  Menu,
} from "lucide-react";

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", desc: "Update your name, bio, and avatar" },
      { icon: Mail, label: "Email Settings", desc: "Manage email preferences and notifications" },
      { icon: KeyRound, label: "Password & Security", desc: "Change password and enable 2FA" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", desc: "Configure push and email notifications" },
      { icon: Globe, label: "Language & Region", desc: "Set your preferred language and timezone" },
      { icon: Shield, label: "Privacy", desc: "Manage data sharing and visibility" },
    ],
  },
  {
    title: "Billing",
    items: [
      { icon: CreditCard, label: "Subscription", desc: "Manage your plan and payment methods" },
    ],
  },
];

const recentActivity = [
  { action: "Changed accent color to Blue", time: "2 hours ago" },
  { action: "Uploaded project-spec.pdf", time: "5 hours ago" },
  { action: "Created new prompt template", time: "Yesterday" },
  { action: "Started 12 new conversations", time: "This week" },
];

export default function ProfileContent({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const [notificationsOn, setNotificationsOn] = useState(true);

  return (
    <main className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      <header className="shrink-0 px-4 md:px-8 pt-6 pb-4 border-b border-border-light">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={onMobileMenuOpen} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-hover-bg text-text-muted">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-[20px] md:text-[24px] font-bold text-text-primary">Profile</h1>
          </div>
          <p className="text-[14px] text-text-secondary mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-[960px] mx-auto space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-border-light bg-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white text-[24px] font-bold">
                  BN
                </div>
                <button className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-[20px] font-bold text-text-primary">Bilguun Nyamlhagva</h2>
                <p className="text-[14px] text-text-muted mt-0.5">bilguunint@gmail.com</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500 text-[11px] font-semibold">
                    Pro Plan
                  </span>
                  <span className="text-[12px] text-text-muted">Member since Jan 2025</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl border border-border-light bg-card hover:bg-hover-bg text-[13px] font-medium text-text-primary transition-colors cursor-pointer">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Conversations", value: "142" },
              { label: "Messages Sent", value: "1,847" },
              { label: "Files Uploaded", value: "38" },
              { label: "Prompts Saved", value: "24" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border-light bg-card p-4 text-center"
              >
                <p className="text-[22px] font-bold text-text-primary">{stat.value}</p>
                <p className="text-[12px] text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Settings Sections */}
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="rounded-xl border border-border-light bg-card divide-y divide-border-light overflow-hidden">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-hover-bg transition-colors cursor-pointer text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4.5 h-4.5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-text-primary">{item.label}</p>
                      <p className="text-[12px] text-text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Recent Activity */}
          <div>
            <h3 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">
              Recent Activity
            </h3>
            <div className="rounded-xl border border-border-light bg-card divide-y divide-border-light overflow-hidden">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <p className="text-[13px] text-text-primary">{item.action}</p>
                  <span className="text-[11px] text-text-muted shrink-0 ml-4">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sign Out */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-[13px] font-medium transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
