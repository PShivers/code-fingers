import React, { useState, useRef } from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import {
	code,
	correct,
	incorrect,
	untyped,
	caret,
	input,
	active,
} from "../styles/index.module.css";

const IndexPage = () => {
	const codeString = `function myFunction(){
    return "this is my function";
	}`;

	const [codeArr, setCodeArr] = useState(
		getArrayOfObjectsFromString(codeString)
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
			<div id="caret" className={caret}></div>
			<pre
				className={code}
				onFocus={handleCodeBlockFocus}
				role="textbox"
				tabIndex="0"
			>
				<code>
					{codeArr.map((letter, index) => {
						let isActive = false;
						if (index === 0 && codeArr[index].correct === null) {
							isActive = true;
						} else if (
							index > 0 &&
							index < codeArr.length - 1 &&
							codeArr[index - 1].correct !== null &&
							codeArr[index].correct === null
						) {
							isActive = true;
						}

						return (
							<span
								key={index}
								className={`code-letter ${
									letter.correct !== null
										? letter.correct
											? correct
											: incorrect
										: untyped
								} ${isActive ? active : ""}`}
							>
								{letter.value}
							</span>
						);
					})}
				</code>
			</pre>

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
