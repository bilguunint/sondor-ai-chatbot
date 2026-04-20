"use client";

import { Image as ImageIcon, Download, Eye } from "lucide-react";
import ActionIcons from "../ActionIcons";

export default function ImageBubble({ content, thinkingTime }: { content: string; thinkingTime?: number }) {
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
        <ActionIcons content={content} />
      </div>
    </div>
  );
}
