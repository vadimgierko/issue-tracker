import { useState } from "react";
import {
	getLocalStorageItem,
	setLocalStorageItem,
} from "../../lib/localStorage";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";

// interface IssueFormProps {
// 	onSubmit: (e: React.FormEvent<HTMLFormElement>, issue: Issue) => void;
// }

export default function ProjectForm() {
	const [title, setTitle] = useState("");

	function addProject(e: React.FormEvent<HTMLFormElement>, title: string) {
		e.preventDefault();
		const storedProjects = getLocalStorageItem("projects");
		const updatedProjects = storedProjects
			? [...storedProjects, title]
			: [title];
		setLocalStorageItem("projects", updatedProjects);
		clearForm();
	}

	function clearForm() {
		setTitle("");
	}

	return (
		<div className="add-project-form">
			<header className="text-center my-3">
				<h2>Add Project</h2>
			</header>
			<Form
				onSubmit={(e) => {
					addProject(e, title);
				}}
			>
				<>
					<FloatingLabel label="Project's title" className="mb-3">
						<Form.Control
							value={title}
							placeholder="type project title here"
							onChange={(e) => setTitle(e.target.value)}
						/>
					</FloatingLabel>
				</>

				<div className="d-grid gap-2">
					<Button variant="primary" type="submit">
						add project
					</Button>
				</div>
			</Form>
			<hr />
		</div>
	);
}
