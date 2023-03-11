import { useEffect, useState } from "react";
import { Issue } from "../../interfaces/Issue";
import {
	getLocalStorageItem,
	setLocalStorageItem,
} from "../../lib/localStorage";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import slugify from "slugify";

// interface IssueFormProps {
// 	onSubmit: (e: React.FormEvent<HTMLFormElement>, issue: Issue) => void;
// }

type Type = "bug" | "feature request" | "improvement";
type Priority = "high" | "medium" | "low";
type Status = "open" | "closed";

export default function IssueForm() {
	const projects = getProjects();

	function getProjects(): string[] {
		const storedProjects = getLocalStorageItem("projects");

		if (storedProjects) return storedProjects;

		return [];
	}

	const [project, setProject] = useState<string>(() =>
		projects.length ? projects[0] : ""
	);
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [type, setType] = useState<Type>("bug");
	const [priority, setPriority] = useState<Priority>("high");
	const [status, setStatus] = useState<Status>("open");

	function addIssue(e: React.FormEvent<HTMLFormElement>, issue: Issue) {
		e.preventDefault();
		console.log("issue opened:", issue);

		const storedIssues = getLocalStorageItem("issues");
		const updatedIssues = storedIssues ? [...storedIssues, issue] : [issue];
		setLocalStorageItem("issues", updatedIssues);

		clearForm();
	}

	function clearForm() {
		setProject(projects.length ? projects[0] : "");
		setTitle("");
		setDescription("");
		setType("bug");
		setPriority("high");
		setStatus("open");
	}

	useEffect(() => console.log("project:", project), [project]);

	return (
		<Form
			className="my-3"
			onSubmit={(e) => {
				const issue: Issue = {
					title,
					description,
					project,
					type,
					priority,
					status,
				};
				addIssue(e, issue);
			}}
		>
			<>
				<FloatingLabel label="Project" className="mb-3">
					<Form.Select
						value={project}
						onChange={(e) => setProject(e.target.value)}
					>
						{projects.length ? (
							projects.map((project) => (
								<option value={project} key={project}>
									{project}
								</option>
							))
						) : (
							<option>There are no projects stored... Add one first!</option>
						)}
					</Form.Select>
				</FloatingLabel>
			</>
			<div className="mb-3">
				<FloatingLabel label="Issue short title">
					<Form.Control
						value={title}
						placeholder="Type issue title here"
						onChange={(e) => setTitle(e.target.value)}
					/>
				</FloatingLabel>
				<Form.Text muted>
					This will be the slug of the issue: {slugify(title, { lower: true })}
				</Form.Text>
			</div>
			<>
				<FloatingLabel label="Issue description" className="mb-3">
					<Form.Control
						as="textarea"
						value={description}
						placeholder="Type issue description here"
						style={{ height: "100px" }}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</FloatingLabel>
			</>
			<>
				<FloatingLabel label="Issue type" className="mb-3">
					<Form.Select
						value={type}
						onChange={(e) => setType(e.target.value as Type)}
					>
						{["bug", "feature request", "improvement"].map((type) => (
							<option value={type} key={type}>
								{type}
							</option>
						))}
					</Form.Select>
				</FloatingLabel>
			</>
			<>
				<FloatingLabel label="Issue priority" className="mb-3">
					<Form.Select
						value={priority}
						onChange={(e) => setPriority(e.target.value as Priority)}
					>
						{["high", "medium", "low"].map((priority) => (
							<option value={priority} key={priority}>
								{priority}
							</option>
						))}
					</Form.Select>
				</FloatingLabel>
			</>
			<div className="d-grid gap-2">
				<Button variant="primary" type="submit">
					open issue
				</Button>
			</div>{" "}
		</Form>
	);
}
