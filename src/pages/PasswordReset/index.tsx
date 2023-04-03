import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useTheme from "../../context/useTheme";
import useUser from "../../context/useUser";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function PasswordReset() {
	const theme = useTheme();
	const { firebaseUser } = useUser();
	const [email, setEmail] = useState("");
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (email) {
			try {
				await sendPasswordResetEmail(auth, email);
				alert(
					"Password reset email was sent! Check your email and try to sign in again with reset password!"
				);
				navigate("/signin");
			} catch (error: any) {
				console.error(error.message);
			}
		} else {
			return console.error(
				"No email address was provided... Cannot send password reset email..."
			);
		}
	}

	if (firebaseUser) return <Navigate to="/dashboard" replace />;

	return (
		<div
			style={{
				backgroundColor: theme?.value === "light" ? "white" : "rgb(13, 17, 23)",
				color: theme?.value === "light" ? "black" : "white",
				maxWidth: 360,
				margin: "auto",
			}}
		>
			<h1 className="text-center mb-3">Reset your password!</h1>

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
						onChange={(e) => setEmail(e.target.value)}
						style={{
							backgroundColor:
								theme?.value === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme?.value === "light" ? "black" : "white",
						}}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Text>
						Don't have an account? <Link to="/signup">Sign up!</Link>
					</Form.Text>
				</Form.Group>

				<div className="d-grid mb-2">
					<Button variant="success" type="submit">
						Send password reset email
					</Button>
				</div>
			</Form>
		</div>
	);
}
