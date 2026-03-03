# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server (gatsby develop)
npm run build      # Production build
npm run serve      # Serve production build locally
npm run clean      # Clear Gatsby cache and output
```

No linting or testing is configured.

## Architecture

**Codexterity** is a Gatsby/React typing practice app for coding snippets, similar to MonkeyType but for code.

### Data Flow

`data.js` exports a `codeBlocks` array of JavaScript snippets. `src/pages/index.js` imports this and drives the entire typing experience via React hooks (`useState`, `useRef`).

### Typing Engine (src/pages/index.js)

The core is a custom parsing + input-tracking system:

- **`createCodeRows(codeBlock)`** — Parses a code block string into a 2D array of character objects `{ value, correct }`. Special markers:
  - `^` = line break
  - `~` = one indentation level (rendered as a spacer element)
  - End of each row gets a return symbol (`String.fromCharCode(9166)`) that is hidden until that row is active
- **Character state:** `correct: null` = untyped (gray), `true` = correct (off-white), `false` = incorrect (red)
- **Active character** gets a blinking caret (pink `#ec7fff`)
- **Input handling:** A hidden `<input>` field captures keypresses. `rowIndex` and `charIndex` track cursor position. Backspace uses `inputType === "deleteContentBackward"` to revert state.

### Styling

CSS Modules are used throughout (`*.module.css`). Global dark theme vars are set in `src/styles/global.css`:
- Background: `#242933`
- Correct text: `#f6f0e9`
- Incorrect: `#ec4c56`
- Caret: `#ec7fff`

### Pages

- `/` — Main typing interface
- `/about` — About page
- `/settings` — Settings page (placeholder, in development)
