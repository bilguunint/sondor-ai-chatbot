"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  ClipboardCheck,
  Languages,
  HelpCircle,
  Plus,
  Mic,
  AudioLines,
  Check,
  Menu,
  Image as ImageIcon,
  Volume2,
  Terminal,
  FileText,
} from "lucide-react";

import { useTheme } from "@/contexts/ThemeProvider";
import { useToast } from "@/contexts/ToastProvider";
import { useChatStore } from "@/contexts/ChatStoreProvider";
import type { ResponseType, ChatMessage } from "@/types";
import { aiModels, researchOptions, suggestions, getMockResponse, getMockTypedResponse } from "@/lib/mockData";
import { UserBubble, AssistantBubble, CodeBubble, FileBubble, AudioBubble, ImageBubble } from "./components/bubbles";
import PricingModal from "./components/PricingModal";

export default function ChatView({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const {
    activeConversationId,
    activeMessages,
    setActiveConversation,
    createConversation,
    appendMessage,
  } = useChatStore();

  const [view, setView] = useState<"home" | "chat">(activeConversationId ? "chat" : "home");
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
  void primaryKey;
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const researchDropdownRef = useRef<HTMLDivElement>(null);

  // Messages displayed in the UI come from the live Firestore subscription.
  const messages = useMemo<ChatMessage[]>(
    () =>
      activeMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        thinkingTime: m.thinkingTime,
        responseType: m.responseType,
      })),
    [activeMessages],
  );

  // Keep the view in sync with the active conversation. Skip while a
  // home→chat transition animation is running so we don't fight it.
  useEffect(() => {
    if (isTransitioning) return;
    if (activeConversationId && view !== "chat") setView("chat");
    else if (!activeConversationId && view === "chat") setView("home");
  }, [activeConversationId, isTransitioning, view]);

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

  const simulateResponse = useCallback(
    (
      userMsg: string,
      type: ResponseType,
      conversationId: string,
      historyForApi: { role: "user" | "assistant"; content: string }[],
    ) => {
      setActiveResponseType(type);
      setIsThinking(true);
      setThinkingSeconds(0);
      const thinkInterval = setInterval(() => {
        setThinkingSeconds((s) => s + 1);
      }, 1000);
      const startedAt = Date.now();

      // Non-text response types still use mocked content for now.
      if (type !== "default") {
        const response = getMockTypedResponse(userMsg, type);
        const thinkTime = Math.floor(Math.random() * 2) + 3;
        setTimeout(() => {
          clearInterval(thinkInterval);
          setIsThinking(false);
          appendMessage(conversationId, {
            role: "assistant",
            content: response,
            thinkingTime: thinkTime,
            responseType: type,
          }).catch((err) =>
            toast("Failed to save reply", {
              type: "warning",
              description: err instanceof Error ? err.message : String(err),
            }),
          );
        }, thinkTime * 1000);
        return;
      }

      let cancelled = false;

      (async () => {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: historyForApi,
              provider: selectedModel.provider,
              model: selectedModel.model,
            }),
          });

          if (!res.ok || !res.body) {
            const errPayload = await res.json().catch(() => ({}));
            throw new Error(errPayload?.error ?? `Request failed (${res.status})`);
          }

          // First chunk: stop thinking, switch to typing.
          clearInterval(thinkInterval);
          setIsThinking(false);
          setIsTyping(true);
          setTypingText("");

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = "";

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (cancelled) return;
            acc += decoder.decode(value, { stream: true });
            setTypingText(acc);
          }

          const thinkTime = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
          setIsTyping(false);
          setTypingText("");
          await appendMessage(conversationId, {
            role: "assistant",
            content: acc || getMockResponse(userMsg),
            thinkingTime: thinkTime,
            responseType: "default",
          });
        } catch (err) {
          clearInterval(thinkInterval);
          setIsThinking(false);
          setIsTyping(false);
          setTypingText("");
          const message =
            err instanceof Error ? err.message : "Unknown error contacting AI service";
          toast("AI request failed", { type: "warning", description: message });
          appendMessage(conversationId, {
            role: "assistant",
            content: `⚠️ ${message}`,
            thinkingTime: 0,
            responseType: "default",
          }).catch(() => undefined);
        }
      })();

      return () => {
        cancelled = true;
        clearInterval(thinkInterval);
      };
    },
    [appendMessage, toast, selectedModel],
  );

  /**
   * Persist the user's message and kick off a model response. Creates a
   * brand-new conversation if there isn't one active yet.
   */
  const submitUserMessage = useCallback(
    async (text: string, type: ResponseType) => {
      const modelMeta = { provider: selectedModel.provider, model: selectedModel.model };
      let convId = activeConversationId;
      if (!convId) {
        convId = await createConversation(text, modelMeta);
        if (!convId) {
          toast("Sign in required", { type: "warning", description: "Connect Firebase to start chatting." });
          return;
        }
        setActiveConversation(convId);
      }

      // Build the history snapshot BEFORE Firestore round-trips so we don't
      // race onSnapshot for the user's just-typed message.
      const history = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text },
      ];

      try {
        await appendMessage(convId, { role: "user", content: text });
      } catch (err) {
        toast("Failed to save message", {
          type: "warning",
          description: err instanceof Error ? err.message : String(err),
        });
        return;
      }

      simulateResponse(text, type, convId, history);
    },
    [
      activeConversationId,
      appendMessage,
      createConversation,
      messages,
      selectedModel,
      setActiveConversation,
      simulateResponse,
      toast,
    ],
  );

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    if (view === "home") {
      setIsTransitioning(true);
      setInputValue("");
      setTimeout(() => {
        setView("chat");
        setIsTransitioning(false);
        void submitUserMessage(text, responseType);
      }, 400);
    } else {
      setInputValue("");
      void submitUserMessage(text, responseType);
    }
  }, [inputValue, view, submitUserMessage, responseType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    setTimeout(() => {
      setIsTransitioning(true);
      setInputValue("");
      setTimeout(() => {
        setView("chat");
        setIsTransitioning(false);
        void submitUserMessage(text, responseType);
      }, 400);
    }, 100);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://sondor-ai-chatbot.vercel.app";
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied", { type: "success", description: "Share URL copied to clipboard" });
    } catch {
      toast("Share link ready", { description: url });
    }
  };

  const handleExport = () => {
    if (messages.length === 0) {
      toast("Nothing to export", { type: "warning", description: "Start a chat first" });
      return;
    }
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "Sondor"}:\n${m.content}`)
      .join("\n\n---\n\n");
    try {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sondor-chat-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast("Chat exported", { type: "success" });
    } catch {
      toast("Export failed", { type: "warning" });
    }
  };

  const handleFileAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      const f = input.files?.[0];
      if (f) toast(`Attached: ${f.name}`, { type: "success", description: `${(f.size / 1024).toFixed(1)} KB` });
    };
    input.click();
  };

  const handleMic = () => {
    toast("Voice input", { description: "Recording simulation — connect your STT provider" });
  };

  const handleWebSearch = () => {
    toast("Web search enabled", { type: "success", description: "Next response will include live data" });
  };

  const handleCamera = () => {
    toast("Camera", { description: "Image capture requires device permission" });
  };

  const handleLightbulb = () => {
    const tips = [
      "Tip: Use Shift+Enter for multi-line input",
      "Tip: Try different response types for better results",
      "Tip: Pin useful responses to your library",
    ];
    toast(tips[Math.floor(Math.random() * tips.length)]);
  };

  const handleClipboardPrompt = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputValue(text);
        toast("Pasted from clipboard", { type: "success" });
      } else {
        toast("Clipboard is empty", { type: "warning" });
      }
    } catch {
      toast("Clipboard access denied", { type: "warning" });
    }
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
          <button onClick={() => toast("Options", { description: "Share, report, settings" })} className="hidden sm:flex p-2 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer" title="More options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button onClick={handleShare} className="hidden sm:flex p-2 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer" title="Copy share link">
            <Link2 className="w-4 h-4" />
          </button>
          <button onClick={handleExport} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-hover-bg text-text-secondary text-[13px] cursor-pointer" title="Export chat as .txt">
            <Download className="w-4 h-4" />
            <span>Export chat</span>
          </button>
          <button
            onClick={() => setShowPricing(true)}
            className="px-3 sm:px-4 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-[12px] sm:text-[13px] font-medium transition-colors cursor-pointer"
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
                  <button onClick={handleClipboardPrompt} className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer" title="Paste from clipboard">
                    <ClipboardCheck className="w-4 h-4" />
                  </button>
                  <button onClick={handleLightbulb} className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer" title="Tip">
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleCamera} className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer" title="Camera">
                    <Camera className="w-4 h-4" />
                  </button>
                  <button onClick={handleWebSearch} className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer" title="Web search">
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
              <button
                onClick={() => toast("Saved prompts", { description: "Browse prompts in your Library" })}
                className="flex items-center gap-1.5 text-[12.5px] text-primary-500 font-medium hover:opacity-80 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Saved prompts
              </button>
              <button
                onClick={handleFileAttach}
                className="flex items-center gap-1.5 text-[12.5px] text-text-muted hover:text-text-secondary cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5" />
                Attach file
              </button>
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
                    <button onClick={handleFileAttach} className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer" title="Attach file">
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
                    <button onClick={handleMic} className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer" title="Voice input">
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
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                toast("Discord", { description: "Opening community link..." });
                window.open("https://discord.gg", "_blank", "noopener,noreferrer");
              }}
              className="text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
            >
              Join Discord
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast("Language", { description: "English (US) — more locales coming soon" })}
              className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer"
              title="Language"
            >
              <Languages className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast("Help & shortcuts", { description: "Press ? anytime to view keyboard shortcuts" })}
              className="p-1.5 rounded-lg hover:bg-hover-bg text-text-muted cursor-pointer"
              title="Help"
            >
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
