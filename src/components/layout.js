import * as React from "react";
import Header from "./header";
import "../styles/global.css";
import { container } from "../styles/layout.module.css";

const Layout = ({ pageTitle, children }) => {
	return (
		<div className={container}>
			<Header pageTitle={pageTitle} />
			<main>{children}</main>
		</div>
	);
};

export default Layout;
