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
	const { issues, updateIssues, updateIssue, deleteIssue, findIssueById } =
		useIssues();
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

		const issueBeforeUpdates = findIssueById(updatedIssue.id);

		if (!issueBeforeUpdates) return;

		const wasIssueOpenOrInProgress =
			issueBeforeUpdates.status === "open" ||
			issueBeforeUpdates.status === "in progress";
		const isIssueOpenOrInProgress =
			updatedIssue.status === "open" || updatedIssue.status === "in progress";

		if (
			updatedIssue.ordered &&
			wasIssueOpenOrInProgress &&
			!isIssueOpenOrInProgress
		) {
			// if ordered issue was closed:
			// de facto convert issue into unordered:

			const closeTime = Date.now();

			const closedUpdatedIssue: Issue.AppIssue = {
				...updatedIssue,
				closedAt: closeTime,
				updated: closeTime,
				ordered: false,
				after: null,
				before: null,
			};

			const issueAfter = issueBeforeUpdates.after
				? issues.find((i) => i.id === issueBeforeUpdates.after)
				: null;

			const issueBefore = issueBeforeUpdates.before
				? issues.find((i) => i.id === issueBeforeUpdates.before)
				: null;

			const issueAfterUpdated: Issue.AppIssue | null = issueAfter
				? {
						...issueAfter,
						before: issueBeforeUpdates.before,
						updated: closeTime,
				  }
				: null;

			const issueBeforeUpdated: Issue.AppIssue | null = issueBefore
				? {
						...issueBefore,
						after: issueBeforeUpdates.after,
						updated: closeTime,
				  }
				: null;

			const updatedIssuesArray: Issue.AppIssue[] = [
				closedUpdatedIssue,
				...(issueAfterUpdated ? [issueAfterUpdated] : []),
				...(issueBeforeUpdated ? [issueBeforeUpdated] : []),
			];

			try {
				await updateIssues({ update: updatedIssuesArray });

				console.log(
					"issues were updated succsessfully after closing and ordered issues:",
					updatedIssuesArray
				);
				alert(`Your issue with the id ${issueId} was successfully updated.`);
				navigate(-1);
			} catch (error: any) {
				console.error(error);
				alert(error);
			}
		} else {
			try {
				await updateIssue(updatedIssue);

				alert(`Your issue with the id ${issueId} was successfully updated.`);
				navigate(-1);
			} catch (error: any) {
				console.error(error);
				alert(error);
			}
		}
	}

	async function handleDeleteIssue() {
		if (!issueId)
			return alert("No issue id was provided... Cannot delete issue.");

		if (!updatedIssue || !updatedIssue.projectId)
			return alert("No project id was provided... Cannot delete issue.");

		if (
			window.confirm(
				"Are you sure you want to delete this issue permanently? This action can not be undone!"
			)
		) {
			await deleteIssue(updatedIssue.id, updatedIssue.projectId);
			alert(`Your issue with the id ${issueId} was successfully deleted.`);
			navigate(-1); // maybe add checking if there is prev page
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
						<FloatingLabel label="feature" className="mb-3">
							<Form.Select
								value={updatedIssue.feature}
								onChange={(e) =>
									setUpdatedIssue({
										...updatedIssue,
										feature: e.target.value,
									})
								}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
							>
								<option value="">feature</option>
								{projects
									.find((p) => p.id === updatedIssue.projectId)
									?.features?.map((f) => (
										<option value={f} key={f}>
											{f}
										</option>
									))}
							</Form.Select>
						</FloatingLabel>
					</Col>

					<Col xs={12} md={true} className="mb-2">
						<FloatingLabel label="page" className="mb-3">
							<Form.Select
								value={updatedIssue.page}
								onChange={(e) =>
									setUpdatedIssue({
										...updatedIssue,
										page: e.target.value,
									})
								}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
							>
								<option value="">page</option>
								{projects
									.find((p) => p.id === updatedIssue.projectId)
									?.pages?.map((p) => (
										<option value={p} key={p}>
											{p}
										</option>
									))}
							</Form.Select>
						</FloatingLabel>
					</Col>

					<Col xs={12} md={true} className="mb-2">
						<FloatingLabel label="component" className="mb-3">
							<Form.Select
								value={updatedIssue.component}
								onChange={(e) =>
									setUpdatedIssue({
										...updatedIssue,
										component: e.target.value,
									})
								}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
							>
								<option value="">component</option>
								{projects
									.find((p) => p.id === updatedIssue.projectId)
									?.components?.map((c) => (
										<option value={c} key={c}>
											{c}
										</option>
									))}
							</Form.Select>
						</FloatingLabel>
					</Col>
				</Row>

				<Row>
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
								<option value="">Estimated time</option>
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
								<option value="">Difficulty</option>
								{Issue.allowedLevels.map((level) => (
									<option value={level} key={"difficulty-" + level}>
										{level}
									</option>
								))}
							</Form.Select>
						</FloatingLabel>
					</Col>

					<Col xs={12} md="auto" className="mb-2">
						<FloatingLabel label="status" className="mb-3">
							<Form.Select
								value={updatedIssue.status}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
								onChange={(e) =>
									setUpdatedIssue({
										...updatedIssue,
										status: e.target.value as Issue.Status,
									})
								}
							>
								{Issue.allowedStatuses.map((level) => (
									<option value={level} key={"status-" + level}>
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
						onClick={handleDeleteIssue}
					>
						delete issue
					</Button>
				</div>
			</Form>
		</>
	);
}
