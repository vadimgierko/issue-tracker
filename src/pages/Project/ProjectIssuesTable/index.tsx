import { useParams, Link } from "react-router-dom";
import useIssues from "../../../context/useIssues";
import { AiOutlinePlusSquare } from "react-icons/ai";
import IssuesFilterableTable from "../../Issues/IssuesFilterableTable";
import createAddIssueLinkWithParams from "../../../lib/createAddIssueLinkWithParams";

export default function ProjectIssuesTable() {
	const { projectId } = useParams<string>();
	const { issues } = useIssues();
	const projectIssues = issues.filter((i) => i.projectId === projectId);

	if (!projectId) return null;

	return (
		<>
			<h2 className="text-center">
				Issues ({projectIssues.length}){" "}
				<Link
					to={createAddIssueLinkWithParams(projectId, false, null, null, null)}
				>
					<AiOutlinePlusSquare />
				</Link>
			</h2>

			{projectIssues.length ? (
				<IssuesFilterableTable issues={projectIssues} />
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
