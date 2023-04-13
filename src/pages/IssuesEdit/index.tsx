import { useNavigate, useParams } from "react-router-dom";
import useIssues from "../../context/useIssues";
import PageHeader from "../../components/Layout/PageHeader";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {
	Issue,
	IssuePriority,
	IssueStatus,
	IssueType,
	issuePriorities,
	issueStatuses,
	issueTypes,
} from "../../interfaces/Issue";
import useTheme from "../../context/useTheme";
import { useState, useEffect } from "react";
import logError from "../../lib/logError";
import useProjects from "../../context/useProjects";

export default function IssuesEdit() {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const { issueId } = useParams();
	const { issues, updateIssue } = useIssues();
	const issueToUpdate = issues.find((i) => i.id === issueId);
	const [updatedIssue, setUpdatedIssue] = useState<Issue | null>(null);
	const { projects } = useProjects();

	async function handleIssueUpdate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!issueToUpdate || !updatedIssue || !issueId)
			return logError(
				"No issue or issue data provided... Cannot update issue."
			);

		if (!updatedIssue.projectId)
			return logError("No project selected... Cannot update issue.");

		await updateIssue(updatedIssue);
		alert(`Your issue with the id ${issueId} was successfully updated.`);
		navigate(-1);
	}

	useEffect(() => {
		if (issueToUpdate) {
			setUpdatedIssue(issueToUpdate);
		} else {
			setUpdatedIssue(null);
		}
	}, [issueToUpdate]);

	if (!issueToUpdate || !updatedIssue || !issueId)
		return (
			<p className="text-center">
				No issue or issue data provided... Cannot update issue.
			</p>
		);

	return (
		<>
			<PageHeader pageTitle="Update issue" />

			<Form className="my-3" onSubmit={handleIssueUpdate}>
				<FloatingLabel label="Project" className="mb-3">
					<Form.Select
						value={updatedIssue.projectId}
						onChange={(e) =>
							setUpdatedIssue({ ...updatedIssue, projectId: e.target.value })
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						required
					>
						<option value="">Select project</option>
						{projects.map((project) => (
							<option value={project.id} key={project.id}>
								{project.title}
							</option>
						))}
					</Form.Select>
				</FloatingLabel>

				<FloatingLabel label="Issue short title" className="mb-3">
					<Form.Control
						value={updatedIssue.title}
						placeholder="Type issue title here"
						onChange={(e) =>
							setUpdatedIssue({ ...updatedIssue, title: e.target.value })
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						required
					/>
				</FloatingLabel>

				<FloatingLabel label="Issue description" className="mb-3">
					<Form.Control
						as="textarea"
						value={updatedIssue.description}
						placeholder="Type issue description here"
						style={{
							height: "100px",
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) =>
							setUpdatedIssue({ ...updatedIssue, description: e.target.value })
						}
					/>
				</FloatingLabel>

				<FloatingLabel label="Issue type" className="mb-3">
					<Form.Select
						value={updatedIssue.type}
						onChange={(e) =>
							setUpdatedIssue({
								...updatedIssue,
								type: e.target.value as IssueType,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						{issueTypes.map((type) => (
							<option value={type} key={type}>
								{type}
							</option>
						))}
					</Form.Select>
				</FloatingLabel>

				<FloatingLabel label="Issue priority" className="mb-3">
					<Form.Select
						value={updatedIssue.priority}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) =>
							setUpdatedIssue({
								...updatedIssue,
								priority: e.target.value as IssuePriority,
							})
						}
					>
						{issuePriorities.map((priority) => (
							<option value={priority} key={priority}>
								{priority}
							</option>
						))}
					</Form.Select>
				</FloatingLabel>

				<FloatingLabel label="Issue status" className="mb-3">
					<Form.Select
						value={updatedIssue.status}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) =>
							setUpdatedIssue({
								...updatedIssue,
								status: e.target.value as IssueStatus,
							})
						}
					>
						{issueStatuses.map((status) => (
							<option value={status} key={status}>
								{status}
							</option>
						))}
					</Form.Select>
				</FloatingLabel>

				<div className="d-grid gap-2">
					<Button variant="primary" type="submit">
						update issue
					</Button>
				</div>
			</Form>
		</>
	);
}
