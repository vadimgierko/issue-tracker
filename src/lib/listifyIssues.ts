import { Issue } from "../interfaces/Issue";

export default function listifyIssues(
	issues: Issue.RankedIssue[]
): Issue.RankedIssue[] {
	const sortedIssues: Issue.RankedIssue[] = [];

	// helper function
	function findIssueById(issueId: string | null | undefined) {
		if (!issueId) return null;
		return issues.find((i) => i.id === issueId);
	}

	if (issues && issues.length) {
		const rootIssue = issues.find((i) => !i.after || i.after === null);
		console.log("root issue:", rootIssue?.title, rootIssue?.id);

		if (rootIssue) {
			// add root issue:
			sortedIssues.push(rootIssue);

			// add remaining ordered issues based on what is next for prev issue:
			for (let i = 0; i < issues.length - 1; i++) {
				const issueAfter = findIssueById(sortedIssues[i].before);
				if (issueAfter) {
					sortedIssues.push(issueAfter);
				}
			}
		}
	}

	return sortedIssues;
}
