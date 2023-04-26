import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import { Link, useParams } from "react-router-dom";
import useProjects from "../../../context/useProjects";
import useTheme from "../../../context/useTheme";
import { Issue } from "../../../interfaces/Issue";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import getDate from "../../../lib/getDate";
import useIssues from "../../../context/useIssues";

type IssuesTableProps = {
	issues: Issue.Issue[];
};

export default function IssuesTable({ issues }: IssuesTableProps) {
	const { theme } = useTheme();
	const { projects } = useProjects();
	const { projectId } = useParams();
	const { deleteIssue } = useIssues();
	// all issues have same status,
	// because they are filtered by status via issue table tabs:
	const issuesStatus: Issue.Status = issues[0].status; // needed for conditional rendering

	async function handleDeleteIssue(issue: Issue.Issue) {
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
					<th>Importance</th>
					<th>Urgency</th>
					<th>Estimated time</th>
					<th>Difficulty</th>
					{/* {issuesStatus === "open" && <th>Opened</th>}
					{issuesStatus === "in progress" && <th>In progress from</th>}
					{issuesStatus !== "open" && issuesStatus !== "in progress" && (
						<th>Closed</th>
					)}
					{(issuesStatus === "open" || issuesStatus === "in progress") && (
						<th>Updated</th>
					)} */}
					<th>
						<BsPencilSquare />
					</th>
					<th>
						<BsTrash className="text-danger" />
					</th>
				</tr>
			</thead>
			<tbody>
				{issues.map((issue) => (
					<tr key={issue.id}>
						<td>
							<Link to={"/issues/" + issue.id}>{issue.title}</Link>{" "}
							<Badge bg={issue.type === "bug" ? "danger" : "primary"}>
								{issue.type}
							</Badge>
							<br />
							<span className="text-muted">
								{issuesStatus === "open"
									? "opened at " + getDate(issue.created)
									: issue.inProgressFrom && issuesStatus === "in progress"
									? "in progress from " + getDate(issue.inProgressFrom)
									: issue.closedAt
									? "closed at " + getDate(issue.closedAt)
									: ""}
							</span>
						</td>
						{!projectId && (
							<td>
								<Link to={"/projects/" + issue.projectId}>
									{projects.find((p) => p.id === issue.projectId)?.title}
								</Link>
							</td>
						)}
						<td>
							<Badge
								bg={
									issue.importance === "high"
										? "danger"
										: issue.importance === "medium"
										? "warning"
										: "secondary"
								}
								text={issue.importance === "medium" ? "dark" : "light"}
							>
								{issue.importance}
							</Badge>
						</td>
						<td>
							<Badge
								bg={
									issue.urgency === "high"
										? "danger"
										: issue.urgency === "medium"
										? "warning"
										: "secondary"
								}
								text={issue.urgency === "medium" ? "dark" : "light"}
							>
								{issue.urgency}
							</Badge>
						</td>
						<td>
							<Badge
								bg={
									issue.estimatedTime === "high"
										? "danger"
										: issue.estimatedTime === "medium"
										? "warning"
										: "success"
								}
								text={issue.estimatedTime === "medium" ? "dark" : "light"}
							>
								{issue.estimatedTime}
							</Badge>
						</td>
						<td>
							<Badge
								bg={
									issue.difficulty === "high"
										? "danger"
										: issue.difficulty === "medium"
										? "warning"
										: "success"
								}
								text={issue.difficulty === "medium" ? "dark" : "light"}
							>
								{issue.difficulty}
							</Badge>
						</td>
						{/* {issuesStatus === "open" && <td>{getDate(issue.created)}</td>}
						{issue.inProgressFrom && issuesStatus === "in progress" && (
							<td>{getDate(issue.inProgressFrom)}</td>
						)}
						{issue.closedAt && <td>{getDate(issue.closedAt)}</td>}
						{!issue.closedAt && <td>{getDate(issue.updated)}</td>} */}
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
					</tr>
				))}
			</tbody>
		</Table>
	);
}
