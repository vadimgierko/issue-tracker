import { Issue } from "../interfaces/Issue";

export default function unrankifyIssues({
	issues,
}: {
	issues: Issue.RankedIssue[];
}) {
	const unrankifiedIssues: Issue.Issue[] = issues.map((i) => {
		const { rank: _, ...unrankifiedIssue } = i;
		return unrankifiedIssue;
	});

	return unrankifiedIssues;
}
