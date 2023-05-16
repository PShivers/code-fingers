import * as React from "react";
import { Link } from "gatsby";
import {
	container,
	heading,
	navLinks,
	navLinkItem,
	navLinkText,
} from "./header.module.css";

const Header = ({ pageTitle }) => {
	return (
		<div className={container}>
			<div>
				<h1 className={heading}>{pageTitle}</h1>
			</div>

			<nav>
				<ul className={navLinks}>
					<li className={navLinkItem}>
						<Link to="/" className={navLinkText}>
							home
						</Link>
					</li>
					<li className={navLinkItem}>
						<Link to="/about" className={navLinkText}>
							about
						</Link>
					</li>
					<li className={navLinkItem}>
						<Link to="/settings" className={navLinkText}>
							settings
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Header;
