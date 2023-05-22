import { Dropdown } from "react-bootstrap";
import { Issue } from "../../../../interfaces/Issue";
import listifyIssues from "../../../../lib/listifyIssues";
import useIssues from "../../../../context/useIssues";
import { Link, useNavigate, useParams } from "react-router-dom";
import createAddIssueLinkWithParams from "../../../../lib/createAddIssueLinkWithParams";
import {
	BsArrowDown,
	BsPlus,
	BsArrowUp,
	BsDot,
	BsArrowLeft,
	BsArrowRight,
	BsPencilSquare,
	BsEye,
	BsTrash,
	BsArrowReturnRight,
} from "react-icons/bs";

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
	const lastOrderedIssue =
		rootIssuesOrdered && rootIssuesOrdered.length
			? rootIssuesOrdered[rootIssuesOrdered.length - 1]
			: null;

	async function handleDeleteIssue(issue: Issue.AppIssue) {
		if (!issue) return alert("No issue was provided... Cannot delete issue.");

		if (
			window.confirm(
				"Are you sure you want to delete this issue permanently? This action can not be undone!"
			)
		) {
			await deleteIssue(issue.id, issue.projectId);
			alert(
				`Your issue ${issue.title} with the id ${issue.id} was successfully deleted.`
			);
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

	function RecursiveListItem({ i }: { i: Issue.AppIssue }) {
		return (
			<li>
				<div style={{ display: "flex" }}>
					{/* <Link to={"/issues/" + i.id} className="me-1">
						{i.title}
					</Link> */}
					<span>
						<strong>{i.title}</strong> ({i.rank}/90)
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

									<Dropdown.Item
										onClick={() =>
											navigate(
												createAddIssueLinkWithParams(
													i.projectId,
													true,
													null,
													null,
													i.id
												)
											)
										}
									>
										<BsArrowReturnRight />
										<BsPlus /> add child
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
										<BsDot /> transform into unordered
									</Dropdown.Item>
								</>
							)}

							{!i.ordered && (
								<Dropdown.Item onClick={() => convertIntoOrdered(i.id)}>
									<BsDot />
									<BsArrowRight /> 1. transform into ordered
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

							<Dropdown.Item onClick={() => handleDeleteIssue(i)}>
								<BsTrash className="text-danger" />{" "}
								<span className="text-danger">delete</span>
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
				<p>
					There are no ordered issues yet...{" "}
					<Link
						to={createAddIssueLinkWithParams(
							projectId,
							true,
							lastOrderedIssue ? lastOrderedIssue.id : null,
							null,
							root
						)}
					>
						Add one!
					</Link>
				</p>
			)}

			{rootIssuesUnordered && rootIssuesUnordered.length ? (
				<>
					<Link
						to={createAddIssueLinkWithParams(
							projectId,
							false,
							null,
							null,
							root
						)}
					>
						+ Add unordered issue
					</Link>
					<ul>
						{rootIssuesUnordered
							.sort((a, b) => b.rank - a.rank)
							.map((i) => (
								<RecursiveListItem key={i.id} i={i} />
							))}
					</ul>
					<Link
						to={createAddIssueLinkWithParams(
							projectId,
							false,
							null,
							null,
							root
						)}
					>
						+ Add unordered issue
					</Link>
				</>
			) : (
				<p>
					There are no unordered issues yet...{" "}
					<Link
						to={createAddIssueLinkWithParams(
							projectId,
							false,
							null,
							null,
							root
						)}
					>
						Add one!
					</Link>
				</p>
			)}
		</>
	);
}
