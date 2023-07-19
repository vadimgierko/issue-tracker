import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useTheme from "../../context/useTheme";
import useUser from "../../context/useUser";
import { signIn } from "../../services/auth";
import PageHeader from "../../components/Layout/PageHeader";

export default function SignIn() {
	const { theme } = useTheme();
	const { user } = useUser();
	const [userData, setUserData] = useState({
		email: "",
		password: "",
	});
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const { email, password } = userData;
		if (email && password) {
			await signIn(email, password);
			navigate("/dashboard");
		} else {
			return console.error(
				"No email or password were provided... Cannot sign in..."
			);
		}
	}

	if (user) return <Navigate to="/dashboard" replace />;

	return (
		<div
			style={{
				maxWidth: 360,
				margin: "auto",
			}}
		>
			<PageHeader pageTitle="Sign in" />

			<Form
				className="border border-secondary rounded p-3 shadow"
				onSubmit={handleSubmit}
			>
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
					<Form.Text
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						Forgot password?{" "}
						<Link to="/password-reset">Send a password reset email!</Link>
					</Form.Text>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Text
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						Don't have an account? <Link to="/signup">Sign up!</Link>
					</Form.Text>
				</Form.Group>

				<div className="d-grid mb-2">
					<Button variant="success" type="submit">
						Sign in
					</Button>
				</div>
			</Form>
		</div>
	);
}
