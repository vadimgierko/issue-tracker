import Table from "react-bootstrap/Table";
import { Link, useParams } from "react-router-dom";
import useProjects from "../../context/useProjects";
import useTheme from "../../context/useTheme";
import { Issue } from "../../interfaces/Issue";
import { BsTrash, BsPencilSquare } from "react-icons/bs";

type IssuesTableProps = {
	issues: Issue[];
};

export default function IssuesTable({ issues }: IssuesTableProps) {
	const { theme } = useTheme();
	const { projects } = useProjects();
	const { projectId } = useParams();

	return (
		<Table striped bordered hover responsive className="mt-3" variant={theme}>
			<thead>
				<tr>
					<th>Title</th>
					{!projectId && <th>Project</th>}
					<th>Description</th>
					<th>Type</th>
					<th>Priority</th>
					<th>Status</th>
					<th>Update</th>
					{/* <th>Delete</th> */}
				</tr>
			</thead>
			<tbody>
				{issues.map((issue) => (
					<tr key={issue.id}>
						<td>{issue.title}</td>
						{!projectId && (
							<td>
								<Link to={"/projects/" + issue.projectId}>
									{projects.find((p) => p.id === issue.projectId)?.title}
								</Link>
							</td>
						)}
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
						<td>
							<Link to={"/issues/" + issue.id + "/edit"}>
								<BsPencilSquare />
							</Link>
						</td>
						{/* <td><BsTrash className="text-danger" /></td> */}
					</tr>
				))}
			</tbody>
		</Table>
	);
}
