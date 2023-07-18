import { useParams } from "react-router-dom";
import useProjects from "../../../context/useProjects";
import MarkdownRenderer from "../../../components/MarkdownRenderer";

export default function ProjectDetails() {
	const { projectId } = useParams();
	const { projects } = useProjects();
	const project = projects.find((p) => p.id === projectId);

	if (!project)
		return (
			<p className="text-center text-danger">
				There is no such project with the id {projectId}...
			</p>
		);

	return (
		<>
			<h2 className="text-center">Project details</h2>
			<p>
				<strong>Description</strong>:
			</p>
			<MarkdownRenderer markdown={project.description} />
		</>
	);
}
