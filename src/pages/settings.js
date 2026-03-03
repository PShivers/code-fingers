import React, { useState, useEffect } from "react";
import Seo from "../components/seo";
import Layout from "../components/layout";
import {
	settings,
	section,
	sectionLabel,
	langButtons,
	langBtn,
	langBtnActive,
} from "../styles/settings.module.css";

const LANGUAGES = [
	{ key: "javascript", label: "JavaScript" },
	{ key: "python", label: "Python" },
	{ key: "c", label: "C" },
	{ key: "cpp", label: "C++" },
	{ key: "csharp", label: "C#" },
];

const Settings = () => {
	const [selectedLang, setSelectedLang] = useState("javascript");

	useEffect(() => {
		const lang = localStorage.getItem("codexterity_language") || "javascript";
		setSelectedLang(lang);
	}, []);

	const handleSelect = (lang) => {
		localStorage.setItem("codexterity_language", lang);
		setSelectedLang(lang);
	};

	return (
		<Layout>
			<div className={settings}>
				<h1>Settings</h1>
				<div className={section}>
					<span className={sectionLabel}>Language</span>
					<div className={langButtons}>
						{LANGUAGES.map(({ key, label }) => (
							<button
								key={key}
								className={`${langBtn}${selectedLang === key ? ` ${langBtnActive}` : ""}`}
								onClick={() => handleSelect(key)}
							>
								{label}
							</button>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export const Head = () => <Seo title="Settings" />;

export default Settings;
