// Step 1: Import React
import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";

const IndexPage = () => {
	return (
		<Layout pageTitle="Code Fingers">
			<p></p>
		</Layout>
	);
};

export const Head = () => <Seo title="Home Page" />;

export default IndexPage;
