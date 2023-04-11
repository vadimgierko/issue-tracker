import { useState, useEffect } from "react";
import { Project, ProjectData } from "../../interfaces/Project";
import useProjects from "../../context/useProjects";
import { useNavigate, useParams } from "react-router-dom";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import useTheme from "../../context/useTheme";
import PageHeader from "../../components/Layout/PageHeader";

export default function ProjectsEdit() {
	const { value: theme } = useTheme();
	const { projectId } = useParams();
	const { value: projects, updateProject } = useProjects();
	const project = projects.find((p) => p.id === projectId);
	const [projectData, setProjectData] = useState<ProjectData | null>(null);
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!project || !projectData)
			return console.error(
				"No project or project data provided... Cannot update project."
			);

		const updatedProject: Project = {
			...project,
			...projectData,
		};

		try {
			await updateProject(updatedProject);
			navigate("/projects/" + projectId);
		} catch (error: any) {
			console.error(error.message);
		}
	}

	useEffect(() => {
		if (project) {
			setProjectData({
				title: project.title,
				description: project.description,
			});
		} else {
			setProjectData(null);
		}
	}, [project]);

	if (!projectData)
		return (
			<p className="text-center">
				No project data provided... Cannot update project.
			</p>
		);

	return (
		<>
			<PageHeader pageTitle="Edit your project" />

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
						edit project
					</Button>
				</div>
			</Form>
		</>
	);
}
