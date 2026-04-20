"use client";

import { useState } from "react";
import { Copy, Check, ThumbsUp, ThumbsDown, Pin, RefreshCw, MoreHorizontal } from "lucide-react";
import { useToast } from "@/contexts/ToastProvider";

export default function ActionIcons({ content, onRegenerate }: { content?: string; onRegenerate?: () => void }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [pinned, setPinned] = useState(false);

  const handleCopy = async () => {
    if (!content) {
      toast("Nothing to copy", { type: "warning" });
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast("Copied to clipboard", { type: "success" });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("Copy failed", { type: "warning" });
    }
  };

  const handleFeedback = (value: "up" | "down") => {
    const next = feedback === value ? null : value;
    setFeedback(next);
    if (next === "up") toast("Thanks for your feedback!", { type: "success" });
    else if (next === "down") toast("Feedback noted", { description: "We'll use this to improve responses." });
  };

  const handlePin = () => {
    setPinned((p) => !p);
    toast(pinned ? "Unpinned" : "Pinned to library", { type: "success" });
  };

  const handleRegenerate = () => {
    if (onRegenerate) onRegenerate();
    else toast("Regenerating response...", { type: "info" });
  };

  const handleMore = () => {
    toast("More actions", { description: "Share, report, edit coming soon" });
  };

  const btn =
    "p-1.5 rounded-lg hover:bg-hover-bg text-text-muted hover:text-text-secondary transition-colors cursor-pointer";

  return (
    <div className="flex items-center gap-1 mt-3">
      <button onClick={handleCopy} className={btn} title={copied ? "Copied" : "Copy"}>
        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
      </button>
      <button
        onClick={() => handleFeedback("up")}
        className={`${btn} ${feedback === "up" ? "text-emerald-500" : ""}`}
        title="Good response"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleFeedback("down")}
        className={`${btn} ${feedback === "down" ? "text-rose-500" : ""}`}
        title="Bad response"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
      <button
        onClick={handlePin}
        className={`${btn} ${pinned ? "text-primary-500" : ""}`}
        title={pinned ? "Unpin" : "Pin"}
      >
        <Pin className="w-4 h-4" />
      </button>
      <button onClick={handleRegenerate} className={btn} title="Regenerate">
        <RefreshCw className="w-4 h-4" />
      </button>
      <button onClick={handleMore} className={btn} title="More">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
