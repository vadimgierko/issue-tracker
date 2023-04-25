import { useEffect, useState } from "react";
import {
	Issue,
	IssueTableTabStatus,
	IssuesFilterFormData,
} from "../../../interfaces/Issue";
import IssuesFilterForm from "./IssuesFilterForm";
import IssuesTable from "./IssuesTable";
import IssuesTableTabs from "./IssuesTableTabs";

type IssuesFilterableTableProps = {
	issues: Issue[];
};

const initFilterFormData: IssuesFilterFormData = {
	type: "",
	urgency: "",
	importance: "",
	estimatedTime: "",
	difficulty: "",
	sortValue: "recently updated",
};

export default function IssuesFilterableTable({
	issues,
}: IssuesFilterableTableProps) {
	const [filterFormData, setFilterFormData] =
		useState<IssuesFilterFormData>(initFilterFormData);
	const [status, setStatus] = useState<IssueTableTabStatus>("open");

	const [filteredIssues, setFilteredIssues] = useState<Issue[] | []>([]);

	function NoFilteredIssues() {
		return (
			<p className="text-center">
				No issues are found that match the filter criteria...
			</p>
		);
	}

	useEffect(() => {
		function filterAndSortIssues(
			filterFormData: IssuesFilterFormData,
			status: IssueTableTabStatus
		) {
			// filter issues:
			const filteredItems = issues.filter((i) => {
				return (
					(!filterFormData.estimatedTime ||
						i.estimatedTime === filterFormData.estimatedTime) &&
					(!filterFormData.difficulty ||
						i.difficulty === filterFormData.difficulty) &&
					(!filterFormData.importance ||
						i.importance === filterFormData.importance) &&
					(!filterFormData.urgency || i.urgency === filterFormData.urgency) &&
					(!filterFormData.type || i.type === filterFormData.type) &&
					(status === "all" ||
						(i.status === "open" && status === "open") ||
						(i.status === "in progress" && status === "in progress") ||
						((i.status === "abandoned" ||
							i.status === "resolved" ||
							i.status === "won't fix") &&
							status === "closed"))
				);
			});

			// sort issues:
			if (filterFormData.sortValue === "recently updated") {
				filteredItems.sort((a, b) => b.updated - a.updated);
			} else if (filterFormData.sortValue === "least recently updated") {
				filteredItems.sort((a, b) => a.updated - b.updated);
			} else if (filterFormData.sortValue === "newest") {
				filteredItems.sort((a, b) => b.created - a.created);
			} else if (filterFormData.sortValue === "oldest") {
				filteredItems.sort((a, b) => a.updated - b.updated);
			}

			setFilteredIssues(filteredItems);
		}

		filterAndSortIssues(filterFormData, status);
	}, [filterFormData, issues, status]);

	return (
		<>
			<IssuesFilterForm
				filterFormData={filterFormData}
				setFilterFormData={setFilterFormData}
				resetFilterFormData={() => setFilterFormData(initFilterFormData)}
			/>

			<IssuesTableTabs
				onTabSelect={setStatus}
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
