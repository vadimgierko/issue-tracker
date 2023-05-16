import { Dropdown } from "react-bootstrap";
import { Issue } from "../../../../interfaces/Issue";
import listifyIssues from "../../../../lib/listifyIssues";
import useIssues from "../../../../context/useIssues";
import { Link } from "react-router-dom";
import { doc, writeBatch } from "firebase/firestore";
import { firestore } from "../../../../firebaseConfig";

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
		const updateTime = Date.now();

		const lastOrderedIssue =
			rootOrderedIssues && rootOrderedIssues.length
				? rootOrderedIssues[rootOrderedIssues.length - 1]
				: null;

		const issueToTransform = rootIssues.find((i) => i.id === issueId);

		if (issueToTransform) {
			const updatedIssues: Issue.AppIssue[] = rootIssues.map((i) =>
				i.id === issueToTransform.id
					? {
							...issueToTransform,
							ordered: true,
							after: lastOrderedIssue ? lastOrderedIssue.id : null,
							before: null,
							updated: updateTime,
					  }
					: lastOrderedIssue && i.id === lastOrderedIssue.id
					? { ...lastOrderedIssue, before: issueId, updated: updateTime }
					: i
			);

			// UPDATE DATABASE & APP STATE:
			try {
				// init batch to update multiply docs:
				// Get a new write batch
				const batch = writeBatch(firestore);

				const transformedIssueRef = doc(
					firestore,
					"issues",
					issueToTransform.id
				);
				batch.update(transformedIssueRef, {
					ordered: true,
					after: lastOrderedIssue ? lastOrderedIssue.id : null,
					before: null,
					updated: updateTime,
				});

				if (lastOrderedIssue) {
					const lastOrderedIssueRef = doc(
						firestore,
						"issues",
						lastOrderedIssue.id
					);
					batch.update(lastOrderedIssueRef, {
						before: issueId,
						updated: updateTime,
					});
				}

				// Commit the batch
				await batch.commit();

				console.log("issue to transform was updated succsessfully!");
				lastOrderedIssue &&
					console.log("last ordered issue exists & was updated succsessfully!");

				!lastOrderedIssue &&
					console.log(
						"there is no last ordered issue to update (there were no ordered issues at all)..."
					);

				// UPDATE APP STATE:
				setIssues(updatedIssues);
			} catch (error: any) {
				console.error(error);
				alert(error);
			}
		}
	}

	return (
		<>
			{rootOrderedIssues && rootOrderedIssues.length ? (
				<ol>
					{rootOrderedIssues.map((i) => (
						<li key={i.id}>
							<Link to={"/issues/" + i.id}>{i.title}</Link> ({i.rank}/90)
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
									<Link to={"/issues/" + i.id}>{i.title}</Link> ({i.rank}/90)
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
