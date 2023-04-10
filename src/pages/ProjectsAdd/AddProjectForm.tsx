import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Project, ProjectData } from "../../interfaces/Project";
import useTheme from "../../context/useTheme";

const emptyProject: ProjectData = {
	title: "",
	description: "",
};

interface ProjectFormProps {
	onSubmit: (projectData: ProjectData) => Promise<void>;
	project?: Project;
}

export default function AddProjectForm({
	project,
	onSubmit,
}: ProjectFormProps) {
	const { value: theme } = useTheme();
	const [projectData, setProjectData] = useState<ProjectData>(() =>
		project
			? { title: project.title, description: project.description }
			: emptyProject
	);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		await onSubmit(projectData);
		clearForm();
	}

	function clearForm() {
		setProjectData(emptyProject);
	}

	return (
		<Form
			onSubmit={(e) => {
				handleSubmit(e);
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
				/>
			</FloatingLabel>

			<FloatingLabel label="Description" className="mb-3">
				<Form.Control
					value={projectData.description}
					placeholder="type project title here"
					onChange={(e) =>
						setProjectData({ ...projectData, description: e.target.value })
					}
					style={{
						backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
						color: theme === "light" ? "black" : "white",
					}}
				/>
			</FloatingLabel>

			<div className="d-grid gap-2">
				<Button variant="primary" type="submit">
					add project
				</Button>
			</div>
		</Form>
	);
}
