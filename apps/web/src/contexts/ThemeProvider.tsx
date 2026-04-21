"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Mode = "light" | "dark" | "system";
export type ThemePreset = "default" | "zyricon";

interface PresetMeta {
  key: ThemePreset;
  name: string;
  description: string;
  /** When set, switching to this preset forces the resolved mode. */
  forceMode?: "light" | "dark";
  /** When set, switching to this preset forces the primary color key. */
  forcePrimary?: string;
}

export const themePresets: PresetMeta[] = [
  {
    key: "default",
    name: "Default",
    description: "Standard Sondor look — works with every accent color and mode.",
  },
  {
    key: "zyricon",
    name: "Zyricon",
    description: "Cosmic violet gradient with glassmorphism and glowing accents.",
    forceMode: "dark",
    forcePrimary: "purple",
  },
];

interface PrimaryColor {
  name: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  sidebar: string;
  sidebarHover: string;
  sidebarActive: string;
  borderLight: string;
}

const primaryColors: Record<string, PrimaryColor> = {
  purple: {
    name: "Purple",
    50: "#f5f0ff", 100: "#ede5ff", 200: "#d4c4f7", 300: "#b89df0",
    400: "#9b6de6", 500: "#7c3aed", 600: "#6d28d9", 700: "#5b21b6",
    sidebar: "#f8f5ff", sidebarHover: "#efe8ff", sidebarActive: "#e8dff5", borderLight: "#e8e0f0",
  },
  blue: {
    name: "Blue",
    50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
    400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8",
    sidebar: "#f0f5ff", sidebarHover: "#e0ecff", sidebarActive: "#d0e0f8", borderLight: "#d8e4f0",
  },
  emerald: {
    name: "Emerald",
    50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7",
    400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857",
    sidebar: "#f0fdf5", sidebarHover: "#e0f8ec", sidebarActive: "#d0f0e0", borderLight: "#d0e8d8",
  },
  rose: {
    name: "Rose",
    50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af",
    400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c",
    sidebar: "#fff5f6", sidebarHover: "#ffe8ea", sidebarActive: "#fdd8dc", borderLight: "#f0d8dc",
  },
  amber: {
    name: "Amber",
    50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d",
    400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309",
    sidebar: "#fffcf0", sidebarHover: "#fff5e0", sidebarActive: "#ffecd0", borderLight: "#f0e4d0",
  },
  cyan: {
    name: "Cyan",
    50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9",
    400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490",
    sidebar: "#f0fdff", sidebarHover: "#e0f8fc", sidebarActive: "#d0f0f5", borderLight: "#d0e8f0",
  },
};

interface ThemeContextType {
  mode: Mode;
  setMode: (m: Mode) => void;
  resolvedMode: "light" | "dark";
  primaryKey: string;
  setPrimaryKey: (key: string) => void;
  primary: PrimaryColor;
  colors: typeof primaryColors;
  preset: ThemePreset;
  setPreset: (p: ThemePreset) => void;
  presets: PresetMeta[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("light");
  const [primaryKey, setPrimaryKeyState] = useState("purple");
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");
  const [preset, setPresetState] = useState<ThemePreset>("default");

  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode") as Mode | null;
    const savedColor = localStorage.getItem("theme-primary");
    const savedPreset = localStorage.getItem("theme-preset") as ThemePreset | null;
    if (savedMode) setModeState(savedMode);
    if (savedColor && primaryColors[savedColor]) setPrimaryKeyState(savedColor);
    if (savedPreset && themePresets.some((p) => p.key === savedPreset)) {
      setPresetState(savedPreset);
    }
  }, []);

  useEffect(() => {
    const meta = themePresets.find((p) => p.key === preset);
    if (meta?.forceMode) {
      setResolvedMode(meta.forceMode);
      return;
    }
    const resolve = () => {
      if (mode === "system") {
        const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setResolvedMode(dark ? "dark" : "light");
      } else {
        setResolvedMode(mode);
      }
    };
    resolve();
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", resolve);
    return () => mql.removeEventListener("change", resolve);
  }, [mode, preset]);

  useEffect(() => {
    if (preset === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", preset);
    }
  }, [preset]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedMode === "dark");
  }, [resolvedMode]);

  useEffect(() => {
    const c = primaryColors[primaryKey] ?? primaryColors.purple;
    const root = document.documentElement;

    root.style.setProperty("--color-primary-50", c[50]);
    root.style.setProperty("--color-primary-100", c[100]);
    root.style.setProperty("--color-primary-200", c[200]);
    root.style.setProperty("--color-primary-300", c[300]);
    root.style.setProperty("--color-primary-400", c[400]);
    root.style.setProperty("--color-primary-500", c[500]);
    root.style.setProperty("--color-primary-600", c[600]);
    root.style.setProperty("--color-primary-700", c[700]);

    if (resolvedMode === "light") {
      root.style.setProperty("--color-sidebar", c.sidebar);
      root.style.setProperty("--color-sidebar-hover", c.sidebarHover);
      root.style.setProperty("--color-sidebar-active", c.sidebarActive);
      root.style.setProperty("--color-border-light", c.borderLight);
    } else {
      root.style.removeProperty("--color-sidebar");
      root.style.removeProperty("--color-sidebar-hover");
      root.style.removeProperty("--color-sidebar-active");
      root.style.removeProperty("--color-border-light");
    }
  }, [primaryKey, resolvedMode]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    localStorage.setItem("theme-mode", m);
  }, []);

  const setPrimaryKey = useCallback((key: string) => {
    setPrimaryKeyState(key);
    localStorage.setItem("theme-primary", key);
  }, []);

  const setPreset = useCallback((p: ThemePreset) => {
    setPresetState(p);
    localStorage.setItem("theme-preset", p);
    const meta = themePresets.find((m) => m.key === p);
    if (meta?.forcePrimary && primaryColors[meta.forcePrimary]) {
      setPrimaryKeyState(meta.forcePrimary);
      localStorage.setItem("theme-primary", meta.forcePrimary);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        resolvedMode,
        primaryKey,
        setPrimaryKey,
        primary: primaryColors[primaryKey] ?? primaryColors.purple,
        colors: primaryColors,
        preset,
        setPreset,
        presets: themePresets,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
