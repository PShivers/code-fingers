import * as React from "react";
import { Link } from "gatsby";
import {
	container,
	heading,
	navLinks,
	navLinkItem,
	navLinkText,
} from "./header.module.css";

const Header = () => {
	return (
		<div className={container}>
			<div>
				<h1 className={heading}>Code Fingers</h1>
			</div>

			<nav>
				<ul className={navLinks}>
					<li className={navLinkItem}>
						<Link to="/" className={navLinkText}>
							Home
						</Link>
					</li>
					<li className={navLinkItem}>
						<Link to="/about" className={navLinkText}>
							About
						</Link>
					</li>
					<li className={navLinkItem}>
						<Link to="/blog" className={navLinkText}>
							Settings
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Header;
