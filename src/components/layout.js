import * as React from "react";
import Header from "./header";
import { Link } from "gatsby";
import {
	container,
	navLinks,
	navLinkItem,
	navLinkText,
} from "./layout.module.css";

const Layout = ({ pageTitle, children }) => {
	return (
		<div className={container}>
			<Header />
			<main>{children}</main>
		</div>
	);
};

export default Layout;
