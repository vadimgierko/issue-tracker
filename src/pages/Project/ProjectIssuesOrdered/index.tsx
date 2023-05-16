import { Link, useParams } from "react-router-dom";
import useIssues from "../../../context/useIssues";
import useProjects from "../../../context/useProjects";
import ProjectIssuesOrderedList from "./ProjectIssuesOrderedList";
import { AiOutlinePlusSquare } from "react-icons/ai";
import rankifyIssues from "../../../lib/rankifyIssues";

export default function ProjectIssuesOrdered() {
	const { projectId } = useParams();
	const { projects } = useProjects();
	const { issues, setIssues } = useIssues();
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
			<ProjectIssuesOrderedList
				issues={rankifyIssues(projectIssues)}
				setIssues={setIssues}
			/>
		</>
	);
}
