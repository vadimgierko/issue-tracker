import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import { Issue } from "../../interfaces/Issue";
import useTheme from "../../context/useTheme";
import getDate from "../../lib/getDate";

type IssueTableProps = {
	issue: Issue.AppIssue;
};

export default function IssueTable({ issue }: IssueTableProps) {
	const { theme } = useTheme();

	return (
		<Table striped bordered hover responsive className="mt-3" variant={theme}>
			<thead>
				<tr>
					<th>Importance</th>
					<th>Urgency</th>
					<th>Estimated time</th>
					<th>Difficulty</th>
					<th>Opened</th>
					<th>In progress from</th>
					<th>Closed</th>
					<th>Updated</th>
				</tr>
			</thead>
			<tbody>
				<tr key={issue.id}>
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
					<td>{getDate(issue.created)}</td>
					<td>{issue.inProgressFrom ? getDate(issue.inProgressFrom) : "-"}</td>
					<td>{issue.closedAt ? getDate(issue.closedAt) : "-"}</td>
					<td>{getDate(issue.updated)}</td>
				</tr>
			</tbody>
		</Table>
	);
}
