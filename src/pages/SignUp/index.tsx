import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useTheme from "../../context/useTheme";
import useUser from "../../context/useUser";
import { logOut, signUp } from "../../services/auth";
import PageHeader from "../../components/Layout/PageHeader";

export default function SignUp() {
	const { theme } = useTheme();
	const { firebaseUser } = useUser();
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const { firstName, lastName, email, password } = userData;
		if (firstName && lastName && email && password) {
			await signUp(firstName, lastName, email, password);

			alert(
				`Congratulations! You've successfully created an acount! We've sent a verification email, so confirm you're email address & then come back & sign in!`
			);
			console.info(
				`Congratulations! You've successfully created an acount! We've sent a verification email, so confirm you're email address & then come back & sign in!`
			);

			await logOut();

			navigate("/signin");
		}
	}

	if (firebaseUser) return <Navigate to="/dashboard" replace />;

	return (
		<div
			style={{
				backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
				color: theme === "light" ? "black" : "white",
				maxWidth: 360,
				margin: "auto",
			}}
		>
			<PageHeader pageTitle="Create account" />

			<Form
				className="border border-secondary rounded p-3 shadow"
				onSubmit={handleSubmit}
			>
				<Form.Group className="mb-3">
					<Form.Label>First name</Form.Label>
					<Form.Control
						placeholder="Enter your first name"
						required
						onChange={(e) =>
							setUserData({
								...userData,
								firstName: e.target.value,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Last name</Form.Label>
					<Form.Control
						placeholder="Enter your last name"
						required
						onChange={(e) =>
							setUserData({
								...userData,
								lastName: e.target.value,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter your email address"
						required
						onChange={(e) =>
							setUserData({
								...userData,
								email: e.target.value,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Enter your password"
						required
						onChange={(e) =>
							setUserData({
								...userData,
								password: e.target.value,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Text>
						Already have an account? <Link to="/signin">Sign in!</Link>
					</Form.Text>
				</Form.Group>

				<div className="d-grid mb-2">
					<Button variant="success" type="submit">
						Sign up
					</Button>
				</div>
			</Form>
		</div>
	);
}
