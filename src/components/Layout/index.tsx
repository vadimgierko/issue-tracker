import Footer from "./Footer";
import Navbar from "./Navbar";
import Container from "react-bootstrap/Container";
import useTheme from "../../context/useTheme";
import { Outlet, useLocation } from "react-router-dom";
import useMaxWidth from "../../context/useMaxWidth";
import ScrollToTop from "./ScrollToTop";
import About from "../../pages/About";
import { useEffect } from "react";

export default function Layout() {
	const maxWidth = useMaxWidth();
	const { theme } = useTheme();
	const { pathname } = useLocation();

	// fetch light/dark mode css for code highlighting in vsc style
	useEffect(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href =
			theme === "dark"
				? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.css" // Dark mode styles
				: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs.css"; // Light mode styles

		document.head.appendChild(link);

		return () => {
			document.head.removeChild(link); // Clean up the previous stylesheet when unmounting or switching modes
		};
	}, [theme]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
				color: theme === "light" ? "black" : "white",
				minHeight: "100vh",
			}}
		>
			<Navbar />
			<Container
				as="main"
				style={{
					paddingTop: 70,
					maxWidth: maxWidth,
					flexGrow: 1,
					backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
					color: theme === "light" ? "black" : "white",
				}}
			>
				{pathname === "/" ? <About /> : <Outlet />}
			</Container>
			<hr />
			<Footer
				authorFullName="Vadim Gierko"
				// optional:
				creationYear={2023} // The year the app was created. Defaults to the current year if not specified.
				githubProfileLink="https://github.com/vadimgierko"
				personalWebPageLink="https://vadimgierko.com"
				repoLink="https://github.com/vadimgierko/issue-tracker"
			/>
			<ScrollToTop />
		</div>
	);
}
