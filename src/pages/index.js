import React, { useState, useRef, useEffect, useCallback } from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import ResultsChart from "../components/resultsChart";
import {
	wrapper,
	toolbar,
	toolbarSection,
	toolGroup,
	toolBtn,
	toolBtnActive,
	selectCompact,
	liveStats,
	liveStatItem,
	liveStatValue,
	liveStatUnit,
	editorWrapper,
	editorHeader,
	codeMeta,
	badge,
	code,
	codeLine,
	indent,
	caretEl,
	caretLine,
	caretBlock,
	caretUnderline,
	caretFocused,
	letter,
	untyped,
	correct,
	incorrect,
	tok_keyword,
	tok_type,
	tok_string,
	tok_number,
	tok_function,
	tok_comment,
	tok_operator,
	tok_punctuation,
	tok_plain,
	input,
	active,
	hiddenReturn,
	returnChar,
	returnCharActive,
	bottomControls,
	restartBtn,
	kbdInline,
	resultsCard,
	pbBanner,
	heroStats,
	heroStat,
	heroValue,
	heroLabel,
	subStatsGrid,
	subStat,
	subStatValue,
	subStatLabel,
	actionRow,
	primaryBtn,
	secondaryBtn,
	historyTableWrapper,
	historyTable,
	customModalTextarea,
} from "../styles/index.module.css";
import { LANGUAGES, getLanguageSnippets, codeSnippets } from "../../data";
import { tokenizeLine } from "../utils/syntax";
import { soundEngine } from "../utils/audio";
import { Storage } from "../utils/storage";

const TOKEN_CLASSES = {
	keyword: tok_keyword,
	type: tok_type,
	string: tok_string,
	number: tok_number,
	function: tok_function,
	comment: tok_comment,
	operator: tok_operator,
	punctuation: tok_punctuation,
	plain: tok_plain,
};

const parseCustomCodeToSnippet = (rawCode) => {
	const lines = rawCode.replace(/\r\n/g, "\n").split("\n").filter((l, idx, arr) => !(idx === arr.length - 1 && l.trim() === ""));
	const converted = lines.map((line) => {
		let indentCount = 0;
		let trimmed = line;
		while (trimmed.startsWith("  ") || trimmed.startsWith("\t")) {
			if (trimmed.startsWith("\t")) {
				indentCount += 1;
				trimmed = trimmed.slice(1);
			} else {
				indentCount += 1;
				trimmed = trimmed.slice(2);
			}
		}
		return "~".repeat(indentCount) + trimmed;
	});
	return converted.join("^");
};

