import { Dropdown } from "react-bootstrap";
import { Issue } from "../../../../interfaces/Issue";
import listifyIssues from "../../../../lib/listifyIssues";
import useIssues from "../../../../context/useIssues";
import { Link, useNavigate } from "react-router-dom";
import createAddIssueLinkWithParams from "../../../../lib/createAddIssueLinkWithParams";

export default function RecursiveList({
	issuesToList,
	root,
}: {
	issuesToList: Issue.AppIssue[]; // open & in progress project issues only
	root: string | null;
}) {
	const navigate = useNavigate();

	const { issues, findIssueById, updateIssues } = useIssues();

	const rootIssues = issuesToList.filter((i) => !i.parent || i.parent === root);
	const rootIssuesOrdered = listifyIssues(rootIssues.filter((i) => i.ordered));
	console.log("ordered root issues:", rootIssuesOrdered);
	const rootIssuesUnordered = rootIssues.filter((i) => !i.ordered);

	async function convertIntoOrdered(issueId: string) {
		const lastOrderedIssue =
			rootIssuesOrdered && rootIssuesOrdered.length
				? rootIssuesOrdered[rootIssuesOrdered.length - 1]
				: null;

		const issueToConvert = findIssueById(issueId);

		if (!issueToConvert) return;

		const convertedIssue: Issue.AppIssue = {
			...issueToConvert,
			ordered: true,
			after: lastOrderedIssue ? lastOrderedIssue.id : null,
			before: null,
		};

		const issueAfter = convertedIssue.after
			? findIssueById(convertedIssue.after)
			: null;

		const issueAfterUpdated: Issue.AppIssue | null = issueAfter
			? {
					...issueAfter,
					before: convertedIssue.id,
			  }
			: null;

		const updatedIssuesArray: Issue.AppIssue[] = [
			convertedIssue,
			...(issueAfterUpdated ? [issueAfterUpdated] : []),
		];

		try {
			await updateIssues({ update: updatedIssuesArray });
			console.log(
				"issues were updated succsessfully after converting issue to ordered:,",
				updatedIssuesArray
			);
		} catch (error: any) {
			console.error(error);
			alert(error);
		}
	}

	async function convertIntoUnordered(issueId: string) {
		const issueToConvert = findIssueById(issueId);

		if (!issueToConvert) {
			return; // Issue not found, exit early
		}

		const convertedIssue: Issue.AppIssue = {
			...issueToConvert,
			ordered: false,
			after: null,
			before: null,
		};

		const issueAfter = issueToConvert.after
			? issues.find((i) => i.id === issueToConvert.after)
			: null;

		const issueBefore = issueToConvert.before
			? issues.find((i) => i.id === issueToConvert.before)
			: null;

		const issueAfterUpdated: Issue.AppIssue | null = issueAfter
			? {
					...issueAfter,
					before: issueToConvert.before,
			  }
			: null;

		const issueBeforeUpdated: Issue.AppIssue | null = issueBefore
			? {
					...issueBefore,
					after: issueToConvert.after,
			  }
			: null;

		const updatedIssuesArray: Issue.AppIssue[] = [
			convertedIssue,
			...(issueAfterUpdated ? [issueAfterUpdated] : []),
			...(issueBeforeUpdated ? [issueBeforeUpdated] : []),
		];

		try {
			await updateIssues({ update: updatedIssuesArray });

			console.log(
				"issues were updated succsessfully after converting issue to unordered:",
				updatedIssuesArray
			);
		} catch (error: any) {
			console.error(error);
			alert(error);
		}
	}

	async function moveUp(issueId: string) {
		const issueToMove_UP = findIssueById(issueId);

		if (!issueToMove_UP || !rootIssuesOrdered.map((i) => i.id).indexOf(issueId))
			return;

		const issueToMove_DOWN = findIssueById(
			issueToMove_UP.after as string
		) as Issue.AppIssue;

		const UP = {
			...issueToMove_UP,
			before: issueToMove_UP.after,
			after: issueToMove_DOWN.after,
		};
		const DOWN = {
			...issueToMove_DOWN,
			before: issueToMove_UP.before,
			after: issueToMove_DOWN.before,
		};

		const issueAt_START = UP.after ? findIssueById(UP.after) : null;
		const START = issueAt_START ? { ...issueAt_START, before: UP.id } : null;

		const issueAt_END = DOWN.before ? findIssueById(DOWN.before) : null;
		const END = issueAt_END ? { ...issueAt_END, after: DOWN.id } : null;

		const updatedIssuesArray: Issue.AppIssue[] = [
			UP,
			DOWN,
			...(START ? [START] : []),
			...(END ? [END] : []),
		];

		try {
			await updateIssues({ update: updatedIssuesArray });
			console.log(
				"issues were successfully updated after an issue moved up:",
				updatedIssuesArray
			);
		} catch (error: any) {
			console.log(error);
			alert(error);
		}
	}

	async function moveDown(issueId: string) {
		const issueToMove_DOWN = findIssueById(issueId);

		if (
			!issueToMove_DOWN ||
			rootIssuesOrdered.map((i) => i.id).indexOf(issueId) ===
				rootIssuesOrdered.length - 1
		)
			return;

		const issueToMove_UP = findIssueById(
			issueToMove_DOWN.before as string
		) as Issue.AppIssue;

		const DOWN = {
			...issueToMove_UP,
			before: issueToMove_UP.after,
			after: issueToMove_DOWN.after,
		};
		const UP = {
			...issueToMove_DOWN,
			before: issueToMove_UP.before,
			after: issueToMove_DOWN.before,
		};

		const issueAt_START = DOWN.after ? findIssueById(DOWN.after) : null;
		const START = issueAt_START ? { ...issueAt_START, before: DOWN.id } : null;

		const issueAt_END = UP.before ? findIssueById(UP.before) : null;
		const END = issueAt_END ? { ...issueAt_END, after: UP.id } : null;

		const updatedIssuesArray: Issue.AppIssue[] = [
			UP,
			DOWN,
			...(START ? [START] : []),
			...(END ? [END] : []),
		];

		try {
			await updateIssues({ update: updatedIssuesArray });
			console.log(
				"issues were successfully updated after an issue moved up:",
				updatedIssuesArray
			);
		} catch (error: any) {
			console.log(error);
			alert(error);
		}
	}

	function RecursiveListItem({ i }: { i: Issue.AppIssue }) {
		return (
			<li>
				<div style={{ display: "flex" }}>
					<Link to={"/issues/" + i.id} className="me-1">
						{i.title}
					</Link>
					<span>{i.rank}/90</span>
					<Dropdown className="ms-2">
						<Dropdown.Toggle as="a" variant="outline-secondary" />

						<Dropdown.Menu>
							{i.ordered && (
								<>
									<Dropdown.Item
										onClick={() =>
											navigate(
												createAddIssueLinkWithParams(
													i.projectId,
													true,
													i.id,
													i.before ? i.before : null
												)
											)
										}
									>
										+ add after
									</Dropdown.Item>

									<Dropdown.Item
										onClick={() =>
											navigate(
												createAddIssueLinkWithParams(
													i.projectId,
													true,
													i.after ? i.after : null,
													i.id
												)
											)
										}
									>
										+ add before
									</Dropdown.Item>

									<Dropdown.Divider />

									<Dropdown.Item onClick={() => moveUp(i.id)}>
										move up
									</Dropdown.Item>
									<Dropdown.Item onClick={() => moveDown(i.id)}>
										move down
									</Dropdown.Item>

									<Dropdown.Divider />

									<Dropdown.Item onClick={() => convertIntoUnordered(i.id)}>
										transform into unordered
									</Dropdown.Item>
								</>
							)}

							{!i.ordered && (
								<Dropdown.Item onClick={() => convertIntoOrdered(i.id)}>
									transform into ordered
								</Dropdown.Item>
							)}

							<Dropdown.Divider />

							<Dropdown.Item
								onClick={() => navigate("/issues/" + i.id + "/edit")}
							>
								edit
							</Dropdown.Item>
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
