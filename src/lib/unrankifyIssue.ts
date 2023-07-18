import { Issue } from "../interfaces/Issue";

export default function unrankifyIssue(issue: Issue.AppIssue): Issue.DbIssue {
	const { rank: _, ...dbIssue } = issue;

	const unrankifiedIssue: Issue.DbIssue = dbIssue;

	return unrankifiedIssue;
}
