import { useParams, Link, useNavigate } from "react-router-dom";
import useProjects from "../../context/useProjects";
import PageHeader from "../../components/Layout/PageHeader";
import { Button, Badge } from "react-bootstrap";
import useIssues from "../../context/useIssues";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import IssueTable from "./IssueTable";

export default function Issue() {
	const { issueId } = useParams<string>();
	const { projects } = useProjects();
	const { issues, deleteIssue } = useIssues();
	const issue = issues.find((i) => i.id === issueId);
	const project = projects.find((p) => p.id === issue?.projectId);
	const navigate = useNavigate();

	async function handleDeleteIssue() {
		if (!issueId)
			return alert("No issue id was provided... Cannot delete issue.");

		if (!issue || !issue.projectId)
			return alert("No project id was provided... Cannot delete issue.");

		await deleteIssue(issue.id, issue.projectId);
		alert(`Your issue with the id ${issueId} was successfully deleted.`);
		navigate(-1); // maybe add checking if there is prev page
	}

	if (!issue || !issueId)
		return <p className="text-center text-danger">There is no such issue...</p>;

	if (!project)
		return (
			<p className="text-center text-danger">There is no issue project...</p>
		);

	return (
		<>
			<PageHeader
				pageTitle={
					<>
						{issue.title}{" "}
						<Badge bg={issue.type === "bug" ? "danger" : "primary"}>
							{issue.type}
						</Badge>
					</>
				}
			>
				<div className="text-center">
					<p>
						<Badge bg={issue.type === "bug" ? "danger" : "primary"}>
							{issue.type}
						</Badge>{" "}
						in <Link to={"/projects/" + project.id}>{project.title}</Link>
					</p>
					<div className="mt-3">
						<Link to={"/issues/" + issueId + "/edit"}>
							<Button variant="primary">edit issue</Button>
						</Link>
						<Button
							variant="danger"
							onClick={handleDeleteIssue}
							className="ms-2"
						>
							delete issue
						</Button>
					</div>
				</div>
			</PageHeader>

			<section className="issue-details">
				<IssueTable issue={issue} />

				<h2>Description</h2>
				<hr />
				<MarkdownRenderer markdown={issue.description} />
			</section>
		</>
	);
}
