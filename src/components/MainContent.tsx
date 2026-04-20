"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronDown,
  MoreHorizontal,
  Link2,
  Download,
  Sparkles,
  Globe,
  Camera,
  Lightbulb,
  Paperclip,
  RotateCcw,
  ClipboardCheck,
  Languages,
  HelpCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Pin,
  RefreshCw,
  Plus,
  Mic,
  AudioLines,
  X,
  Check,
  Zap,
  Crown,
  Building2,
  Menu,
  Code2,
  FileDown,
  Image as ImageIcon,
  Play,
  Pause,
  Volume2,
  Terminal,
  Eye,
  FileText,
} from "lucide-react";

import { useTheme } from "./ThemeProvider";

type ResponseType = "default" | "code" | "file" | "audio" | "image";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinkingTime?: number;
  responseType?: ResponseType;
}

const aiModels = [
  { id: "sondor-4o", name: "Sondor 4o", desc: "Fastest model for everyday tasks", badge: null },
  { id: "sondor-ultra", name: "Sondor Ultra", desc: "Deep reasoning for complex problems", badge: "Pro" },
  { id: "sondor-vision", name: "Sondor Vision", desc: "Analyze images and visual content", badge: null },
  { id: "sondor-code", name: "Sondor Code", desc: "Specialized in writing and debugging code", badge: null },
  { id: "sondor-mini", name: "Sondor Mini", desc: "Lightweight and fast responses", badge: "Free" },
  { id: "sondor-reason", name: "Sondor Reason", desc: "Logic, math, and scientific reasoning", badge: "New" },
];

const researchOptions: { id: ResponseType; icon: typeof Sparkles; label: string; desc: string; color: string }[] = [
  { id: "default", icon: Sparkles, label: "Default", desc: "Standard response", color: "text-primary-500 bg-primary-500/10" },
  { id: "code", icon: Code2, label: "Coding", desc: "Code generation", color: "text-emerald-500 bg-emerald-500/10" },
  { id: "file", icon: FileDown, label: "File", desc: "File sharing", color: "text-blue-500 bg-blue-500/10" },
  { id: "audio", icon: AudioLines, label: "Audio", desc: "Audio player", color: "text-amber-500 bg-amber-500/10" },
  { id: "image", icon: ImageIcon, label: "Image", desc: "Image preview", color: "text-rose-500 bg-rose-500/10" },
];

const mockResponses: Record<string, string> = {
  default:
    "Hello! I'm Sondor AI assistant. Just tell me what you need, and I'll help you in the best way possible.",
};

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return "Hi there! I'm here to help. Just let me know what you need, and I'll assist you right away.";
  if (lower.includes("plan") || lower.includes("schedule") || lower.includes("organize"))
    return "I'd love to help you plan! Let's start by defining your goals, then break them down step by step. What type of plan do you need? For example: weekly, monthly, or project-based planning.";
  if (lower.includes("code") || lower.includes("program") || lower.includes("develop"))
    return "I'd be happy to help with coding! What programming language are you working with? JavaScript, Python, TypeScript, or something else? Also, please describe what functionality you need in detail.";
  if (lower.includes("idea") || lower.includes("brainstorm") || lower.includes("creative"))
    return "Let me help you brainstorm! What area do you need ideas for? Business, marketing, design, or a creative project? Tell me about your current situation.";
  return mockResponses.default;
}

