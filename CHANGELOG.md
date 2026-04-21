# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-04-21

### Added

- **Guest mode** — visitors land directly on the home view without being
  forced through sign-in. Conversations live in an in-memory store for the
  lifetime of the tab (`ChatStoreProvider`).
- `AuthModal` component that opens the sign-in / setup flow on demand.
- Sidebar **Sign in** button (collapsed, expanded, and mobile variants) shown
  whenever no Firebase user is signed in; greeting falls back to "Guest".
- Real AI replies via OpenAI, Anthropic, and Gemini providers (`/api/chat`).
- BYOK Firebase setup wizard + Firestore-backed chat history persistence.
- User profile management (display name, bio, avatar upload).
- Real Firebase Storage file uploads with a 500 MB per-user quota and
  grid/list views in the Files page.
- Mock-response fallback when the configured AI API key is missing or invalid
  ("Demo mode" toast).
- npm trusted-publishing workflow and badges; community health files
  (`CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/` issue & PR templates).

### Changed

- `AuthGate` no longer blocks on `needs-config` / `needs-auth` — only
  `loading` and `error` states render boot screens.
- Reorganized `src/` to a feature-first architecture: page-level modules now
  live under `src/features/<name>/` with their own `components/`, `data/`,
  `modals/`, and `types.ts` as needed.
- Moved `src/utils/mockData.ts` to `src/lib/mockData.ts`.
- Renamed `MainContent` to `ChatView` (`src/features/chat/`).
- Revamped README with screenshots, "Why Sondor UI?" section, and Quick Start.

### Fixed

- Guest-mode chat replies no longer disappear after streaming
  (`appendMessage` now reads the active conversation id from a ref instead of
  a stale closure).
- Use a valid `ToastType` (`warning`) for AI request errors.
- Duplicate React key in `KeyboardShortcutsWidget` kbd map.
- Type safety in `LiveChatFeedWidget` and `UptimeStatusWidget` (string-indexed
  lookup tables now use `Record<Union, …>`).
