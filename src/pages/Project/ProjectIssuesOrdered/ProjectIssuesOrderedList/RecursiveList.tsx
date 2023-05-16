import { Dropdown } from "react-bootstrap";
import { Issue } from "../../../../interfaces/Issue";
import listifyIssues from "../../../../lib/listifyIssues";
import rankifyIssues from "../../../../lib/rankifyIssues";

export default function RecursiveList({
	issues, // orderedIssues
	root,
	setOrderedIssues,
}: {
	issues: Issue.RankedIssue[];
	root: string | null;
	setOrderedIssues: React.Dispatch<React.SetStateAction<Issue.RankedIssue[]>>;
}) {
	const rootIssues = issues.filter((i) => !i.parent || i.parent === root);
	const rootOrderedIssues = listifyIssues(rootIssues.filter((i) => i.ordered));
	const rootUnorderedIssues = rootIssues.filter((i) => !i.ordered);

	async function transformIntoOrdered(issueId: string) {
		const lastOrderedIssue =
			rootOrderedIssues && rootOrderedIssues.length
				? rootOrderedIssues[rootOrderedIssues.length - 1]
				: null;

		const updatedIssues: Issue.RankedIssue[] = rootIssues.map((i) =>
			i.id === issueId
				? {
						...i,
						ordered: true,
						after: lastOrderedIssue ? lastOrderedIssue.id : null,
						before: null,
				  }
				: lastOrderedIssue && i.id === lastOrderedIssue.id
				? { ...lastOrderedIssue, before: issueId }
				: i
		);
		setOrderedIssues(updatedIssues);
		// const issueRef = doc(firestore, "issues", issue.id);
		// await updateDoc(issueRef, {ordered: true, after: }) // TODO: implement after, before <= list
	}

	return (
		<>
			{rootOrderedIssues && rootOrderedIssues.length ? (
				<ol>
					{rootOrderedIssues.map((i) => (
						<li key={i.id}>
							{i.title} ({i.rank}/90)
							{i.children && i.children.length ? (
								<RecursiveList
									issues={rankifyIssues(i.children)}
									root={i.id}
									setOrderedIssues={setOrderedIssues}
								/>
							) : null}
						</li>
					))}
				</ol>
			) : null}

			{rootUnorderedIssues && rootUnorderedIssues.length ? (
				<ul>
					{rootUnorderedIssues
						.sort((a, b) => b.rank - a.rank)
						.map((i) => (
							<li key={i.id}>
								<div style={{ display: "flex" }}>
									{i.title} ({i.rank}/90)
									<Dropdown className="ms-2">
										<Dropdown.Toggle as="a" variant="outline-secondary" />

										<Dropdown.Menu>
											<Dropdown.Item onClick={() => transformIntoOrdered(i.id)}>
												transform into ordered issue
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
								{i.children && i.children.length ? (
									<RecursiveList
										issues={rankifyIssues(i.children)}
										root={i.id}
										setOrderedIssues={setOrderedIssues}
									/>
								) : null}
							</li>
						))}
				</ul>
			) : null}
		</>
	);
}
