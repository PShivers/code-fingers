import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import {
	container,
	brand,
	brandIcon,
	heading,
	headingAccent,
	navLinks,
	navLinkItem,
	navLinkText,
	iconBtn,
	overlay,
	modal,
	modalHeader,
	modalTitle,
	closeBtn,
	formGrid,
	formGroup,
	formLabel,
	select,
	themeSwatches,
	themeCard,
	themeCardActive,
	swatchPreview,
	swatchBlock,
	aboutSection,
	shortcutGrid,
	kbd,
	dangerBtn,
} from "../styles/header.module.css";
import { THEMES, THEME_OPTIONS, applyTheme } from "../utils/themes";
import { Storage } from "../utils/storage";
import { soundEngine } from "../utils/audio";
import { LANGUAGES } from "../../data";

const SOUND_OPTIONS = [
	{ key: "clicky", label: "Clicky (Blue)" },
	{ key: "thock", label: "Thock (Linear)" },
	{ key: "soft", label: "Soft Bump" },
	{ key: "off", label: "Muted" },
];

const CARET_OPTIONS = [
	{ key: "line", label: "Line" },
	{ key: "block", label: "Block" },
	{ key: "underline", label: "Underline" },
];

const FONT_OPTIONS = [
	{ key: "JetBrains Mono", label: "JetBrains Mono" },
	{ key: "Fira Code", label: "Fira Code" },
	{ key: "monospace", label: "System Monospace" },
];

