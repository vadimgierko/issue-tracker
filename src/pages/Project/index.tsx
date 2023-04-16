import { useParams, Link, useNavigate } from "react-router-dom";
import useProjects from "../../context/useProjects";
import PageHeader from "../../components/Layout/PageHeader";
import { Button } from "react-bootstrap";
import useIssues from "../../context/useIssues";
import IssuesTable from "../Issues/IssuesFilterableTable/IssuesTable";
import { AiOutlinePlusSquare } from "react-icons/ai";

export default function Project() {
	const { projectId } = useParams<string>();
	const { projects, deleteProject } = useProjects();
	const { issues } = useIssues();
	const project = projects.find((p) => p.id === projectId);
	const projectIssues = issues.filter((i) => i.projectId === projectId);
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
						className="ms-2"
					>
						delete project
					</Button>
				</div>
			</PageHeader>

			<section className="project-issues">
				<h2 className="text-center">
					Issues{" "}
					<Link to="/issues/add">
						<AiOutlinePlusSquare />
					</Link>
				</h2>

				{projectIssues.length ? (
					<IssuesTable issues={projectIssues} />
				) : (
					<p className="text-center">
						There are no issues in the project.{" "}
						<Link to="/issues/add">Add one!</Link>
					</p>
				)}
			</section>
		</>
	);
}
