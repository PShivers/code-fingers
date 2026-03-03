import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import {
	code,
	correct,
	incorrect,
	untyped,
	input,
	active,
	hidden,
	indent,
	caretEl,
	caretFocused,
	results,
	statsRow,
	stat,
	statValue,
	statLabel,
	tryAgain,
} from "../styles/index.module.css";
import { codeBlocks } from "../../data";

const getSnippets = () => {
	try {
		const lang = localStorage.getItem("codexterity_language") || "javascript";
		return codeBlocks[lang] || codeBlocks.javascript;
	} catch {
		return codeBlocks.javascript;
	}
};

const IndexPage = () => {
	const initialSnippets = getSnippets();
	const initialSnippet = initialSnippets[Math.floor(Math.random() * initialSnippets.length)];

	const [currentSnippet, setCurrentSnippet] = useState(initialSnippet);
	const [codeBlock, setCodeBlock] = useState(createCodeRows(initialSnippet));
	const [userInput, setUserInput] = useState("");
	const [rowIndex, setRowIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const [resultStats, setResultStats] = useState(null);
	const hiddenInputRef = useRef(null);
	const codeRef = useRef(null);
	const startTime = useRef(null);
	const [caretPos, setCaretPos] = useState(null);
	const [isFocused, setIsFocused] = useState(false);

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
	}, [rowIndex, charIndex]);

	function createCodeRows(str) {
		const rows = str.split("^").map((rowChars, index, array) => {
			const isLastRow = index === array.length - 1;
			let indentLevel = 0;
			let chars = [...rowChars];

			// Count the occurrence of "~" for indentation
			if (!isLastRow) {
				indentLevel = chars.filter((char) => char === "~").length;
			}

			// Remove "~" characters
			chars = chars.filter((char) => char !== "~");

			// Create objects for each character
			chars = chars.map((char) => ({
				value: char,
				correct: null,
			}));

			// Push enter symbol into chars array
			if (!isLastRow) {
				chars.push({
					value: String.fromCharCode(9166),
					correct: null,
				});
			}

			return {
				chars,
				complete: false,
				indentLevel,
			};
		});

		const rowCount = rows.length;

		return { rows, rowCount };
	}

	const handleChange = (e) => {
		if (!startTime.current) {
			startTime.current = Date.now();
		}

		const newUserInput = e.target.value;
		setUserInput(newUserInput);
		const updatedCodeBlock = { ...codeBlock };
		let { rows } = updatedCodeBlock;

		// Handle backspace press
		if (e.nativeEvent.inputType === "deleteContentBackward") {
			if (charIndex > 0) {
				setCharIndex((prevCharIndex) => prevCharIndex - 1);
				rows[rowIndex].chars[charIndex - 1].correct = null;
			}
		} else {
			if (
				rowIndex >= 0 &&
				rowIndex < rows.length &&
				charIndex >= 0 &&
				charIndex < rows[rowIndex].chars.length
			) {
				const updatedRow = [...rows[rowIndex].chars];
				updatedRow[charIndex].correct =
					newUserInput[charIndex] === updatedRow[charIndex].value;
				rows[rowIndex].chars = updatedRow;
			}

			if (charIndex < rows[rowIndex].chars.length) {
				setCharIndex((prevCharIndex) => prevCharIndex + 1);

				// Detect completion: just typed the last char of the last row
				const isLastRow = rowIndex === rows.length - 1;
				const isLastChar = charIndex === rows[rowIndex].chars.length - 1;
				if (isLastRow && isLastChar) {
					const elapsed = (Date.now() - startTime.current) / 1000 / 60;
					const allChars = rows.flatMap((r) => r.chars);
					const totalChars = allChars.length;
					const correctChars = allChars.filter((c) => c.correct === true).length;
					setResultStats({
						wpm: Math.round(totalChars / 5 / elapsed),
						accuracy: Math.round((correctChars / totalChars) * 100),
					});
				}
			}
		}

		setCodeBlock(updatedCodeBlock);
		hiddenInputRef.current.value = newUserInput;
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			const { rows } = codeBlock;
			const returnCharIndex = rows[rowIndex].chars.length - 1;
			if (charIndex === returnCharIndex && rowIndex < rows.length - 1) {
				const updatedCodeBlock = { ...codeBlock };
				updatedCodeBlock.rows[rowIndex].chars[returnCharIndex].correct = true;
				setCodeBlock(updatedCodeBlock);
				setRowIndex((prev) => prev + 1);
				setCharIndex(0);
				setUserInput("");
				hiddenInputRef.current.value = "";
			}
		}
	};

	const resetWith = (snippet) => {
		setCurrentSnippet(snippet);
		setCodeBlock(createCodeRows(snippet));
		setRowIndex(0);
		setCharIndex(0);
		setUserInput("");
		setResultStats(null);
		startTime.current = null;
		hiddenInputRef.current.value = "";
		hiddenInputRef.current.focus();
	};

	const handleTryAgain = () => resetWith(currentSnippet);

	const handleNext = () => {
		const snippets = getSnippets();
		resetWith(snippets[Math.floor(Math.random() * snippets.length)]);
	};

	const handleCodeBlockFocus = () => {
		hiddenInputRef.current.focus();
	};

	return (
		<Layout>
			{resultStats ? (
				<div className={results}>
					<div className={statsRow}>
						<div className={stat}>
							<span className={statValue}>{resultStats.wpm}</span>
							<span className={statLabel}>wpm</span>
						</div>
						<div className={stat}>
							<span className={statValue}>{resultStats.accuracy}%</span>
							<span className={statLabel}>accuracy</span>
						</div>
					</div>
					<div className={statsRow}>
						<button className={tryAgain} onClick={handleTryAgain}>
							try again
						</button>
						<button className={tryAgain} onClick={handleNext}>
							next
						</button>
					</div>
				</div>
			) : (
				<code
					ref={codeRef}
					className={code}
					onFocus={handleCodeBlockFocus}
					role="textbox"
					tabIndex="0"
				>
					{caretPos && (
						<div
							className={`${caretEl}${isFocused ? ` ${caretFocused}` : ""}`}
							style={{ top: `${caretPos.top}px`, left: `${caretPos.left}px` }}
						/>
					)}
					<div className="code-container">
						{codeBlock.rows.map((row, rIndex) => (
							<div key={rIndex}>
								{[...Array(row.indentLevel)].map((_, index) => (
									<span key={index} className={indent}></span>
								))}

								{row.chars.map((char, cIndex) => {
									let isActive = rowIndex === rIndex && charIndex == cIndex;
									let isReturn = char.value === String.fromCharCode(9166);
									let classNames = "code-letter";

									if (char.correct !== null) {
										classNames += char.correct ? ` ${correct}` : ` ${incorrect}`;
									} else {
										classNames += ` ${untyped}`;
									}

									if (isActive) {
										classNames += ` ${active}`;
									}

									if (!isActive && isReturn) {
										return (
											<span key={cIndex} className={`${classNames} ${hidden}`}>
												{char.value}
											</span>
										);
									} else {
										return (
											<span key={cIndex} className={classNames} {...(isActive ? { "data-active": true } : {})}>
												{char.value}
											</span>
										);
									}
								})}
							</div>
						))}
					</div>
				</code>
			)}

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
			/>
		</Layout>
	);
};

export const Head = () => <Seo title="Home Page" />;

export default IndexPage;
