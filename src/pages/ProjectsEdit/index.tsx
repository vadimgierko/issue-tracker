import { useState, useEffect } from "react";
import { Project } from "../../interfaces/Project";
import useProjects from "../../context/useProjects";
import { useNavigate, useParams } from "react-router-dom";
import {
	Badge,
	Button,
	FloatingLabel,
	Form,
	InputGroup,
} from "react-bootstrap";
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

	const [newFeature, setNewFeature] = useState<string>("");
	const [newPage, setNewPage] = useState<string>("");
	const [newComponent, setNewComponent] = useState<string>("");

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

		if (
			window.confirm(
				"Are you sure you want to delete this project permanently? This action can not be undone!"
			)
		) {
			await deleteProject(projectId);
			alert(`Your project with the id ${projectId} was successfully deleted.`);
			navigate("/projects");
		}
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
					required={false}
				/>

				<div className="mb-3">
					<hr />
					<p>
						<strong>Features</strong>:{" "}
						{projectData.features.length
							? projectData.features.map((f) => (
									<Badge key={f} className="me-1">
										{f}{" "}
										<span
											onClick={() =>
												setProjectData({
													...projectData,
													features: projectData.features.filter(
														(feature) => feature !== f
													),
												})
											}
											className="bg-danger px-1"
											style={{ cursor: "pointer" }}
										>
											X
										</span>
									</Badge>
							  ))
							: "There are no project's features yet... Add some!"}
					</p>
					<InputGroup className="mb-3">
						<Form.Control
							value={newFeature}
							placeholder="add new feature here"
							onChange={(e) => setNewFeature(e.target.value)}
							style={{
								backgroundColor:
									theme === "light" ? "white" : "rgb(13, 17, 23)",
								color: theme === "light" ? "black" : "white",
							}}
						/>
						<Button
							variant="outline-secondary"
							type="button"
							onClick={() => {
								if (newFeature) {
									setProjectData({
										...projectData,
										features: [...projectData.features, newFeature],
									});
									setNewFeature("");
								}
							}}
						>
							Add feature
						</Button>
					</InputGroup>
				</div>

				<div className="mb-3">
					<hr />
					<p>
						<strong>Pages</strong>:{" "}
						{projectData.pages.length
							? projectData.pages.map((p) => (
									<Badge key={p} className="me-1">
										{p}{" "}
										<span
											onClick={() =>
												setProjectData({
													...projectData,
													pages: projectData.pages.filter((page) => page !== p),
												})
											}
											className="bg-danger px-1"
											style={{ cursor: "pointer" }}
										>
											X
										</span>
									</Badge>
							  ))
							: "There are no project's pages yet... Add some!"}
					</p>
					<InputGroup className="mb-3">
						<Form.Control
							value={newPage}
							placeholder="add new page here"
							onChange={(e) => setNewPage(e.target.value)}
							style={{
								backgroundColor:
									theme === "light" ? "white" : "rgb(13, 17, 23)",
								color: theme === "light" ? "black" : "white",
							}}
						/>
						<Button
							variant="outline-secondary"
							type="button"
							onClick={() => {
								if (newPage) {
									setProjectData({
										...projectData,
										pages: [...projectData.pages, newPage],
									});
									setNewPage("");
								}
							}}
						>
							Add page
						</Button>
					</InputGroup>
				</div>

				<div className="mb-3">
					<hr />
					<p>
						<strong>Components</strong>:{" "}
						{projectData.components.length
							? projectData.components.map((c) => (
									<Badge key={c} className="me-1">
										{c}{" "}
										<span
											onClick={() =>
												setProjectData({
													...projectData,
													components: projectData.components.filter(
														(component) => component !== c
													),
												})
											}
											className="bg-danger px-1"
											style={{ cursor: "pointer" }}
										>
											X
										</span>
									</Badge>
							  ))
							: "There are no project's components yet... Add some!"}
					</p>
					<InputGroup className="mb-3">
						<Form.Control
							value={newComponent}
							placeholder="add new component here"
							onChange={(e) => setNewComponent(e.target.value)}
							style={{
								backgroundColor:
									theme === "light" ? "white" : "rgb(13, 17, 23)",
								color: theme === "light" ? "black" : "white",
							}}
						/>
						<Button
							variant="outline-secondary"
							type="button"
							onClick={() => {
								if (newComponent) {
									setProjectData({
										...projectData,
										components: [...projectData.components, newComponent],
									});
									setNewComponent("");
								}
							}}
						>
							Add component
						</Button>
					</InputGroup>
				</div>

				<div className="d-grid gap-2">
					<Button variant="primary" type="submit">
						update project
					</Button>
				</div>
			</Form>
			<div className="d-grid gap-2 mt-3">
				<Button
					variant="secondary"
					onClick={() => {
						// clear edit data:
						setProjectData({
							title: project.title,
							description: project.description,
							features: project.features,
							pages: project.pages,
							components: project.components,
						});

						setNewFeature("");
						setNewPage("");
						setNewComponent("");

						navigate(-1);
					}}
				>
					cancel
				</Button>
				<hr />
				<Button
					variant="outline-danger"
					onClick={() => handleDeleteProject(projectId)}
				>
					delete project
				</Button>
			</div>
		</>
	);
}
