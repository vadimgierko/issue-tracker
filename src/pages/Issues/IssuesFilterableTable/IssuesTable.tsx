import Table from "react-bootstrap/Table";
import { Link, useParams } from "react-router-dom";
import useProjects from "../../../context/useProjects";
import useTheme from "../../../context/useTheme";
import { Issue } from "../../../interfaces/Issue";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import getDate from "../../../lib/getDate";
import useIssues from "../../../context/useIssues";

type IssuesTableProps = {
	issues: Issue[];
};

export default function IssuesTable({ issues }: IssuesTableProps) {
	const { theme } = useTheme();
	const { projects } = useProjects();
	const { projectId } = useParams();
	const { deleteIssue } = useIssues();

	async function handleDeleteIssue(issue: Issue) {
		if (!issue) return alert("No issue was provided... Cannot delete issue.");

		await deleteIssue(issue.id, issue.projectId);
		alert(`Your issue with the id ${issue.id} was successfully deleted.`);
	}

	return (
		<Table striped bordered hover responsive className="mt-3" variant={theme}>
			<thead>
				<tr>
					<th>Title</th>
					{!projectId && <th>Project</th>}
					<th>Type</th>
					<th>Importance</th>
					<th>Urgency</th>
					<th>Status</th>
					<th>Update</th>
					<th>Delete</th>
					<th>Created</th>
					<th>Updated</th>
					<th>In progress from</th>
					<th>Closed</th>
				</tr>
			</thead>
			<tbody>
				{issues.map((issue) => (
					<tr key={issue.id}>
						<td>
							<Link to={"/issues/" + issue.id}>{issue.title}</Link>
						</td>
						{!projectId && (
							<td>
								<Link to={"/projects/" + issue.projectId}>
									{projects.find((p) => p.id === issue.projectId)?.title}
								</Link>
							</td>
						)}
						<td className={issue.type === "bug" ? "text-danger" : ""}>
							{issue.type}
						</td>
						<td
							className={
								issue.importance === "high"
									? "text-danger"
									: issue.importance === "medium"
									? "text-warning"
									: "text-secondary"
							}
						>
							{issue.importance}
						</td>
						<td
							className={
								issue.urgency === "high"
									? "text-danger"
									: issue.urgency === "medium"
									? "text-warning"
									: "text-secondary"
							}
						>
							{issue.urgency}
						</td>
						<td className={issue.status === "open" ? "text-danger" : ""}>
							{issue.status}
						</td>
						<td>
							<Link to={"/issues/" + issue.id + "/edit"}>
								<BsPencilSquare />
							</Link>
						</td>
						<td>
							<BsTrash
								className="text-danger"
								onClick={() => handleDeleteIssue(issue)}
								style={{ cursor: "pointer" }}
							/>
						</td>
						<td>{getDate(issue.created)}</td>
						<td>{getDate(issue.updated)}</td>
						<td>
							{issue.inProgressFrom ? getDate(issue.inProgressFrom) : "-"}
						</td>
						<td>{issue.closedAt ? getDate(issue.closedAt) : "-"}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
