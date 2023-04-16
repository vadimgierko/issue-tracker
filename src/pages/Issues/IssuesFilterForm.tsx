import { Button, Col, Form, Row } from "react-bootstrap";
import {
	IssuePriority,
	IssueStatus,
	IssueType,
	IssuesFilterData,
	issuePriorities,
	issueStatuses,
	issueTypes,
} from "../../interfaces/Issue";
import { useState } from "react";
import useTheme from "../../context/useTheme";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

type IssuesFilterFormProps = {
	onSubmit: (filterData: IssuesFilterData) => void;
};
const initFilterData: IssuesFilterData = {
	type: "",
	priority: "",
	status: "",
};

export default function IssuesFilterForm({ onSubmit }: IssuesFilterFormProps) {
	const { theme } = useTheme();
	const [filterData, setFilterData] =
		useState<IssuesFilterData>(initFilterData);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log("Filter data:", filterData);
		onSubmit(filterData);
	}

	function handleReset() {
		setFilterData(initFilterData);
		onSubmit(initFilterData);
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Row
				className="justify-content-md-center justify-content-xs-start"
				xs="auto"
			>
				<Col className="mb-2">
					<Form.Select
						value={filterData.type}
						onChange={(e) =>
							setFilterData({
								...filterData,
								type: e.target.value as IssueType,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						<option value="">Select type</option>

						{issueTypes.map((type) => (
							<option value={type} key={type}>
								{type}
							</option>
						))}
					</Form.Select>
				</Col>

				<Col className="mb-2">
					<Form.Select
						value={filterData.priority}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) =>
							setFilterData({
								...filterData,
								priority: e.target.value as IssuePriority,
							})
						}
					>
						<option value="">Select priority</option>

						{issuePriorities.map((priority) => (
							<option value={priority} key={priority}>
								{priority}
							</option>
						))}
					</Form.Select>
				</Col>

				<Col className="mb-2">
					<Form.Select
						value={filterData.status}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) =>
							setFilterData({
								...filterData,
								status: e.target.value as IssueStatus,
							})
						}
					>
						<option value="">Select status</option>

						{issueStatuses.map((status) => (
							<option value={status} key={status}>
								{status}
							</option>
						))}
					</Form.Select>
				</Col>

				<Col className="mb-2">
					<Button variant="primary" type="submit">
						<AiOutlineSearch />
					</Button>
				</Col>

				<Col className="mb-2">
					<Button variant="secondary" type="button" onClick={handleReset}>
						<MdOutlineCancel />
					</Button>
				</Col>
			</Row>
		</Form>
	);
}
