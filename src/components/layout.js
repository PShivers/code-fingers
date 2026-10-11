import * as React from "react";
import Header from "./header";
import "../styles/global.css";
import { container, mainContent } from "../styles/layout.module.css";

const Layout = ({ pageTitle, children }) => {
	return (
		<div className={container}>
			<Header pageTitle={pageTitle} />
			<main className={mainContent}>{children}</main>
		</div>
	);
};

export default Layout;
