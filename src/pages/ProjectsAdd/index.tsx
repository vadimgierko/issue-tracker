import { useNavigate } from "react-router-dom";
import useProjects from "../../context/useProjects";
import { ProjectData } from "../../interfaces/Project";
import AddProjectForm from "./AddProjectForm";

export default function ProjectsAdd() {
	const { addProject } = useProjects();
	const navigate = useNavigate();

	async function handleAddProject(projectData: ProjectData) {
		if (projectData) {
			try {
				const addedProjectId = await addProject(projectData);
				navigate("/projects/" + addedProjectId);
			} catch (error: any) {
				console.error(error.message);
			}
		}
	}

	return <AddProjectForm onSubmit={handleAddProject} />;
}
