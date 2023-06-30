import { Link, useParams } from "react-router-dom";
import useIssues from "../../../context/useIssues";
import useProjects from "../../../context/useProjects";
import { AiOutlinePlusSquare } from "react-icons/ai";
import RecursiveList from "./RecursiveList";
import createAddIssueLinkWithParams from "../../../lib/createAddIssueLinkWithParams";
import { FormCheck } from "react-bootstrap";

export default function ProjectIssuesList() {
	const { projectId } = useParams();
	const { projects } = useProjects();
	const {
		issues,
		showClosedIssues,
		setShowClosedIssues,
		showRank,
		setShowRank,
		sortUnorderedIssuesByRank,
		setSortUnorderedIssuesByRank,
	} = useIssues();
	const project = projects.find((p) => p.id === projectId);
	const projectIssues = issues.filter((i) => i.projectId === projectId);

	if (!project || !projectId)
		return (
			<p className="text-center text-danger">There is no such project...</p>
		);

	return (
		<>
			<h2 className="text-center">
				Issues List ({projectIssues.length}){" "}
				<Link
					to={createAddIssueLinkWithParams(projectId, false, null, null, null)}
				>
					<AiOutlinePlusSquare />
				</Link>
			</h2>
			<div className="d-flex justify-content-center do-not-display-when-print">
				<FormCheck
					label={"Show closed issues"}
					checked={showClosedIssues}
					onChange={() => setShowClosedIssues(!showClosedIssues)}
					className="do-not-display-when-print"
				/>
			</div>
			<div className="d-flex justify-content-center do-not-display-when-print">
				<FormCheck
					label={"Show issue's rank"}
					checked={showRank}
					onChange={() => setShowRank(!showRank)}
					className="do-not-display-when-print"
				/>
			</div>
			<div className="d-flex justify-content-center do-not-display-when-print">
				<FormCheck
					label={"Sort unordered issues by rank"}
					checked={sortUnorderedIssuesByRank}
					onChange={() =>
						setSortUnorderedIssuesByRank(!sortUnorderedIssuesByRank)
					}
					className="do-not-display-when-print"
				/>
			</div>
			<hr />
			{projectIssues && projectIssues.length ? (
				<RecursiveList issuesToList={projectIssues} root={null} />
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
