import { useEffect, useState } from "react";
import { Issue, IssuesFilterData } from "../../../interfaces/Issue";
import IssuesFilterForm from "./IssuesFilterForm";
import IssuesTable from "./IssuesTable";
import IssuesTableTabs from "./IssuesTableTabs";

type IssuesFilterableTableProps = {
	issues: Issue[];
};

const initFilterData: IssuesFilterData = {
	type: "",
	status: "open",
	urgency: "",
	importance: "",
};

export default function IssuesFilterableTable({
	issues,
}: IssuesFilterableTableProps) {
	const [filterData, setFilterData] =
		useState<IssuesFilterData>(initFilterData);
	const [filteredIssues, setFilteredIssues] = useState<Issue[] | []>([]);

	function NoFilteredIssues() {
		return (
			<p className="text-center">
				No issues are found that match the filter criteria...
			</p>
		);
	}

	useEffect(() => {
		function filterIssues(filterData: IssuesFilterData) {
			const filteredItems = issues.filter((i) => {
				return (
					(!filterData.importance || i.importance === filterData.importance) &&
					(!filterData.urgency || i.urgency === filterData.urgency) &&
					(!filterData.type || i.type === filterData.type) &&
					(filterData.status === "all" ||
						(i.status === "open" && filterData.status === "open") ||
						(i.status === "in progress" &&
							filterData.status === "in progress") ||
						((i.status === "abandoned" ||
							i.status === "resolved" ||
							i.status === "won't fix") &&
							filterData.status === "closed"))
				);
			});

			setFilteredIssues(filteredItems);
		}

		filterIssues(filterData);
	}, [filterData, issues]);

	return (
		<>
			<IssuesFilterForm
				onSubmit={(filterFormData) =>
					setFilterData({ ...filterData, ...filterFormData })
				}
			/>

			<IssuesTableTabs
				onTabSelect={(selectedTab) =>
					setFilterData({ ...filterData, status: selectedTab })
				}
				filteredIssuesNumber={filteredIssues.length}
			/>

			{filteredIssues && filteredIssues.length ? (
				<IssuesTable issues={filteredIssues} />
			) : (
				<NoFilteredIssues />
			)}
		</>
	);
}
