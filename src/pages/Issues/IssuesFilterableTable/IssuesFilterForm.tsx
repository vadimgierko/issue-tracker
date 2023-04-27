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

export default function IssuesFilterForm({
	filterFormData,
	setFilterFormData,
	resetFilterFormData,
}: IssuesFilterFormProps) {
	const { theme } = useTheme();

	// Prev Form className="border border-secondary rounded mb-3 p-1"
	return (
		<Form>
			<Row
				className="justify-content-md-center align-items-center justify-content-xs-start"
				xs="auto"
			>
				{Object.keys(filterFormData).map((key) => (
					<Col key={key + "-filter"}>
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
								value={filterFormData[key as keyof Issue.FilterFormData]}
								onChange={(e) =>
									setFilterFormData({
										...filterFormData,
										[key as keyof Issue.FilterFormData]: e.target.value,
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
						onClick={resetFilterFormData}
					>
						<MdOutlineCancel />
					</Button>
				</Col>
			</Row>
		</Form>
	);
}
