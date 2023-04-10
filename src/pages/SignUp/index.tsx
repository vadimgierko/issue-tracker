import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useTheme from "../../context/useTheme";
import useUser from "../../context/useUser";
import { signUp } from "../../services/auth";

export default function SignUp() {
	const { value: theme } = useTheme();
	const { firebaseUser } = useUser();
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const { firstName, lastName, email, password } = userData;
		if (firstName && lastName && email && password) {
			return signUp(firstName, lastName, email, password);
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
			<h1 className="text-center mb-3">Sign Up!</h1>

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
