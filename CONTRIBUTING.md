# Contributing to Sondor UI

First off, thank you for taking the time to contribute! ❤️

This document is a short, practical guide to setting up the project, the
conventions we follow, and the workflow we use to land changes.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Convention](#commit-message-convention)
- [Pull Requests](#pull-requests)
- [Reporting Bugs & Requesting Features](#reporting-bugs--requesting-features)
- [License](#license)

---

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report
unacceptable behavior to the maintainers.

## Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later (or `pnpm` / `yarn` — examples use `npm`)
- **Git**

### Setup

```bash
# 1. Fork the repository, then clone your fork
git clone https://github.com/<your-username>/sondor-ai-chatbot.git
cd sondor-ai-chatbot

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app is served at [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js dev server (Turbopack) |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project Structure

We use a **feature-first** structure to keep contributions self-contained.
See [`README.md`](README.md#project-structure) for the full tree.

The headline rule is:

> Code that belongs to a single page/feature lives in `src/features/<name>/`.
> Code shared across features lives in `src/components/`, `src/contexts/`,
> `src/lib/`, or `src/types/`.

```
src/
├── app/              # Next.js App Router (routes, layout, global CSS)
├── components/       # Cross-feature, presentational components (e.g. layout)
├── contexts/         # React Context providers (e.g. ThemeProvider)
├── features/         # Feature modules — one folder per feature
│   ├── chat/
│   ├── explore/
│   ├── files/
│   ├── history/
│   ├── library/
│   ├── profile/
│   ├── theme/
│   └── widgets/
├── lib/              # Framework-agnostic helpers, mock data, utilities
└── types/            # Shared TypeScript types
```

Each feature folder follows the same internal pattern:

```
features/<feature>/
├── index.ts                 # Public entry — re-exports the feature's main view
├── <Feature>Content.tsx     # The page-level component
├── components/              # (optional) feature-private components
├── data/                    # (optional) static data or registries
├── modals/                  # (optional) feature-private modals
└── types.ts                 # (optional) feature-private types
```

When adding a new feature:

1. Create `src/features/<feature>/` with at minimum `<Feature>Content.tsx`
   and `index.ts` that re-exports it as `default`.
2. Wire it into the view router in [`src/app/page.tsx`](src/app/page.tsx).
3. Add the navigation entry in [`src/components/layout/Sidebar.tsx`](src/components/layout/Sidebar.tsx)
   if it's user-facing.
4. Extend `ActiveView` in [`src/types/index.ts`](src/types/index.ts).

## Development Workflow

1. Create a topic branch from `main`:
   ```bash
   git checkout -b feat/short-description
   ```
2. Make focused commits.
3. Verify locally before pushing:
   ```bash
   npm run lint
   npm run build
   ```
4. Push and open a Pull Request.

## Coding Guidelines

- **TypeScript everywhere.** All new files are `.ts` / `.tsx`.
- **Path aliases.** Use `@/` for imports from `src/` (e.g. `@/contexts/ThemeProvider`).
  Use relative imports for files within the same feature folder.
- **Tailwind first.** Prefer utility classes over custom CSS. Use the design
  tokens defined in [`src/app/globals.css`](src/app/globals.css)
  (`bg-card`, `text-text-primary`, `border-border-light`, …).
- **Icons.** Use [`lucide-react`](https://lucide.dev). Don't bundle alternatives.
- **Theme-aware.** Read colors via `useTheme()` rather than hard-coding hex values.
- **Components are focused.** One responsibility per component; split into
  `components/` subfolders when a file grows beyond ~250 lines.
- **No dead code.** Remove unused imports, variables, and props.
- **Accessibility.** Provide `alt` text for images and `aria-label` for
  icon-only buttons.

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|---|---|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructure with no behavior change |
| `perf:` | Performance improvement |
| `test:` | Adding or updating tests |
| `chore:` | Tooling, build, or dependency updates |

Example:

```
feat(widgets): add sentiment analysis card
```

## Pull Requests

A good PR is small, focused, and easy to review.

Before opening a PR:

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No unrelated changes are bundled in
- [ ] New components are placed under the correct `src/features/*` folder
- [ ] Screenshots / GIFs are attached for UI changes
- [ ] Linked to the issue it resolves (`Fixes #123`)

The PR template will guide you through the rest.

## Reporting Bugs & Requesting Features

Please use the [issue templates](.github/ISSUE_TEMPLATE/). Include:

- What you expected to happen
- What actually happened
- Reproduction steps (and a code snippet / screenshot when possible)
- Environment (OS, browser, Node version)

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE).
# Contributing to Sondor UI

Thank you for your interest in contributing! Here's how you can help.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sondor-ai-chatbot.git
   cd sondor-ai-chatbot
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the dev server:**
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                # Next.js App Router (layout, page, global styles)
├── components/         # All React components
│   ├── MainContent.tsx     # Chat interface (home + chat views)
│   ├── Sidebar.tsx         # Collapsible navigation sidebar
│   ├── ThemeProvider.tsx   # Theme context (mode + accent color)
│   ├── ThemeContent.tsx    # Theme settings page
│   ├── ExploreContent.tsx  # Explore / AI Assistants page
│   ├── LibraryContent.tsx  # Library page
│   ├── FilesContent.tsx    # Files page
│   ├── HistoryContent.tsx  # Chat history page
│   ├── WidgetsContent.tsx  # Widget components showcase
│   └── ProfileContent.tsx  # User profile & settings
```

## Tech Stack

- **Next.js 16** (App Router + Turbopack)
- **React 19**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **TypeScript 5**
- **Lucide React** (icons)

## How to Contribute

### Reporting Bugs

Open an [issue](https://github.com/bilguunint/sondor-ai-chatbot/issues) with:
- A clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Suggesting Features

Open an issue with the **feature request** label describing:
- What you'd like to see
- Why it would be useful
- Any examples or mockups

### Submitting a Pull Request

1. Create a new branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes
3. Ensure the project builds:
   ```bash
   npm run build
   ```
4. Run the linter:
   ```bash
   npm run lint
   ```
5. Commit with a descriptive message:
   ```bash
   git commit -m "feat: add new widget component"
   ```
6. Push and open a PR against `main`

### Commit Message Convention

Use the following prefixes:
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style (formatting, no logic change)
- `refactor:` — Code refactoring
- `chore:` — Build, config, or tooling changes

## Code Style

- Use **TypeScript** for all components
- Use **Tailwind CSS utility classes** — avoid custom CSS unless necessary
- Use **Lucide React** for icons
- Format code with **Prettier** before committing
- Keep components focused — one responsibility per component

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
