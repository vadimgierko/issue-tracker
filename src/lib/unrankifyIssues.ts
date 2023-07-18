import { Issue } from "../interfaces/Issue";

export default function unrankifyIssues(
	issues: Issue.AppIssue[]
): Issue.DbIssue[] {
	const unrankifiedIssues: Issue.DbIssue[] = issues.map((i) => {
		const { rank: _, ...unrankifiedIssue } = i;
		return unrankifiedIssue;
	});

	return unrankifiedIssues;
}
