import { Button, Col, Form, Row } from "react-bootstrap";
import {
	IssueImportance,
	IssueType,
	IssueUrgency,
	IssuesFilterFormData,
	issueImportance,
	issueTypes,
	issueUrgency,
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
	urgency: "",
	importance: "",
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
						<option value="">Type</option>

						{issueTypes.map((type) => (
							<option value={type} key={type}>
								{type}
							</option>
						))}
					</Form.Select>
				</Col>

				<Col className="mb-2">
					<Form.Select
						value={filterFormData.urgency}
						onChange={(e) =>
							setFilterFormData({
								...filterFormData,
								urgency: e.target.value as IssueUrgency,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						<option value="">Urgency</option>

						{issueUrgency.map((urgency) => (
							<option value={urgency} key={"urgency-" + urgency}>
								{urgency}
							</option>
						))}
					</Form.Select>
				</Col>

				<Col className="mb-2">
					<Form.Select
						value={filterFormData.importance}
						onChange={(e) =>
							setFilterFormData({
								...filterFormData,
								importance: e.target.value as IssueImportance,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						<option value="">Importance</option>

						{issueImportance.map((importance) => (
							<option value={importance} key={"importance-" + importance}>
								{importance}
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
