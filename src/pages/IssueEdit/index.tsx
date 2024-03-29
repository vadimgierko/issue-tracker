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

export default function IssueEdit() {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const { issueId } = useParams();
	const { issues, updateIssueData, deleteIssue } = useIssues();
	const issueToUpdate = issues.find((i) => i.id === issueId);
	const [updatedIssue, setUpdatedIssue] = useState<Issue.AppIssue | null>(null);
	const { projects } = useProjects();

	async function handleIssueUpdate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!issueToUpdate || !updatedIssue || !issueId)
			return logError(
				"No issue or issue data provided... Cannot update issue."
			);

		if (!updatedIssue.projectId)
			return logError("No project selected... Cannot update issue.");

		try {
			await updateIssueData(updatedIssue);
			navigate(-1);
		} catch (error: any) {
			console.error(error);
			alert(error);
		}
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
						disabled
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

				<MarkdownTextAreaField
					label="Issue description"
					value={updatedIssue.description}
					placeholder="Type issue description here"
					formGroupClassName="mb-3"
					formControlClassName="mb-3"
					onChange={(value: string) =>
						setUpdatedIssue({ ...updatedIssue, description: value })
					}
					required={false}
				/>

				<Row>
					<Col xs={12} md="auto" className="mb-2">
						<FloatingLabel label="type" className="mb-3">
							<Form.Select
								value={updatedIssue.type}
								onChange={(e) =>
									setUpdatedIssue({
										...updatedIssue,
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
								value={updatedIssue.importance}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
								onChange={(e) =>
									setUpdatedIssue({
										...updatedIssue,
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
								value={updatedIssue.urgency}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
								onChange={(e) =>
									setUpdatedIssue({
										...updatedIssue,
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
								value={
									updatedIssue.estimatedTime ? updatedIssue.estimatedTime : ""
								}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
								onChange={(e) =>
									setUpdatedIssue({
										...updatedIssue,
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
								value={updatedIssue.difficulty ? updatedIssue.difficulty : ""}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
								onChange={(e) =>
									setUpdatedIssue({
										...updatedIssue,
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
						update issue
					</Button>

					<Button
						variant="secondary"
						type="button"
						onClick={() => {
							// clear edit data:
							setUpdatedIssue(issueToUpdate);

							navigate(-1);
						}}
					>
						cancel
					</Button>
					<hr />
					<Button
						type="button"
						variant="outline-danger"
						onClick={() => {
							deleteIssue(issueToUpdate).then(() => {
								setUpdatedIssue(null);
								navigate(-1);
							});
						}}
					>
						delete issue
					</Button>
				</div>
			</Form>
		</>
	);
}
