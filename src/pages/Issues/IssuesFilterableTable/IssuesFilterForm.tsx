import { Button, Col, Form, Row } from "react-bootstrap";
import { Issue } from "../../../interfaces/Issue";
import useTheme from "../../../context/useTheme";
import { MdOutlineCancel } from "react-icons/md";

type IssuesFilterFormProps = {
	filterFormData: Issue.FilterFormData;
	setFilterFormData: React.Dispatch<React.SetStateAction<Issue.FilterFormData>>;
	resetFilterFormData: () => void;
};

export default function IssuesFilterForm({
	filterFormData,
	setFilterFormData,
	resetFilterFormData,
}: IssuesFilterFormProps) {
	const { theme } = useTheme();

	return (
		<Form>
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
								type: e.target.value as Issue.Type,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						<option value="">Type</option>

						{Issue.allowedTypes.map((type) => (
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
								urgency: e.target.value as Issue.Urgency,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						<option value="">Urgency</option>

						{Issue.allowedLevels.map((level) => (
							<option value={level} key={"urgency-" + level}>
								{level}
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
								importance: e.target.value as Issue.Importance,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						<option value="">Importance</option>

						{Issue.allowedLevels.map((level) => (
							<option value={level} key={"importance-" + level}>
								{level}
							</option>
						))}
					</Form.Select>
				</Col>

				<Col className="mb-2">
					<Form.Select
						value={filterFormData.estimatedTime}
						onChange={(e) =>
							setFilterFormData({
								...filterFormData,
								estimatedTime: e.target.value as Issue.EstimatedTime,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						<option value="">Estimated time</option>

						{Issue.allowedLevels.map((level) => (
							<option value={level} key={"estimated-time-" + level}>
								{level}
							</option>
						))}
					</Form.Select>
				</Col>

				<Col className="mb-2">
					<Form.Select
						value={filterFormData.difficulty}
						onChange={(e) =>
							setFilterFormData({
								...filterFormData,
								difficulty: e.target.value as Issue.Difficulty,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						<option value="">Difficulty</option>

						{Issue.allowedLevels.map((level) => (
							<option value={level} key={"difficulty-" + level}>
								{level}
							</option>
						))}
					</Form.Select>
				</Col>

				<Col className="mb-2">
					<Form.Select
						value={filterFormData.sortValue}
						onChange={(e) =>
							setFilterFormData({
								...filterFormData,
								sortValue: e.target.value as Issue.SortValue,
							})
						}
						style={{
							backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
							color: theme === "light" ? "black" : "white",
						}}
					>
						{Issue.allowedSortValues.map((sortValue) => (
							<option value={sortValue} key={"sort-value-" + sortValue}>
								{sortValue}
							</option>
						))}
					</Form.Select>
				</Col>

				<Col className="mb-2">
					<Button
						variant="secondary"
						type="button"
						onClick={resetFilterFormData}
					>
						<MdOutlineCancel />
					</Button>
				</Col>
			</Row>
		</Form>
	);
}
