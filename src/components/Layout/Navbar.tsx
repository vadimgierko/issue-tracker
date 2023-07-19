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
	AiOutlinePlusSquare,
} from "react-icons/ai";

//import useUser from "../../context/useUser"; // TODO: IMPLEMENT useUser features
import useMaxWidth from "../../context/useMaxWidth";
import { logOut } from "../../services/auth";
import useUser from "../../context/useUser";
import useIssues from "../../context/useIssues";
import useProjects from "../../context/useProjects";
import createAddIssueLinkWithParams from "../../lib/createAddIssueLinkWithParams";

export default function NavigationBar() {
	const maxWidth = useMaxWidth();
	const { theme, switchTheme } = useTheme();
	const { user } = useUser();
	const { issues } = useIssues();
	const { projects } = useProjects();

	return (
		<Navbar
			collapseOnSelect
			expand="lg"
			bg={theme}
			variant={theme}
			fixed="top"
			className="shadow do-not-display-when-print"
		>
			<Container style={{ maxWidth: maxWidth }}>
				<LinkContainer to="/about">
					<Navbar.Brand>Issue Tracker</Navbar.Brand>
				</LinkContainer>

				<Navbar.Toggle />

				<Navbar.Collapse>
					<Nav className="me-auto">
						<hr />
						<LinkContainer to="/about">
							<Nav.Link>About</Nav.Link>
						</LinkContainer>

						<LinkContainer to="/app-guide">
							<Nav.Link>App Guide</Nav.Link>
						</LinkContainer>

						<LinkContainer to="/markdown-guide">
							<Nav.Link>Markdown Guide</Nav.Link>
						</LinkContainer>
					</Nav>

					<hr />

					<Nav>
						{user && (
							<>
								<hr />

								<LinkContainer to="/projects">
									<Nav.Link>Projects ({projects.length})</Nav.Link>
								</LinkContainer>
								<LinkContainer to="/projects/add">
									<Nav.Link>
										<AiOutlinePlusSquare />
									</Nav.Link>
								</LinkContainer>

								<LinkContainer to="/issues">
									<Nav.Link>Issues ({issues.length})</Nav.Link>
								</LinkContainer>
								<LinkContainer
									to={createAddIssueLinkWithParams(
										null,
										false,
										null,
										null,
										null
									)}
								>
									<Nav.Link>
										<AiOutlinePlusSquare />
									</Nav.Link>
								</LinkContainer>
							</>
						)}

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
