import { useState, useEffect } from "react";
import { Issue } from "../../../../interfaces/Issue";
import listifyIssues from "../../../../lib/listifyIssues";
import RecursiveList from "./RecursiveList";

export default function ProjectIssuesOrderedList({
	issues,
	setIssues,
}: {
	issues: Issue.RankedIssue[];
	setIssues: React.Dispatch<React.SetStateAction<Issue.Issue[]>>;
}) {
	const [orderedIssues, setOrderedIssues] =
		useState<Issue.RankedIssue[]>(issues);

	return (
		<RecursiveList
			issues={orderedIssues}
			root={null}
			setOrderedIssues={setOrderedIssues}
		/>
	);
}
