"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, Play, Pause } from "lucide-react";
import ActionIcons from "../ActionIcons";

export default function AudioBubble({ content, thinkingTime }: { content: string; thinkingTime?: number }) {
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
        <ActionIcons content={content} />
      </div>
    </div>
  );
}
