<div align="center">
  <img src="apps/web/public/assets/logo-purple.png" height="80" alt="Sondor UI">
  <h1>Sondor UI</h1>
  <p><strong>Modern AI Chatbot UI Kit</strong></p>

  [![npm version](https://img.shields.io/npm/v/sondor-ui?color=7c3aed&logo=npm)](https://www.npmjs.com/package/sondor-ui)
  [![npm downloads](https://img.shields.io/npm/dm/sondor-ui?color=7c3aed)](https://www.npmjs.com/package/sondor-ui)
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

Use `sondor-ui` in your own **Next.js / Vite / React** app.

### 1. Install

```bash
# npm
npm install sondor-ui

# pnpm
pnpm add sondor-ui

# yarn
yarn add sondor-ui
```

### 2. Import the stylesheet **once** (e.g. in your root layout)

```tsx
// app/layout.tsx (Next.js App Router)
import "sondor-ui/styles.css";
```

### 3. Use any widget

```tsx
import {
  ConversationBranchingWidget,
  TokenStreamInspectorWidget,
  ModelComparisonArenaWidget,
} from "sondor-ui";

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
  transpilePackages: ["sondor-ui"],
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

### Enable real AI replies (OpenAI · Anthropic · Gemini)

By default the chat view returns **mock** responses so you can explore the UI without any account. The demo can stream real responses from three providers — pick whichever you have a key for (or all of them):

| Provider | Where to get a key | Env variable | Default model env |
|---|---|---|---|
| **OpenAI** | <https://platform.openai.com/> → API keys | `OPENAI_API_KEY` | `OPENAI_MODEL` (default `gpt-4o-mini`) |
| **Anthropic** | <https://console.anthropic.com/> → API Keys | `ANTHROPIC_API_KEY` | `ANTHROPIC_MODEL` (default `claude-3-5-sonnet-latest`) |
| **Google Gemini** | <https://aistudio.google.com/app/apikey> | `GEMINI_API_KEY` | `GEMINI_MODEL` (default `gemini-1.5-flash-latest`) |

> ⚠️ Treat these keys like passwords. Never paste them into client code, commit them to git, or share them in screenshots / chat logs. If a key leaks, revoke it immediately from the provider's dashboard.

#### 1. Create your local env file

From the repo root:

```bash
# macOS / Linux
cp apps/web/.env.example apps/web/.env.local

# Windows (PowerShell)
Copy-Item apps/web/.env.example apps/web/.env.local
```

Open `apps/web/.env.local` and fill in **only** the keys you have. Unused providers can stay as placeholders or be deleted — the chat will simply error with a friendly toast if you select a model whose key is missing.

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
```

`.env.local` is git-ignored (see `.gitignore`'s `.env*` rule), so the keys stay on your machine only.

#### 2. Restart the dev server

Next.js loads env files at boot, so stop the running process and start it again:

```bash
pnpm dev
```

Open <http://localhost:3000>, pick a model from the model dropdown above the chat input (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Flash, …), type a message, and the assistant bubble will stream real tokens from the chosen provider.

#### How it works

- The browser POSTs the conversation **plus** `provider` and `model` to `apps/web/src/app/api/chat/route.ts` (a Next.js Edge route).
- The route reads the matching `*_API_KEY` from the server environment, calls the provider's streaming endpoint (OpenAI Chat Completions / Anthropic Messages / Gemini `streamGenerateContent`), and re-streams the token deltas back as plain text.
- Keys are **only** read on the server — they never reach the browser bundle.
- Only the **default text** response uses real AI right now. The `Code`, `File`, `Image`, and `Audio` response types still use mock data so the demo keeps working without extra API setup.

#### Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `OPENAI_API_KEY is not configured on the server.` toast | The key for the selected provider is missing from `.env.local`, or the dev server wasn't restarted after editing it. |
| `… request failed (401)` | Key is wrong, revoked, or copied with extra whitespace. |
| `… request failed (429)` | Account has no credit / hit a rate limit — top up billing or slow down requests. |
| `Anthropic request failed (400)` | Often means the chosen `claude-*` model id is not enabled for your account — try `claude-3-5-haiku-latest`. |
| `Gemini request failed (403)` | Key not enabled for the Generative Language API, or wrong region — recreate the key from AI Studio. |
| Reply never streams, just hangs | Check the terminal running `pnpm dev` for the actual upstream error. |

#### Deploying (Vercel etc.)

Don't upload `.env.local`. Instead, add the relevant `*_API_KEY` values (and optionally `*_MODEL` overrides) as **Environment Variables** in your hosting provider's project settings, then redeploy.

### 🔥 Firebase (auth + chat history)

The demo uses **the user's own Firebase project** for sign-in and to persist chat history. Nothing is stored on Sondor's servers — your Firebase config and access tokens stay in the visitor's browser.

#### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com/) → **Add project**.
2. Inside the project, click the **`</>`** (Web) icon to register a web app. Copy the generated `firebaseConfig` snippet — you'll paste it into the in-app Setup Wizard.
3. **Authentication** → **Get started** → enable the **Google** sign-in provider.
4. **Firestore Database** → **Create database** → start in **production mode** (we'll lock it down with rules below).
5. **Authentication** → **Settings** → **Authorized domains** → add `localhost` (already there) and your deployed domain (e.g. `your-app.vercel.app`).

#### 2. Paste the config in the Setup Wizard

Run `pnpm dev`, open `http://localhost:3000`, and the **Setup Wizard** will appear. Paste the entire `firebaseConfig` object (or fill the fields one by one), click **Connect**, then sign in with Google.

The config is saved to `localStorage` only — it never leaves the browser.

#### 3. Firestore security rules

Open **Firestore Database** → **Rules** in the Firebase console and replace the contents with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Each user can only read/write under their own /users/{uid} subtree.
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Click **Publish**. Without this rule conversations will fail to save (or worse — be readable by other users in test mode).

#### 4. Data model

Conversations and messages are stored as:

```
users/{uid}/conversations/{conversationId}
  title, lastMessage, messageCount, starred, model, createdAt, updatedAt

users/{uid}/conversations/{conversationId}/messages/{messageId}
  role, content, responseType, thinkingTime, createdAt
```

Subscriptions use `onSnapshot` so chat history updates in real time across tabs.

#### Troubleshooting Firebase

| Symptom | Likely cause / fix |
|---|---|
| Setup Wizard says "Invalid config" | Make sure you pasted the *whole* `firebaseConfig` object, including `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId`. |
| Google popup is blocked | Allow popups for `localhost:3000` (or your domain) in the browser. |
| `auth/unauthorized-domain` | Add the current host to Firebase **Authentication → Settings → Authorized domains**. |
| `Missing or insufficient permissions` when sending a message | Firestore rules weren't published. Re-check **step 3** and click **Publish**. |
| Want to reconnect a different project | Sign-in screen → **Use a different Firebase project**, or clear the `sondor.firebase-config.v1` key from localStorage. |

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

- **`packages/ui`** — the publishable library `sondor-ui` (all widget components).
- **`apps/web`** — the Next.js demo / documentation site that consumes `sondor-ui` via a `workspace:*` dependency.

```
.
├── apps/
│   └── web/                          # Next.js 16 demo (@sondor/web)
│       ├── next.config.ts            # transpilePackages: ["sondor-ui"]
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
│   └── ui/                           # Publishable library (sondor-ui)
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
