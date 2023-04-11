import { useParams, Link, useNavigate } from "react-router-dom";
import useProjects from "../../context/useProjects";
import { Project as ProjectType } from "../../interfaces/Project";
import PageHeader from "../../components/Layout/PageHeader";
import { Button } from "react-bootstrap";

export default function Project() {
	const { projectId } = useParams<string>();
	const { projects, deleteProject } = useProjects();
	const project: ProjectType | undefined = projects.find(
		(p) => p.id === projectId
	);
	const navigate = useNavigate();

	async function handleDeleteProject(projectId: string) {
		if (!projectId)
			return alert("No project id was provided... Cannot delete project.");

		await deleteProject(projectId);
		alert(`Your project with the id ${projectId} was successfully deleted.`);
		navigate("/projects");
	}

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
						<Button variant="primary">edit project</Button>
					</Link>
					<Button
						variant="danger"
						onClick={() => handleDeleteProject(projectId)}
						className="ms-1"
					>
						delete project
					</Button>
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
