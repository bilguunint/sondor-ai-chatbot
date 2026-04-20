"use client";

import { Sparkles } from "lucide-react";
import ActionIcons from "../ActionIcons";

export default function AssistantBubble({
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
        <ActionIcons content={content} />
      </div>
    </div>
  );
}
