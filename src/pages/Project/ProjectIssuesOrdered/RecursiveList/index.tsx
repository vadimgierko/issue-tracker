import { Badge, Dropdown } from "react-bootstrap";
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
	BsRocketTakeoff,
} from "react-icons/bs";
import { VscIssueReopened } from "react-icons/vsc";
import useTheme from "../../../../context/useTheme";

export default function RecursiveList({
	issuesToList,
	root,
}: {
	issuesToList: Issue.AppIssue[]; // open & in progress project issues only
	root: string | null;
}) {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const { projectId } = useParams();
	const {
		issues,
		findIssueById,
		updateIssues,
		deleteIssue,
		reopenIssue,
		resolveIssue,
		setToInProgressIssue,
		showClosedIssues,
		showRank,
		findAllIssueChidrenRecursively,
	} = useIssues();
	if (!projectId) return null;

	const rootIssues = issuesToList.filter((i) => !i.parent || i.parent === root);

	const rootIssuesOrdered = listifyIssues(rootIssues.filter((i) => i.ordered));
	// console.log("ordered root issues:", rootIssuesOrdered);

	const rootIssuesUnordered = rootIssues.filter((i) => !i.ordered);
	// console.log("unordered root issues:", rootIssuesUnordered);

	const lastOrderedIssue =
		rootIssuesOrdered && rootIssuesOrdered.length
			? rootIssuesOrdered[rootIssuesOrdered.length - 1]
			: null;

	// THESE FUNCTIONS BELOW ARE HERE & NOT IN useIssues()
	// BECAUSE THEY ARE NEEDED ONLY HERE:

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

	//=============================================================

	function RecursiveListItem({ i }: { i: Issue.AppIssue }) {
		return (
			<li>
				<div style={{ display: "flex" }}>
					<span>
						<span
							style={{
								textDecoration: i.closedAt ? "line-through" : "",
								backgroundColor:
									i.status === "in progress" ? "rgb(50, 140, 113)" : "",
								color: i.status === "in progress" ? "white" : "",
							}}
						>
							{i.title}
						</span>{" "}
						{i.children && i.children.length ? (
							<Badge
								bg={theme === "dark" ? "light" : "dark"}
								className={`me-1 text-${theme}`}
							>
								{
									findAllIssueChidrenRecursively(i).filter(
										(child) =>
											child.status !== "open" && child.status !== "in progress"
									).length
								}
								/{findAllIssueChidrenRecursively(i).length}
							</Badge>
						) : (
							""
						)}
						{showRank && <span>({i.rank}/90)</span>}
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

							{i.status && i.status === "open" && (
								<Dropdown.Item onClick={() => setToInProgressIssue(i)}>
									<BsRocketTakeoff />{" "}
									<span className="text-primary">in progress...</span>
								</Dropdown.Item>
							)}

							{i.status &&
							(i.status === "open" || i.status === "in progress") ? (
								<Dropdown.Item onClick={() => resolveIssue(i)}>
									<BsCheck2Square className="text-success" />{" "}
									<span className="text-success">resolve</span>
								</Dropdown.Item>
							) : (
								<Dropdown.Item onClick={() => reopenIssue(i)}>
									<VscIssueReopened /> <span>reopen</span>
								</Dropdown.Item>
							)}

							<Dropdown.Divider />

							<Dropdown.Item onClick={() => navigate("/issues/" + i.id)}>
								<BsEye /> view
							</Dropdown.Item>

							<Dropdown.Item
								onClick={() => navigate("/issues/" + i.id + "/edit")}
							>
								<BsPencilSquare /> edit
							</Dropdown.Item>

							<Dropdown.Item onClick={() => deleteIssue(i)}>
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
			{rootIssuesOrdered && rootIssuesOrdered.length ? (
				<ol>
					{rootIssuesOrdered
						.filter((i) =>
							showClosedIssues
								? true
								: i.status === "open" || i.status === "in progress"
						)
						.map((i) => (
							<RecursiveListItem key={i.id} i={i} />
						))}
				</ol>
			) : null}

			{rootIssuesUnordered && rootIssuesUnordered.length ? (
				<>
					<ul>
						{rootIssuesUnordered
							.sort((a, b) => b.rank - a.rank)
							.filter((i) =>
								showClosedIssues
									? true
									: i.status === "open" || i.status === "in progress"
							)
							.map((i) => (
								<RecursiveListItem key={i.id} i={i} />
							))}
					</ul>
				</>
			) : null}
		</>
	);
}
