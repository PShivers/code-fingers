import React, { useState, useEffect } from "react";
import Seo from "../components/seo";
import Layout from "../components/layout";
import {
	settings,
	pageHeader,
	title,
	subtitle,
	section,
	sectionTitle,
	sectionDescription,
	gridButtons,
	btnOption,
	btnOptionActive,
	themesGrid,
	themeCard,
	themeCardActive,
	swatchPreview,
	swatchBlock,
	statsOverview,
	statBox,
	statVal,
	statLbl,
	resetBtn,
} from "../styles/settings.module.css";
import { THEMES, THEME_OPTIONS, applyTheme } from "../utils/themes";
import { Storage } from "../utils/storage";
import { soundEngine } from "../utils/audio";
import { LANGUAGES } from "../../data";

const SOUNDS = [
	{ key: "clicky", label: "🔊 Clicky (Blue)" },
	{ key: "thock", label: "🎧 Thock (Linear)" },
	{ key: "soft", label: "🔉 Soft Bump" },
	{ key: "off", label: "🔇 Muted" },
];

const CARETS = [
	{ key: "line", label: "Line" },
	{ key: "block", label: "Block" },
	{ key: "underline", label: "Underline" },
];

const FONTS = [
	{ key: "JetBrains Mono", label: "JetBrains Mono" },
	{ key: "Fira Code", label: "Fira Code" },
	{ key: "monospace", label: "Monospace" },
];

