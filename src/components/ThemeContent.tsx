"use client";

import {
  Sun,
  Moon,
  Monitor,
  Check,
  Plus,
  Sparkles,
  MessageSquare,
  Menu,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeContent({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const { mode, setMode, resolvedMode, primaryKey, setPrimaryKey, primary, colors } =
    useTheme();

  return (
    <main className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 md:px-8 pt-6 pb-4 border-b border-border-light">
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onMobileMenuOpen} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-hover-bg text-text-muted">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-[20px] md:text-[24px] font-bold text-text-primary">
              Theme Settings
            </h1>
          </div>
          <p className="text-[14px] text-text-secondary">
            Customize appearance and accent color
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
        <div className="max-w-[720px] mx-auto space-y-10">
          {/* Appearance Mode */}
          <section>
            <h2 className="text-[15px] font-semibold text-text-primary mb-1">
              Appearance
            </h2>
            <p className="text-[13px] text-text-muted mb-4">
              Choose how Sondor AI looks on your device
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                {
                  key: "light" as const,
                  icon: Sun,
                  label: "Light",
                  desc: "Classic light theme",
                },
                {
                  key: "dark" as const,
                  icon: Moon,
                  label: "Dark",
                  desc: "Easy on the eyes",
                },
                {
                  key: "system" as const,
                  icon: Monitor,
                  label: "System",
                  desc: "Follow OS setting",
                },
              ]).map(({ key, icon: Icon, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                    mode === key
                      ? "border-primary-500 bg-primary-500/10 shadow-sm"
                      : "border-border-light hover:border-primary-300 bg-card hover:bg-card-hover"
                  }`}
                >
                  {mode === key && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {/* Mini preview */}
                  <div
                    className={`w-full h-20 rounded-xl border overflow-hidden flex ${
                      key === "dark"
                        ? "bg-[#0f0f1a] border-[#2a2a45]"
                        : key === "light"
                          ? "bg-white border-gray-200"
                          : "bg-gradient-to-r from-white to-[#0f0f1a] border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-1/4 h-full ${
                        key === "dark"
                          ? "bg-[#141422] border-r border-[#2a2a45]"
                          : key === "light"
                            ? "bg-[#f8f5ff] border-r border-[#e8e0f0]"
                            : "bg-gradient-to-b from-[#f8f5ff] to-[#141422] border-r border-gray-300"
                      }`}
                    />
                    <div className="flex-1 p-2 flex flex-col gap-1">
                      <div
                        className={`h-2 w-2/3 rounded ${key === "dark" ? "bg-[#2a2a45]" : "bg-gray-200"}`}
                      />
                      <div
                        className={`h-2 w-1/2 rounded ${key === "dark" ? "bg-[#2a2a45]" : "bg-gray-200"}`}
                      />
                      <div
                        className="h-3 w-3/4 rounded mt-auto"
                        style={{ background: primary[500] }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <Icon
                        className={`w-4 h-4 ${mode === key ? "text-primary-500" : "text-text-muted"}`}
                      />
                      <span
                        className={`text-[14px] font-semibold ${mode === key ? "text-primary-600" : "text-text-primary"}`}
                      >
                        {label}
                      </span>
                    </div>
                    <span className="text-[11.5px] text-text-muted">{desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Primary Color */}
          <section>
            <h2 className="text-[15px] font-semibold text-text-primary mb-1">
              Accent Color
            </h2>
            <p className="text-[13px] text-text-muted mb-4">
              Pick a primary color that appears across the interface
            </p>

            {/* Color swatches */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              {Object.entries(colors).map(([key, color]) => (
                <button
                  key={key}
                  onClick={() => setPrimaryKey(key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    primaryKey === key
                      ? "border-primary-500 bg-primary-500/10 shadow-sm"
                      : "border-border-light hover:border-primary-300 bg-card hover:bg-card-hover"
                  }`}
                >
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full shadow-sm"
                      style={{ background: color[500] }}
                    />
                    {primaryKey === key && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-[12px] font-medium text-text-primary">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Shade preview */}
            <div className="p-4 rounded-2xl border border-border-light bg-card">
              <p className="text-[12px] font-medium text-text-muted mb-3">
                Color shades
              </p>
              <div className="flex gap-2 overflow-x-auto">
                {(
                  [50, 100, 200, 300, 400, 500, 600, 700] as const
                ).map((shade) => (
                  <div key={shade} className="flex-1 min-w-[36px] flex flex-col items-center gap-1">
                    <div
                      className="w-full h-10 rounded-lg"
                      style={{ background: primary[shade] }}
                    />
                    <span className="text-[10px] text-text-muted">{shade}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Live Preview */}
          <section>
            <h2 className="text-[15px] font-semibold text-text-primary mb-1">
              Live Preview
            </h2>
            <p className="text-[13px] text-text-muted mb-4">
              See how your theme looks in context
            </p>

            <div
              className={`rounded-2xl border overflow-hidden ${
                resolvedMode === "dark"
                  ? "bg-[#0f0f1a] border-[#2a2a45]"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex h-[280px] overflow-hidden">
                {/* Mini sidebar */}
                <div
                  className="hidden sm:flex w-[180px] flex-col p-3 border-r"
                  style={{
                    background:
                      resolvedMode === "dark" ? "#141422" : primary.sidebar,
                    borderColor:
                      resolvedMode === "dark" ? "#2a2a45" : primary.borderLight,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={`/assets/logo-${primaryKey}.png`}
                      alt="Sondor AI"
                      className="w-5 h-5 rounded-md object-contain"
                    />
                    <span
                      className="text-[11px] font-semibold"
                      style={{
                        color:
                          resolvedMode === "dark" ? "#e4e4ef" : "#1a1a2e",
                      }}
                    >
                      Sondor AI
                    </span>
                  </div>
                  <div
                    className="w-full py-1.5 rounded-md text-white text-[10px] font-medium text-center mb-3"
                    style={{ background: primary[500] }}
                  >
                    New chat
                  </div>
                  {["Explore", "Library", "Files"].map((item) => (
                    <div
                      key={item}
                      className="px-2 py-1.5 rounded-md text-[10px] mb-0.5"
                      style={{
                        color:
                          resolvedMode === "dark" ? "#9ca3bc" : "#6b7280",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Mini main content */}
                <div className="flex-1 flex flex-col p-4">
                  <div className="flex-1 space-y-3">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div
                        className="px-3 py-1.5 rounded-xl rounded-br-sm text-white text-[10px] max-w-[60%]"
                        style={{
                          background: `linear-gradient(to right, ${primary[500]}, ${primary[600]})`,
                        }}
                      >
                        How does dark mode work?
                      </div>
                    </div>
                    {/* Assistant message */}
                    <div className="flex gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${primary[400]}, ${primary[600]})`,
                        }}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                      </div>
                      <div
                        className="text-[10px] leading-relaxed max-w-[70%]"
                        style={{
                          color:
                            resolvedMode === "dark" ? "#e4e4ef" : "#1a1a2e",
                        }}
                      >
                        Dark mode reduces eye strain by using a darker background
                        with lighter text. It adapts all interface elements.
                      </div>
                    </div>
                    {/* Suggestion cards */}
                    <div className="flex gap-2 mt-2">
                      {["Design tips", "Best practices"].map((t) => (
                        <div
                          key={t}
                          className="px-2.5 py-1.5 rounded-lg border text-[9px]"
                          style={{
                            borderColor:
                              resolvedMode === "dark"
                                ? "#2a2a45"
                                : primary.borderLight,
                            color:
                              resolvedMode === "dark" ? "#9ca3bc" : "#6b7280",
                            background:
                              resolvedMode === "dark" ? "#181830" : "#ffffff",
                          }}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Mini input */}
                  <div
                    className="rounded-xl border px-3 py-2 flex items-center gap-2 mt-3"
                    style={{
                      borderColor:
                        resolvedMode === "dark"
                          ? "#2a2a45"
                          : primary.borderLight,
                      background:
                        resolvedMode === "dark" ? "#181830" : "#ffffff",
                    }}
                  >
                    <span
                      className="text-[10px] flex-1"
                      style={{
                        color:
                          resolvedMode === "dark" ? "#6b7294" : "#9ca3af",
                      }}
                    >
                      Ask anything...
                    </span>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${primary[400]}, ${primary[600]})`,
                      }}
                    >
                      <MessageSquare className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
