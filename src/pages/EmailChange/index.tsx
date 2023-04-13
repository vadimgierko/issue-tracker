import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useTheme from "../../context/useTheme";
import useUser from "../../context/useUser";
import { changeEmail } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/Layout/PageHeader";

export default function EmailChange() {
	const { theme } = useTheme();
	const { firebaseUser } = useUser();
	const [newEmail, setNewEmail] = useState("");
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (newEmail) {
			try {
				await changeEmail(firebaseUser, newEmail);
				navigate("/dashboard");
			} catch (error: any) {
				console.error(error.message);
				alert(error.message);
			}
		} else {
			return alert(
				"No email address was provided... Cannot send password reset email..."
			);
		}
	}

	return (
		<div
			style={{
				maxWidth: 360,
				margin: "auto",
			}}
		>
			<PageHeader pageTitle="Change your email address" />

			<Form
				className="border border-secondary rounded p-3 shadow"
				onSubmit={handleSubmit}
			>
				<Form.Group className="mb-3">
					<Form.Label>New email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter your new email address"
						required
						onChange={(e) => setNewEmail(e.target.value)}
						className="mb-2"
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					/>
					<Form.Text className="text-danger">
						WARNING: You will use this new email address to log in in the app!
					</Form.Text>
				</Form.Group>

				<div className="d-grid mb-2">
					<Button variant="success" type="submit">
						Change email
					</Button>
				</div>
			</Form>
		</div>
	);
}
