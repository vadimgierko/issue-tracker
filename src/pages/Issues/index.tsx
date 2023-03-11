import { Outlet } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

export default function Issues() {
	return (
		<div className="issues">
			<header className="text-center">
				<h1>Issues</h1>
				<Nav
					variant="tabs"
					//defaultActiveKey="list"
					className="justify-content-center"
				>
					<Nav.Item>
						<LinkContainer to="list">
							<Nav.Link eventKey="list">List</Nav.Link>
						</LinkContainer>
					</Nav.Item>
					<Nav.Item>
						<LinkContainer to="add">
							<Nav.Link eventKey="add">Add</Nav.Link>
						</LinkContainer>
					</Nav.Item>
				</Nav>
			</header>
			<Outlet />
		</div>
	);
}
