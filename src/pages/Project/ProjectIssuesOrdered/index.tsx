import { Link, useParams } from "react-router-dom";
import useIssues from "../../../context/useIssues";
import useProjects from "../../../context/useProjects";
import { AiOutlinePlusSquare } from "react-icons/ai";
import RecursiveList from "./RecursiveList";
import createAddIssueLinkWithParams from "../../../lib/createAddIssueLinkWithParams";

export default function ProjectIssuesOrdered() {
	const { projectId } = useParams();
	const { projects } = useProjects();
	const { issues } = useIssues();
	const project = projects.find((p) => p.id === projectId);
	const projectIssuesOpenAndInProgress = issues.filter(
		(i) =>
			i.projectId === projectId &&
			(i.status === "open" || i.status === "in progress")
	);

	if (!project || !projectId)
		return (
			<p className="text-center text-danger">There is no such project...</p>
		);

	return (
		<>
			<h2 className="text-center">
				Issues Ordered (open & in progress) (
				{projectIssuesOpenAndInProgress.length}){" "}
				<Link
					to={createAddIssueLinkWithParams(projectId, false, null, null, null)}
				>
					<AiOutlinePlusSquare />
				</Link>
			</h2>
			{projectIssuesOpenAndInProgress &&
			projectIssuesOpenAndInProgress.length ? (
				<RecursiveList
					issuesToList={projectIssuesOpenAndInProgress}
					root={null}
				/>
			) : (
				<p className="text-center">
					There are no issues in the project.{" "}
					<Link
						to={createAddIssueLinkWithParams(
							projectId,
							false,
							null,
							null,
							null
						)}
					>
						Add one!
					</Link>
				</p>
			)}
		</>
	);
}
