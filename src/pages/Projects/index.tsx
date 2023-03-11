import { Outlet, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { useState } from "react";

export default function Projects() {
	const { pathname } = useLocation();
	const [activeTab, setActiveTab] = useState(() =>
		pathname.includes("list") ? "list" : "add"
	);

	return (
		<div className="projects">
			<header className="text-center">
				<h1>Projects</h1>
				<Nav
					variant="tabs"
					defaultActiveKey={activeTab}
					onSelect={(eventKey) => (eventKey ? setActiveTab(eventKey) : null)}
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
