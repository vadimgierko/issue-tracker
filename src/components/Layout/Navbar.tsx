import useTheme from "../../context/useTheme";
// react-bootstrap components:
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
// react-router-bootstrap for link container:
import { LinkContainer } from "react-router-bootstrap";
// react-icons:
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import {
	AiOutlineUser,
	AiOutlineInfoCircle,
	AiOutlineSetting,
	AiOutlineLogout,
	AiOutlineLogin,
} from "react-icons/ai";
//import useUser from "../../context/useUser"; // TODO: IMPLEMENT useUser features
import useMaxWidth from "../../context/useMaxWidth";
import { logOut } from "../../services/auth";
import useUser from "../../context/useUser";

export default function NavigationBar() {
	const maxWidth = useMaxWidth();
	const { value: theme, switch: switchTheme } = useTheme();
	const { user } = useUser();

	return (
		<Navbar
			collapseOnSelect
			expand="lg"
			bg={theme}
			variant={theme}
			fixed="top"
			className="shadow"
		>
			<Container style={{ maxWidth: maxWidth }}>
				<LinkContainer to="/">
					<Navbar.Brand>Issue Tracker</Navbar.Brand>
				</LinkContainer>

				<Navbar.Toggle />

				<Navbar.Collapse>
					<Nav className="me-auto">
						<hr />
						<LinkContainer to="/about">
							<Nav.Link>About</Nav.Link>
						</LinkContainer>
						{user && (
							<>
								<hr />
								<LinkContainer to="/projects">
									<Nav.Link>Projects</Nav.Link>
								</LinkContainer>
								{/* <LinkContainer to="/issues">
							<Nav.Link>Issues</Nav.Link>
						</LinkContainer> */}
							</>
						)}
					</Nav>

					<hr />

					<Nav>
						{!user && (
							<LinkContainer to="/signin">
								<Nav.Link>
									<AiOutlineLogin /> Log in
								</Nav.Link>
							</LinkContainer>
						)}
						{user && (
							<NavDropdown
								title={
									<>
										<AiOutlineUser />{" "}
										{user.firstName ? (
											<span className="me-2">{user.firstName}</span>
										) : null}
									</>
								}
								menuVariant={theme}
								drop="down-centered"
							>
								<LinkContainer to="/dashboard">
									<NavDropdown.Item>
										<AiOutlineSetting /> Profile Settings
									</NavDropdown.Item>
								</LinkContainer>

								<NavDropdown.Divider />

								<LinkContainer to="/" onClick={logOut}>
									<NavDropdown.Item>
										<AiOutlineLogout /> Log out
									</NavDropdown.Item>
								</LinkContainer>
							</NavDropdown>
						)}
						<Nav.Link href="#" onClick={switchTheme}>
							{theme === "light" ? <BsMoonFill /> : <BsSunFill />}
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
