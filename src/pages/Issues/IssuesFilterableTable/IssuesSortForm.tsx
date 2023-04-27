import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Issue } from "../../../interfaces/Issue";
import useTheme from "../../../context/useTheme";
import { MdOutlineCancel } from "react-icons/md";
import { TbArrowsSort } from "react-icons/tb";

type IssuesSortFormProps = {
	sortValue: Issue.SortValue;
	setSortValue: React.Dispatch<React.SetStateAction<Issue.SortValue>>;
	resetSortValue: () => void;
};

export default function IssuesSortForm({
	sortValue,
	setSortValue,
	resetSortValue,
}: IssuesSortFormProps) {
	const { theme } = useTheme();

	return (
		<Form className="mb-3">
			<Row
				className="justify-content-md-center align-items-center justify-content-xs-start"
				xs="auto"
			>
				<Col>
					<FloatingLabel
						label={
							<span>
								<TbArrowsSort /> sort by
							</span>
						}
					>
						<Form.Select
							value={sortValue}
							onChange={(e) => setSortValue(e.target.value as Issue.SortValue)}
							style={{
								backgroundColor:
									theme === "light" ? "white" : "rgb(13, 17, 23)",
								color: theme === "light" ? "black" : "white",
							}}
						>
							{Issue.allowedSortValueValues.map((allowedValue) => (
								<option value={allowedValue} key={allowedValue}>
									{allowedValue}
								</option>
							))}
						</Form.Select>
					</FloatingLabel>
				</Col>

				<Col>
					<Button variant="secondary" type="button" onClick={resetSortValue}>
						<MdOutlineCancel />
					</Button>
				</Col>
			</Row>
		</Form>
	);
}
