import { Container, Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Header() {
	return (
		<Navbar collapseOnSelect bg="dark" variant="dark" expand="lg" fixed="top">
			<Container>
				<Navbar.Brand href="#home">Issue Tracker</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav className="me-auto">
						<LinkContainer to="/">
							<Nav.Link>About</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/projects/list">
							<Nav.Link>Projects</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/issues/list">
							<Nav.Link>Issues</Nav.Link>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
