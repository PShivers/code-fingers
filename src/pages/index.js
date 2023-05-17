import React, { useState } from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { code } from "../styles/index.module.css";

const IndexPage = () => {
	const codeString = `function myFunction(){
    return "this is my function";
  }`;

	const [codeArr, setCodeArr] = useState(
		getArrayOfObjectsFromString(codeString)
	);
	const [userInput, setUserInput] = useState("");

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
	};

	return (
		<Layout>
			<pre className={code}>
				<code>
					{codeArr.map((letter, index) => (
						<span
							key={index}
							className={`code-letter ${
								letter.correct !== null
									? letter.correct
										? "correct"
										: "incorrect"
									: "untyped"
							}`}
							style={{
								color:
									letter.correct !== null
										? letter.correct
											? "#f6f0e9"
											: "#ec4c56"
										: "gray",
							}}
						>
							{letter.value}
						</span>
					))}
				</code>
			</pre>
			<div
				id="caret"
				className="default hidden"
				style={{
					fontSize: "1.5rem",
					animationName: "caretFlashSmooth",
					opacity: 1,
					display: "block",
					top: "3.6px",
					left: "5px",
				}}
			></div>
			<input onChange={handleChange} value={userInput} />
		</Layout>
	);
};

export const Head = () => <Seo title="Home Page" />;

export default IndexPage;
