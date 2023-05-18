// Step 1: Import React
import * as React from "react";
import Seo from "../components/seo";
import Layout from "../components/layout";
import { settings } from "../styles/settings.module.css";

const Settings = () => {
	return (
		<Layout>
			<div className={settings}>
				<h1>Settings</h1>
				<p>There are no settings yet.</p>
			</div>
		</Layout>
	);
};

export const Head = () => <Seo title="Settings" />;

export default Settings;
