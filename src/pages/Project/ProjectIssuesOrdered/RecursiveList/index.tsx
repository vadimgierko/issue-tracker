import { Dropdown } from "react-bootstrap";
import { Issue } from "../../../../interfaces/Issue";
import listifyIssues from "../../../../lib/listifyIssues";
import useIssues from "../../../../context/useIssues";
import { useNavigate, useParams } from "react-router-dom";
import createAddIssueLinkWithParams from "../../../../lib/createAddIssueLinkWithParams";
import {
	BsArrowDown,
	BsPlus,
	BsArrowUp,
	BsDot,
	BsArrowRight,
	BsPencilSquare,
	BsEye,
	BsTrash,
	BsArrowReturnRight,
	BsCheck2Square,
} from "react-icons/bs";
import { VscIssueReopened } from "react-icons/vsc";

export default function RecursiveList({
	issuesToList,
	root,
}: {
	issuesToList: Issue.AppIssue[]; // open & in progress project issues only
	root: string | null;
}) {
	const navigate = useNavigate();
	const { projectId } = useParams();
	const { issues, findIssueById, updateIssues, deleteIssue } = useIssues();

	if (!projectId) return null;

	const rootIssues = issuesToList.filter((i) => !i.parent || i.parent === root);
	const rootIssuesOrdered = listifyIssues(rootIssues.filter((i) => i.ordered));
	console.log("ordered root issues:", rootIssuesOrdered);
	const rootIssuesUnordered = rootIssues.filter((i) => !i.ordered);
	console.log("unordered root issues:", rootIssuesUnordered);

	const lastOrderedIssue =
		rootIssuesOrdered && rootIssuesOrdered.length
			? rootIssuesOrdered[rootIssuesOrdered.length - 1]
			: null;

	async function handleDeleteIssue(issue: Issue.AppIssue) {
		if (!issue) return alert("No issue was provided... Cannot delete issue.");

		if (
			window.confirm(
				`Are you sure you want to delete ${issue.title} issue permanently? This action can not be undone!`
			)
		) {
			if (issue.children && issue.children.length) {
				if (
					window.confirm(
						`The ${issue.title} issue you want to delete has children issues, so deleting this parent issue will delete all its children. Are you sure you want to delete all ${issue.title} issue children (${issue.children.length})? This action cannot be undone!`
					)
				) {
					await deleteIssue(issue.id, issue.projectId);
					alert(
						`Your issue ${issue.title} with the id ${issue.id} and its children (${issue.children.length}) were successfully deleted.`
					);
				}
			} else {
				await deleteIssue(issue.id, issue.projectId);
				alert(
					`Your issue ${issue.title} with the id ${issue.id} was successfully deleted.`
				);
			}
		}
	}

	async function convertIntoOrdered(issueId: string) {
		const convertTime = Date.now();

		const issueToConvert = findIssueById(issueId);

		if (!issueToConvert) return;

		const convertedIssue: Issue.AppIssue = {
			...issueToConvert,
			ordered: true,
			after: lastOrderedIssue ? lastOrderedIssue.id : null,
			before: null,
			updated: convertTime,
		};

		const issueAfter = convertedIssue.after
			? findIssueById(convertedIssue.after)
			: null;

		const issueAfterUpdated: Issue.AppIssue | null = issueAfter
			? {
					...issueAfter,
					before: convertedIssue.id,
					updated: convertTime,
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
		const convertTime = Date.now();

		const issueToConvert = findIssueById(issueId);

		if (!issueToConvert) {
			return; // Issue not found, exit early
		}

		const convertedIssue: Issue.AppIssue = {
			...issueToConvert,
			ordered: false,
			after: null,
			before: null,
			updated: convertTime,
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
					updated: convertTime,
			  }
			: null;

		const issueBeforeUpdated: Issue.AppIssue | null = issueBefore
			? {
					...issueBefore,
					after: issueToConvert.after,
					updated: convertTime,
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
		const moveTime = Date.now();

		const issueToMove_UP = findIssueById(issueId);

		if (!issueToMove_UP || !rootIssuesOrdered.map((i) => i.id).indexOf(issueId))
			return;

		const issueToMove_DOWN = findIssueById(
			issueToMove_UP.after as string
		) as Issue.AppIssue;

		const UP: Issue.AppIssue = {
			...issueToMove_UP,
			before: issueToMove_UP.after,
			after: issueToMove_DOWN.after,
			updated: moveTime,
		};
		const DOWN: Issue.AppIssue = {
			...issueToMove_DOWN,
			before: issueToMove_UP.before,
			after: issueToMove_DOWN.before,
			updated: moveTime,
		};

		const issueAt_START = UP.after ? findIssueById(UP.after) : null;
		const START = issueAt_START
			? { ...issueAt_START, before: UP.id, updated: moveTime }
			: null;

		const issueAt_END = DOWN.before ? findIssueById(DOWN.before) : null;
		const END = issueAt_END
			? { ...issueAt_END, after: DOWN.id, updated: moveTime }
			: null;

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
		const moveTime = Date.now();
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

		const DOWN: Issue.AppIssue = {
			...issueToMove_UP,
			before: issueToMove_UP.after,
			after: issueToMove_DOWN.after,
			updated: moveTime,
		};
		const UP: Issue.AppIssue = {
			...issueToMove_DOWN,
			before: issueToMove_UP.before,
			after: issueToMove_DOWN.before,
			updated: moveTime,
		};

		const issueAt_START = DOWN.after ? findIssueById(DOWN.after) : null;
		const START = issueAt_START
			? { ...issueAt_START, before: DOWN.id, updated: moveTime }
			: null;

		const issueAt_END = UP.before ? findIssueById(UP.before) : null;
		const END = issueAt_END
			? { ...issueAt_END, after: UP.id, updated: moveTime }
			: null;

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

	async function addChildOrdered(parentId: string) {
		const parent = findIssueById(parentId);

		if (!parent) return;

		const children = parent.children;

		const orderedChildren =
			children && children.length
				? children.filter((i) => findIssueById(i)?.ordered)
				: null;

		const after =
			orderedChildren && orderedChildren.length
				? orderedChildren[orderedChildren.length - 1]
				: null;

		navigate(
			createAddIssueLinkWithParams(
				parent.projectId,
				true,
				after,
				null, // before
				parent.id
			)
		);
	}

	async function addChildUnordered(parentId: string) {
		const parent = findIssueById(parentId);

		if (!parent) return;

		console.log("new unordered issue parent:", parent);

		navigate(
			createAddIssueLinkWithParams(
				parent.projectId,
				false, // ordered
				null, // after
				null, // before
				parent.id
			)
		);
	}

	async function resolve(issue: Issue.AppIssue) {
		if (!issue) return;

		const closeTime = Date.now();

		const issueToClose: Issue.AppIssue = {
			...issue,
			updated: closeTime,
			closedAt: closeTime,
			status: "resolved",
		};

		try {
			await updateIssues({ update: [issueToClose] });
			console.log("Issue was resolved successfully!");
		} catch (error: any) {
			console.log(error);
			alert(error);
		}
	}

	async function reopen(issue: Issue.AppIssue) {
		if (!issue) return;

		const reopenTime = Date.now();

		const issueToReopen: Issue.AppIssue = {
			...issue,
			updated: reopenTime,
			closedAt: null,
			inProgressFrom: null,
			status: "open",
		};

		try {
			await updateIssues({ update: [issueToReopen] });
			console.log("Issue was reopened successfully!");
		} catch (error: any) {
			console.log(error);
			alert(error);
		}
	}

	function RecursiveListItem({ i }: { i: Issue.AppIssue }) {
		return (
			<li>
				<div style={{ display: "flex" }}>
					{/* <Link to={"/issues/" + i.id} className="me-1">
						{i.title}
					</Link> */}
					<span>
						<strong
							style={{ textDecoration: i.closedAt ? "line-through" : "" }}
						>
							{i.title}
						</strong>{" "}
						({i.rank}/90)
					</span>
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
													i.before ? i.before : null,
													i.parent ? i.parent : null
												)
											)
										}
									>
										<BsArrowDown />
										<BsPlus /> add after
									</Dropdown.Item>

									<Dropdown.Item
										onClick={() =>
											navigate(
												createAddIssueLinkWithParams(
													i.projectId,
													true,
													i.after ? i.after : null,
													i.id,
													i.parent ? i.parent : null
												)
											)
										}
									>
										<BsArrowUp />
										<BsPlus /> add before
									</Dropdown.Item>

									<Dropdown.Divider />

									<Dropdown.Item onClick={() => moveUp(i.id)}>
										<BsArrowUp /> move up
									</Dropdown.Item>
									<Dropdown.Item onClick={() => moveDown(i.id)}>
										<BsArrowDown /> move down
									</Dropdown.Item>

									<Dropdown.Divider />

									<Dropdown.Item onClick={() => convertIntoUnordered(i.id)}>
										1. <BsArrowRight />
										<BsDot /> convert into unordered
									</Dropdown.Item>
								</>
							)}

							{!i.ordered && (
								<Dropdown.Item onClick={() => convertIntoOrdered(i.id)}>
									<BsDot />
									<BsArrowRight /> 1. convert into ordered
								</Dropdown.Item>
							)}

							<Dropdown.Divider />

							<Dropdown.Item onClick={() => addChildOrdered(i.id)}>
								<BsArrowReturnRight />
								<BsPlus /> 1. add ordered child
							</Dropdown.Item>

							<Dropdown.Item onClick={() => addChildUnordered(i.id)}>
								<BsArrowReturnRight />
								<BsPlus /> <BsDot /> add unordered child
							</Dropdown.Item>

							<Dropdown.Divider />

							<Dropdown.Item onClick={() => navigate("/issues/" + i.id)}>
								<BsEye /> view
							</Dropdown.Item>

							<Dropdown.Item
								onClick={() => navigate("/issues/" + i.id + "/edit")}
							>
								<BsPencilSquare /> edit
							</Dropdown.Item>

							{i.status &&
							(i.status === "open" || i.status === "in progress") ? (
								<Dropdown.Item onClick={() => resolve(i)}>
									<BsCheck2Square className="text-success" />{" "}
									<span className="text-success">resolve</span>
								</Dropdown.Item>
							) : (
								<Dropdown.Item onClick={() => reopen(i)}>
									<VscIssueReopened /> <span>reopen</span>
								</Dropdown.Item>
							)}

							<Dropdown.Item onClick={() => handleDeleteIssue(i)}>
								<BsTrash className="text-danger" />{" "}
								<span className="text-danger">delete</span>
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				{i.children && i.children.length ? (
					<RecursiveList
						issuesToList={
							i.children
								.map((id) => issues.find((iss) => iss.id === id))
								.filter((f) => f !== undefined) as Issue.AppIssue[]
						}
						root={i.id}
					/>
				) : null}
			</li>
		);
	}

	return (
		<>
			{
				rootIssuesOrdered && rootIssuesOrdered.length ? (
					<ol>
						{rootIssuesOrdered.map((i) => (
							<RecursiveListItem key={i.id} i={i} />
						))}
					</ol>
				) : null
				// <p>
				// 	There are no ordered issues yet...{" "}
				// 	<Link
				// 		to={createAddIssueLinkWithParams(
				// 			projectId,
				// 			true,
				// 			lastOrderedIssue ? lastOrderedIssue.id : null,
				// 			null,
				// 			root
				// 		)}
				// 	>
				// 		Add one!
				// 	</Link>
				// </p>
			}

			{
				rootIssuesUnordered && rootIssuesUnordered.length ? (
					<>
						{/* <Link
						to={createAddIssueLinkWithParams(
							projectId,
							false,
							null,
							null,
							root
						)}
					>
						+ Add unordered issue
					</Link> */}
						<ul>
							{rootIssuesUnordered
								.sort((a, b) => b.rank - a.rank)
								.map((i) => (
									<RecursiveListItem key={i.id} i={i} />
								))}
						</ul>
						{/* <Link
						to={createAddIssueLinkWithParams(
							projectId,
							false,
							null,
							null,
							root
						)}
					>
						+ Add unordered issue
					</Link> */}
					</>
				) : null
				// <p>
				// 	There are no unordered issues yet...{" "}
				// 	<Link
				// 		to={createAddIssueLinkWithParams(
				// 			projectId,
				// 			false,
				// 			null,
				// 			null,
				// 			root
				// 		)}
				// 	>
				// 		Add one!
				// 	</Link>
				// </p>
			}
		</>
	);
}
