import { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Issue } from "../../../interfaces/Issue";
import useTheme from "../../../context/useTheme";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineFilter } from "react-icons/ai";
import useProjects from "../../../context/useProjects";
import { useParams } from "react-router-dom";
import { Project } from "../../../interfaces/Project";

type IssuesFilterFormProps = {
	filterFormData: Issue.FilterFormData;
	setFilterFormData: React.Dispatch<React.SetStateAction<Issue.FilterFormData>>;
	resetFilterFormData: () => void;
};

export interface IssueRealtedFilterFormData {
	type: Issue.Type | "";
	urgency: Issue.Urgency | "";
	importance: Issue.Importance | "";
	estimatedTime: Issue.EstimatedTime | "";
	difficulty: Issue.Difficulty | "";
}

export interface ProjectRealtedFilterFormData {
	feature: string | "";
	page: string | "";
	component: string | "";
}

export default function IssuesFilterForm({
	filterFormData,
	setFilterFormData,
	resetFilterFormData,
}: IssuesFilterFormProps) {
	const { theme } = useTheme();
	const { projects } = useProjects();
	const { projectId } = useParams();

	const [issueRealtedFilterFormData, setIssueRealtedFilterFormData] =
		useState<IssueRealtedFilterFormData>({
			type: filterFormData.type,
			urgency: filterFormData.urgency,
			importance: filterFormData.importance,
			estimatedTime: filterFormData.estimatedTime,
			difficulty: filterFormData.difficulty,
		});

	const [projectReleatedFilterFormData, setProjectReleatedFilterFormData] =
		useState<ProjectRealtedFilterFormData>({
			feature: filterFormData.feature,
			page: filterFormData.page,
			component: filterFormData.component,
		});

	useEffect(() => {
		setFilterFormData({
			...issueRealtedFilterFormData,
			...projectReleatedFilterFormData,
		});
	}, [issueRealtedFilterFormData, projectReleatedFilterFormData]);

	// Prev Form className="border border-secondary rounded mb-3 p-1"
	return (
		<Form>
			<Row
				className="justify-content-md-center align-items-center justify-content-xs-start"
				xs="auto"
			>
				{Object.keys(issueRealtedFilterFormData).map((key) => (
					<Col key={key + "-filter"} className="mb-3">
						<FloatingLabel
							label={
								key === "estimatedTime" ? (
									<span>
										<AiOutlineFilter /> estimated time
									</span>
								) : (
									<span>
										<AiOutlineFilter /> {key}
									</span>
								)
							}
						>
							<Form.Select
								value={
									issueRealtedFilterFormData[
										key as keyof IssueRealtedFilterFormData
									]
								}
								onChange={(e) =>
									setIssueRealtedFilterFormData({
										...issueRealtedFilterFormData,
										[key as keyof IssueRealtedFilterFormData]: e.target.value,
									})
								}
								style={{
									backgroundColor:
										theme === "light" ? "white" : "rgb(13, 17, 23)",
									color: theme === "light" ? "black" : "white",
								}}
							>
								<option value="">
									{key === "estimatedTime" ? "estimated time" : key}
								</option>

								{Issue[
									`allowed${
										key.charAt(0).toUpperCase() + key.slice(1)
									}Values` as keyof typeof Issue
								].map((allowedValue) => (
									<option value={allowedValue} key={key + "-" + allowedValue}>
										{allowedValue}
									</option>
								))}
							</Form.Select>
						</FloatingLabel>
					</Col>
				))}
			</Row>

			{projectId && (
				<Row
					className="justify-content-md-center align-items-center justify-content-xs-start"
					xs="auto"
				>
					{Object.keys(projectReleatedFilterFormData).map((key) => (
						<Col key={key + "-filter"} className="mb-3">
							<FloatingLabel
								label={
									<span>
										<AiOutlineFilter /> {key}
									</span>
								}
							>
								<Form.Select
									value={
										projectReleatedFilterFormData[
											key as keyof ProjectRealtedFilterFormData
										]
									}
									onChange={(e) =>
										setProjectReleatedFilterFormData({
											...projectReleatedFilterFormData,
											[key as keyof ProjectRealtedFilterFormData]:
												e.target.value,
										})
									}
									style={{
										backgroundColor:
											theme === "light" ? "white" : "rgb(13, 17, 23)",
										color: theme === "light" ? "black" : "white",
									}}
								>
									<option value="">{key}</option>

									{key === "feature" &&
										projects
											.find((p) => p.id === projectId)
											?.features?.map((p) => (
												<option value={p} key={p}>
													{p}
												</option>
											))}

									{key === "page" &&
										projects
											.find((p) => p.id === projectId)
											?.pages?.map((p) => (
												<option value={p} key={p}>
													{p}
												</option>
											))}

									{key === "component" &&
										projects
											.find((p) => p.id === projectId)
											?.components?.map((p) => (
												<option value={p} key={p}>
													{p}
												</option>
											))}
								</Form.Select>
							</FloatingLabel>
						</Col>
					))}

					<Col>
						<Button
							variant="secondary"
							type="button"
							onClick={() => {
								resetFilterFormData();
								// TODO: REFACTOR THIS:
								setIssueRealtedFilterFormData({
									type: "",
									urgency: "",
									importance: "",
									estimatedTime: "",
									difficulty: "",
								});

								setProjectReleatedFilterFormData({
									feature: "",
									page: "",
									component: "",
								});
							}}
						>
							<MdOutlineCancel />
						</Button>
					</Col>
				</Row>
			)}
		</Form>
	);
}
