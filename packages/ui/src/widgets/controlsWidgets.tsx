"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, Globe, Zap, Moon, Volume2, Shield, Tag, X, Calendar, Palette, Keyboard } from "lucide-react";

export function DropdownSelectWidget() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("GPT-4o");
  const models = ["GPT-4o", "Claude 4 Opus", "Gemini 2.5", "Llama 3.1"];
  return (
    <div>
      <label className="text-xs font-medium text-gray-400 mb-1 block">AI Model</label>
      <div className="relative">
        <button onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />{selected}
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-10 w-full mt-1 rounded-lg border bg-white dark:bg-gray-900 shadow-lg py-1">
            {models.map((m) => (
              <button key={m} onClick={() => { setSelected(m); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-purple-50 ${
                  m === selected ? "text-purple-600 font-medium" : ""}`}>
                {m}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ToggleSettingsWidget() {
  const [toggles, setToggles] = useState({
    streaming: true, darkMode: false, sound: true, privacy: true
  });
  const items = [
    { key: "streaming" as const, label: "Stream Responses", desc: "Show typing animation", icon: Zap },
    { key: "darkMode" as const, label: "Dark Mode", desc: "Toggle dark theme", icon: Moon },
    { key: "sound" as const, label: "Sound Effects", desc: "Notification sounds", icon: Volume2 },
    { key: "privacy" as const, label: "Privacy Mode", desc: "Hide chat history", icon: Shield },
  ];
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2.5">
          <item.icon className="w-4 h-4 text-gray-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium">{item.label}</p>
            <p className="text-[10px] text-gray-400">{item.desc}</p>
          </div>
          <button onClick={() => setToggles(p => ({ ...p, [item.key]: !p[item.key] }))}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              toggles[item.key] ? "bg-purple-500" : "bg-gray-200"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
              toggles[item.key] ? "left-[18px]" : "left-0.5"}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ModelSelectorWidget() {
  const [selected, setSelected] = useState(0);
  const models = [
    { name: "GPT-4o", speed: "Fast", accuracy: "95%", badge: "Popular" },
    { name: "Claude 4", speed: "Medium", accuracy: "97%", badge: "Most Accurate" },
    { name: "Gemini 2.5", speed: "Very Fast", accuracy: "92%", badge: "Fastest" },
  ];
  return (
    <div>
      <span className="text-sm font-semibold">Choose Model</span>
      <div className="mt-2.5 space-y-2">
        {models.map((m, i) => (
          <button key={m.name} onClick={() => setSelected(i)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left ${
              selected === i ? "border-purple-300 bg-purple-50 shadow-sm" : "border-gray-200"}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              selected === i ? "border-purple-500" : "border-gray-200"}`}>
              {selected === i && <div className="w-2 h-2 rounded-full bg-purple-500" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold">{m.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">{m.badge}</span>
              </div>
              <div className="flex gap-3 mt-0.5">
                <span className="text-[10px] text-gray-400">Speed: {m.speed}</span>
                <span className="text-[10px] text-gray-400">Accuracy: {m.accuracy}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TagInputWidget() {
  const [tags, setTags] = useState(["billing", "urgent", "api-error", "v2.1"]);
  const [input, setInput] = useState("");
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Tag className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-sm font-semibold">Conversation Tags</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
            bg-gray-100 dark:bg-gray-800 border">
            {tag}
            <button onClick={() => setTags(tags.filter(t => t !== tag))}><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { setTags([...tags, input.trim()]); setInput(""); }}}
          placeholder="Add tag..." className="flex-1 px-3 py-1.5 rounded-lg border text-xs outline-none" />
        <button onClick={() => { if (input.trim()) { setTags([...tags, input.trim()]); setInput(""); }}}
          className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-medium">Add</button>
      </div>
    </div>
  );
}

export function DatePickerWidget() {
  const [selectedDay, setSelectedDay] = useState(15);
  const daysInMonth = 30;
  const startDay = 2;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-sm font-semibold">April 2026</span>
        </div>
        <div className="flex gap-1">
          <button className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-xs">‹</button>
          <button className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-xs">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <span key={d} className="text-[9px] font-medium text-gray-400 py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {blanks.map(b => <span key={`b${b}`} />)}
        {days.map(d => (
          <button key={d} onClick={() => setSelectedDay(d)}
            className={`w-full aspect-square rounded-md text-[10px] font-medium ${
              d === selectedDay ? "bg-purple-500 text-white shadow-sm"
              : d === 19 ? "bg-purple-50 text-purple-600 font-semibold"
              : "hover:bg-gray-100"}`}>
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ThemeCustomizerWidget() {
  const [activeColor, setActiveColor] = useState(3);
  const colors = [
    { name: "Red", bg: "bg-red-500", ring: "ring-red-300" },
    { name: "Amber", bg: "bg-amber-500", ring: "ring-amber-300" },
    { name: "Emerald", bg: "bg-emerald-500", ring: "ring-emerald-300" },
    { name: "Purple", bg: "bg-purple-500", ring: "ring-purple-300" },
    { name: "Blue", bg: "bg-blue-500", ring: "ring-blue-300" },
    { name: "Pink", bg: "bg-pink-500", ring: "ring-pink-300" },
  ];
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-3.5 h-3.5 text-purple-500" />
        <span className="text-sm font-semibold">Theme Customizer</span>
      </div>
      <label className="text-xs text-gray-400 mb-1.5 block">Accent Color</label>
      <div className="flex gap-2 mb-3">
        {colors.map((c, i) => (
          <button key={c.name} onClick={() => setActiveColor(i)}
            className={`w-7 h-7 rounded-full ${c.bg} ${
              activeColor === i ? `ring-2 ${c.ring} ring-offset-2 scale-110` : "hover:scale-105"}`} />
        ))}
      </div>
      <label className="text-xs text-gray-400 mb-1.5 block">Font Size</label>
      <div className="flex gap-1.5">
        {["Small", "Medium", "Large"].map((s, i) => (
          <button key={s} className={`flex-1 py-1.5 rounded-md text-xs font-medium ${
            i === 1 ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-500"}`}>{s}</button>
        ))}
      </div>
    </div>
  );
}

export function KeyboardShortcutsWidget() {
  const shortcuts = [
    { keys: ["?", "K"], desc: "Open command palette" },
    { keys: ["?", "N"], desc: "New conversation" },
    { keys: ["?", "?", "C"], desc: "Copy last response" },
    { keys: ["?", "/"], desc: "Toggle sidebar" },
    { keys: ["Esc"], desc: "Close modal" },
    { keys: ["Enter"], desc: "Send message" },
  ];
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Keyboard className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-sm font-semibold">Keyboard Shortcuts</span>
      </div>
      <div className="space-y-1.5">
        {shortcuts.map((s) => (
          <div key={s.desc} className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-500">{s.desc}</span>
            <div className="flex gap-1">
              {s.keys.map((k, i) => (
                <kbd key={`${s.desc}-${i}`} className="min-w-[22px] h-[22px] rounded-md bg-gray-100 border text-[10px]
                  font-mono font-medium flex items-center justify-center px-1.5 shadow-sm">{k}</kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
