"use client";

import { useState } from "react";
import {
  Search,
  Upload,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Film,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Grid3X3,
  List,
  SortAsc,
  HardDrive,
  Menu,
} from "lucide-react";

type ViewMode = "grid" | "list";

interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
  modified: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const files: FileItem[] = [
  {
    id: 1,
    name: "Q4 Marketing Strategy.pdf",
    type: "PDF",
    size: "2.4 MB",
    modified: "2 hours ago",
    icon: FileText,
    color: "from-red-500 to-rose-500",
  },
  {
    id: 2,
    name: "Product Mockups.png",
    type: "Image",
    size: "8.1 MB",
    modified: "Yesterday",
    icon: FileImage,
    color: "from-violet-500 to-indigo-500",
  },
  {
    id: 3,
    name: "Revenue Report 2026.xlsx",
    type: "Spreadsheet",
    size: "1.2 MB",
    modified: "2 days ago",
    icon: FileSpreadsheet,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    name: "api-integration.ts",
    type: "Code",
    size: "24 KB",
    modified: "3 days ago",
    icon: FileCode,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 5,
    name: "Brand Guidelines.pdf",
    type: "PDF",
    size: "15.6 MB",
    modified: "5 days ago",
    icon: FileText,
    color: "from-red-500 to-rose-500",
  },
  {
    id: 6,
    name: "Demo Video.mp4",
    type: "Video",
    size: "124 MB",
    modified: "1 week ago",
    icon: Film,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 7,
    name: "project-assets.zip",
    type: "Archive",
    size: "48 MB",
    modified: "1 week ago",
    icon: FileArchive,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 8,
    name: "User Research Notes.pdf",
    type: "PDF",
    size: "890 KB",
    modified: "2 weeks ago",
    icon: FileText,
    color: "from-red-500 to-rose-500",
  },
];

const storageUsed = 201.3;
const storageTotal = 500;

export default function FilesContent({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 md:px-8 pt-6 pb-4 border-b border-border-light">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <button onClick={onMobileMenuOpen} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-hover-bg text-text-muted">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-[20px] md:text-[24px] font-bold text-text-primary">Files</h1>
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-[12.5px] font-medium transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Upload file
            </button>
          </div>
          <p className="text-[14px] text-text-secondary mb-5">
            Manage files uploaded to your conversations
          </p>

          {/* Search + Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light bg-input-bg text-[14px] text-text-primary placeholder:text-text-muted outline-none focus:border-primary-300 focus:bg-card transition-colors"
              />
            </div>
            <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border-light text-text-muted hover:bg-card-hover text-[12.5px] transition-colors">
              <SortAsc className="w-3.5 h-3.5" />
              Sort
            </button>
            <div className="flex rounded-xl border border-border-light overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-50 text-primary-500"
                    : "text-text-muted hover:bg-card-hover"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 border-l border-border-light transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-50 text-primary-500"
                    : "text-text-muted hover:bg-card-hover"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-[960px] mx-auto">
          {/* Storage indicator */}
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-input-bg border border-border-light">
            <HardDrive className="w-5 h-5 text-primary-500 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-medium text-text-primary">Storage</span>
                <span className="text-[12px] text-text-muted">
                  {storageUsed} MB / {storageTotal} MB
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-border-light overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                  style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Files */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filtered.map((file) => (
                <FileGridCard key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {/* List header */}
              <div className="flex items-center gap-4 px-4 py-2 text-[11px] font-medium text-text-muted uppercase tracking-wide">
                <span className="flex-1">Name</span>
                <span className="w-20 hidden sm:block">Type</span>
                <span className="w-20 text-right hidden sm:block">Size</span>
                <span className="w-24 text-right hidden sm:block">Modified</span>
                <span className="w-10" />
              </div>
              {filtered.map((file) => (
                <FileListRow key={file.id} file={file} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function FileGridCard({ file }: { file: FileItem }) {
  return (
    <div className="group flex flex-col p-4 rounded-xl border border-border-light bg-card hover:border-primary-200 hover:shadow-sm transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${file.color} flex items-center justify-center`}
        >
          <file.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 rounded-md hover:bg-hover-bg text-text-muted">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded-md hover:bg-hover-bg text-text-muted">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-[12.5px] font-medium text-text-primary truncate group-hover:text-primary-600 transition-colors">
        {file.name}
      </p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[11px] text-text-muted">{file.size}</span>
        <span className="text-[11px] text-text-muted">{file.modified}</span>
      </div>
    </div>
  );
}

function FileListRow({ file }: { file: FileItem }) {
  return (
    <div className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-card-hover transition-colors cursor-pointer">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${file.color} flex items-center justify-center shrink-0`}
        >
          <file.icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[13px] font-medium text-text-primary truncate group-hover:text-primary-600 transition-colors">
          {file.name}
        </span>
      </div>
      <span className="w-20 text-[12px] text-text-muted hidden sm:block">{file.type}</span>
      <span className="w-20 text-[12px] text-text-muted text-right hidden sm:block">{file.size}</span>
      <span className="w-24 text-[12px] text-text-muted text-right hidden sm:block">{file.modified}</span>
      <div className="w-10 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded-md hover:bg-hover-bg text-text-muted">
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button className="p-1 rounded-md hover:bg-hover-bg text-text-muted hover:text-red-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
