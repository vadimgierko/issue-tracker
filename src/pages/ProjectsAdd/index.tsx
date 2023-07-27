import { useNavigate } from "react-router-dom";
import useProjects from "../../context/useProjects";
import PageHeader from "../../components/Layout/PageHeader";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Project } from "../../interfaces/Project";
import useTheme from "../../context/useTheme";
import { useState } from "react";
import MarkdownTextAreaField from "../../components/MarkdownTextAreaField";

const emptyProject: Project.Data = {
	title: "",
	description: "",
};

export default function ProjectsAdd() {
	const { theme } = useTheme();
	const [projectData, setProjectData] = useState<Project.Data>(emptyProject);
	const { addProject } = useProjects();
	const navigate = useNavigate();

	async function handleAddProject(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!projectData)
			return alert("No project data provided... Cannot add project.");

		const addedProjectId = await addProject(projectData);
		alert(`Your project was successfully added with the id ${addedProjectId}.`);
		clearForm();
		navigate("/projects/" + addedProjectId, { replace: true });
	}

	function clearForm() {
		setProjectData(emptyProject);
	}

	return (
		<>
			<PageHeader pageTitle="Add project" />

			<Form
				onSubmit={(e) => {
					handleAddProject(e);
				}}
			>
				<FloatingLabel label="Title" className="mb-3">
					<Form.Control
						value={projectData.title}
						placeholder="type project title here"
						onChange={(e) =>
							setProjectData({ ...projectData, title: e.target.value })
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						required
					/>
				</FloatingLabel>

				<MarkdownTextAreaField
					label="Description"
					value={projectData.description}
					placeholder="type project description here"
					onChange={(value: string) =>
						setProjectData({ ...projectData, description: value })
					}
					formGroupClassName="mb-3"
					required={false}
				/>

				<div className="d-grid">
					<Button variant="primary" type="submit">
						add project
					</Button>
				</div>
			</Form>

			<div className="d-grid mt-3">
				<Button
					variant="outline-secondary"
					onClick={() => {
						// clear edit data:
						clearForm();
						navigate(-1);
					}}
				>
					cancel
				</Button>
			</div>
		</>
	);
}
