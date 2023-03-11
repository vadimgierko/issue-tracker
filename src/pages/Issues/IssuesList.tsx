import { Issue } from "../../interfaces/Issue";
import { getLocalStorageItem } from "../../lib/localStorage";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import slugify from "slugify";

interface IssuesListProps {
	passedIssues?: Issue[] | [];
}

export default function IssuesList({ passedIssues = [] }: IssuesListProps) {
	const issues: Issue[] = passedIssues.length ? passedIssues : getIssues();

	function getIssues(): Issue[] | [] {
		const storedIssues = getLocalStorageItem("issues");
		if (storedIssues) return storedIssues;
		return [];
	}

	if (!issues || (issues && !issues.length))
		return (
			<p className="text-center text-danger my-3">
				There are no issues stored in local storage. Add one!
			</p>
		);

	return (
		<Table striped bordered hover responsive className="mt-3">
			<thead>
				<tr>
					<th>Title</th>
					{!passedIssues.length ? <th>Project</th> : null}
					<th>Description</th>
					<th>Type</th>
					<th>Priority</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{issues.map((issue) => (
					<tr key={issue.title}>
						<td>{issue.title}</td>
						{!passedIssues.length ? (
							<td>
								<Link
									to={"/projects/" + slugify(issue.project, { lower: true })}
								>
									{issue.project}
								</Link>
							</td>
						) : null}
						<td>{issue.description}</td>
						<td className={issue.type === "bug" ? "text-danger" : ""}>
							{issue.type}
						</td>
						<td
							className={
								issue.priority === "high"
									? "text-danger"
									: issue.priority === "medium"
									? "text-warning"
									: "text-success"
							}
						>
							{issue.priority}
						</td>
						<td
							className={
								issue.status === "open" ? "text-success" : "text-danger"
							}
						>
							{issue.status}
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
