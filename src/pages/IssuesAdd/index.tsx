import { useNavigate, useParams } from "react-router-dom";
import useIssues from "../../context/useIssues";
import PageHeader from "../../components/Layout/PageHeader";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {
	IssueData,
	IssueImportance,
	IssueType,
	IssueUrgency,
	issueImportance,
	issueTypes,
	issueUrgency,
} from "../../interfaces/Issue";
import useTheme from "../../context/useTheme";
import { useState } from "react";
import logError from "../../lib/logError";
import useProjects from "../../context/useProjects";
import MarkdownTextAreaField from "../../components/MarkdownTextAreaField";

const emptyIssue: IssueData = {
	projectId: "",
	title: "",
	description: "",
	type: "improvement",
	importance: "high",
	urgency: "high",
	status: "open",
};

export default function IssuesAdd() {
	const { theme } = useTheme();
	// we need to check, if there is projectId in the link
	// (check if we were redirected from project page to add an issue)
	// to set projectId in new issue:
	const { projectId } = useParams();
	const navigate = useNavigate();
	const [issueData, setIssueData] = useState<IssueData>(
		projectId ? { ...emptyIssue, projectId } : emptyIssue
	);
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
					required={false}
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

				<FloatingLabel label="Issue importance" className="mb-3">
					<Form.Select
						value={issueData.importance}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) =>
							setIssueData({
								...issueData,
								importance: e.target.value as IssueImportance,
							})
						}
					>
						{issueImportance.map((importance) => (
							<option value={importance} key={"importance-" + importance}>
								{importance}
							</option>
						))}
					</Form.Select>
				</FloatingLabel>

				<FloatingLabel label="Issue urgency" className="mb-3">
					<Form.Select
						value={issueData.urgency}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) =>
							setIssueData({
								...issueData,
								urgency: e.target.value as IssueUrgency,
							})
						}
					>
						{issueUrgency.map((urgency) => (
							<option value={urgency} key={"urgency-" + urgency}>
								{urgency}
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
