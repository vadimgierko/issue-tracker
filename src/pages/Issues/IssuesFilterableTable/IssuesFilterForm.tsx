import { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Issue } from "../../../interfaces/Issue";
import useTheme from "../../../context/useTheme";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineFilter } from "react-icons/ai";

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

	const [issueRealtedFilterFormData, setIssueRealtedFilterFormData] =
		useState<IssueRealtedFilterFormData>({
			type: filterFormData.type,
			urgency: filterFormData.urgency,
			importance: filterFormData.importance,
			estimatedTime: filterFormData.estimatedTime,
			difficulty: filterFormData.difficulty,
		});

	useEffect(() => {
		setFilterFormData({
			...issueRealtedFilterFormData,
		});
	}, [issueRealtedFilterFormData]);

	// Prev Form className="border border-secondary rounded mb-3 p-1"
	return (
		<Form className="do-not-display-when-print">
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
						}}
					>
						<MdOutlineCancel />
					</Button>
				</Col>
			</Row>
		</Form>
	);
}
