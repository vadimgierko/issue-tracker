import useIssues from "../../context/useIssues";
import { Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import useProjects from "../../context/useProjects";
import PageHeader from "../../components/Layout/PageHeader";
import useTheme from "../../context/useTheme";

export default function Issues() {
	const { issues, loading } = useIssues();
	const { projects } = useProjects();
	const { theme } = useTheme();

	function Loading() {
		return (
			<div className="text-center">
				<Spinner />
			</div>
		);
	}

	function IssuesTable() {
		return (
			<Table striped bordered hover responsive className="mt-3" variant={theme}>
				<thead>
					<tr>
						<th>Title</th>
						<th>Project</th>
						<th>Description</th>
						<th>Type</th>
						<th>Priority</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{issues.map((issue) => (
						<tr key={issue.id}>
							<td>{issue.title}</td>
							<td>
								<Link to={"/projects/" + issue.projectId}>
									{projects.find((p) => p.id === issue.projectId)?.title}
								</Link>
							</td>
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
										: "text-secondary"
								}
							>
								{issue.priority}
							</td>
							<td>{issue.status}</td>
						</tr>
					))}
				</tbody>
			</Table>
		);
	}

	function NoIssues() {
		return <p className="text-center">There are no issues... Add one!</p>;
	}

	return (
		<>
			<PageHeader pageTitle="Issues">
				<div className="text-center my-3">
					<Link to="/issues/add">
						<Button className="primary">Add Issue</Button>
					</Link>
				</div>
			</PageHeader>

			{loading ? (
				<Loading />
			) : issues && issues.length ? (
				<IssuesTable />
			) : (
				<NoIssues />
			)}
		</>
	);
}
