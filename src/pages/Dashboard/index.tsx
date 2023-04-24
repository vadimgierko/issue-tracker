import { useState } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import useUser from "../../context/useUser";
import { deleteUserAccount } from "../../services/auth";
import { LinkContainer } from "react-router-bootstrap";
import {
	AiOutlineUser,
	AiOutlineWarning,
	AiOutlineSetting,
} from "react-icons/ai";
import useProjects from "../../context/useProjects";
import useIssues from "../../context/useIssues";

export default function Dashboard() {
	const { user, firebaseUser } = useUser();
	const { projects } = useProjects();
	const { issues } = useIssues();
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDeleteAccount() {
		try {
			const agreeToDeleteAccount = window.confirm(
				"Are you sure you want to delete your account and all your data forever? This action can't be undone!"
			);
			if (agreeToDeleteAccount) {
				await deleteUserAccount(firebaseUser, projects, issues);
			}
		} catch (error: any) {
			console.error(
				`Error message: ${error.message}. Error code: ${error.code}`
			);
			alert(`Error message: ${error.message}. Error code: ${error.code}`);
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<>
			<header className="text-center">
				<h1>
					<AiOutlineSetting /> Profile Settings
				</h1>
				<hr />
			</header>

			<h2 className="text-center mb-3">
				<AiOutlineUser /> Personal Data
			</h2>
			<p>
				<span className="fw-bold">First name:</span>{" "}
				{user?.firstName ? user?.firstName : ""}
			</p>
			<p>
				<span className="fw-bold">Last name:</span>{" "}
				{user?.lastName ? user?.lastName : ""}
			</p>
			<p>
				<span className="fw-bold">Email:</span> {user?.email}
			</p>
			<p>
				<span className="fw-bold">UID:</span> {user?.uid}
			</p>
			<LinkContainer to="/personal-data-edit">
				<Button variant="primary">Edit data</Button>
			</LinkContainer>
			<hr />

			<h2 className="text-center mb-3">
				<AiOutlineWarning /> Security sensitive actions
			</h2>
			<LinkContainer to="/password-change" className="mb-3">
				<Button variant="primary">Change password</Button>
			</LinkContainer>
			<br />
			<LinkContainer to="/email-change" className="mb-3">
				<Button variant="primary">Change email</Button>
			</LinkContainer>
			<br />
			<Button
				variant="outline-danger"
				onClick={() => {
					setIsDeleting(true);
					handleDeleteAccount();
				}}
			>
				Delete Account {isDeleting && <Spinner as="span" size="sm" />}
			</Button>
		</>
	);
}
