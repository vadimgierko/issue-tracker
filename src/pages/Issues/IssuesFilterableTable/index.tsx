import { useEffect, useState } from "react";
import { Issue } from "../../../interfaces/Issue";
import IssuesFilterForm from "./IssuesFilterForm";
import IssuesTable from "./IssuesTable";
import IssuesTableTabs from "./IssuesTableTabs";
import IssuesSortForm from "./IssuesSortForm";
import rankifyIssues from "../../../lib/rankifyIssues";

type IssuesFilterableTableProps = {
	issues: Issue.AppIssue[];
};

const initFilterFormData: Issue.FilterFormData = {
	type: "",
	urgency: "",
	importance: "",
	estimatedTime: "",
	difficulty: "",
	feature: "",
	page: "",
	component: "",
};

export default function IssuesFilterableTable({
	issues,
}: IssuesFilterableTableProps) {
	const [filterFormData, setFilterFormData] =
		useState<Issue.FilterFormData>(initFilterFormData);
	const [sortValue, setSortValue] = useState<Issue.SortValue>("highest ranked");
	const [status, setStatus] = useState<Issue.TableTabStatus>("open");

	const [filteredIssues, setFilteredIssues] = useState<Issue.AppIssue[] | []>(
		[]
	);

	function NoFilteredIssues() {
		return (
			<p className="text-center">
				No issues are found that match the filter criteria...
			</p>
		);
	}

	useEffect(() => {
		function filterAndSortIssues(
			filterFormData: Issue.FilterFormData,
			status: Issue.TableTabStatus
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
					(!filterFormData.feature || i.feature === filterFormData.feature) &&
					(!filterFormData.page || i.page === filterFormData.page) &&
					(!filterFormData.component ||
						i.component === filterFormData.component) &&
					(status === "all" ||
						(i.status === "open" && status === "open") ||
						(i.status === "in progress" && status === "in progress") ||
						((i.status === "abandoned" ||
							i.status === "resolved" ||
							i.status === "won't fix") &&
							status === "closed"))
				);
			});

			// rank issues:
			//const rankedIssues = rankifyIssues(filteredItems);

			// sort issues:
			const levelsOrder: Issue.Level[] = ["high", "medium", "low"];

			function sortIssuesByValue(
				issues: Issue.AppIssue[],
				sortValue: Issue.SortValue
			): Issue.AppIssue[] {
				switch (sortValue) {
					case "newest":
						return issues.sort((a, b) => b.created - a.created);
					case "oldest":
						return issues.sort((a, b) => a.created - b.created);
					case "recently updated":
						return issues.sort((a, b) => b.updated - a.updated);
					case "least recently updated":
						return issues.sort((a, b) => a.updated - b.updated);
					case "highest ranked":
						return issues.sort((a, b) => b.rank - a.rank);
					case "lowest ranked":
						return issues.sort((a, b) => a.rank - b.rank);
					case "most urgent":
						return issues.sort(
							(a, b) =>
								levelsOrder.indexOf(a.urgency) - levelsOrder.indexOf(b.urgency)
						);
					case "least urgent":
						return issues.sort(
							(a, b) =>
								levelsOrder.indexOf(b.urgency) - levelsOrder.indexOf(a.urgency)
						);
					case "most important":
						return issues.sort(
							(a, b) =>
								levelsOrder.indexOf(a.importance) -
								levelsOrder.indexOf(b.importance)
						);
					case "least important":
						return issues.sort(
							(a, b) =>
								levelsOrder.indexOf(b.importance) -
								levelsOrder.indexOf(a.importance)
						);
					case "need more time":
						return issues.sort(
							(a, b) =>
								levelsOrder.indexOf(a.estimatedTime) -
								levelsOrder.indexOf(b.estimatedTime)
						);
					case "need less time":
						return issues.sort(
							(a, b) =>
								levelsOrder.indexOf(b.estimatedTime) -
								levelsOrder.indexOf(a.estimatedTime)
						);
					case "most difficult":
						return issues.sort(
							(a, b) =>
								levelsOrder.indexOf(a.difficulty) -
								levelsOrder.indexOf(b.difficulty)
						);
					case "less difficult":
						return issues.sort(
							(a, b) =>
								levelsOrder.indexOf(b.difficulty) -
								levelsOrder.indexOf(a.difficulty)
						);
					default:
						throw new Error(`Invalid sort value: ${sortValue}`);
				}
			}

			const filteredAndSortedIssues = sortIssuesByValue(
				filteredItems,
				sortValue
			);

			setFilteredIssues(filteredAndSortedIssues);
		}

		filterAndSortIssues(filterFormData, status);
	}, [filterFormData, issues, status, sortValue]);

	return (
		<>
			<IssuesFilterForm
				filterFormData={filterFormData}
				setFilterFormData={setFilterFormData}
				resetFilterFormData={() => setFilterFormData(initFilterFormData)}
			/>

			<hr />

			<IssuesSortForm
				sortValue={sortValue}
				setSortValue={setSortValue}
				resetSortValue={() => setSortValue("recently updated")}
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
