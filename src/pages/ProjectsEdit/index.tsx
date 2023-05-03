import { useState, useEffect } from "react";
import { Project } from "../../interfaces/Project";
import useProjects from "../../context/useProjects";
import { useNavigate, useParams } from "react-router-dom";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import useTheme from "../../context/useTheme";
import PageHeader from "../../components/Layout/PageHeader";
import MarkdownTextAreaField from "../../components/MarkdownTextAreaField";

export default function ProjectsEdit() {
	const { theme } = useTheme();
	const { projectId } = useParams();
	const { projects, updateProject, deleteProject } = useProjects();
	const project = projects.find((p) => p.id === projectId);
	const [projectData, setProjectData] = useState<Project.Data | null>(null);
	const navigate = useNavigate();

	async function handleProjectUpdate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!project || !projectData || !projectId)
			return alert(
				"No project or project data provided... Cannot update project."
			);

		const updatedProject: Project.Project = {
			...project,
			...projectData,
		};

		await updateProject(updatedProject);
		alert(`Your project with the id ${projectId} was successfully updated.`);
		navigate("/projects/" + projectId);
	}

	async function handleDeleteProject(projectId: string) {
		if (!projectId)
			return console.error(
				"No project id was provided... Cannot delete project."
			);

		await deleteProject(projectId);
		alert(`Your project with the id ${projectId} was successfully deleted.`);
		navigate("/projects");
	}

	useEffect(() => {
		if (project) {
			setProjectData({
				title: project.title,
				description: project.description,
				features: project.features,
				pages: project.pages,
				components: project.components,
			});
		} else {
			setProjectData(null);
		}
	}, [project]);

	if (!projectData || !project || !projectId)
		return (
			<p className="text-center">
				No project data provided... Cannot update project.
			</p>
		);

	return (
		<>
			<PageHeader pageTitle="Update your project" />

			<Form
				onSubmit={(e) => {
					handleProjectUpdate(e);
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
				/>

				<div className="d-grid gap-2">
					<Button variant="primary" type="submit">
						update project
					</Button>
				</div>
			</Form>
			<div className="d-grid gap-2 mt-3">
				<Button variant="danger" onClick={() => handleDeleteProject(projectId)}>
					delete project
				</Button>
			</div>
		</>
	);
}