const Header = () => {
	const [activeModal, setActiveModal] = useState(null);
	const [selectedLang, setSelectedLang] = useState("javascript");
	const [selectedTheme, setSelectedTheme] = useState("default");
	const [selectedSound, setSelectedSound] = useState("clicky");
	const [selectedCaret, setSelectedCaret] = useState("line");
	const [selectedFont, setSelectedFont] = useState("JetBrains Mono");

	const syncFromStorage = () => {
		const lang = Storage.getLanguage();
		const theme = Storage.getTheme();
		const sound = Storage.getSound();
		const caret = Storage.getCaret();
		const font = Storage.getFont();

		setSelectedLang(lang);
		setSelectedTheme(theme);
		setSelectedSound(sound);
		setSelectedCaret(caret);
		setSelectedFont(font);
		applyTheme(theme);
	};

	useEffect(() => {
		syncFromStorage();
		const handleSettingsUpdate = () => {
			syncFromStorage();
		};
		window.addEventListener("codexterity-settings-change", handleSettingsUpdate);
		return () => {
			window.removeEventListener("codexterity-settings-change", handleSettingsUpdate);
		};
	}, []);

	useEffect(() => {
		if (!activeModal) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setActiveModal(null);
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [activeModal]);

	const handleLangChange = (e) => {
		const lang = e.target.value;
		Storage.setLanguage(lang);
		setSelectedLang(lang);
	};

	const handleThemeSelect = (themeKey) => {
		Storage.setTheme(themeKey);
		setSelectedTheme(themeKey);
		applyTheme(themeKey);
	};

	const handleSoundChange = (e) => {
		const sound = e.target.value;
		Storage.setSound(sound);
		setSelectedSound(sound);
		soundEngine.playKey(sound, 0.5);
	};

	const handleCaretChange = (e) => {
		const caret = e.target.value;
		Storage.setCaret(caret);
		setSelectedCaret(caret);
	};

	const handleFontChange = (e) => {
		const font = e.target.value;
		Storage.setFont(font);
		setSelectedFont(font);
		document.documentElement.style.setProperty("--code-font", `"${font}", monospace`);
	};

	const cycleSoundQuick = () => {
		const cycle = ["clicky", "thock", "soft", "off"];
		const nextIdx = (cycle.indexOf(selectedSound) + 1) % cycle.length;
		const nextSound = cycle[nextIdx];
		Storage.setSound(nextSound);
		setSelectedSound(nextSound);
		soundEngine.playKey(nextSound, 0.5);
	};

	const handleClearHistory = () => {
		if (window.confirm("Are you sure you want to clear your test history and personal bests?")) {
			Storage.clearHistory();
			alert("Test history cleared.");
		}
	};

	return (
		<>
			<header className={container}>
				<Link to="/" className={brand}>
					<div className={brandIcon}>&gt;_</div>
					<h1 className={heading}>
						Code<span className={headingAccent}>xterity</span>
					</h1>
				</Link>

				<nav>
					<ul className={navLinks}>
						<li className={navLinkItem}>
							<button
								className={iconBtn}
								onClick={cycleSoundQuick}
								title="Toggle Sound (Click to switch sound profile)"
							>
								{selectedSound === "off" ? "🔇 Muted" : selectedSound === "clicky" ? "🔊 Clicky" : selectedSound === "thock" ? "🎧 Thock" : "🔉 Soft"}
							</button>
						</li>
						<li className={navLinkItem}>
							<button className={navLinkText} onClick={() => setActiveModal("about")}>
								about
							</button>
						</li>
						<li className={navLinkItem}>
							<button className={navLinkText} onClick={() => setActiveModal("settings")}>
								settings
							</button>
						</li>
						<li className={navLinkItem}>
							<Link to="/settings" className={navLinkText}>
								full options
							</Link>
						</li>
					</ul>
				</nav>
			</header>

			{activeModal && (
				<div className={overlay} onClick={() => setActiveModal(null)}>
					<div className={modal} onClick={(e) => e.stopPropagation()}>
						<div className={modalHeader}>
							<span className={modalTitle}>
								{activeModal === "settings" ? "Preferences" : "About Codexterity"}
							</span>
							<button className={closeBtn} onClick={() => setActiveModal(null)} aria-label="Close modal">
								&times;
							</button>
						</div>

						{activeModal === "about" && (
							<div className={aboutSection}>
								<p>
									<strong>Codexterity</strong> is a modern typing practice platform designed specifically for programmers.
									Instead of generic prose, practice real code snippets across 10 programming languages with syntax highlighting,
									muscle memory training for punctuation, brackets, indentation, and live analytics.
								</p>

								<div style={{ marginTop: "1rem" }}>
									<strong>Keyboard Shortcuts</strong>
									<div className={shortcutGrid}>
										<div><span className={kbd}>Tab</span> or <span className={kbd}>Esc</span></div>
										<div>Quick restart / skip to next snippet</div>
										<div><span className={kbd}>Enter</span></div>
										<div>Advance to the next line at line-end symbol (⏎)</div>
										<div><span className={kbd}>Backspace</span></div>
										<div>Revert current character & correction</div>
									</div>
								</div>

								<p style={{ marginTop: "1.25rem", color: "var(--dim)", fontSize: "0.85rem" }}>
									Looking for more details? Visit the <Link to="/about" style={{ color: "var(--accent)" }}>full About page</Link>.
								</p>
							</div>
						)}

						{activeModal === "settings" && (
							<>
								<div className={formGrid}>
									<div className={formGroup}>
										<label className={formLabel}>Language</label>
										<select className={select} value={selectedLang} onChange={handleLangChange}>
											{LANGUAGES.map(({ key, label }) => (
												<option key={key} value={key}>
													{label}
												</option>
											))}
										</select>
									</div>

									<div className={formGroup}>
										<label className={formLabel}>Sound Feedback</label>
										<select className={select} value={selectedSound} onChange={handleSoundChange}>
											{SOUND_OPTIONS.map(({ key, label }) => (
												<option key={key} value={key}>
													{label}
												</option>
											))}
										</select>
									</div>

									<div className={formGroup}>
										<label className={formLabel}>Caret Style</label>
										<select className={select} value={selectedCaret} onChange={handleCaretChange}>
											{CARET_OPTIONS.map(({ key, label }) => (
												<option key={key} value={key}>
													{label}
												</option>
											))}
										</select>
									</div>

									<div className={formGroup}>
										<label className={formLabel}>Font Family</label>
										<select className={select} value={selectedFont} onChange={handleFontChange}>
											{FONT_OPTIONS.map(({ key, label }) => (
												<option key={key} value={key}>
													{label}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className={formGroup} style={{ marginTop: "0.5rem" }}>
									<label className={formLabel}>Theme</label>
									<div className={themeSwatches}>
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

								<div style={{ marginTop: "0.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
									<button className={dangerBtn} onClick={handleClearHistory}>
										Reset History & Personal Bests
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default Header;
