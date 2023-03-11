import "./App.css";
import Header from "./layout/Header";
import Container from "react-bootstrap/Container";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./layout/Footer";
import About from "./pages/About";

function App() {
	const { pathname } = useLocation();

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<Header />
			<Container
				as="main"
				style={{
					paddingTop: 50,
					flexGrow: 1,
				}}
				className="my-3"
			>
				{pathname === "/" ? <About /> : <Outlet />}
			</Container>
			<Footer />
		</div>
	);
}

export default App;
