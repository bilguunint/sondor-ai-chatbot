<div align="center">
  <img src="apps/web/public/assets/logo-purple.png" height="80" alt="Sondor AI">
  <h1>Sondor AI</h1>
  <p><strong>Open-source, BYO-key AI chat — UI + Firebase backend, ready to ship.</strong></p>

  [![npm version](https://img.shields.io/npm/v/sondor-ui?color=7c3aed&logo=npm)](https://www.npmjs.com/package/sondor-ui)
  ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
  ![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-ffca28?logo=firebase&logoColor=black)
  ![License](https://img.shields.io/badge/License-MIT-green)

  <br>

  <img src="apps/web/public/assets/intro.png" width="700" alt="Sondor AI Screenshot" style="border-radius: 12px;">

  <br><br>

  <p>
    <a href="https://sondor-ai-chatbot.vercel.app/"><strong>🔴 Live demo</strong></a>
    &nbsp;·&nbsp;
    <a href="#-quick-start">Quick start</a>
    &nbsp;·&nbsp;
    <a href="#-using-it-as-a-ui-library">Use as a library</a>
    &nbsp;·&nbsp;
    <a href="CONTRIBUTING.md">Contributing</a>
  </p>
</div>

---

Sondor AI is a **fully functional, self-hostable AI chat app** — not just a UI kit. Bring your own OpenAI / Anthropic / Gemini key, plug in your own Firebase project, and you've got a production-ready ChatGPT-style assistant with Google sign-in, real-time history, profile management, and 30+ reusable widgets.

Everything runs on your infrastructure. No vendor lock-in, no telemetry, no hidden backend.

## ✨ Highlights

- 🔐 **Bring-your-own Firebase** — Auth (Google), Firestore (chat history), Storage (avatars). Zero backend code to write or deploy.
- 🧠 **Bring-your-own AI key** — streams real responses from **OpenAI**, **Anthropic Claude**, and **Google Gemini** out of the box.
- 💬 **Real chat features** — multi-conversation, real-time sync via `onSnapshot`, star/delete, search, grouped history.
- 👤 **Profile management** — edit first/last name, bio, upload avatar to Firebase Storage.
- 🎨 **6 accent themes + dark mode + Zyricon glass preset** that propagate across every page and widget.
- 🧩 **30+ reusable widgets** also published as the standalone npm package [`sondor-ui`](https://www.npmjs.com/package/sondor-ui).
- ⚡ **Modern stack** — Next.js 16 (App Router), React 19, TypeScript 5, Tailwind v4, Lucide icons.
- 📜 **MIT licensed** — fork it, rebrand it, ship it.

## 📸 Screenshots

**Two built-in themes** — switch instantly from the sidebar:

<div align="center">
<table>
<tr><td align="center"><img src="apps/web/public/assets/default-theme.png" width="780" alt="Default theme"><br><sub><b>Default</b></sub></td></tr>
<tr><td align="center"><img src="apps/web/public/assets/zyricon-theme.png" width="780" alt="Zyricon theme"><br><sub><b>Zyricon</b></sub></td></tr>
</table>
</div>

<div align="center">
<table>
<tr><td align="center"><img src="apps/web/public/assets/explore-screen.png" width="780" alt="Explore"><br><sub><b>Explore</b></sub></td></tr>
<tr><td align="center"><img src="apps/web/public/assets/widgets-screen.png" width="780" alt="Widgets"><br><sub><b>Widgets</b></sub></td></tr>
<tr><td align="center"><img src="apps/web/public/assets/response-types.png" width="780" alt="Response types"><br><sub><b>Response types</b></sub></td></tr>
</table>
</div>

## 🚀 Quick start

```bash
git clone https://github.com/bilguunint/sondor-ai-chatbot.git
cd sondor-ai-chatbot
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The app boots in **mock mode** — you can browse every page without any keys.

To unlock the full experience, set up the two services below.

### 1. Firebase (sign-in + chat history + avatars)

1. Create a project at <https://console.firebase.google.com/> → register a Web app and copy the `firebaseConfig`.
2. Enable **Authentication → Google** sign-in.
3. Enable **Firestore Database** (production mode).
4. Enable **Storage** (for avatar uploads).
5. Add the config to `apps/web/.env.local` (recommended for Vercel/prod) **or** paste it into the in-app Setup Wizard on first boot (saved to `localStorage` only):

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123...:web:abc
   ```

6. Paste these **security rules** (Firestore → Rules):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

7. And these **Storage rules** (Storage → Rules):

   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /users/{uid}/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == uid
                      && request.resource.size < 5 * 1024 * 1024
                      && request.resource.contentType.matches('image/.*');
       }
     }
   }
   ```

8. **Authentication → Settings → Authorized domains** → add your dev/prod domains (`localhost` is preset).

### 2. AI providers (real streaming replies)

Add whichever key(s) you have to the same `apps/web/.env.local`:

| Provider | Get a key | Env variable | Default model override |
|---|---|---|---|
| OpenAI | <https://platform.openai.com/> | `OPENAI_API_KEY` | `OPENAI_MODEL` (default `gpt-4o-mini`) |
| Anthropic | <https://console.anthropic.com/> | `ANTHROPIC_API_KEY` | `ANTHROPIC_MODEL` (default `claude-3-5-sonnet-latest`) |
| Google Gemini | <https://aistudio.google.com/app/apikey> | `GEMINI_API_KEY` | `GEMINI_MODEL` (default `gemini-1.5-flash-latest`) |

Restart `pnpm dev`. Pick a model in the chat header and your messages now stream real tokens from the chosen provider via the Edge route at [`apps/web/src/app/api/chat/route.ts`](apps/web/src/app/api/chat/route.ts). Keys are **only** read on the server — never bundled into the browser.

> ⚠️ Treat your keys like passwords. `.env.local` is git-ignored. For Vercel: add the same vars under **Settings → Environment Variables**, then redeploy.

## 🏗️ Architecture

```
Browser ──► Firebase Auth (Google sign-in)
       ──► Firestore   (users/{uid}/conversations/{id}/messages)
       ──► Storage     (users/{uid}/avatar.*)
       ──► /api/chat   ──► OpenAI / Anthropic / Gemini  (server-only keys)
```

- **`FirebaseProvider`** — config bootstrap (env vars or wizard) + auth state.
- **`UserProfileProvider`** — `users/{uid}/profile/main` doc, real-time, with avatar upload helper.
- **`ChatStoreProvider`** — `useChatStore()` exposes conversations, active messages, `appendMessage`, `toggleStar`, etc. All `onSnapshot`-backed.
- **`/api/chat`** — Next.js Edge route that proxies streaming requests to the chosen provider; the only place where API keys exist.

Everything user-generated lives under `users/{uid}/…` so the security rules above lock it down perfectly per-user.

## 📦 Using it as a UI library

The widgets are also published as the standalone npm package **[`sondor-ui`](https://www.npmjs.com/package/sondor-ui)** — perfect if you only want the components without the Firebase / chat stack.

```bash
npm install sondor-ui
```

```tsx
// app/layout.tsx
import "sondor-ui/styles.css";

// any page
import { ConversationBranchingWidget, TokenStreamInspectorWidget } from "sondor-ui";

export default function Page() {
  return (
    <main className="p-6 space-y-6">
      <ConversationBranchingWidget />
      <TokenStreamInspectorWidget />
    </main>
  );
}
```

All widgets ship with `"use client"` baked in for the Next.js App Router. See the full catalogue in [`packages/ui/README.md`](packages/ui/README.md).

## 🧰 Tech stack

| Tech | Version | Purpose |
|---|---|---|
| Next.js | 16 | App Router + Edge runtime for `/api/chat` |
| React | 19 | UI |
| TypeScript | 5 | Type safety |
| Tailwind CSS | v4 | Styling (`@theme` design tokens) |
| Firebase | 12 | Auth + Firestore + Storage |
| Lucide React | 1.x | Icons |
| pnpm | 9 | Monorepo |

## 📁 Project structure

```
.
├── apps/web/                       # Next.js 16 demo + product (@sondor/web)
│   └── src/
│       ├── app/                    # App Router + /api/chat edge route
│       ├── components/             # Sidebar, AuthGate
│       ├── contexts/               # Firebase / UserProfile / ChatStore / Theme / Toast
│       ├── features/               # chat, history, profile, explore, files, library, widgets, theme, auth, setup
│       └── lib/firebase/           # config / client / chats / profile
│
└── packages/ui/                    # Publishable library (sondor-ui)
    └── src/widgets/                # 30+ reusable widget components
```

## 🛠️ Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run the Next.js demo (`apps/web`) |
| `pnpm build` | Build the UI library, then the demo |
| `pnpm build:ui` / `pnpm build:web` | Build a single workspace |
| `pnpm lint` | ESLint across all workspaces |
| `pnpm clean` | Remove `dist/`, `.next/`, `node_modules/` everywhere |

## 🚢 Deploy

**Vercel (recommended)** — connect the repo, add the same env vars under **Settings → Environment Variables**, deploy. Don't forget to add the deployed domain to Firebase **Authentication → Authorized domains**.

**Self-hosted / Docker** — `pnpm build && pnpm start` (port 3000 by default).

## 🐛 Troubleshooting

| Symptom | Fix |
|---|---|
| Setup Wizard appears on production | Env vars missing on Vercel — add the 6 `NEXT_PUBLIC_FIREBASE_*` vars and redeploy. |
| `auth/unauthorized-domain` on sign-in | Add the host to Firebase **Authentication → Authorized domains**. |
| `Missing or insufficient permissions` writing chats | Firestore rules not published — see step 6 above. |
| Avatar upload fails | Storage not enabled, or rules missing — see step 7 above. |
| `OPENAI_API_KEY is not configured on the server.` | Add the key to `.env.local` (or Vercel env) and restart the dev server / redeploy. |
| Reply just hangs | Check the dev-server terminal for the upstream provider error (401 = bad key, 429 = no credit). |

## 📜 License

MIT — fork it, rebrand it, ship it.
