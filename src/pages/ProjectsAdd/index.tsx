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
import { Badge, InputGroup } from "react-bootstrap";

const emptyProject: Project.Data = {
	title: "",
	description: "",
	features: [],
	pages: [],
	components: [],
};

export default function ProjectsAdd() {
	const { theme } = useTheme();
	const [projectData, setProjectData] = useState<Project.Data>(emptyProject);
	const { addProject } = useProjects();
	const navigate = useNavigate();

	const [newFeature, setNewFeature] = useState<string>("");
	const [newPage, setNewPage] = useState<string>("");
	const [newComponent, setNewComponent] = useState<string>("");

	async function handleAddProject(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!projectData)
			return alert("No project data provided... Cannot add project.");

		const addedProjectId = await addProject(projectData);
		alert(`Your project was successfully added with the id ${addedProjectId}.`);
		clearForm();
		navigate("/projects/" + addedProjectId);
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

				<div className="mb-3">
					<hr />
					<p>
						<strong>Features</strong>:{" "}
						{projectData.features.length
							? projectData.features.map((f) => (
									<Badge key={f} className="me-1">
										{f}
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
										{p}
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
										{c}
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
						add project
					</Button>
				</div>
			</Form>
		</>
	);
}
