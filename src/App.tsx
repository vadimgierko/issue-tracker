import "./App.css";
import Header from "./layout/Header";
import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Header />
			<Container as="main" className="my-3">
				<Outlet />
			</Container>
		</div>
	);
}

export default App;