const SettingsPage = () => {
	const [selectedLang, setSelectedLang] = useState("javascript");
	const [selectedTheme, setSelectedTheme] = useState("default");
	const [selectedSound, setSelectedSound] = useState("clicky");
	const [selectedCaret, setSelectedCaret] = useState("line");
	const [selectedFont, setSelectedFont] = useState("JetBrains Mono");
	const [historyCount, setHistoryCount] = useState(0);
	const [avgWpm, setAvgWpm] = useState(0);
	const [topWpm, setTopWpm] = useState(0);

	const loadSettings = () => {
		setSelectedLang(Storage.getLanguage());
		const theme = Storage.getTheme();
		setSelectedTheme(theme);
		applyTheme(theme);
		setSelectedSound(Storage.getSound());
		setSelectedCaret(Storage.getCaret());
		setSelectedFont(Storage.getFont());

		const history = Storage.getHistory();
		setHistoryCount(history.length);
		if (history.length > 0) {
			const totalWpm = history.reduce((acc, h) => acc + (h.wpm || 0), 0);
			setAvgWpm(Math.round(totalWpm / history.length));
			setTopWpm(Math.max(...history.map((h) => h.wpm || 0)));
		} else {
			setAvgWpm(0);
			setTopWpm(0);
		}
	};

	useEffect(() => {
		loadSettings();
	}, []);

	const handleLangSelect = (langKey) => {
		Storage.setLanguage(langKey);
		setSelectedLang(langKey);
	};

	const handleThemeSelect = (themeKey) => {
		Storage.setTheme(themeKey);
		setSelectedTheme(themeKey);
		applyTheme(themeKey);
	};

	const handleSoundSelect = (soundKey) => {
		Storage.setSound(soundKey);
		setSelectedSound(soundKey);
		soundEngine.playKey(soundKey, 0.5);
	};

	const handleCaretSelect = (caretKey) => {
		Storage.setCaret(caretKey);
		setSelectedCaret(caretKey);
	};

	const handleFontSelect = (fontKey) => {
		Storage.setFont(fontKey);
		setSelectedFont(fontKey);
		document.documentElement.style.setProperty("--code-font", `"${fontKey}", monospace`);
	};

	const handleClearHistory = () => {
		if (window.confirm("Are you sure you want to clear all test history and personal bests?")) {
			Storage.clearHistory();
			loadSettings();
		}
	};

	return (
		<Layout pageTitle="Settings">
			<div className={settings}>
				<div className={pageHeader}>
					<h1 className={title}>Settings & Preferences</h1>
					<p className={subtitle}>Customize your typing environment, editor theme, and practice defaults.</p>
				</div>

				{/* Progress Overview */}
				<div className={section}>
					<h2 className={sectionTitle}>Stats & Progress</h2>
					<p className={sectionDescription}>Your historical typing activity stored locally on this device.</p>
					<div className={statsOverview}>
						<div className={statBox}>
							<span className={statVal}>{historyCount}</span>
							<span className={statLbl}>Tests Completed</span>
						</div>
						<div className={statBox}>
							<span className={statVal}>{avgWpm}</span>
							<span className={statLbl}>Average WPM</span>
						</div>
						<div className={statBox}>
							<span className={statVal}>{topWpm}</span>
							<span className={statLbl}>Personal Best WPM</span>
						</div>
					</div>
				</div>

				{/* Language */}
				<div className={section}>
					<h2 className={sectionTitle}>Default Programming Language</h2>
					<p className={sectionDescription}>Select your primary target for code syntax drills.</p>
					<div className={gridButtons}>
						{LANGUAGES.map(({ key, label }) => (
							<button
								key={key}
								type="button"
								className={`${btnOption}${selectedLang === key ? ` ${btnOptionActive}` : ""}`}
								onClick={() => handleLangSelect(key)}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				{/* Theme */}
				<div className={section}>
					<h2 className={sectionTitle}>Editor Theme</h2>
					<p className={sectionDescription}>Color palettes inspired by popular developer IDEs and text editors.</p>
					<div className={themesGrid}>
						{THEME_OPTIONS.map(({ key, label }) => {
							const t = THEMES[key];
							return (
								<button
									key={key}
									type="button"
									className={`${themeCard}${selectedTheme === key ? ` ${themeCardActive}` : ""}`}
									onClick={() => handleThemeSelect(key)}
								>
									<div className={swatchPreview}>
										<span className={swatchBlock} style={{ background: t.bg }} />
										<span className={swatchBlock} style={{ background: t.accent }} />
										<span className={swatchBlock} style={{ background: t.synType }} />
										<span className={swatchBlock} style={{ background: t.synString }} />
									</div>
									<span>{label}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Mechanical Audio */}
				<div className={section}>
					<h2 className={sectionTitle}>Tactile Audio Feedback</h2>
					<p className={sectionDescription}>Synthesized mechanical switch audio via Web Audio API.</p>
					<div className={gridButtons}>
						{SOUNDS.map(({ key, label }) => (
							<button
								key={key}
								type="button"
								className={`${btnOption}${selectedSound === key ? ` ${btnOptionActive}` : ""}`}
								onClick={() => handleSoundSelect(key)}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				{/* Caret & Font */}
				<div className={section}>
					<h2 className={sectionTitle}>Caret & Typography</h2>
					<p className={sectionDescription}>Configure caret indicator style and code typography.</p>
					<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
						<div>
							<div style={{ fontSize: "0.8rem", color: "var(--dim)", marginBottom: "0.4rem", textTransform: "uppercase" }}>
								Caret Shape
							</div>
							<div className={gridButtons}>
								{CARETS.map(({ key, label }) => (
									<button
										key={key}
										type="button"
										className={`${btnOption}${selectedCaret === key ? ` ${btnOptionActive}` : ""}`}
										onClick={() => handleCaretSelect(key)}
									>
										{label}
									</button>
								))}
							</div>
						</div>
						<div>
							<div style={{ fontSize: "0.8rem", color: "var(--dim)", marginBottom: "0.4rem", textTransform: "uppercase" }}>
								Monospace Font
							</div>
							<div className={gridButtons}>
								{FONTS.map(({ key, label }) => (
									<button
										key={key}
										type="button"
										className={`${btnOption}${selectedFont === key ? ` ${btnOptionActive}` : ""}`}
										onClick={() => handleFontSelect(key)}
									>
										{label}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Data Management */}
				<div className={section}>
					<h2 className={sectionTitle}>Data Management</h2>
					<p className={sectionDescription}>Clear test logs, speed metrics, and personal best records from this browser.</p>
					<button className={resetBtn} onClick={handleClearHistory}>
						Clear All Data & Test History
					</button>
				</div>
			</div>
		</Layout>
	);
};

export const Head = () => <Seo title="Settings — Codexterity" />;

export default SettingsPage;
