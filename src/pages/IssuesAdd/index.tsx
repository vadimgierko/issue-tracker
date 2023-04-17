import { useNavigate } from "react-router-dom";
import useIssues from "../../context/useIssues";
import PageHeader from "../../components/Layout/PageHeader";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {
	IssueData,
	IssuePriority,
	IssueType,
	issuePriorities,
	issueTypes,
} from "../../interfaces/Issue";
import useTheme from "../../context/useTheme";
import { useState } from "react";
import logError from "../../lib/logError";
import useProjects from "../../context/useProjects";
import MarkdownTextAreaField from "../../components/MarkdownTextAreaField";

const emptyIssue: IssueData = {
	title: "",
	description: "",
	projectId: "",
	type: "bug",
	priority: "high",
	status: "open",
};

export default function IssuesAdd() {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const [issueData, setIssueData] = useState<IssueData>(emptyIssue);
	const { projects } = useProjects();
	const { addIssue } = useIssues();

	async function handleAddIssue(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!issueData)
			return logError("No issue data provided... Cannot add issue.");

		if (!issueData.projectId)
			return logError("No project selected... Cannot add issue.");

		const addedIssueId = await addIssue(issueData, issueData.projectId);
		alert(`Your issue was successfully added with the id ${addedIssueId}.`);
		clearForm();
		navigate(-1);
	}

	function clearForm() {
		setIssueData(emptyIssue);
	}

	if (!projects || !projects.length)
		return (
			<>
				<PageHeader pageTitle="Add issue" />
				<p className="text-center">
					There are no project to add issue to... Add some project first, then
					add an issue!
				</p>
			</>
		);

	return (
		<>
			<PageHeader pageTitle="Add issue" />

			<Form className="my-3" onSubmit={handleAddIssue}>
				<FloatingLabel label="Project" className="mb-3">
					<Form.Select
						value={issueData.projectId}
						onChange={(e) =>
							setIssueData({ ...issueData, projectId: e.target.value })
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
						value={issueData.title}
						placeholder="Type issue title here"
						onChange={(e) =>
							setIssueData({ ...issueData, title: e.target.value })
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						required
					/>
				</FloatingLabel>

				<MarkdownTextAreaField
					label="Issue description"
					value={issueData.description}
					placeholder="Type issue description here"
					formGroupClassName="mb-3"
					formControlClassName="mb-3"
					onChange={(value: string) =>
						setIssueData({ ...issueData, description: value })
					}
				/>

				<FloatingLabel label="Issue type" className="mb-3">
					<Form.Select
						value={issueData.type}
						onChange={(e) =>
							setIssueData({ ...issueData, type: e.target.value as IssueType })
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
						value={issueData.priority}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) =>
							setIssueData({
								...issueData,
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

				<div className="d-grid gap-2">
					<Button variant="primary" type="submit">
						add issue
					</Button>
				</div>
			</Form>
		</>
	);
}
