// Step 1: Import React
import * as React from "react";
import Seo from "../components/seo";
import Layout from "../components/layout";
import { about } from "../styles/about.module.css";

const About = () => {
	return (
		<Layout>
			<div className={about}>
				<h1>About</h1>
				<p>
					Code Fingers Welcome to Code Fingers, a platform dedicated to
					enhancing your coding skills through immersive typing practice. Our
					mission is to provide a seamless learning experience that combines the
					art of typing with the world of coding. At Code Fingers, we understand
					the importance of typing proficiency when it comes to coding. We
					believe that efficient and accurate typing skills are essential for
					every programmer's toolkit. That's why we have designed a specialized
					environment that focuses on typing code blocks, allowing you to master
					both your typing speed and accuracy while improving your coding
					abilities. With a range of realistic code blocks, syntax highlighting,
					and customizable challenges, Code Fingers provides an engaging and
					interactive way to level up your coding skills. Track your progress,
					compete with friends, and explore various programming languages as you
					embark on a journey to become a faster and more efficient coder. Join
					us at Code Fingers and unlock your full coding potential. Let your
					fingers dance across the keyboard as you immerse yourself in the world
					of coding and elevate your typing prowess to new heights. Get ready to
					type code like never before!
				</p>
			</div>
		</Layout>
	);
};

export const Head = () => <Seo title="About" />;

export default About;
