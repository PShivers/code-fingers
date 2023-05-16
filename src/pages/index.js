// Step 1: Import React
import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { code } from "../styles/index.module.css";

const IndexPage = () => {
	return (
		<Layout>
			<pre className={code}>
				<code>
					{`
function calculateSum(a, b) {
	return a + b;
}

console.log(calculateSum(5, 10));
          `}
				</code>
			</pre>
		</Layout>
	);
};

export const Head = () => <Seo title="Home Page" />;

export default IndexPage;
