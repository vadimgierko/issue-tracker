import {
	Link,
	Outlet,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import useProjects from "../../context/useProjects";
import PageHeader from "../../components/Layout/PageHeader";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import useIssues from "../../context/useIssues";
import ProjectIssuesList from "./ProjectIssuesList";

export default function Project() {
	const { projectId } = useParams<string>();
	const { projects, deleteProject } = useProjects();
	const project = projects.find((p) => p.id === projectId);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const { issues } = useIssues();
	const projectIssues = issues.filter((i) => i.projectId === projectId);

	async function handleDeleteProject(projectId: string) {
		if (!projectId)
			return alert("No project id was provided... Cannot delete project.");

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

	if (!projectId) return null;

	if (!project)
		return (
			<p className="text-center text-danger">
				There is no such project with the id {projectId}...
			</p>
		);

	return (
		<>
			<PageHeader
				pageTitle={
					<>
						{project.title}{" "}
						<Link to={"/projects/" + project.id + "/edit"}>
							<BsPencilSquare />
						</Link>{" "}
						<BsTrash
							style={{ color: "red", cursor: "pointer" }}
							onClick={() => handleDeleteProject(project.id)}
						/>
					</>
				}
			>
				<p className="text-center">
					<Link to="issues-table">Issues Table ({projectIssues.length})</Link> |{" "}
					<Link to="details">Details</Link> |{" "}
					<Link to="issues-list">Issues List ({projectIssues.length})</Link>
				</p>
			</PageHeader>

			{pathname === `/projects/${projectId}` ? (
				<ProjectIssuesList />
			) : (
				<Outlet />
			)}
		</>
	);
}
