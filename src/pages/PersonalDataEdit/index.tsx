import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useTheme from "../../context/useTheme";
import useUser from "../../context/useUser";
import { updateDocument } from "../../services/firestore-crud";
import PageHeader from "../../components/Layout/PageHeader";

export default function PersonalDataEdit() {
	const { theme } = useTheme();
	const { user } = useUser();
	const navigate = useNavigate();

	const [userData, setUserData] = useState({
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		email: user?.email || "",
	});

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const { firstName, lastName, email } = userData;
		if (firstName && lastName && email) {
			if (user && user.uid) {
				await updateDocument(userData, "users", user.uid);
				navigate("/dashboard");
			}
		}
	}

	return (
		<>
			<PageHeader pageTitle="Edit your personal data" />

			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>First name</Form.Label>
					<Form.Control
						placeholder="Enter your first name"
						value={userData.firstName}
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
						value={userData.lastName}
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
						value={userData.email}
						required
						onChange={(e) =>
							setUserData({
								...userData,
								email: e.target.value,
							})
						}
						className="mb-2"
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					/>
					<Form.Text className="text-danger">
						WARNING: if you change your email address here, it will be changed
						only in your personal data and database, but it DOESN'T change the
						email address you're using to log in into the app. If you want to
						change the email address you're using to log in into the app,{" "}
						<Link to="/email-change">click here</Link>.
					</Form.Text>
				</Form.Group>

				<div className="text-end mt-5">
					<Button
						variant="secondary"
						className="me-1"
						type="button"
						onClick={() => {
							setUserData({
								firstName: user?.firstName || "",
								lastName: user?.lastName || "",
								email: user?.email || "",
							});
							navigate("/dashboard");
						}}
					>
						Cancel
					</Button>
					<Button variant="success" type="submit">
						Save changes
					</Button>
				</div>
			</Form>
		</>
	);
}
