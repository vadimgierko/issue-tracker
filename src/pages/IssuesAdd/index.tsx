import { useNavigate, useParams } from "react-router-dom";
import useIssues from "../../context/useIssues";
import PageHeader from "../../components/Layout/PageHeader";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Issue } from "../../interfaces/Issue";
import useTheme from "../../context/useTheme";
import { useState, useEffect } from "react";
import logError from "../../lib/logError";
import useProjects from "../../context/useProjects";
import MarkdownTextAreaField from "../../components/MarkdownTextAreaField";
import { Col, Row } from "react-bootstrap";

const emptyIssue: Issue.FormData = {
	projectId: "",
	title: "",
	description: "",
	type: "",
	importance: "",
	urgency: "",
	estimatedTime: "",
	difficulty: "",
	status: "open",
};

export default function IssuesAdd() {
	const { theme } = useTheme();
	const params = useParams();

	const { projectId, ordered, after, before, parent } = useParams();
	const navigate = useNavigate();
	const [issueData, setIssueData] = useState<Issue.FormData>(emptyIssue);
	const { projects } = useProjects();
	const { addIssue } = useIssues();

	async function handleAddIssue(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		console.log("/issues/add params:", params);
		console.log();

		if (!issueData)
			return logError("No issue data provided... Cannot add issue.");

		if (!issueData.projectId)
			return logError("No project selected... Cannot add issue.");

		const addedIssueId = await addIssue(
			issueData,
			issueData.projectId,
			ordered === "true" ? true : false,
			after ? (after === "null" ? null : after) : null,
			before ? (before === "null" ? null : before) : null,
			parent ? (parent === "null" ? null : parent) : null
		);
		alert(`Your issue was successfully added with the id ${addedIssueId}.`);
		clearForm();
		navigate(-1);
	}

	function clearForm() {
		setIssueData(emptyIssue);
	}

	useEffect(() => {
		if (projectId) {
			setIssueData({ ...emptyIssue, projectId });
		}
	}, [projectId]);

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
						disabled={projectId && projectId !== "null" ? true : false}
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

				<Row>
					<Col xs={12} md="auto" className="mb-2">
						<FloatingLabel label="type" className="mb-3">
							<Form.Select
								value={issueData.type}
								onChange={(e) =>
									setIssueData({
										...issueData,
										type: e.target.value as Issue.Type,
									})
								}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
							>
								{Issue.allowedTypeValues.map((type) => (
									<option value={type} key={type}>
										{type}
									</option>
								))}
							</Form.Select>
						</FloatingLabel>
					</Col>

					<Col xs={12} md={true} className="mb-2">
						<FloatingLabel label="importance" className="mb-3">
							<Form.Select
								value={issueData.importance}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
								onChange={(e) =>
									setIssueData({
										...issueData,
										importance: e.target.value as Issue.Importance,
									})
								}
							>
								{Issue.allowedLevels.map((level) => (
									<option value={level} key={"importance-" + level}>
										{level}
									</option>
								))}
							</Form.Select>
						</FloatingLabel>
					</Col>

					<Col xs={12} md={true} className="mb-2">
						<FloatingLabel label="urgency" className="mb-3">
							<Form.Select
								value={issueData.urgency}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
								onChange={(e) =>
									setIssueData({
										...issueData,
										urgency: e.target.value as Issue.Urgency,
									})
								}
							>
								{Issue.allowedLevels.map((level) => (
									<option value={level} key={"urgency-" + level}>
										{level}
									</option>
								))}
							</Form.Select>
						</FloatingLabel>
					</Col>

					<Col xs={12} md={true} className="mb-2">
						<FloatingLabel label="estimated time" className="mb-3">
							<Form.Select
								value={issueData.estimatedTime}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
								onChange={(e) =>
									setIssueData({
										...issueData,
										estimatedTime: e.target.value as Issue.EstimatedTime,
									})
								}
							>
								{Issue.allowedLevels.map((level) => (
									<option value={level} key={"estimated-time-" + level}>
										{level}
									</option>
								))}
							</Form.Select>
						</FloatingLabel>
					</Col>

					<Col xs={12} md={true} className="mb-2">
						<FloatingLabel label="difficulty" className="mb-3">
							<Form.Select
								value={issueData.difficulty}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
								onChange={(e) =>
									setIssueData({
										...issueData,
										difficulty: e.target.value as Issue.Difficulty,
									})
								}
							>
								{Issue.allowedLevels.map((level) => (
									<option value={level} key={"difficulty-" + level}>
										{level}
									</option>
								))}
							</Form.Select>
						</FloatingLabel>
					</Col>
				</Row>

				<div className="d-grid gap-2">
					<Button variant="primary" type="submit">
						add issue
					</Button>
				</div>
			</Form>
		</>
	);
}
