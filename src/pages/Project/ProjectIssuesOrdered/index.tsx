import { Link, useParams } from "react-router-dom";
import useIssues from "../../../context/useIssues";
import useProjects from "../../../context/useProjects";
import { AiOutlinePlusSquare } from "react-icons/ai";
import RecursiveList from "./RecursiveList";

export default function ProjectIssuesOrdered() {
	const { projectId } = useParams();
	const { projects } = useProjects();
	const { issues } = useIssues();
	const project = projects.find((p) => p.id === projectId);
	const projectIssues = issues.filter(
		(i) =>
			i.projectId === projectId &&
			(i.status === "open" || i.status === "in progress")
	);

	if (!project)
		return (
			<p className="text-center text-danger">There is no such project...</p>
		);

	if (!projectIssues || !projectIssues.length)
		return (
			<p className="text-center text-danger">
				There are no issues in this project...
			</p>
		);

	return (
		<>
			<h2 className="text-center">
				Issues Ordered (open & in progress) ({projectIssues.length}){" "}
				{/* <Link to="add-issue">
					<AiOutlinePlusSquare />
				</Link> */}
			</h2>
			<RecursiveList issuesToList={projectIssues} root={null} />
		</>
	);
}
