export const THEMES = {
	default: {
		key: "default",
		label: "Codexterity",
		bg: "#1e222b",
		surface: "#272c38",
		border: "#3a4253",
		text: "#f6f0e9",
		dim: "#636e85",
		accent: "#ec7fff",
		caret: "#ec7fff",
		err: "#ec4c56",
		synKeyword: "#ec7fff",
		synType: "#61afef",
		synString: "#98c379",
		synNumber: "#e5c07b",
		synFunction: "#56b6c2",
		synComment: "#5c6370",
		synOperator: "#d19a66",
	},
	monokai: {
		key: "monokai",
		label: "Monokai",
		bg: "#272822",
		surface: "#34352f",
		border: "#49483e",
		text: "#f8f8f2",
		dim: "#75715e",
		accent: "#a6e22e",
		caret: "#a6e22e",
		err: "#f92672",
		synKeyword: "#f92672",
		synType: "#66d9ef",
		synString: "#e6db74",
		synNumber: "#ae81ff",
		synFunction: "#a6e22e",
		synComment: "#75715e",
		synOperator: "#fd971f",
	},
	oneDarkPro: {
		key: "oneDarkPro",
		label: "One Dark Pro",
		bg: "#282c34",
		surface: "#21252b",
		border: "#3b4048",
		text: "#abb2bf",
		dim: "#5c6370",
		accent: "#61afef",
		caret: "#528bff",
		err: "#e06c75",
		synKeyword: "#c678dd",
		synType: "#e5c07b",
		synString: "#98c379",
		synNumber: "#d19a66",
		synFunction: "#61afef",
		synComment: "#5c6370",
		synOperator: "#56b6c2",
	},
	dracula: {
		key: "dracula",
		label: "Dracula",
		bg: "#282a36",
		surface: "#343746",
		border: "#44475a",
		text: "#f8f8f2",
		dim: "#6272a4",
		accent: "#bd93f9",
		caret: "#ff79c6",
		err: "#ff5555",
		synKeyword: "#ff79c6",
		synType: "#8be9fd",
		synString: "#f1fa8c",
		synNumber: "#bd93f9",
		synFunction: "#50fa7b",
		synComment: "#6272a4",
		synOperator: "#ffb86c",
	},
	tokyoNight: {
		key: "tokyoNight",
		label: "Tokyo Night",
		bg: "#1a1b26",
		surface: "#24283b",
		border: "#414868",
		text: "#c0caf5",
		dim: "#565f89",
		accent: "#7aa2f7",
		caret: "#bb9af7",
		err: "#f7768e",
		synKeyword: "#bb9af7",
		synType: "#2ac3de",
		synString: "#9ece6a",
		synNumber: "#ff9e64",
		synFunction: "#7aa2f7",
		synComment: "#565f89",
		synOperator: "#89ddff",
	},
	nord: {
		key: "nord",
		label: "Nord",
		bg: "#2e3440",
		surface: "#3b4252",
		border: "#4c566a",
		text: "#eceff4",
		dim: "#7b88a1",
		accent: "#88c0d0",
		caret: "#81a1c1",
		err: "#bf616a",
		synKeyword: "#81a1c1",
		synType: "#8fbcbb",
		synString: "#a3be8c",
		synNumber: "#b48ead",
		synFunction: "#88c0d0",
		synComment: "#616e88",
		synOperator: "#d8dee9",
	},
	catppuccin: {
		key: "catppuccin",
		label: "Catppuccin Mocha",
		bg: "#1e1e2e",
		surface: "#252538",
		border: "#45475a",
		text: "#cdd6f4",
		dim: "#6c7086",
		accent: "#cba6f7",
		caret: "#f5c2e7",
		err: "#f38ba8",
		synKeyword: "#cba6f7",
		synType: "#89dceb",
		synString: "#a6e3a1",
		synNumber: "#fab387",
		synFunction: "#89b4fa",
		synComment: "#6c7086",
		synOperator: "#94e2d5",
	},
	gruvbox: {
		key: "gruvbox",
		label: "Gruvbox Dark",
		bg: "#282828",
		surface: "#32302f",
		border: "#504945",
		text: "#ebdbb2",
		dim: "#928374",
		accent: "#fe8019",
		caret: "#fabd2f",
		err: "#fb4934",
		synKeyword: "#fb4934",
		synType: "#fabd2f",
		synString: "#b8bb26",
		synNumber: "#d3869b",
		synFunction: "#8ec07c",
		synComment: "#928374",
		synOperator: "#fe8019",
	},
	cyberpunk: {
		key: "cyberpunk",
		label: "Cyberpunk",
		bg: "#0d0f18",
		surface: "#171b2b",
		border: "#2c3553",
		text: "#00f0ff",
		dim: "#495b82",
		accent: "#ffe600",
		caret: "#ff0055",
		err: "#ff0055",
		synKeyword: "#ff007f",
		synType: "#ffe600",
		synString: "#00ff9f",
		synNumber: "#ff7700",
		synFunction: "#00f0ff",
		synComment: "#5b6c8f",
		synOperator: "#fcee0a",
	},
	githubDark: {
		key: "githubDark",
		label: "GitHub Dark",
		bg: "#0d1117",
		surface: "#161b22",
		border: "#30363d",
		text: "#c9d1d9",
		dim: "#6e7681",
		accent: "#58a6ff",
		caret: "#58a6ff",
		err: "#f85149",
		synKeyword: "#ff7b72",
		synType: "#ffa657",
		synString: "#a5d6ff",
		synNumber: "#79c0ff",
		synFunction: "#d2a8ff",
		synComment: "#8b949e",
		synOperator: "#79c0ff",
	},
};

