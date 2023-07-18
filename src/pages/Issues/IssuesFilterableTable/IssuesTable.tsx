import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import { Link, useNavigate, useParams } from "react-router-dom";
import useProjects from "../../../context/useProjects";
import useTheme from "../../../context/useTheme";
import { Issue } from "../../../interfaces/Issue";
import {
	BsTrash,
	BsPencilSquare,
	BsEye,
	BsCheck2Square,
	BsRocketTakeoff,
	BsThreeDotsVertical,
} from "react-icons/bs";
import getDate from "../../../lib/getDate";
import useIssues from "../../../context/useIssues";
import { Dropdown } from "react-bootstrap";
import { VscIssueReopened } from "react-icons/vsc";

type IssuesTableProps = {
	issues: Issue.AppIssue[];
};

export default function IssuesTable({ issues }: IssuesTableProps) {
	const { theme } = useTheme();
	const { projects } = useProjects();
	const { projectId } = useParams();
	const {
		deleteIssue,
		reopenIssue,
		resolveIssue,
		setToInProgressIssue,
		findAllIssueChidren,
	} = useIssues();

	// all issues have same status,
	// because they are filtered by status via issue table tabs:
	const issuesStatus: Issue.Status = issues[0].status; // needed for conditional rendering

	const navigate = useNavigate();

	return (
		<Table striped bordered hover responsive className="mt-3" variant={theme}>
			<thead>
				<tr>
					<th>
						<BsThreeDotsVertical />
					</th>
					<th>Title</th>
					{!projectId && <th>Project</th>}
					<th>Rank</th>
					<th>Importance</th>
					<th>Urgency</th>
					<th>Estimated time</th>
					<th>Difficulty</th>
				</tr>
			</thead>
			<tbody>
				{issues.map((issue) => (
					<tr key={issue.id}>
						<td>
							<Dropdown className="ms-2">
								<Dropdown.Toggle as="a" variant="outline-secondary" />

								<Dropdown.Menu>
									{issue.status && issue.status === "open" && (
										<Dropdown.Item onClick={() => setToInProgressIssue(issue)}>
											<BsRocketTakeoff />{" "}
											<span className="text-primary">in progress...</span>
										</Dropdown.Item>
									)}

									{issue.status &&
									(issue.status === "open" ||
										issue.status === "in progress") ? (
										<Dropdown.Item onClick={() => resolveIssue(issue)}>
											<BsCheck2Square className="text-success" />{" "}
											<span className="text-success">resolve</span>
										</Dropdown.Item>
									) : (
										<Dropdown.Item onClick={() => reopenIssue(issue)}>
											<VscIssueReopened /> <span>reopen</span>
										</Dropdown.Item>
									)}

									<Dropdown.Divider />

									<Dropdown.Item
										onClick={() => navigate("/issues/" + issue.id)}
									>
										<BsEye /> view
									</Dropdown.Item>

									<Dropdown.Item
										onClick={() => navigate("/issues/" + issue.id + "/edit")}
									>
										<BsPencilSquare /> edit
									</Dropdown.Item>

									<Dropdown.Item onClick={() => deleteIssue(issue)}>
										<BsTrash className="text-danger" />{" "}
										<span className="text-danger">delete</span>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</td>
						<td>
							{issue.title}{" "}
							{issue.children && issue.children.length ? (
								<Badge
									bg={theme === "dark" ? "light" : "dark"}
									className={`me-1 text-${theme}`}
								>
									{
										findAllIssueChidren(issue).filter(
											(i) => i.status !== "open" && i.status !== "in progress"
										).length
									}
									/{findAllIssueChidren(issue).length}
								</Badge>
							) : (
								""
							)}{" "}
							<Badge
								bg={issue.type === "bug" ? "danger" : "primary"}
								className="me-1"
							>
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
						<td>{issue.rank}/90</td>
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
					</tr>
				))}
			</tbody>
		</Table>
	);
}
