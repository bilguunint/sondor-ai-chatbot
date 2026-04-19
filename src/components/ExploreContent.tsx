"use client";

import { useState } from "react";
import {
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Code,
  PenTool,
  BarChart3,
  GraduationCap,
  Globe,
  ImageIcon,
  MessageCircle,
  Music,
  FileText,
  ArrowRight,
  Heart,
  Menu,
} from "lucide-react";

const categories = [
  { icon: Star, label: "Featured", active: true },
  { icon: TrendingUp, label: "Trending" },
  { icon: Zap, label: "Productivity" },
  { icon: Code, label: "Development" },
  { icon: PenTool, label: "Writing" },
  { icon: BarChart3, label: "Analysis" },
  { icon: GraduationCap, label: "Education" },
  { icon: ImageIcon, label: "Creative" },
];

const featuredAssistants = [
  {
    name: "Research Pro",
    description:
      "Deep research assistant that synthesizes information from multiple sources into comprehensive reports.",
    icon: Sparkles,
    color: "from-violet-500 to-indigo-500",
    tag: "Featured",
    uses: "124K",
  },
  {
    name: "Code Architect",
    description:
      "Expert code reviewer and architect. Analyzes patterns, suggests improvements, and generates clean code.",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    tag: "Popular",
    uses: "98K",
  },
  {
    name: "Content Writer",
    description:
      "Creates engaging blog posts, social media content, emails, and marketing copy in your brand voice.",
    icon: PenTool,
    color: "from-pink-500 to-rose-500",
    tag: "New",
    uses: "67K",
  },
];

const trendingAssistants = [
  {
    name: "Data Analyst",
    description: "Transform raw data into actionable insights with charts and summaries.",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-500",
    uses: "45K",
    rating: 4.8,
  },
  {
    name: "Language Tutor",
    description: "Interactive language learning with personalized lessons and practice.",
    icon: Globe,
    color: "from-amber-500 to-orange-500",
    uses: "89K",
    rating: 4.9,
  },
  {
    name: "Creative Studio",
    description: "Generate image prompts, storyboards, and creative concepts.",
    icon: ImageIcon,
    color: "from-violet-500 to-violet-700",
    uses: "56K",
    rating: 4.7,
  },
  {
    name: "Meeting Notes",
    description: "Summarize meetings, extract action items, and draft follow-ups.",
    icon: FileText,
    color: "from-sky-500 to-blue-500",
    uses: "112K",
    rating: 4.8,
  },
  {
    name: "Chat Buddy",
    description: "Friendly conversational AI for casual chats and brainstorming.",
    icon: MessageCircle,
    color: "from-rose-400 to-pink-500",
    uses: "203K",
    rating: 4.6,
  },
  {
    name: "Music Helper",
    description: "Compose lyrics, analyze music theory, and discover new genres.",
    icon: Music,
    color: "from-fuchsia-500 to-fuchsia-700",
    uses: "34K",
    rating: 4.5,
  },
];

export default function ExploreContent({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Featured");

  return (
    <main className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 md:px-8 pt-6 pb-4 border-b border-border-light">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onMobileMenuOpen} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-hover-bg text-text-muted">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-[20px] md:text-[24px] font-bold text-text-primary">
              Explore
            </h1>
          </div>
          <p className="text-[14px] text-text-secondary mb-5">
            Discover AI assistants built by the community
          </p>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assistants..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light bg-input-bg text-[14px] text-text-primary placeholder:text-text-muted outline-none focus:border-primary-300 focus:bg-card transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`flex items-center gap-1.5 px-3.5 py-[6px] rounded-full text-[12.5px] font-medium whitespace-nowrap transition-colors ${
                  activeCategory === label
                    ? "bg-primary-500 text-white"
                    : "bg-hover-bg text-text-secondary hover:bg-sidebar-hover"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-[960px] mx-auto space-y-8">
          {/* Featured Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-text-primary">
                Featured Assistants
              </h2>
              <button className="flex items-center gap-1 text-[12.5px] text-primary-500 font-medium hover:text-primary-600 transition-colors">
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredAssistants.map((assistant) => (
                <FeaturedCard key={assistant.name} {...assistant} />
              ))}
            </div>
          </section>

          {/* Trending Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-text-primary">
                Trending This Week
              </h2>
              <button className="flex items-center gap-1 text-[12.5px] text-primary-500 font-medium hover:text-primary-600 transition-colors">
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trendingAssistants.map((assistant) => (
                <TrendingCard key={assistant.name} {...assistant} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function FeaturedCard({
  name,
  description,
  icon: Icon,
  color,
  tag,
  uses,
}: {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  tag: string;
  uses: string;
}) {
  const tagColor =
    tag === "Featured"
      ? "bg-primary-100 text-primary-600"
      : tag === "Popular"
        ? "bg-blue-100 text-blue-600"
        : "bg-emerald-100 text-emerald-600";

  return (
    <button className="flex flex-col p-5 rounded-2xl border border-border-light bg-card hover:border-primary-200 hover:shadow-md transition-all text-left group cursor-pointer">
      <div className="flex items-start justify-between w-full mb-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span
          className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${tagColor}`}
        >
          {tag}
        </span>
      </div>
      <h3 className="text-[14px] font-semibold text-text-primary mb-1.5 group-hover:text-primary-600 transition-colors">
        {name}
      </h3>
      <p className="text-[12px] text-text-secondary leading-relaxed mb-3 line-clamp-2">
        {description}
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <span className="text-[11px] text-text-muted">{uses} uses</span>
        <div className="ml-auto p-1 rounded-md hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-colors">
          <Heart className="w-3.5 h-3.5" />
        </div>
      </div>
    </button>
  );
}

function TrendingCard({
  name,
  description,
  icon: Icon,
  color,
  uses,
  rating,
}: {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  uses: string;
  rating: number;
}) {
  return (
    <button className="flex items-center gap-4 p-4 rounded-xl border border-border-light bg-card hover:border-primary-200 hover:shadow-sm transition-all text-left group cursor-pointer">
      <div
        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
          {name}
        </h3>
        <p className="text-[11.5px] text-text-secondary truncate">
          {description}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[11px] text-text-muted">{rating}</span>
          </div>
          <span className="text-[11px] text-text-muted">{uses} uses</span>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
}
