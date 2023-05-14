import { useParams, Link } from "react-router-dom";
import useIssues from "../../../context/useIssues";
import { AiOutlinePlusSquare } from "react-icons/ai";
import IssuesFilterableTable from "../../Issues/IssuesFilterableTable";

export default function ProjectIssues() {
	const { projectId } = useParams<string>();
	const { issues } = useIssues();
	const projectIssues = issues.filter((i) => i.projectId === projectId);

	return (
		<>
			<h2 className="text-center">
				Issues ({projectIssues.length}){" "}
				<Link to="add-issue">
					<AiOutlinePlusSquare />
				</Link>
			</h2>

			{projectIssues.length ? (
				<IssuesFilterableTable issues={projectIssues} />
			) : (
				<p className="text-center">
					There are no issues in the project.{" "}
					<Link to="/issues/add">Add one!</Link>
				</p>
			)}
		</>
	);
}
