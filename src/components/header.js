import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import {
	container,
	heading,
	navLinks,
	navLinkItem,
	navLinkText,
	settingsBtn,
	overlay,
	modal,
	modalHeader,
	modalTitle,
	closeBtn,
	formGroup,
	formLabel,
	select,
} from "../styles/header.module.css";

const LANGUAGES = [
	{ key: "javascript", label: "JavaScript" },
	{ key: "python", label: "Python" },
	{ key: "c", label: "C" },
	{ key: "cpp", label: "C++" },
	{ key: "csharp", label: "C#" },
];

const THEMES = {
	default: {
		bg: "#242933",
		text: "#f6f0e9",
		err: "#ec4c56",
		caret: "#ec7fff",
		dim: "#596172",
		accent: "#ec4c56",
	},
	monokai: {
		bg: "#272822",
		text: "#f8f8f2",
		err: "#f92672",
		caret: "#a6e22e",
		dim: "#75715e",
		accent: "#a6e22e",
	},
	oneDarkPro: {
		bg: "#282c34",
		text: "#abb2bf",
		err: "#e06c75",
		caret: "#61afef",
		dim: "#5c6370",
		accent: "#61afef",
	},
};

const THEME_OPTIONS = [
	{ key: "default", label: "Codexterity" },
	{ key: "monokai", label: "Monokai" },
	{ key: "oneDarkPro", label: "One Dark Pro" },
];

const applyTheme = (themeKey) => {
	const theme = THEMES[themeKey] || THEMES.default;
	const root = document.documentElement;
	root.style.setProperty("--bg", theme.bg);
	root.style.setProperty("--text", theme.text);
	root.style.setProperty("--err", theme.err);
	root.style.setProperty("--caret", theme.caret);
	root.style.setProperty("--dim", theme.dim);
	root.style.setProperty("--accent", theme.accent);
};

const Header = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedLang, setSelectedLang] = useState("javascript");
	const [selectedTheme, setSelectedTheme] = useState("default");

	useEffect(() => {
		const lang = localStorage.getItem("codexterity_language") || "javascript";
		const theme = localStorage.getItem("codexterity_theme") || "default";
		setSelectedLang(lang);
		setSelectedTheme(theme);
		applyTheme(theme);
	}, []);

	useEffect(() => {
		if (!modalOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setModalOpen(false);
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [modalOpen]);

	const handleLangChange = (e) => {
		const lang = e.target.value;
		localStorage.setItem("codexterity_language", lang);
		setSelectedLang(lang);
	};

	const handleThemeChange = (e) => {
		const themeKey = e.target.value;
		localStorage.setItem("codexterity_theme", themeKey);
		setSelectedTheme(themeKey);
		applyTheme(themeKey);
	};

	return (
		<>
			<div className={container}>
				<div>
					<h1 className={heading}>Codexterity</h1>
				</div>

				<nav>
					<ul className={navLinks}>
						<li className={navLinkItem}>
							<Link to="/" className={navLinkText}>
								home
							</Link>
						</li>
						<li className={navLinkItem}>
							<Link to="/about" className={navLinkText}>
								about
							</Link>
						</li>
						<li>
							<button className={settingsBtn} onClick={() => setModalOpen(true)}>
								settings
							</button>
						</li>
					</ul>
				</nav>
			</div>

			{modalOpen && (
				<div className={overlay} onClick={() => setModalOpen(false)}>
					<div className={modal} onClick={(e) => e.stopPropagation()}>
						<div className={modalHeader}>
							<span className={modalTitle}>Settings</span>
							<button className={closeBtn} onClick={() => setModalOpen(false)}>
								&times;
							</button>
						</div>

						<div className={formGroup}>
							<label className={formLabel}>Language</label>
							<select
								className={select}
								value={selectedLang}
								onChange={handleLangChange}
							>
								{LANGUAGES.map(({ key, label }) => (
									<option key={key} value={key}>
										{label}
									</option>
								))}
							</select>
						</div>

						<div className={formGroup}>
							<label className={formLabel}>Theme</label>
							<select
								className={select}
								value={selectedTheme}
								onChange={handleThemeChange}
							>
								{THEME_OPTIONS.map(({ key, label }) => (
									<option key={key} value={key}>
										{label}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Header;
