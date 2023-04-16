import { useState } from "react";
import { Issue, IssuesFilterData } from "../../../interfaces/Issue";
import IssuesFilterForm from "./IssuesFilterForm";
import IssuesTable from "./IssuesTable";

type IssuesFilterableTableProps = {
	issues: Issue[];
};

export default function IssuesFilterableTable({
	issues,
}: IssuesFilterableTableProps) {
	const [filteredIssues, setFilteredIssues] = useState(issues);

	function filterIssues(filterData: IssuesFilterData) {
		const filteredItems = issues.filter((item) => {
			return (
				(!filterData.priority || item.priority === filterData.priority) &&
				(!filterData.status || item.status === filterData.status) &&
				(!filterData.type || item.type === filterData.type)
			);
		});

		setFilteredIssues(filteredItems);
	}

	function NoFilteredIssues() {
		return (
			<p className="text-center">
				No issues are found that match the filter criteria...
			</p>
		);
	}

	return (
		<>
			<IssuesFilterForm onSubmit={filterIssues} />
			{filteredIssues && filteredIssues.length ? (
				<IssuesTable issues={filteredIssues} />
			) : (
				<NoFilteredIssues />
			)}
		</>
	);
}
