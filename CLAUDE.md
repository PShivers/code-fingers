# CLAUDE.md

This file provides guidance when working with code in this repository.

## Environment & Commands

- **Node version:** Node 20 LTS (Gatsby 5 requirement). If using NVM: `nvm use 20`.

```bash
npm start          # Start dev server (gatsby develop)
npm run build      # Production build (gatsby build)
npm run serve      # Serve production build locally
npm run clean      # Clear Gatsby cache and output
```

## Architecture

**Codexterity** is a modern Gatsby/React typing practice platform for code snippets, inspired by MonkeyType but specifically tailored for software engineers.

### Core Modules & Utilities

- **`data.js`** — Rich snippet database for 10 languages (`javascript`, `typescript`, `python`, `rust`, `go`, `c`, `cpp`, `csharp`, `java`, `sql`), categorized across `short`, `medium`, and `long` difficulties.
- **`src/utils/syntax.js`** — Lightweight syntax tokenizer that maps code characters into syntax token types (`keyword`, `type`, `string`, `number`, `function`, `comment`, `operator`, `punctuation`, `plain`).
- **`src/utils/themes.js`** — 10 developer themes (Codexterity, Monokai, One Dark Pro, Dracula, Tokyo Night, Nord, Catppuccin Mocha, Gruvbox, Cyberpunk, GitHub Dark) providing vibrant syntax colors and dimmed untyped variants.
- **`src/utils/audio.js`** — Web Audio API mechanical keyboard sound engine with zero external dependencies (Clicky Blue, Thock Linear, Soft Bump, Mute).
- **`src/utils/storage.js`** — User preferences and test history persistence with real-time multi-component synchronization via custom window events.
- **`src/components/resultsChart.js`** — Interactive SVG performance chart visualizing WPM timeline curves and error markers.

### Typing Engine (`src/pages/index.js`)

- **Tokenized Parsing (`createCodeRows`)**:
  - `^` = newline break
  - `~` = indentation level (rendered as auto-indent spacers)
  - End of each row receives a return symbol (`⏎`)
- **Interactive States**:
  - Untyped characters render in their theme's dimmed syntax color.
  - Correct keystrokes illuminate in vibrant syntax colors.
  - Errors highlight in red with wavy underlines and audio buzz feedback.
- **Modes**:
  - `Snippets`: Standard code block practice.
  - `30s Rush` / `60s Rush`: Time attack with continuous code snippets and accumulated metrics.
  - `Custom`: Paste and practice any custom code snippet.
- **Shortcuts**:
  - `Tab`: Restart snippet / advance
  - `Esc`: Skip snippet
  - `Enter`: Advance line at return symbol or restart from results card

### Pages

- `/` — Main typing interface and toolbar
- `/about` — About page and shortcut guide
- `/settings` — Dedicated settings and history management dashboard
