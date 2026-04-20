<div align="center">
  <img src="apps/web/public/assets/logo-purple.png" height="80" alt="Sondor UI">
  <h1>Sondor UI</h1>
  <p><strong>Modern AI Chatbot UI Kit</strong></p>

  ![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green)

  <br>

  <img src="apps/web/public/assets/intro.png" width="700" alt="Sondor AI Screenshot" style="border-radius: 12px;">

  <br><br>

  <p>
    <a href="https://chatbot-uikit.vercel.app/"><strong>🔴 Live Demo</strong></a>
    &nbsp;·&nbsp;
    <a href="#-quick-start-library">Quick Start</a>
    &nbsp;·&nbsp;
    <a href="packages/ui/README.md">Library Docs</a>
    &nbsp;·&nbsp;
    <a href="CONTRIBUTING.md">Contributing</a>
  </p>
</div>

<br>

A modern, fully responsive AI chatbot interface built with **Next.js 16**, **Tailwind CSS v4**, **TypeScript**, and **Lucide React** icons. Designed as a production-ready UI kit for AI-powered chat applications.

## 💡 Why Sondor UI?

> **A production-ready UI kit for AI chatbots.** Save weeks of design & frontend work — so you can focus on the AI, not the pixels.

Building an AI chatbot, agent dashboard, or LLM analytics tool? You shouldn't have to reinvent the UI every time. Sondor UI gives you a batteries-included, AI-first component library under the MIT license.

### Who is it for?

- 🚀 **AI startups & indie hackers** — ship an OpenAI / Claude / Gemini wrapper in days, not weeks
- 🧑‍💻 **Frontend developers** — drop-in components for client projects and portfolios
- 🏢 **Enterprise teams** — internal AI assistants, admin panels, and LLM-powered dashboards
- 🎓 **Learners** — study a real-world Tailwind v4 + React 19 codebase

### What makes it different?

| | Generic UI kits<br/>(MUI, Chakra) | Premium kits<br/>($$$) | **Sondor UI** |
|---|:-:|:-:|:-:|
| Chatbot-first components | ❌ | ⚠️ | ✅ |
| Conversation branching, token stream, model arena | ❌ | ❌ | ✅ |
| Next.js 16 + React 19 + Tailwind v4 | ⚠️ | ⚠️ | ✅ |
| Full layout system (sidebar, theme, pages) | ❌ | ✅ | ✅ |
| 6 accent themes + dark mode | ❌ | ⚠️ | ✅ |
| Price | Free | $149–$299 | **Free (MIT)** |

### Real-world use cases

- **AI chatbot SaaS** — plug in the chat view, focus on backend prompting
- **LLM observability dashboards** — `TokenStreamInspector`, `ModelComparisonArena`, `ContextMemoryVisualizer`
- **Internal copilots** — brand-tunable admin UI for your team's AI tools
- **Prototypes & demos** — clone, deploy to Vercel in under 5 minutes

## Screenshots

<div align="center">

### 🏠 Home — Chat Interface
<img src="apps/web/public/assets/home-screen.png" width="700" alt="Home Screen">

<br>

### 🧭 Explore — AI Assistants
<img src="apps/web/public/assets/explore-screen.png" width="700" alt="Explore Screen">

<br>

### 🧩 Widgets — Dashboard Components
<img src="apps/web/public/assets/widgets-screen.png" width="700" alt="Widgets Screen">

<br>

### 💬 Chat Response Types
<img src="apps/web/public/assets/response-types.png" width="700" alt="Chat Response Types">

</div>

## Features

