import { Button, Col, Form, Row } from "react-bootstrap";
import {
	IssuePriority,
	IssueType,
	IssuesFilterFormData,
	issuePriorities,
	issueTypes,
} from "../../../interfaces/Issue";
import { useState } from "react";
import useTheme from "../../../context/useTheme";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

type IssuesFilterFormProps = {
	onSubmit: (filterFormData: IssuesFilterFormData) => void;
};

const initFilterFormData: IssuesFilterFormData = {
	type: "",
	priority: "",
};

export default function IssuesFilterForm({ onSubmit }: IssuesFilterFormProps) {
	const { theme } = useTheme();
	const [filterFormData, setFilterFormData] =
		useState<IssuesFilterFormData>(initFilterFormData);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		onSubmit(filterFormData);
	}

	function handleReset() {
		setFilterFormData(initFilterFormData);
		onSubmit(initFilterFormData);
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Row
				className="justify-content-md-center justify-content-xs-start"
				xs="auto"
			>
				<Col className="mb-2">
					<Form.Select
						value={filterFormData.type}
						onChange={(e) =>
							setFilterFormData({
								...filterFormData,
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
						value={filterFormData.priority}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
						onChange={(e) =>
							setFilterFormData({
								...filterFormData,
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
