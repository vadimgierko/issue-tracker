import { useParams } from "react-router-dom";
import useProjects from "../../../context/useProjects";
import { Badge } from "react-bootstrap";
import MarkdownRenderer from "../../../components/MarkdownRenderer";
import { Project } from "../../../interfaces/Project";

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
			<hr />
			{["features", "pages", "components"].map((x) => (
				<div key={x}>
					<p>
						<strong>
							{x} ({project[x as keyof Project.Project].length})
						</strong>
					</p>
					<p>
						{(project[x as keyof Project.Project] as string[]).map((f) => (
							<Badge key={f} className="me-1">
								{f}
							</Badge>
						))}
					</p>
				</div>
			))}
		</>
	);
}