- **Multi-page layout** — Home, Explore, Library, Files, History, Widgets, Theme, Profile
- **AI model selector** — Switch between 6 AI models (Sondor 4o, Ultra, Vision, Code, Mini, Reason)
- **Theme system** — Light / Dark / System mode with 6 accent colors (Purple, Blue, Emerald, Rose, Amber, Cyan)
- **Collapsible sidebar** — Full navigation with expand/collapse support
- **32+ widget components** — Pre-built UI widgets for dashboards
- **Profile page** — User profile, usage stats, and settings
- **Chat history** — Organized by Today, Yesterday, and 7 days
- **Dark mode** — Fully supported across all pages and components

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.2.4 | React framework (App Router) |
| [React](https://react.dev) | 19.2.4 | UI library |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety |
| [Lucide React](https://lucide.dev) | 1.8.0 | Icon library |

## 🚀 Quick Start (Library)

Use `@sondor/ui` in your own **Next.js / Vite / React** app.

### 1. Install

```bash
# npm
npm install @sondor/ui

# pnpm
pnpm add @sondor/ui

# yarn
yarn add @sondor/ui
```

### 2. Import the stylesheet **once** (e.g. in your root layout)

```tsx
// app/layout.tsx (Next.js App Router)
import "@sondor/ui/styles.css";
```

### 3. Use any widget

```tsx
import {
  ConversationBranchingWidget,
  TokenStreamInspectorWidget,
  ModelComparisonArenaWidget,
} from "@sondor/ui";

export default function Page() {
  return (
    <main className="p-6 space-y-6">
      <ConversationBranchingWidget />
      <TokenStreamInspectorWidget />
      <ModelComparisonArenaWidget />
    </main>
  );
}
```

> ✅ All widgets ship with the `"use client"` directive baked in, so they work out of the box with the **Next.js App Router** (React Server Components).

### Next.js: transpile the package (optional)

If you run into ESM interop issues, add this to `next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ["@sondor/ui"],
};
```

See the full widget catalogue in [`packages/ui/README.md`](packages/ui/README.md).

---

## 🛠️ Running the Demo Locally

Clone the repo to run the `apps/web` Next.js showcase.

### Prerequisites

- **Node.js** 18.18+ (20.x recommended)
- **pnpm** 9.x — `npm install -g pnpm`

### Setup

```bash
git clone https://github.com/bilguunint/chatbot-uikit.git
cd chatbot-uikit
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the demo's development server (`apps/web`) |
| `pnpm build` | Build the UI library (`packages/ui`) and then the demo |
| `pnpm build:ui` | Build only the UI library (tsup → ESM + CJS + `.d.ts`) |
| `pnpm build:web` | Build only the Next.js demo |
| `pnpm start` | Start the demo's production server |
| `pnpm lint` | Run ESLint across all workspaces |
| `pnpm clean` | Remove `dist/`, `.next/`, and `node_modules/` in all packages |

## Project Structure

This repo is a **pnpm monorepo** with two workspaces:

- **`packages/ui`** — the publishable library `@sondor/ui` (all widget components).
- **`apps/web`** — the Next.js demo / documentation site that consumes `@sondor/ui` via a `workspace:*` dependency.

```
.
├── apps/
│   └── web/                          # Next.js 16 demo (@sondor/web)
│       ├── next.config.ts            # transpilePackages: ["@sondor/ui"]
│       ├── package.json
│       └── src/
│           ├── app/                  # App Router
│           ├── components/layout/    # Sidebar
│           ├── contexts/             # ThemeProvider
│           ├── features/             # chat, widgets, explore, files, history, library, profile, theme
│           ├── lib/                  # Mock data
│           └── types/
│
├── packages/
│   └── ui/                           # Publishable library (@sondor/ui)
│       ├── tsup.config.ts            # ESM + CJS + .d.ts bundler
│       ├── tsconfig.json
│       ├── scripts/copy-css.mjs      # Copies styles.css into dist/
│       ├── package.json              # exports ".", "./widgets", "./styles.css"
│       └── src/
│           ├── index.ts              # Public entry (re-exports widgets)
│           ├── styles.css            # Design tokens (Tailwind v4 @theme)
│           └── widgets/
│               ├── index.ts
│               ├── aiKitWidgets.tsx
│               ├── chatWidgets.tsx
│               ├── controlsWidgets.tsx
│               ├── dataWidgets.tsx
│               ├── feedbackWidgets.tsx
│               └── profileWidgets.tsx
│
├── pnpm-workspace.yaml
├── package.json                      # Workspace root scripts
├── .github/                          # CI, issue templates, PR template
└── README.md, LICENSE, CHANGELOG.md, CONTRIBUTING.md, ...
```

## Deploy

### Vercel (Recommended)

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) with zero configuration — it auto-detects Next.js.

### Docker / Self-hosted

```bash
npm run build
npm run start
```

The production server runs on port 3000 by default.

## License

MIT
