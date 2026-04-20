"use client";

import { FileText, Download, Eye } from "lucide-react";
import ActionIcons from "../ActionIcons";

export default function FileBubble({ content, thinkingTime }: { content: string; thinkingTime?: number }) {
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
        <ActionIcons content={content} />
      </div>
    </div>
  );
}
