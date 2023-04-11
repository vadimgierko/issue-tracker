import { useParams, Link } from "react-router-dom";
import useProjects from "../../context/useProjects";
import { Project as ProjectType } from "../../interfaces/Project";
import PageHeader from "../../components/Layout/PageHeader";
import { Button } from "react-bootstrap";

export default function Project() {
	const { projectId } = useParams<string>();
	const { value: projects } = useProjects();
	const project: ProjectType | undefined = projects.find(
		(p) => p.id === projectId
	);

	if (!projectId || !project)
		return (
			<p className="text-center text-danger">There is no such project...</p>
		);

	return (
		<>
			<PageHeader pageTitle={project.title}>
				{project.description}
				<div className="text-center mt-3">
					<Link to={"/projects/" + projectId + "/edit"}>
						<Button variant="primary">Edit project</Button>
					</Link>
				</div>
			</PageHeader>

			{/* {projectIssues.length ? (
				<IssuesList passedIssues={projectIssues} />
			) : (
				<p className="text-center text-danger">
					There are no issues in the project. Add one!
				</p>
			)} */}
		</>
	);
}
