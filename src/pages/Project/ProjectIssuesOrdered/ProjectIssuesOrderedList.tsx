import { Issue } from "../../../interfaces/Issue";

export default function ProjectIssuesOrderedList({
	issues,
}: {
	issues: Issue.RankedIssue[];
}) {
	const rootIssues = issues.filter((i) => !i.parent);
	const rootOrderedIssue = rootIssues.find((i) => i.ordered);
	const rootUnorderedIssues = rootIssues.filter(
		(i) => i.id !== rootOrderedIssue?.id
	);

	/**
	 * returns ranked issues with no order assigned
	 */
	function UL({ issues }: { issues: Issue.RankedIssue[] }) {
		return (
			<ul>
				{issues
					.sort((a, b) => b.rank - a.rank)
					.map((i) => (
						<li key={i.id}>
							{i.title} ({i.rank}/90)
						</li>
					))}
			</ul>
		);
	}

	/**
	 * returns ranked issues with assigned order
	 */
	function OL({ issues }: { issues: Issue.RankedIssue[] }) {
		return (
			<ol>
				{issues
					.sort((a, b) => b.rank - a.rank)
					.map((i) => (
						<li key={i.id}>
							{i.title} ({i.rank}/90)
						</li>
					))}
			</ol>
		);
	}

	return (
		<>
			{rootOrderedIssue && <OL issues={[rootOrderedIssue]} />}
			{rootUnorderedIssues.length && <UL issues={rootUnorderedIssues} />}
		</>
	);
}
