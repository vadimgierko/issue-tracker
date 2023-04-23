import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import useTheme from "../../../context/useTheme";

export type SortValue =
	| "newest"
	| "oldest"
	| "recently updated"
	| "least recently updated";

export const allowedSortValues: SortValue[] = [
	"newest",
	"oldest",
	"recently updated",
	"least recently updated",
];

type IssuesSortFormProps = {
	onChange: (sortValue: SortValue) => void;
};

export default function IssuesSortForm({ onChange }: IssuesSortFormProps) {
	const { theme } = useTheme();
	const [sortValue, setSortValue] = useState<SortValue>("recently updated");

	useEffect(() => {
		onChange(sortValue);
	}, [sortValue]);

	return (
		<Form className="my-2">
			<Form.Select
				value={sortValue}
				onChange={(e) => setSortValue(e.target.value as SortValue)}
				style={{
					backgroundColor: theme === "light" ? "white" : "rgb(13, 17, 23)",
					color: theme === "light" ? "black" : "white",
				}}
			>
				{allowedSortValues.map((sortValue) => (
					<option value={sortValue} key={"sort-value-" + sortValue}>
						{sortValue}
					</option>
				))}
			</Form.Select>
		</Form>
	);
}
