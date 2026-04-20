# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Reorganized `src/` to a feature-first architecture: page-level modules now
  live under `src/features/<name>/` with their own `components/`, `data/`,
  `modals/`, and `types.ts` as needed.
- Moved `src/utils/mockData.ts` to `src/lib/mockData.ts`.
- Renamed `MainContent` to `ChatView` (`src/features/chat/`).
- Added repository community health files: `CODE_OF_CONDUCT.md`, `SECURITY.md`,
  `CHANGELOG.md`, `.github/` issue & PR templates.

### Fixed

- Type safety in `LiveChatFeedWidget` and `UptimeStatusWidget` (string-indexed
  lookup tables now use `Record<Union, …>`).
