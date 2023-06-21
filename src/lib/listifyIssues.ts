import { Issue } from "../interfaces/Issue";

/**
 * Order passed issues with ordered prop set to true only.
 *
 * DO NOT PASS ISSUES WITH ORDERED PROP SET TO FALSE !!!
 */
export default function listifyIssues(
	issues: Issue.AppIssue[]
): Issue.AppIssue[] {
	const sortedIssues: Issue.AppIssue[] = [];

	// helper function
	function findIssueById(issueId: string | null | undefined) {
		if (!issueId) return null;
		return issues.find((i) => i.id === issueId);
	}

	if (issues && issues.length) {
		const rootIssue = issues.find((i) => !i.after || i.after === null);

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
