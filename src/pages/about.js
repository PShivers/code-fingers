import * as React from "react";
import Seo from "../components/seo";
import Layout from "../components/layout";
import {
	about,
	heroHeader,
	title,
	subtitle,
	featureGrid,
	featureCard,
	featureTitle,
	featureDesc,
	articleCard,
	cardHeading,
	cardBody,
	table,
	kbd,
} from "../styles/about.module.css";

const About = () => {
	return (
		<Layout pageTitle="About Codexterity">
			<div className={about}>
				<div className={heroHeader}>
					<h1 className={title}>About Codexterity</h1>
					<p className={subtitle}>
						The typing practice platform built from the ground up for software developers.
						Practice real syntax, master keyboard shortcuts, and build true muscle memory for code.
					</p>
				</div>

				<div className={featureGrid}>
					<div className={featureCard}>
						<h3 className={featureTitle}>10 Programming Languages</h3>
						<p className={featureDesc}>
							Curated idiomatic code blocks across JavaScript, TypeScript, Python, Rust, Go, C, C++, C#, Java, and SQL.
						</p>
					</div>

					<div className={featureCard}>
						<h3 className={featureTitle}>IDE Syntax Highlighting</h3>
						<p className={featureDesc}>
							Real-time tokenized syntax coloring across 10 developer themes including Dracula, Monokai, Nord, and Tokyo Night.
						</p>
					</div>

					<div className={featureCard}>
						<h3 className={featureTitle}>Mechanical Audio Feedback</h3>
						<p className={featureDesc}>
							Synthesized keyboard switches via the Web Audio API with Clicky (Blue), Thock (Linear), and Soft profiles.
						</p>
					</div>

					<div className={featureCard}>
						<h3 className={featureTitle}>Performance Analytics</h3>
						<p className={featureDesc}>
							Net WPM, Raw speed, accuracy percentage, real-time SVG progression curves, and personal best tracking.
						</p>
					</div>
				</div>

				<div className={articleCard}>
					<h2 className={cardHeading}>Why Codexterity?</h2>
					<p className={cardBody}>
						Standard typing tests measure how fast you can type standard English literature and common vocabulary.
						However, real programming requires constant use of special characters: braces <code>{"{}"}</code>, brackets <code>{"[]"}</code>,
						semicolons <code>;</code>, arrows <code>=&gt;</code>, operators, camelCase, and indentation levels.
					</p>
					<p className={cardBody}>
						Codexterity simulates the real developer typing experience with auto-indentation, newline advance triggers, and realistic code idioms.
					</p>
				</div>

				<div className={articleCard}>
					<h2 className={cardHeading}>Keyboard Controls Reference</h2>
					<table className={table}>
						<thead>
							<tr>
								<th>Key</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><span className={kbd}>Tab</span></td>
								<td>Instantly restart current snippet / advance to next snippet</td>
							</tr>
							<tr>
								<td><span className={kbd}>Esc</span></td>
								<td>Skip to a new snippet</td>
							</tr>
							<tr>
								<td><span className={kbd}>Enter</span></td>
								<td>Advance line at the newline symbol (⏎) or restart on results screen</td>
							</tr>
							<tr>
								<td><span className={kbd}>Backspace</span></td>
								<td>Revert last typed character (preserves auto-indent spacers)</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
};

export const Head = () => <Seo title="About — Codexterity" />;

export default About;