function getMockTypedResponse(userMessage: string, type: ResponseType): string {
  switch (type) {
    case "code":
      return `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;
    case "file":
      return "project-analysis-report.pdf|2.4 MB|A comprehensive analysis of your project structure, dependencies, and optimization recommendations.";
    case "audio":
      return "Beautiful Melody for kids|3:42|A podcast-style audio summary of your conversation highlights and key takeaways.";
    case "image":
      return (userMessage || "A futuristic cityscape at golden hour with towering glass skyscrapers") + "|1024x1024";
    default:
      return getMockResponse(userMessage);
  }
}

const suggestions = [
  {
    icon: RotateCcw,
    title: "Synthesize Data",
    description: "Turn my meeting notes into 5 key bullet points for the team.",
  },
  {
    icon: Lightbulb,
    title: "Creative Brainstorm",
    description: "Generate 3 taglines for a new sustainable fashion brand.",
  },
  {
    icon: ClipboardCheck,
    title: "Check Facts",
    description: "Compare key differences between GDPR and CCPA.",
  },
];

export default function MainContent({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const [view, setView] = useState<"home" | "chat">("home");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [thinkingSeconds, setThinkingSeconds] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [selectedModel, setSelectedModel] = useState(aiModels[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [responseType, setResponseType] = useState<ResponseType>("default");
  const [showResearchDropdown, setShowResearchDropdown] = useState(false);
  const [activeResponseType, setActiveResponseType] = useState<ResponseType>("default");
  const { primaryKey } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const researchDropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText, scrollToBottom]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    if (showModelDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModelDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (researchDropdownRef.current && !researchDropdownRef.current.contains(e.target as Node)) {
        setShowResearchDropdown(false);
      }
    };
    if (showResearchDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showResearchDropdown]);

  const simulateResponse = useCallback((userMsg: string, type: ResponseType = "default") => {
    const response = type === "default" ? getMockResponse(userMsg) : getMockTypedResponse(userMsg, type);
    const thinkTime = type === "default" ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 2) + 3;

    setActiveResponseType(type);
    setIsThinking(true);
    setThinkingSeconds(0);
    const thinkInterval = setInterval(() => {
      setThinkingSeconds((s) => s + 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(thinkInterval);
      setIsThinking(false);

      if (type !== "default") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: response,
            thinkingTime: thinkTime,
            responseType: type,
          },
        ]);
        return;
      }

      setIsTyping(true);
      setTypingText("");

      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < response.length) {
          setTypingText(response.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setTypingText("");
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: response,
              thinkingTime: thinkTime,
              responseType: type,
            },
          ]);
        }
      }, 20);
    }, thinkTime * 1000);
  }, []);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    if (view === "home") {
      setIsTransitioning(true);
      setTimeout(() => {
        setView("chat");
        setMessages([userMessage]);
        setInputValue("");
        setIsTransitioning(false);
        simulateResponse(text, responseType);
      }, 400);
    } else {
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      simulateResponse(text, responseType);
    }
  }, [inputValue, view, simulateResponse, responseType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    setTimeout(() => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: text,
      };
      setIsTransitioning(true);
      setTimeout(() => {
        setView("chat");
        setMessages([userMessage]);
        setInputValue("");
        setIsTransitioning(false);
        simulateResponse(text, responseType);
      }, 400);
    }, 100);
  };

  return (
    <main className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <button onClick={onMobileMenuOpen} className="md:hidden p-2 rounded-lg hover:bg-hover-bg text-text-muted">
            <Menu className="w-5 h-5" />
          </button>
        <div className="relative" ref={modelDropdownRef}>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-hover-bg transition-colors cursor-pointer"
          >
            <span className="text-[14px] font-semibold text-text-primary">
              {selectedModel.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${showModelDropdown ? "rotate-180" : ""}`} />
          </button>

          {showModelDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-[260px] md:w-[280px] rounded-xl border border-border-light bg-card shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-2 border-b border-border-light">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Model</span>
              </div>
              {aiModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => { setSelectedModel(model); setShowModelDropdown(false); }}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-hover-bg transition-colors cursor-pointer ${
                    selectedModel.id === model.id ? "bg-primary-500/10" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-text-primary">{model.name}</span>
                      {model.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          model.badge === "Pro" ? "bg-amber-500/15 text-amber-500"
                          : model.badge === "New" ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-primary-500/15 text-primary-500"
                        }`}>
                          {model.badge}
                        </span>
                      )}
                      {selectedModel.id === model.id && (
                        <Check className="w-3.5 h-3.5 text-primary-500 ml-auto" />
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5">{model.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        </div>
        <div className="flex items-center gap-1 md:gap-3">
          <button className="hidden sm:flex p-2 rounded-lg hover:bg-hover-bg text-text-muted">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button className="hidden sm:flex p-2 rounded-lg hover:bg-hover-bg text-text-muted">
            <Link2 className="w-4 h-4" />
          </button>
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-hover-bg text-text-secondary text-[13px]">
            <Download className="w-4 h-4" />
            <span>Export chat</span>
          </button>
          <button
            onClick={() => setShowPricing(true)}
            className="px-3 sm:px-4 py-1.5 rounded-lg bg-text-primary text-background text-[12px] sm:text-[13px] font-medium hover:opacity-90 transition-colors cursor-pointer"
          >
            Upgrade
          </button>
        </div>
      </header>

      {/* ====== HOME VIEW ====== */}
      {view === "home" && (
        <div
          className={`flex-1 flex flex-col items-center justify-center px-4 sm:px-6 -mt-4 sm:-mt-8 transition-all duration-400 ${
            isTransitioning
              ? "opacity-0 translate-y-8 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          {/* Avatar / Orb */}
          <div className="relative mb-6">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary-200 via-primary-300 to-primary-400 opacity-60 blur-sm absolute inset-0" />
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary-100 via-primary-200 to-primary-400 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 opacity-80" />
            </div>
          </div>

          {/* Greeting */}
          <h2 className="text-[18px] sm:text-[22px] font-normal bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-1">
            Hello, Bilguun
          </h2>
          <h1 className="text-[22px] sm:text-[28px] font-bold text-text-primary mb-8">
            How can I assist you today?
          </h1>

          {/* Chat Input */}
          <div className="w-full max-w-[560px] mb-4">
            <div className="rounded-2xl border border-border-light bg-card shadow-sm px-4 py-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="w-full text-[14px] text-text-primary placeholder:text-text-muted outline-none bg-transparent"
              />
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-light">
                <div className="flex items-center gap-2">
                  <div className="relative" ref={researchDropdownRef}>
                    <button
                      onClick={() => setShowResearchDropdown(!showResearchDropdown)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-200 bg-primary-50 text-primary-600 text-[11px] font-medium hover:bg-primary-100 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {(() => { const opt = researchOptions.find(o => o.id === responseType); const Icon = opt?.icon || Sparkles; return <Icon className="w-3.5 h-3.5" />; })()}
                      {researchOptions.find(o => o.id === responseType)?.label || "Default"}
                      <ChevronDown className={`w-3 h-3 transition-transform ${showResearchDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showResearchDropdown && (
                      <div className="absolute bottom-full left-0 mb-2 w-[220px] rounded-xl border border-border-light bg-card shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-bottom-1 duration-150">
                        <div className="px-3 py-1.5 border-b border-border-light">
                          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Response Type</span>
                        </div>
                        {researchOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => { setResponseType(opt.id); setShowResearchDropdown(false); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-hover-bg transition-colors cursor-pointer ${responseType === opt.id ? "bg-primary-500/10" : ""}`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${opt.color}`}>
                              <opt.icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[12px] font-semibold text-text-primary">{opt.label}</span>
                              <p className="text-[10px] text-text-muted">{opt.desc}</p>
                            </div>
                            {responseType === opt.id && <Check className="w-3.5 h-3.5 text-primary-500" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
                    <ClipboardCheck className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
                    <Camera className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
                    <Globe className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSend}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center hover:from-primary-500 hover:to-primary-700 transition-all cursor-pointer"
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Prompts */}
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-1.5 text-[12.5px] text-primary-500 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Saved prompts
              </div>
              <div className="flex items-center gap-1.5 text-[12.5px] text-text-muted">
                <Paperclip className="w-3.5 h-3.5" />
                Attach file
              </div>
            </div>
          </div>

          {/* Suggestion Cards */}
          <div className="w-full max-w-[560px] grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {suggestions.map(({ icon: Icon, title, description }) => (
              <button
                key={title}
                onClick={() => handleSuggestionClick(description)}
                className="flex flex-col gap-2 p-4 rounded-xl border border-border-light bg-card hover:bg-card-hover hover:border-primary-200 transition-all text-left group cursor-pointer"
              >
                <Icon className="w-4 h-4 text-text-muted group-hover:text-primary-500 transition-colors" />
                <p className="text-[13px] font-semibold text-text-primary">
                  {title}
                </p>
                <p className="text-[11.5px] text-text-secondary leading-relaxed">
                  {description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ====== CHAT VIEW ====== */}
      {view === "chat" && (
        <div className="flex-1 flex flex-col overflow-hidden animate-chat-enter">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
            <div className="max-w-[720px] mx-auto space-y-6">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    <UserBubble content={msg.content} />
                  ) : msg.responseType === "code" ? (
                    <CodeBubble content={msg.content} thinkingTime={msg.thinkingTime} />
                  ) : msg.responseType === "file" ? (
                    <FileBubble content={msg.content} thinkingTime={msg.thinkingTime} />
                  ) : msg.responseType === "audio" ? (
                    <AudioBubble content={msg.content} thinkingTime={msg.thinkingTime} />
                  ) : msg.responseType === "image" ? (
                    <ImageBubble content={msg.content} thinkingTime={msg.thinkingTime} />
                  ) : (
                    <AssistantBubble
                      content={msg.content}
                      thinkingTime={msg.thinkingTime}
                    />
                  )}
                </div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <>
                  {activeResponseType === "default" && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[13px] text-text-muted">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse [animation-delay:200ms]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse [animation-delay:400ms]" />
                          </div>
                          <span>Thinking for {thinkingSeconds}s</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeResponseType === "code" && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Terminal className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="rounded-xl overflow-hidden border border-[#313244] bg-[#1e1e2e] max-w-[320px]">
                          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#181825] border-b border-[#313244]">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#f38ba8]/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#f9e2af]/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#a6e3a1]/60" />
                            <span className="text-[10px] text-[#6c7086] ml-2 font-mono">compiling</span>
                          </div>
                          <div className="px-3 py-2.5">
                            <div className="font-mono text-[12px]">
                              <span className="text-[#6c7086]">$</span>
                              <span className="text-emerald-400 ml-1.5">analyzing code</span>
                              <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-1 animate-pulse align-text-bottom" />
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1 bg-[#313244] rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(thinkingSeconds * 20, 90)}%` }} />
                              </div>
                              <span className="text-[10px] text-[#6c7086] font-mono">{thinkingSeconds}s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeResponseType === "file" && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="rounded-xl border border-border-light bg-card px-4 py-3 max-w-[280px]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-500 animate-bounce" style={{ animationDuration: '1.5s' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium text-text-primary">Processing document...</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex-1 h-1.5 bg-blue-500/15 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(thinkingSeconds * 25, 95)}%` }} />
                                </div>
                                <span className="text-[10px] text-text-muted">{thinkingSeconds}s</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeResponseType === "audio" && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Volume2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="rounded-xl border border-border-light bg-card px-4 py-3 max-w-[300px]">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-[12px] font-medium text-text-primary">Generating audio...</p>
                            <span className="text-[10px] text-text-muted">{thinkingSeconds}s</span>
                          </div>
                          <div className="flex items-end gap-[3px] h-8">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-amber-500 rounded-full animate-waveform"
                                style={{ animationDelay: `${i * 80}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeResponseType === "image" && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <ImageIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="rounded-xl border border-border-light bg-card overflow-hidden max-w-[200px]">
                          <div className="aspect-square grid grid-cols-6 grid-rows-6 gap-[2px] p-2">
                            {Array.from({ length: 36 }).map((_, i) => (
                              <div
                                key={i}
                                className="rounded-sm animate-pixel-fill"
                                style={{
                                  backgroundColor: `hsl(${340 + i * 3}, 70%, ${65}%)`,
                                  animationDelay: `${i * 50}ms`,
                                  opacity: i < thinkingSeconds * 8 ? 1 : 0.1,
                                }}
                              />
                            ))}
                          </div>
                          <div className="px-3 pb-2 flex items-center justify-between">
                            <span className="text-[11px] text-text-muted">Rendering...</span>
                            <span className="text-[10px] text-text-muted">{thinkingSeconds}s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Typing indicator */}
              {isTyping && typingText && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-text-muted mb-2 italic">
                      Thought for {thinkingSeconds}s
                    </p>
                    <div className="text-[14px] text-text-primary leading-relaxed">
                      {typingText}
                      <span className="inline-block w-0.5 h-4 bg-primary-500 animate-blink ml-0.5 align-text-bottom" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Chat Input */}
          <div className="shrink-0 px-4 md:px-6 py-4 border-t border-border-light bg-background">
            <div className="max-w-[720px] mx-auto">
              <div className="rounded-2xl border border-border-light bg-card shadow-sm px-4 py-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="w-full text-[14px] text-text-primary placeholder:text-text-muted outline-none bg-transparent"
                  autoFocus
                />
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border-light">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="relative" ref={view === "chat" ? researchDropdownRef : undefined}>
                      <button
                        onClick={() => setShowResearchDropdown(!showResearchDropdown)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-200 bg-primary-50 text-primary-600 text-[12px] font-medium hover:bg-primary-100 transition-colors cursor-pointer"
                      >
                        {(() => { const opt = researchOptions.find(o => o.id === responseType); const Icon = opt?.icon || Sparkles; return <Icon className="w-3.5 h-3.5" />; })()}
                        {researchOptions.find(o => o.id === responseType)?.label || "Default"}
                        <ChevronDown className={`w-3 h-3 transition-transform ${showResearchDropdown ? "rotate-180" : ""}`} />
                      </button>
                      {showResearchDropdown && (
                        <div className="absolute bottom-full left-0 mb-2 w-[220px] rounded-xl border border-border-light bg-card shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-bottom-1 duration-150">
                          <div className="px-3 py-1.5 border-b border-border-light">
                            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Response Type</span>
                          </div>
                          {researchOptions.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => { setResponseType(opt.id); setShowResearchDropdown(false); }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-hover-bg transition-colors cursor-pointer ${responseType === opt.id ? "bg-primary-500/10" : ""}`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${opt.color}`}>
                                <opt.icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[12px] font-semibold text-text-primary">{opt.label}</span>
                                <p className="text-[10px] text-text-muted">{opt.desc}</p>
                              </div>
                              {responseType === opt.id && <Check className="w-3.5 h-3.5 text-primary-500" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSend}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center hover:from-primary-500 hover:to-primary-700 transition-all cursor-pointer"
                    >
                      <AudioLines className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer (home only) */}
      {view === "home" && (
        <footer
          className={`flex items-center justify-between px-4 md:px-6 py-3 shrink-0 transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <div />
          <div className="text-[11.5px] text-text-muted">
            Join the valerus community for more insights{" "}
            <a
              href="#"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Join Discord
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
              <Languages className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
      {/* Pricing Modal */}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </main>
  );
}

/* ---- Sub-components ---- */

function PricingModal({ onClose }: { onClose: () => void }) {
  const plans = [
    {
      name: "Free",
      icon: Zap,
      price: "$0",
      period: "forever",
      description: "For individuals getting started",
      color: "from-gray-400 to-gray-500",
      buttonStyle: "border border-border-light text-text-primary hover:bg-card-hover",
      features: [
        "50 messages per day",
        "Basic AI models",
        "Chat history (7 days)",
        "Community support",
      ],
    },
    {
      name: "Pro",
      icon: Crown,
      price: "$19",
      period: "per month",
      description: "For power users and professionals",
      color: "from-violet-500 to-indigo-500",
      buttonStyle: "bg-primary-500 text-white hover:bg-primary-600",
      popular: true,
      features: [
        "Unlimited messages",
        "GPT-4, Claude & more",
        "Unlimited chat history",
        "Deeper Research mode",
        "File uploads (50MB)",
        "Priority support",
      ],
    },
    {
      name: "Team",
      icon: Building2,
      price: "$49",
      period: "per user/month",
      description: "For teams and organizations",
      color: "from-emerald-500 to-teal-500",
      buttonStyle: "border border-border-light text-text-primary hover:bg-card-hover",
      features: [
        "Everything in Pro",
        "Team workspace",
        "Admin dashboard",
        "API access",
        "Custom AI training",
        "Dedicated support",
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-[780px] mx-4 max-h-[90vh] overflow-y-auto animate-slide-up"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">Upgrade your plan</h2>
            <p className="text-[13px] text-text-secondary mt-0.5">Choose the plan that works best for you</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 sm:px-6 pb-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-5 transition-all ${
                plan.popular
                  ? "border-primary-300 shadow-md shadow-primary-100"
                  : "border-border-light hover:border-primary-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary-500 text-white text-[10.5px] font-semibold">
                  Most Popular
                </span>
              )}
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}
              >
                <plan.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <h3 className="text-[15px] font-semibold text-text-primary">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-1 mb-1">
                <span className="text-[28px] font-bold text-text-primary">{plan.price}</span>
                <span className="text-[12px] text-text-muted">/{plan.period}</span>
              </div>
              <p className="text-[12px] text-text-secondary mb-4">{plan.description}</p>
              <button
                className={`w-full py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${plan.buttonStyle}`}
              >
                {plan.name === "Free" ? "Current Plan" : `Get ${plan.name}`}
              </button>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[12px] text-text-secondary">
                    <Check className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end animate-slide-up">
      <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[14px] leading-relaxed shadow-sm">
        {content}
      </div>
    </div>
  );
}

function AssistantBubble({
  content,
  thinkingTime,
}: {
  content: string;
  thinkingTime?: number;
}) {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        {thinkingTime && (
          <p className="text-[13px] text-text-muted mb-2 italic">
            Thought for {thinkingTime}s
          </p>
        )}
        <div className="text-[14px] text-text-primary leading-relaxed">
          {content}
        </div>
        {/* Action icons */}
        <div className="flex items-center gap-1 mt-3">
          {[Copy, ThumbsUp, ThumbsDown, Pin, RefreshCw, MoreHorizontal].map(
            (Icon, i) => (
              <button
                key={i}
                className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted hover:text-text-secondary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function ActionIcons() {
  return (
    <div className="flex items-center gap-1 mt-3">
      {[Copy, ThumbsUp, ThumbsDown, Pin, RefreshCw, MoreHorizontal].map((Icon, i) => (
        <button key={i} className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted hover:text-text-secondary transition-colors">
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

function CodeBubble({ content, thinkingTime }: { content: string; thinkingTime?: number }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
        <Terminal className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        {thinkingTime && (
          <div className="flex items-center gap-2 text-[13px] text-text-muted mb-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span className="italic">Compiled in {thinkingTime}s</span>
          </div>
        )}
        <div className="rounded-xl overflow-hidden border border-[#313244] bg-[#1e1e2e] max-w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#313244]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#f38ba8]" />
                <div className="w-3 h-3 rounded-full bg-[#f9e2af]" />
                <div className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
              </div>
              <span className="text-[11px] text-[#6c7086] ml-2 font-mono">typescript</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[#6c7086] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="text-[12.5px] font-mono leading-relaxed text-[#cdd6f4] whitespace-pre-wrap">
              <code>{content}</code>
            </pre>
          </div>
        </div>
        <ActionIcons />
      </div>
    </div>
  );
}

function FileBubble({ content, thinkingTime }: { content: string; thinkingTime?: number }) {
  const parts = content.split("|");
  const fileName = parts[0] || "file.pdf";
  const fileSize = parts[1] || "1.2 MB";
  const fileDesc = parts[2] || "Generated file";

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
        <FileText className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        {thinkingTime && (
          <div className="flex items-center gap-2 text-[13px] text-text-muted mb-2">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span className="italic">Processed in {thinkingTime}s</span>
          </div>
        )}
        <div className="rounded-xl border border-border-light bg-card overflow-hidden max-w-[380px]">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 px-5 py-6 flex flex-col items-center gap-3 border-b border-border-light">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <p className="text-[14px] font-semibold text-text-primary">{fileName}</p>
              <p className="text-[12px] text-text-muted mt-0.5">{fileSize}</p>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-[13px] text-text-secondary leading-relaxed">{fileDesc}</p>
          </div>
          <div className="flex items-center gap-2 px-4 pb-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[13px] font-medium hover:from-blue-600 hover:to-blue-700 transition-all cursor-pointer">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border-light hover:bg-hover-bg text-text-muted transition-colors cursor-pointer">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        <ActionIcons />
      </div>
    </div>
  );
}

function AudioBubble({ content, thinkingTime }: { content: string; thinkingTime?: number }) {
  const parts = content.split("|");
  const title = parts[0] || "Audio";
  const duration = parts[1] || "0:00";
  const description = parts[2] || "";
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const waveformBars = useRef(
    Array.from({ length: 40 }, (_, i) => Math.sin(i * 0.5) * 50 + Math.random() * 30 + 20)
  ).current;

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { setIsPlaying(false); return 0; }
        return p + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 mt-0.5">
        <Volume2 className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        {thinkingTime && (
          <div className="flex items-center gap-2 text-[13px] text-text-muted mb-2">
            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="italic">Generated in {thinkingTime}s</span>
          </div>
        )}
        <div className="rounded-xl border border-border-light bg-card overflow-hidden max-w-[420px]">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 px-5 pt-4 pb-3">
            <p className="text-[14px] font-semibold text-text-primary mb-1">{title}</p>
            <p className="text-[12px] text-text-muted">{duration}</p>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-end gap-[2px] h-12 mb-3">
              {waveformBars.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    i / waveformBars.length * 100 < progress
                      ? "bg-amber-500"
                      : "bg-amber-500/20"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="w-full h-1.5 bg-amber-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <span className="text-[11px] text-text-muted font-mono">{duration}</span>
            </div>
          </div>
          {description && (
            <div className="px-5 pb-4 border-t border-border-light pt-3">
              <p className="text-[12px] text-text-secondary leading-relaxed">{description}</p>
            </div>
          )}
        </div>
        <ActionIcons />
      </div>
    </div>
  );
}

function ImageBubble({ content, thinkingTime }: { content: string; thinkingTime?: number }) {
  const parts = content.split("|");
  const prompt = parts[0] || "Generated image";
  const dimensions = parts[1] || "1024x1024";

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shrink-0 mt-0.5">
        <ImageIcon className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        {thinkingTime && (
          <div className="flex items-center gap-2 text-[13px] text-text-muted mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
            <span className="italic">Rendered in {thinkingTime}s</span>
          </div>
        )}
        <div className="rounded-xl border border-border-light bg-card overflow-hidden max-w-[400px]">
          <div className="relative aspect-square bg-gradient-to-br from-rose-500/10 via-purple-500/10 to-blue-500/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-px opacity-30">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm animate-pixel-fill"
                  style={{
                    background: `linear-gradient(135deg, hsl(${340 + i * 4}, 70%, 65%), hsl(${280 + i * 3}, 60%, 55%))`,
                    animationDelay: `${i * 40}ms`,
                  }}
                />
              ))}
            </div>
            <div className="relative flex flex-col items-center gap-3 p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/30 to-purple-500/30 flex items-center justify-center backdrop-blur-sm">
                <ImageIcon className="w-8 h-8 text-rose-500" />
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed max-w-[280px]">{prompt}</p>
              <span className="text-[11px] text-text-muted bg-black/5 px-2 py-0.5 rounded-full">{dimensions}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[13px] font-medium hover:from-rose-600 hover:to-rose-700 transition-all cursor-pointer">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-border-light hover:bg-hover-bg text-text-muted transition-colors cursor-pointer">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        <ActionIcons />
      </div>
    </div>
  );
}
