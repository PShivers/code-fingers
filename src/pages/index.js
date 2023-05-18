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
	indent,
} from "../styles/index.module.css";
import { codeBlocks } from "../../data";

const IndexPage = () => {
	const randomIndex = Math.floor(Math.random() * codeBlocks.length);
	const randomCodeBlock = codeBlocks[randomIndex];

	const [codeArr, setCodeArr] = useState(
		getArrayOfObjectsFromString(randomCodeBlock)
	);
	const [userInput, setUserInput] = useState("");
	const hiddenInputRef = useRef(null);

	function getArrayOfObjectsFromString(str) {
		return [...str].map((letter) => ({
			value: letter,
			correct: null,
		}));
	}

	const handleChange = (e) => {
		const newUserInput = e.target.value;
		setUserInput(newUserInput);

		const updatedCodeArr = [];
		for (let index = 0; index < codeArr.length; index++) {
			const isTyped = index < newUserInput.length;
			const letter = codeArr[index];
			if (isTyped) {
				const isCorrect = letter.value === newUserInput[index];
				updatedCodeArr.push({
					...letter,
					correct: isCorrect,
				});
			} else {
				updatedCodeArr.push({
					...letter,
					correct: null,
				});
			}
		}

		setCodeArr(updatedCodeArr);

		hiddenInputRef.current.value = newUserInput;
	};

	const handleCodeBlockFocus = () => {
		console.log("focused");
		hiddenInputRef.current.focus();
	};

	return (
		<Layout>
			<code className={code} onFocus={handleCodeBlockFocus}>
				<div className="code-container">
					{codeArr.map((letter, index) => {
						let isActive = false;
						let isNewRow = false;
						let isIndentation = false;

						if (letter.value === "^") {
							isNewRow = true;
						} else if (letter.value === "~") {
							isIndentation = true;
						} else if (index === 0 && codeArr[index].correct === null) {
							isActive = true;
						} else if (
							index > 0 &&
							index < codeArr.length - 1 &&
							codeArr[index - 1].correct !== null &&
							codeArr[index].correct === null
						) {
							isActive = true;
						}

						if (isNewRow) {
							return <div key={index} className="code-row" />;
						}

						if (isIndentation) {
							return <span key={index} className={indent} />;
						}

						let classNames = "code-letter";
						if (letter.correct !== null) {
							classNames += letter.correct ? ` ${correct}` : ` ${incorrect}`;
						} else {
							classNames += ` ${untyped}`;
						}
						if (isActive) {
							classNames += ` ${active}`;
						}

						return (
							<span key={index} className={classNames}>
								{letter.value}
							</span>
						);
					})}
				</div>
			</code>

			<input
				autoFocus
				ref={hiddenInputRef}
				type="text"
				onChange={handleChange}
				value={userInput}
				style={input}
			/>
		</Layout>
	);
};

export const Head = () => <Seo title="Home Page" />;

export default IndexPage;
