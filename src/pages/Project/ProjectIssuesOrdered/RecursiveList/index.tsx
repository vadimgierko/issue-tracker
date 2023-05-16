import { Dropdown } from "react-bootstrap";
import { Issue } from "../../../../interfaces/Issue";
import listifyIssues from "../../../../lib/listifyIssues";
import useIssues from "../../../../context/useIssues";

export default function RecursiveList({
	issuesToList,
	root,
}: {
	issuesToList: Issue.AppIssue[];
	root: string | null;
}) {
	const { setIssues } = useIssues();
	const rootIssues = issuesToList.filter((i) => !i.parent || i.parent === root);
	const rootOrderedIssues = listifyIssues(rootIssues.filter((i) => i.ordered));
	const rootUnorderedIssues = rootIssues.filter((i) => !i.ordered);

	async function transformIntoOrdered(issueId: string) {
		const lastOrderedIssue =
			rootOrderedIssues && rootOrderedIssues.length
				? rootOrderedIssues[rootOrderedIssues.length - 1]
				: null;

		const updatedIssues: Issue.AppIssue[] = rootIssues.map((i) =>
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

		// TODO:
		// UNRANKIFY UPDATED ISSUES =>
		// UPDATE DATABASE
		// UPDATE APP STATE:
		setIssues(updatedIssues);
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
									issuesToList={
										i.children
											.map((id) => issuesToList.find((iss) => iss.id === id))
											.filter((f) => f !== undefined) as Issue.AppIssue[]
									}
									root={i.id}
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
										issuesToList={
											i.children
												.map((id) => issuesToList.find((iss) => iss.id === id))
												.filter((f) => f !== undefined) as Issue.AppIssue[]
										}
										root={i.id}
									/>
								) : null}
							</li>
						))}
				</ul>
			) : null}
		</>
	);
}
