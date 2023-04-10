import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useTheme from "../../context/useTheme";
import useUser from "../../context/useUser";
import { changePassword } from "../../services/auth";

export default function PasswordChange() {
	const { value: theme } = useTheme();
	const { firebaseUser } = useUser();

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordConfirmed, setNewPasswordConfirmed] = useState("");

	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!oldPassword)
			return alert(
				"You need to provide an old password to change the password!"
			);

		if (!newPassword)
			return alert(
				"You need to provide a new password to change the password!"
			);

		if (newPassword.length < 6)
			return alert("New password must have at least 6 characters!");

		if (newPassword !== newPasswordConfirmed)
			return alert("New and confirmed passwords don't match!");

		try {
			await changePassword(firebaseUser, oldPassword, newPassword);
			navigate("/dashboard");
		} catch (error: any) {
			console.error(
				`Error message: ${error.message}. Error code: ${error.code}`
			);
			alert(`Error message: ${error.message}. Error code: ${error.code}`);
		}
	}

	if (!firebaseUser)
		return <p className="text-center">You need to be logged!</p>;

	return (
		<div
			style={{
				backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
				color: theme === "light" ? "black" : "white",
				maxWidth: 360,
				margin: "auto",
			}}
		>
			<h1 className="text-center mb-3">Change your password!</h1>

			<Form
				className="border border-secondary rounded p-3 shadow"
				onSubmit={handleSubmit}
			>
				<Form.Group className="mb-3">
					<Form.Label>Old password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Enter your old password"
						required
						onChange={(e) => setOldPassword(e.target.value)}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>New password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Enter your new password"
						required
						onChange={(e) => setNewPassword(e.target.value)}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					/>
					<Form.Text muted>At least 6 characters</Form.Text>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Confirm new password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Enter your new password again"
						required
						onChange={(e) => setNewPasswordConfirmed(e.target.value)}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					/>
				</Form.Group>

				<div className="d-grid mb-2">
					<Button variant="success" type="submit">
						Change password
					</Button>
				</div>
			</Form>
		</div>
	);
}
