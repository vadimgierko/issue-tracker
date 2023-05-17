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
	const rootIssuesOrdered = listifyIssues(rootIssues.filter((i) => i.ordered));
	const rootIssuesUnordered = rootIssues.filter((i) => !i.ordered);

	async function transformIntoOrdered(issueId: string) {
		const updateTime = Date.now();

		const lastOrderedIssue =
			rootIssuesOrdered && rootIssuesOrdered.length
				? rootIssuesOrdered[rootIssuesOrdered.length - 1]
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

	async function transformIntoUnordered(issueId: string) {
		const updateTime = Date.now();

		const issueToTransform = rootIssues.find((i) => i.id === issueId);

		if (issueToTransform) {
			const issueToTransformAfter = rootIssues.find(
				(i) => i.id === issueToTransform.after
			);
			const issueToTransformBefore = rootIssues.find(
				(i) => i.id === issueToTransform.before
			);

			const updatedIssues: Issue.AppIssue[] = rootIssues.map((i) =>
				i.id === issueToTransform.id
					? {
							...issueToTransform,
							ordered: false,
							after: null,
							before: null,
							updated: updateTime,
					  }
					: issueToTransformAfter && i.id === issueToTransformAfter.id
					? {
							...issueToTransformAfter,
							before: issueToTransform.before,
							updated: updateTime,
					  }
					: issueToTransformBefore && i.id === issueToTransformBefore.id
					? {
							...issueToTransformBefore,
							after: issueToTransform.after,
							updated: updateTime,
					  }
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
					ordered: false,
					after: null,
					before: null,
					updated: updateTime,
				});

				if (issueToTransformAfter) {
					const issueToTransformAfterRef = doc(
						firestore,
						"issues",
						issueToTransformAfter.id
					);
					batch.update(issueToTransformAfterRef, {
						before: issueToTransform.before,
						updated: updateTime,
					});
				}

				if (issueToTransformBefore) {
					const issueToTransformBeforeRef = doc(
						firestore,
						"issues",
						issueToTransformBefore.id
					);
					batch.update(issueToTransformBeforeRef, {
						before: issueToTransform.before,
						updated: updateTime,
					});
				}

				// Commit the batch
				await batch.commit();

				console.log("issue to transform was updated succsessfully!");

				issueToTransformAfter &&
					console.log(
						"issue which transformed issue was after exists & was updated succsessfully!"
					);
				!issueToTransformAfter &&
					console.log(
						"issue which transformed issue was after DOESN'T exists... no need to update"
					);

				issueToTransformBefore &&
					console.log(
						"issue which transformed issue was before exists & was updated succsessfully!"
					);
				!issueToTransformBefore &&
					console.log(
						"issue which transformed issue was before DOESN'T exists... no need to update"
					);

				// UPDATE APP STATE:
				setIssues(updatedIssues);
			} catch (error: any) {
				console.error(error);
				alert(error);
			}
		}
	}

	function RecursiveListItem({ i }: { i: Issue.AppIssue }) {
		return (
			<li>
				<div style={{ display: "flex" }}>
					<Link to={"/issues/" + i.id}>{i.title}</Link> ({i.rank}/90)
					<Dropdown className="ms-2">
						<Dropdown.Toggle as="a" variant="outline-secondary" />

						<Dropdown.Menu>
							{!i.ordered && (
								<Dropdown.Item onClick={() => transformIntoOrdered(i.id)}>
									transform into ordered
								</Dropdown.Item>
							)}
							{i.ordered && (
								<Dropdown.Item onClick={() => transformIntoUnordered(i.id)}>
									transform into unordered
								</Dropdown.Item>
							)}
						</Dropdown.Menu>
					</Dropdown>
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
				</div>
			</li>
		);
	}

	return (
		<>
			{rootIssuesOrdered && rootIssuesOrdered.length ? (
				<ol>
					{rootIssuesOrdered.map((i) => (
						<RecursiveListItem key={i.id} i={i} />
					))}
				</ol>
			) : (
				<p>There are no ordered issues yet... Add one!</p>
			)}

			<hr />

			{rootIssuesUnordered && rootIssuesUnordered.length ? (
				<ul>
					{rootIssuesUnordered
						.sort((a, b) => b.rank - a.rank)
						.map((i) => (
							<RecursiveListItem key={i.id} i={i} />
						))}
				</ul>
			) : (
				<p>There are no unordered issues yet... Add one!</p>
			)}
		</>
	);
}
