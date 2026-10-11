// LocalStorage and User Preferences Helper

const KEYS = {
	LANG: "codexterity_language",
	THEME: "codexterity_theme",
	DIFFICULTY: "codexterity_difficulty",
	MODE: "codexterity_mode",
	SOUND: "codexterity_sound",
	VOLUME: "codexterity_volume",
	CARET: "codexterity_caret",
	FONT: "codexterity_font",
	LIVE_WPM: "codexterity_live_wpm",
	HISTORY: "codexterity_history",
	PBS: "codexterity_pbs",
	CUSTOM_SNIPPETS: "codexterity_custom_snippets",
};

function safeGet(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const val = localStorage.getItem(key);
		return val !== null ? val : fallback;
	} catch {
		return fallback;
	}
}

function safeSet(key, val) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(key, typeof val === "string" ? val : JSON.stringify(val));
		window.dispatchEvent(new CustomEvent("codexterity-settings-change", { detail: { key, val } }));
	} catch (e) {
		console.error("Failed to write to localStorage", e);
	}
}

export const Storage = {
	getLanguage: () => safeGet(KEYS.LANG, "javascript"),
	setLanguage: (lang) => safeSet(KEYS.LANG, lang),

	getTheme: () => safeGet(KEYS.THEME, "default"),
	setTheme: (theme) => safeSet(KEYS.THEME, theme),

	getDifficulty: () => safeGet(KEYS.DIFFICULTY, "all"),
	setDifficulty: (diff) => safeSet(KEYS.DIFFICULTY, diff),

	getMode: () => safeGet(KEYS.MODE, "snippet"),
	setMode: (mode) => safeSet(KEYS.MODE, mode),

	getSound: () => safeGet(KEYS.SOUND, "clicky"),
	setSound: (sound) => safeSet(KEYS.SOUND, sound),

	getVolume: () => parseFloat(safeGet(KEYS.VOLUME, "0.5")),
	setVolume: (vol) => safeSet(KEYS.VOLUME, String(vol)),

	getCaret: () => safeGet(KEYS.CARET, "line"),
	setCaret: (caret) => safeSet(KEYS.CARET, caret),

	getFont: () => safeGet(KEYS.FONT, "JetBrains Mono"),
	setFont: (font) => safeSet(KEYS.FONT, font),

	getLiveWpm: () => safeGet(KEYS.LIVE_WPM, "true") === "true",
	setLiveWpm: (enabled) => safeSet(KEYS.LIVE_WPM, String(enabled)),

	getPersonalBests: () => {
		try {
			const raw = safeGet(KEYS.PBS, "{}");
			return JSON.parse(raw);
		} catch {
			return {};
		}
	},

	getHistory: () => {
		try {
			const raw = safeGet(KEYS.HISTORY, "[]");
			return JSON.parse(raw);
		} catch {
			return [];
		}
	},

	saveTestResult: (result) => {
		if (typeof window === "undefined") return { isPersonalBest: false };
		try {
			const history = Storage.getHistory();
			const entry = {
				id: Date.now(),
				timestamp: new Date().toISOString(),
				...result,
			};
			history.unshift(entry);
			if (history.length > 50) history.pop();
			safeSet(KEYS.HISTORY, JSON.stringify(history));

			const pbs = Storage.getPersonalBests();
			const key = `${result.lang}_${result.difficulty || "all"}`;
			const currentPb = pbs[key] || 0;
			const isPersonalBest = result.wpm > currentPb;

			if (isPersonalBest) {
				pbs[key] = result.wpm;
				safeSet(KEYS.PBS, JSON.stringify(pbs));
			}

			return { isPersonalBest, previousBest: currentPb };
		} catch (e) {
			console.error("Failed to save result", e);
			return { isPersonalBest: false };
		}
	},

	clearHistory: () => {
		if (typeof window === "undefined") return;
		try {
			localStorage.removeItem(KEYS.HISTORY);
			localStorage.removeItem(KEYS.PBS);
			window.dispatchEvent(new CustomEvent("codexterity-settings-change", { detail: { key: "cleared" } }));
		} catch (e) {
			console.error("Failed to clear history", e);
		}
	},

	getCustomSnippets: () => {
		try {
			const raw = safeGet(KEYS.CUSTOM_SNIPPETS, "[]");
			return JSON.parse(raw);
		} catch {
			return [];
		}
	},

	saveCustomSnippet: (code) => {
		try {
			const snippets = Storage.getCustomSnippets();
			if (!snippets.includes(code)) {
				snippets.unshift(code);
				if (snippets.length > 10) snippets.pop();
				safeSet(KEYS.CUSTOM_SNIPPETS, JSON.stringify(snippets));
			}
		} catch (e) {
			console.error("Failed to save custom snippet", e);
		}
	},
};