const IndexPage = () => {
	const [lang, setLang] = useState("javascript");
	const [difficulty, setDifficulty] = useState("all");
	const [mode, setMode] = useState("snippet"); // "snippet" | "time-30" | "time-60" | "custom"
	const [caretStyle, setCaretStyle] = useState("line");
	const [soundType, setSoundType] = useState("clicky");

	const [currentSnippet, setCurrentSnippet] = useState(null);
	const [codeBlock, setCodeBlock] = useState({ rows: [], rowCount: 0 });
	const [userInput, setUserInput] = useState("");
	const [rowIndex, setRowIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);

	// Test tracking
	const [isFocused, setIsFocused] = useState(false);
	const [caretPos, setCaretPos] = useState(null);
	const [resultStats, setResultStats] = useState(null);
	const [liveWpm, setLiveWpm] = useState(0);
	const [liveAccuracy, setLiveAccuracy] = useState(100);
	const [timeDisplay, setTimeDisplay] = useState(0);
	const [showHistory, setShowHistory] = useState(false);
	const [customModalOpen, setCustomModalOpen] = useState(false);
	const [customInputText, setCustomInputText] = useState("");

	// Refs
	const hiddenInputRef = useRef(null);
	const codeRef = useRef(null);
	const startTime = useRef(null);
	const sampleTimer = useRef(null);
	const timelineData = useRef([]);
	const timeAttackRemaining = useRef(30);
	const accumulatedChars = useRef({ total: 0, correct: 0, errors: 0 });

	// Helper to create tokenized code rows
	const createCodeRows = useCallback((str, currentLang) => {
		if (!str) return { rows: [], rowCount: 0 };
		const rows = str.split("^").map((rowChars, index, array) => {
			const isLastRow = index === array.length - 1;
			let indentLevel = 0;
			let chars = [...rowChars];

			if (!isLastRow) {
				indentLevel = chars.filter((char) => char === "~").length;
			}
			chars = chars.filter((char) => char !== "~");

			const rawLine = chars.join("");
			const tokens = tokenizeLine(rawLine, currentLang);

			const charObjs = chars.map((char, cIdx) => ({
				value: char,
				token: tokens[cIdx] || "plain",
				correct: null,
			}));

			if (!isLastRow) {
				charObjs.push({
					value: String.fromCharCode(9166),
					token: "punctuation",
					correct: null,
				});
			}

			return {
				chars: charObjs,
				complete: false,
				indentLevel,
			};
		});

		return { rows, rowCount: rows.length };
	}, []);

	// Pick a random snippet
	const pickSnippet = useCallback((selectedLang, selectedDiff) => {
		const snippets = getLanguageSnippets(selectedLang, selectedDiff);
		const choice = snippets[Math.floor(Math.random() * snippets.length)];
		return choice || { code: `function hello() {^~return "world";^}`, difficulty: "short" };
	}, []);

	// Reset state with a new snippet
	const resetTest = useCallback((snippetToUse) => {
		if (sampleTimer.current) clearInterval(sampleTimer.current);

		const activeSnippet = snippetToUse || pickSnippet(lang, difficulty);
		setCurrentSnippet(activeSnippet);
		setCodeBlock(createCodeRows(activeSnippet.code, lang));
		setRowIndex(0);
		setCharIndex(0);
		setUserInput("");
		setResultStats(null);
		setLiveWpm(0);
		setLiveAccuracy(100);
		startTime.current = null;
		timelineData.current = [];
		accumulatedChars.current = { total: 0, correct: 0, errors: 0 };

		if (mode === "time-30") {
			timeAttackRemaining.current = 30;
			setTimeDisplay(30);
		} else if (mode === "time-60") {
			timeAttackRemaining.current = 60;
			setTimeDisplay(60);
		} else {
			setTimeDisplay(0);
		}

		if (hiddenInputRef.current) {
			hiddenInputRef.current.value = "";
			hiddenInputRef.current.focus();
		}
	}, [createCodeRows, difficulty, lang, mode, pickSnippet]);

	// Initialize preferences and settings listener
	useEffect(() => {
		const storedLang = Storage.getLanguage();
		const storedDiff = Storage.getDifficulty();
		const storedMode = Storage.getMode();
		const storedCaret = Storage.getCaret();
		const storedSound = Storage.getSound();

		setLang(storedLang);
		setDifficulty(storedDiff);
		setMode(storedMode);
		setCaretStyle(storedCaret);
		setSoundType(storedSound);

		const snippet = pickSnippet(storedLang, storedDiff);
		setCurrentSnippet(snippet);
		setCodeBlock(createCodeRows(snippet.code, storedLang));

		const onSettingsChange = (e) => {
			const { key } = e.detail || {};
			if (key === "codexterity_language" || key === "codexterity_difficulty" || key === "codexterity_mode") {
				const nextLang = Storage.getLanguage();
				const nextDiff = Storage.getDifficulty();
				const nextMode = Storage.getMode();
				setLang(nextLang);
				setDifficulty(nextDiff);
				setMode(nextMode);
				const nextSnippet = pickSnippet(nextLang, nextDiff);
				setCurrentSnippet(nextSnippet);
				setCodeBlock(createCodeRows(nextSnippet.code, nextLang));
				setRowIndex(0);
				setCharIndex(0);
				setUserInput("");
				setResultStats(null);
				startTime.current = null;
			} else if (key === "codexterity_caret") {
				setCaretStyle(Storage.getCaret());
			} else if (key === "codexterity_sound") {
				setSoundType(Storage.getSound());
			}
		};

		window.addEventListener("codexterity-settings-change", onSettingsChange);
		return () => {
			window.removeEventListener("codexterity-settings-change", onSettingsChange);
			if (sampleTimer.current) clearInterval(sampleTimer.current);
		};
	}, [createCodeRows, pickSnippet]);

	// Update Caret Position
	useEffect(() => {
		const activeEl = codeRef.current?.querySelector("[data-active]");
		if (activeEl && codeRef.current) {
			const containerRect = codeRef.current.getBoundingClientRect();
			const activeRect = activeEl.getBoundingClientRect();
			setCaretPos({
				top: activeRect.top - containerRect.top,
				left: activeRect.left - containerRect.left,
			});
		}
	}, [rowIndex, charIndex, codeBlock]);

	// Complete the test and save results
	const finishTest = useCallback(() => {
		if (sampleTimer.current) clearInterval(sampleTimer.current);

		const elapsedMinutes = Math.max((Date.now() - startTime.current) / 1000 / 60, 0.05);
		const elapsedSeconds = Math.round(elapsedMinutes * 60 * 10) / 10;

		const currentRows = codeBlock.rows;
		const allChars = currentRows.flatMap((r) => r.chars);
		const sessionCorrect = allChars.filter((c) => c.correct === true).length + accumulatedChars.current.correct;
		const sessionErrors = allChars.filter((c) => c.correct === false).length + accumulatedChars.current.errors;
		const sessionTotal = allChars.filter((c) => c.correct !== null).length + accumulatedChars.current.total;

		const calculatedWpm = Math.max(Math.round(sessionCorrect / 5 / elapsedMinutes), 0);
		const rawWpm = Math.max(Math.round(sessionTotal / 5 / elapsedMinutes), calculatedWpm);
		const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 100;

		const resultPayload = {
			lang,
			difficulty,
			mode,
			wpm: calculatedWpm,
			rawWpm,
			accuracy,
			time: elapsedSeconds,
			chars: { correct: sessionCorrect, errors: sessionErrors, total: sessionTotal },
			timeline: timelineData.current,
		};

		const { isPersonalBest } = Storage.saveTestResult(resultPayload);

		setResultStats({
			...resultPayload,
			isPersonalBest,
		});
	}, [codeBlock.rows, difficulty, lang, mode]);

	// Sample timeline every second
	const startSampling = useCallback(() => {
		startTime.current = Date.now();
		timelineData.current = [];

		sampleTimer.current = setInterval(() => {
			if (!startTime.current) return;
			const elapsedSec = Math.floor((Date.now() - startTime.current) / 1000);

			if (mode.startsWith("time-")) {
				timeAttackRemaining.current -= 1;
				setTimeDisplay(Math.max(timeAttackRemaining.current, 0));
				if (timeAttackRemaining.current <= 0) {
					finishTest();
					return;
				}
			} else {
				setTimeDisplay(elapsedSec);
			}

			// Compute live metrics
			const currentRows = codeBlock.rows;
			const typedChars = currentRows.flatMap((r) => r.chars).filter((c) => c.correct !== null);
			const correctCount = typedChars.filter((c) => c.correct === true).length + accumulatedChars.current.correct;
			const totalCount = typedChars.length + accumulatedChars.current.total;
			const minutes = Math.max(elapsedSec / 60, 0.05);

			const currentWpm = Math.round(correctCount / 5 / minutes);
			const currentRaw = Math.round(totalCount / 5 / minutes);
			const currentAcc = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;

			setLiveWpm(currentWpm);
			setLiveAccuracy(currentAcc);

			timelineData.current.push({
				time: elapsedSec,
				wpm: currentWpm,
				rawWpm: currentRaw,
				errors: typedChars.filter((c) => c.correct === false).length,
			});
		}, 1000);
	}, [codeBlock.rows, finishTest, mode]);

	// Handle typing changes
	const handleChange = (e) => {
		if (!startTime.current) {
			startSampling();
		}

		const newUserInput = e.target.value;
		setUserInput(newUserInput);
		const updatedCodeBlock = { ...codeBlock };
		let { rows } = updatedCodeBlock;

		// Handle Backspace
		if (e.nativeEvent.inputType === "deleteContentBackward") {
			if (charIndex > 0) {
				setCharIndex((prev) => prev - 1);
				rows[rowIndex].chars[charIndex - 1].correct = null;
			} else if (rowIndex > 0) {
				// Go back to previous line
				const prevRowIdx = rowIndex - 1;
				const prevRow = rows[prevRowIdx];
				const prevLastCharIdx = prevRow.chars.length - 1;
				setRowIndex(prevRowIdx);
				setCharIndex(prevLastCharIdx);
				prevRow.chars[prevLastCharIdx].correct = null;
			}
		} else {
			// Normal Character Input
			if (
				rowIndex >= 0 &&
				rowIndex < rows.length &&
				charIndex >= 0 &&
				charIndex < rows[rowIndex].chars.length
			) {
				const targetChar = rows[rowIndex].chars[charIndex];
				const typedChar = newUserInput[charIndex];
				const isMatch = typedChar === targetChar.value;

				targetChar.correct = isMatch;

				if (isMatch) {
					soundEngine.playKey(soundType, 0.5);
				} else {
					soundEngine.playError(0.5);
				}
			}

			if (charIndex < rows[rowIndex].chars.length) {
				setCharIndex((prev) => prev + 1);

				// Check if finished current snippet
				const isLastRow = rowIndex === rows.length - 1;
				const isLastChar = charIndex === rows[rowIndex].chars.length - 1;

				if (isLastRow && isLastChar) {
					if (mode.startsWith("time-")) {
						// In time attack: accumulate stats and load next snippet seamlessly
						const allChars = rows.flatMap((r) => r.chars);
						accumulatedChars.current.total += allChars.length;
						accumulatedChars.current.correct += allChars.filter((c) => c.correct === true).length;
						accumulatedChars.current.errors += allChars.filter((c) => c.correct === false).length;

						const nextSnippet = pickSnippet(lang, difficulty);
						setCurrentSnippet(nextSnippet);
						setCodeBlock(createCodeRows(nextSnippet.code, lang));
						setRowIndex(0);
						setCharIndex(0);
						setUserInput("");
						hiddenInputRef.current.value = "";
						return;
					} else {
						// Standard mode: complete!
						finishTest();
					}
				}
			}
		}

		setCodeBlock(updatedCodeBlock);
		hiddenInputRef.current.value = newUserInput;
	};

	// Handle Enter key for newlines & shortcuts
	const handleKeyDown = (e) => {
		if (e.key === "Tab") {
			e.preventDefault();
			resetTest();
			return;
		}

		if (e.key === "Escape") {
			e.preventDefault();
			resetTest();
			return;
		}

		if (e.key === "Enter") {
			if (resultStats) {
				resetTest(currentSnippet);
				return;
			}

			const { rows } = codeBlock;
			const returnCharIndex = rows[rowIndex].chars.length - 1;
			if (charIndex === returnCharIndex && rowIndex < rows.length - 1) {
				const updatedCodeBlock = { ...codeBlock };
				updatedCodeBlock.rows[rowIndex].chars[returnCharIndex].correct = true;
				soundEngine.playKey(soundType, 0.5);
				setCodeBlock(updatedCodeBlock);
				setRowIndex((prev) => prev + 1);
				setCharIndex(0);
				setUserInput("");
				hiddenInputRef.current.value = "";
			}
		}
	};

	const handleLanguageChange = (newLang) => {
		Storage.setLanguage(newLang);
		setLang(newLang);
		const snippet = pickSnippet(newLang, difficulty);
		resetTest(snippet);
	};

	const handleDifficultyChange = (newDiff) => {
		Storage.setDifficulty(newDiff);
		setDifficulty(newDiff);
		const snippet = pickSnippet(lang, newDiff);
		resetTest(snippet);
	};

	const handleModeChange = (newMode) => {
		if (newMode === "custom") {
			setCustomModalOpen(true);
			return;
		}
		Storage.setMode(newMode);
		setMode(newMode);
		resetTest();
	};

	const handleCustomSnippetSubmit = () => {
		if (!customInputText.trim()) return;
		const parsed = parseCustomCodeToSnippet(customInputText);
		const customObj = { id: "custom-" + Date.now(), difficulty: "custom", code: parsed };
		Storage.saveCustomSnippet(customInputText);
		setMode("custom");
		Storage.setMode("custom");
		setCustomModalOpen(false);
		resetTest(customObj);
	};

	const historyList = Storage.getHistory();

	return (
		<Layout>
			<div className={wrapper}>
				{/* Top Controls Toolbar */}
				<div className={toolbar}>
					<div className={toolbarSection}>
						{/* Language Selector */}
						<select
							className={selectCompact}
							value={lang}
							onChange={(e) => handleLanguageChange(e.target.value)}
							aria-label="Select Programming Language"
						>
							{LANGUAGES.map(({ key, label }) => (
								<option key={key} value={key}>
									{label}
								</option>
							))}
						</select>

						{/* Difficulty Group */}
						<div className={toolGroup}>
							{["all", "short", "medium", "long"].map((d) => (
								<button
									key={d}
									type="button"
									className={`${toolBtn}${difficulty === d ? ` ${toolBtnActive}` : ""}`}
									onClick={() => handleDifficultyChange(d)}
								>
									{d}
								</button>
							))}
						</div>
					</div>

					{/* Practice Mode Selector */}
					<div className={toolbarSection}>
						<div className={toolGroup}>
							<button
								type="button"
								className={`${toolBtn}${mode === "snippet" ? ` ${toolBtnActive}` : ""}`}
								onClick={() => handleModeChange("snippet")}
							>
								Snippets
							</button>
							<button
								type="button"
								className={`${toolBtn}${mode === "time-30" ? ` ${toolBtnActive}` : ""}`}
								onClick={() => handleModeChange("time-30")}
							>
								30s Rush
							</button>
							<button
								type="button"
								className={`${toolBtn}${mode === "time-60" ? ` ${toolBtnActive}` : ""}`}
								onClick={() => handleModeChange("time-60")}
							>
								60s Rush
							</button>
							<button
								type="button"
								className={`${toolBtn}${mode === "custom" ? ` ${toolBtnActive}` : ""}`}
								onClick={() => handleModeChange("custom")}
							>
								Custom
							</button>
						</div>

						{/* Live Stats display when active */}
						{startTime.current && !resultStats && (
							<div className={liveStats}>
								<div className={liveStatItem}>
									<span className={liveStatValue}>{liveWpm}</span>
									<span className={liveStatUnit}>wpm</span>
								</div>
								<div className={liveStatItem}>
									<span className={liveStatValue}>{timeDisplay}s</span>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Results Screen */}
				{resultStats ? (
					<div className={resultsCard}>
						{resultStats.isPersonalBest && (
							<div className={pbBanner}>
								<span>👑</span> NEW PERSONAL BEST FOR {lang.toUpperCase()}!
							</div>
						)}

						<div className={heroStats}>
							<div className={heroStat}>
								<span className={heroValue}>{resultStats.wpm}</span>
								<span className={heroLabel}>Net WPM</span>
							</div>
							<div className={heroStat}>
								<span className={heroValue}>{resultStats.accuracy}%</span>
								<span className={heroLabel}>Accuracy</span>
							</div>
						</div>

						<div className={subStatsGrid}>
							<div className={subStat}>
								<span className={subStatValue}>{resultStats.rawWpm}</span>
								<span className={subStatLabel}>Raw WPM</span>
							</div>
							<div className={subStat}>
								<span className={subStatValue}>{resultStats.time}s</span>
								<span className={subStatLabel}>Time</span>
							</div>
							<div className={subStat}>
								<span className={subStatValue}>
									{resultStats.chars?.correct}/{resultStats.chars?.errors}/{resultStats.chars?.total}
								</span>
								<span className={subStatLabel}>Correct/Err/Total</span>
							</div>
							<div className={subStat}>
								<span className={subStatValue} style={{ textTransform: "capitalize" }}>
									{lang}
								</span>
								<span className={subStatLabel}>Language</span>
							</div>
						</div>

						{/* Interactive SVG Chart */}
						<ResultsChart
							timeline={resultStats.timeline}
							wpm={resultStats.wpm}
							errors={resultStats.chars?.errors || 0}
						/>

						{/* Actions */}
						<div className={actionRow}>
							<button className={primaryBtn} onClick={() => resetTest(currentSnippet)}>
								<span>↻</span> Try Again <span className={kbdInline}>Enter</span>
							</button>
							<button className={secondaryBtn} onClick={() => resetTest()}>
								<span>➔</span> Next Snippet <span className={kbdInline}>Tab</span>
							</button>
							<button className={secondaryBtn} onClick={() => setShowHistory(!showHistory)}>
								{showHistory ? "Hide History" : "View History"}
							</button>
						</div>

						{/* History Drawer */}
						{showHistory && (
							<div className={historyTableWrapper}>
								<table className={historyTable}>
									<thead>
										<tr>
											<th>Date</th>
											<th>Language</th>
											<th>WPM</th>
											<th>Accuracy</th>
											<th>Time</th>
										</tr>
									</thead>
									<tbody>
										{historyList.slice(0, 8).map((h) => (
											<tr key={h.id}>
												<td>{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
												<td style={{ textTransform: "capitalize" }}>{h.lang}</td>
												<td style={{ color: "var(--caret)", fontWeight: 700 }}>{h.wpm}</td>
												<td>{h.accuracy}%</td>
												<td>{h.time}s</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				) : (
					/* Typing Editor */
					<div
						className={editorWrapper}
						onClick={() => hiddenInputRef.current?.focus()}
						role="region"
						aria-label="Code typing area"
					>
						<div className={editorHeader}>
							<div className={codeMeta}>
								<span className={badge}>{lang}</span>
								{currentSnippet?.difficulty && (
									<span className={badge}>{currentSnippet.difficulty}</span>
								)}
							</div>
							<div>
								<span>Click or start typing</span>
							</div>
						</div>

						<code ref={codeRef} className={code}>
							{/* Smooth Blinking Caret */}
							{caretPos && (
								<div
									className={`${caretEl} ${
										caretStyle === "block"
											? caretBlock
											: caretStyle === "underline"
											? caretUnderline
											: caretLine
									}${isFocused ? ` ${caretFocused}` : ""}`}
									style={{ top: `${caretPos.top}px`, left: `${caretPos.left}px` }}
								/>
							)}

							<div>
								{codeBlock.rows.map((row, rIndex) => (
									<div key={rIndex} className={codeLine}>
										{[...Array(row.indentLevel)].map((_, i) => (
											<span key={i} className={indent} />
										))}

										{row.chars.map((char, cIndex) => {
											const isActive = rowIndex === rIndex && charIndex === cIndex;
											const isReturn = char.value === String.fromCharCode(9166);
											const tokenClass = TOKEN_CLASSES[char.token] || tok_plain;

											let stateClass = untyped;
											if (char.correct === true) stateClass = correct;
											if (char.correct === false) stateClass = incorrect;

											if (isReturn) {
												return (
													<span
														key={cIndex}
														className={`${returnChar} ${isActive ? returnCharActive : hiddenReturn}`}
														{...(isActive ? { "data-active": true } : {})}
													>
														{char.value}
													</span>
												);
											}

											return (
												<span
													key={cIndex}
													className={`${letter} ${tokenClass} ${stateClass} ${isActive ? active : ""}`}
													{...(isActive ? { "data-active": true } : {})}
												>
													{char.value}
												</span>
											);
										})}
									</div>
								))}
							</div>
						</code>
					</div>
				)}

				{/* Hidden Keyboard Input */}
				<input
					autoFocus
					ref={hiddenInputRef}
					type="text"
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					value={userInput}
					className={input}
					aria-label="Hidden typing capture input"
				/>

				{/* Bottom Controls Bar */}
				{!resultStats && (
					<div className={bottomControls}>
						<button className={restartBtn} onClick={() => resetTest()}>
							<span>↻</span> Restart Snippet <span className={kbdInline}>Tab</span>
						</button>
						<span>
							Skip <span className={kbdInline}>Esc</span>
						</span>
					</div>
				)}
			</div>

			{/* Custom Snippet Modal */}
			{customModalOpen && (
				<div style={{
					position: "fixed",
					inset: 0,
					background: "rgba(0,0,0,0.7)",
					backdropFilter: "blur(4px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 300,
					padding: "1rem"
				}} onClick={() => setCustomModalOpen(false)}>
					<div style={{
						background: "var(--bg)",
						border: "1px solid var(--border)",
						borderRadius: "12px",
						padding: "2rem",
						width: "100%",
						maxWidth: "540px",
						display: "flex",
						flexDirection: "column",
						gap: "1.25rem"
					}} onClick={(e) => e.stopPropagation()}>
						<h3 style={{ margin: 0, color: "var(--text)" }}>Paste Custom Code</h3>
						<p style={{ margin: 0, color: "var(--dim)", fontSize: "0.85rem" }}>
							Paste any code block below. Indentation and line breaks will automatically format into practice mode.
						</p>
						<textarea
							className={customModalTextarea}
							placeholder="function myCustomCode() { ... }"
							value={customInputText}
							onChange={(e) => setCustomInputText(e.target.value)}
						/>
						<div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
							<button className={secondaryBtn} onClick={() => setCustomModalOpen(false)}>
								Cancel
							</button>
							<button className={primaryBtn} onClick={handleCustomSnippetSubmit}>
								Start Practice
							</button>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
};

export const Head = () => <Seo title="Codexterity — Typing Practice for Programmers" />;

export default IndexPage;
