# sondor-ui

> Modern, accessible **AI Chatbot UI Kit** — 30+ ready-to-use widgets built with React 19, Tailwind CSS v4, and TypeScript.

[![npm version](https://img.shields.io/npm/v/sondor-ui?color=7c3aed)](https://www.npmjs.com/package/sondor-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](../../LICENSE)

## Install

```bash
npm install sondor-ui
# or
pnpm add sondor-ui
# or
yarn add sondor-ui
```

**Peer requirements:** `react >= 18.2`, `react-dom >= 18.2`, **Tailwind CSS v4** in your app.

## Usage

```tsx
// app/layout.tsx (or your global CSS entry)
import "sondor-ui/styles.css";
```

```tsx
import {
  ChatBubbleWidget,
  ConversationBranchingWidget,
  ModelComparisonArenaWidget,
  TokenStreamInspectorWidget,
} from "sondor-ui";

export default function Page() {
  return (
    <main className="p-8 grid gap-4">
      <ChatBubbleWidget />
      <ConversationBranchingWidget />
      <ModelComparisonArenaWidget />
      <TokenStreamInspectorWidget />
    </main>
  );
}
```

## Available widgets

| Category   | Components                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| AI Kit     | `ConversationBranchingWidget`, `TokenStreamInspectorWidget`, `ModelComparisonArenaWidget`, `ContextMemoryVisualizerWidget`, `PromptLabWorkbenchWidget` |
| Chat       | `ChatBubbleWidget`, `LiveChatFeedWidget`, `QuickRepliesWidget`, `CodeBlockWidget`, `FileUploadWidget`, `VoiceInputWidget`, `ImageGenWidget`, `PromptTemplatesWidget` |
| Data       | `BarChartWidget`, `LineChartWidget`, `DonutChartWidget`, `StatsCardsWidget`, `ProgressBarsWidget`, `TokenCostWidget`, `UptimeStatusWidget`, `LeaderboardWidget` |
| Profile    | `UserProfileWidget`, `TeamMembersWidget`, `OnlineUsersWidget`, `BotPersonaWidget`                       |
| Controls   | `DropdownSelectWidget`, `ToggleSettingsWidget`, `ModelSelectorWidget`, `TagInputWidget`, `DatePickerWidget`, `ThemeCustomizerWidget`, `KeyboardShortcutsWidget` |
| Feedback   | `StarRatingWidget`, `SentimentWidget`, `NotificationFeedWidget`, `SatisfactionGaugeWidget`, `ConversationExportWidget` |

## Subpath imports

```ts
// Tree-shakable subpath
import { TokenStreamInspectorWidget } from "sondor-ui/widgets";
```

## License

MIT © [Bilguun](https://github.com/bilguunint)
