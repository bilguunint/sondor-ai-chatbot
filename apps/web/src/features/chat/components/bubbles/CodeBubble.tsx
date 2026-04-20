"use client";

import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import ActionIcons from "../ActionIcons";

export default function CodeBubble({ content, thinkingTime }: { content: string; thinkingTime?: number }) {
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
        <ActionIcons content={content} />
      </div>
    </div>
  );
}
