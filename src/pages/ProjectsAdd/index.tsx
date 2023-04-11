import { useNavigate } from "react-router-dom";
import useProjects from "../../context/useProjects";
import { ProjectData } from "../../interfaces/Project";
import AddProjectForm from "./AddProjectForm";
import PageHeader from "../../components/Layout/PageHeader";

export default function ProjectsAdd() {
	const { addProject } = useProjects();
	const navigate = useNavigate();

	async function handleAddProject(projectData: ProjectData) {
		if (!projectData)
			return alert("No project data provided... Cannot add project.");

		const addedProjectId = await addProject(projectData);
		alert(`Your project was successfully added with the id ${addedProjectId}.`);
		navigate("/projects/" + addedProjectId);
	}

	return (
		<>
			<PageHeader pageTitle="Add project" />
			<AddProjectForm onSubmit={handleAddProject} />
		</>
	);
}
