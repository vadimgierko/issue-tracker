import Footer from "./Footer";
import Navbar from "./Navbar";
import Container from "react-bootstrap/Container";
import useTheme from "../../context/useTheme";
import { Outlet } from "react-router-dom";
import useMaxWidth from "../../context/useMaxWidth";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
	const maxWidth = useMaxWidth();
	const { value: theme } = useTheme();

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
				<Outlet />
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
