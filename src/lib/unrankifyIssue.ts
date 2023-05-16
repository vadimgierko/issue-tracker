import { Issue } from "../interfaces/Issue";

export default function unrankifyIssue(issue: Issue.AppIssue) {
	const { rank: _, ...unrankifiedIssue } = issue;

	return unrankifiedIssue;
}
