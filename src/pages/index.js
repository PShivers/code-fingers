import React, { useState, useRef } from "react";
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
} from "../styles/index.module.css";
import { codeBlocks } from "../../data";

const IndexPage = () => {
	const randomIndex = Math.floor(Math.random() * codeBlocks.length);
	const randomCodeBlock = codeBlocks[randomIndex];

	const [codeBlock, setCodeBlock] = useState(createCodeRows(randomCodeBlock));
	const [userInput, setUserInput] = useState("");
	const [rowIndex, setRowIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const hiddenInputRef = useRef(null);

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
		const newUserInput = e.target.value;
		setUserInput(newUserInput);
		const updatedCodeBlock = { ...codeBlock }; // Copy the codeBlock object
		let { rows } = updatedCodeBlock;
		//handle enter

		// Handle backspace press
		if (e.nativeEvent.inputType === "deleteContentBackward") {
			if (charIndex > 0) {
				setCharIndex((prevCharIndex) => prevCharIndex - 1); // Decrement charIndex
				rows[rowIndex].chars[charIndex - 1].correct = null; // Set correct field to null for the previous char object
			}
		} else {
			// Check if the provided row and char indices are within the valid range
			if (
				rowIndex >= 0 &&
				rowIndex < rows.length &&
				charIndex >= 0 &&
				charIndex < rows[rowIndex].chars.length
			) {
				const updatedRow = [...rows[rowIndex].chars]; // Copy the row's chars array

				// Check if the new userInput matches the char value at the specified indices
				if (newUserInput[charIndex] === updatedRow[charIndex].value) {
					// If yes, set the correct field to true
					updatedRow[charIndex].correct = true;
				} else {
					// If no, set the correct field to false
					updatedRow[charIndex].correct = false;
				}

				// Update the row with the modified chars array
				rows[rowIndex].chars = updatedRow;
			}

			//while charIndex is less than length of the row increment charIndex
			if (charIndex < rows[rowIndex].chars.length) {
				setCharIndex((prevCharIndex) => prevCharIndex + 1); // Increment charIndex using the previous value
			} else if (
				e.key === "Enter" &&
				rowIndex < rows.length - 1 &&
				charIndex === rows[rowIndex].chars.length - 1
			) {
				setRowIndex((prevRowIndex) => prevRowIndex + 1); // Increment rowIndex
				setCharIndex(0); // Reset charIndex to the beginning of the next row
			}
		}

		setCodeBlock(updatedCodeBlock);
		hiddenInputRef.current.value = newUserInput;

		// console.table(codeBlock.rows[rowIndex].chars);
	};

	const handleCodeBlockFocus = () => {
		hiddenInputRef.current.focus();
	};

	return (
		<Layout>
			<code
				className={code}
				onFocus={handleCodeBlockFocus}
				role="textbox"
				tabIndex="0"
			>
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
										<span key={cIndex} className={classNames}>
											{char.value}
										</span>
									);
								}
							})}
						</div>
					))}
				</div>
			</code>

			<input
				autoFocus
				ref={hiddenInputRef}
				type="text"
				onChange={handleChange}
				value={userInput}
				className={input}
			/>
		</Layout>
	);
};

export const Head = () => <Seo title="Home Page" />;

export default IndexPage;
