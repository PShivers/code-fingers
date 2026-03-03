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
					Code Fingers is a typing practice app for code — like MonkeyType, but
					for real programming snippets. Type through JavaScript code blocks and
					build muscle memory for the patterns you actually use.
				</p>
			</div>
		</Layout>
	);
};

export const Head = () => <Seo title="About" />;

export default About;