export const THEME_OPTIONS = Object.values(THEMES).map((t) => ({
	key: t.key,
	label: t.label,
}));

export const applyTheme = (themeKey) => {
	if (typeof document === "undefined") return;
	const theme = THEMES[themeKey] || THEMES.default;
	const root = document.documentElement;
	root.style.setProperty("--bg", theme.bg);
	root.style.setProperty("--surface", theme.surface);
	root.style.setProperty("--border", theme.border);
	root.style.setProperty("--text", theme.text);
	root.style.setProperty("--dim", theme.dim);
	root.style.setProperty("--accent", theme.accent);
	root.style.setProperty("--caret", theme.caret);
	root.style.setProperty("--err", theme.err);

	// Syntax colors (vibrant)
	root.style.setProperty("--syn-keyword", theme.synKeyword);
	root.style.setProperty("--syn-type", theme.synType);
	root.style.setProperty("--syn-string", theme.synString);
	root.style.setProperty("--syn-number", theme.synNumber);
	root.style.setProperty("--syn-function", theme.synFunction);
	root.style.setProperty("--syn-comment", theme.synComment);
	root.style.setProperty("--syn-operator", theme.synOperator);

	// Dimmed syntax colors for untyped text
	root.style.setProperty("--syn-keyword-dim", hexToRgba(theme.synKeyword, 0.45));
	root.style.setProperty("--syn-type-dim", hexToRgba(theme.synType, 0.45));
	root.style.setProperty("--syn-string-dim", hexToRgba(theme.synString, 0.45));
	root.style.setProperty("--syn-number-dim", hexToRgba(theme.synNumber, 0.45));
	root.style.setProperty("--syn-function-dim", hexToRgba(theme.synFunction, 0.45));
	root.style.setProperty("--syn-comment-dim", hexToRgba(theme.synComment, 0.40));
	root.style.setProperty("--syn-operator-dim", hexToRgba(theme.synOperator, 0.45));
};

function hexToRgba(hex, alpha = 0.5) {
	if (!hex || hex[0] !== "#") return hex;
	let c = hex.slice(1);
	if (c.length === 3) {
		c = c.split("").map((ch) => ch + ch).join("");
	}
	const num = parseInt(c, 16);
	const r = (num >> 16) & 255;
	const g = (num >> 8) & 255;
	const b = num & 255;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
