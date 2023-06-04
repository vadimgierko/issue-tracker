import { Issue } from "../../../../interfaces/Issue";
import listifyIssues from "../../../../lib/listifyIssues";
import useIssues from "../../../../context/useIssues";
import { useNavigate, useParams } from "react-router-dom";
import createAddIssueLinkWithParams from "../../../../lib/createAddIssueLinkWithParams";
import RecursiveListItem from "./RecursiveListItem";
import { useEffect, useState } from "react";

export default function RecursiveList({
	issuesToList,
	root,
}: {
	issuesToList: Issue.AppIssue[]; // open & in progress project issues only
	root: string | null;
}) {
	const navigate = useNavigate();
	const { projectId } = useParams();
	const { issues, findIssueById, updateIssues, showClosedIssues } = useIssues();

	//==================== D&D ==========================//
	const [dragging, setDragging] = useState<Issue.AppIssue | null>(null);
	const [over, setOver] = useState<Issue.AppIssue | null>(null);

	// this below is only for movement direction detecting:
	const [direction, setDirection] = useState<"down" | "up" | null>(null);
	const [prev, setPrev] = useState<number | null>(null);
	const [current, setCurrent] = useState<number | null>(null);

	function handleDragStart(i: Issue.AppIssue | null) {
		if (!i) return;
		setDragging(i);

		const index = issuesToList.indexOf(i);
		setCurrent(index);
		setPrev(index);
	}

	function handleDragOver(over: Issue.AppIssue | null) {
		if (!dragging || !over) return;
		if (dragging.id === over.id) return;

		setOver(over);

		// this is only to set direction of the movement:
		const index = issuesToList.indexOf(over);

		if (index !== current) {
			setPrev(current);
			setCurrent(index);
		}
		//=============================================//

		if (dragging.ordered && over.ordered) {
			// reorder index position:
			const reorderedItems: Issue.AppIssue[] = issuesToList.reduce(
				(reordered: Issue.AppIssue[], item: Issue.AppIssue) => {
					if (item.id === over.id) {
						return direction === "down"
							? [...reordered, over, dragging]
							: [...reordered, dragging, over];
					} else if (item.id === dragging.id) {
						return reordered;
					} else {
						return [...reordered, item];
					}
				},
				[]
			);

			// TODO:
			// MODIFY IT TO USE WITH ISSUES:

			// const convertedIntoBeforeAfter: Issue.AppIssue[] =
			// 	convertIndexesIntoBeforeAfterRelation(reorderedItems);

			// setItems(convertedIntoBeforeAfter);
		} else if (dragging.ordered && !over.ordered) {
			// convert into unordered
			// do not add dragging to reorderedItems =>
			// instead add converted dragging
			const convertedIntoUnordered: Issue.AppIssue = {
				...dragging,
				ordered: false,
				after: null,
				before: null,
			};

			const reorderedItems: Issue.AppIssue[] = issuesToList.reduce(
				(reordered: Issue.AppIssue[], item: Issue.AppIssue) => {
					if (item.id === over.id) {
						return direction === "down"
							? [...reordered, over, convertedIntoUnordered]
							: [...reordered, convertedIntoUnordered, over];
					} else if (item.id === dragging.id) {
						return reordered;
					} else {
						return [...reordered, item];
					}
				},
				[]
			);

			// TODO:
			// MODIFY IT TO USE WITH ISSUES:

			// const convertedIntoBeforeAfter: Issue.AppIssue[] =
			// 	convertIndexesIntoBeforeAfterRelation(reorderedItems);

			// setItems(convertedIntoBeforeAfter);
		} else if (!dragging.ordered && over.ordered) {
			// convert dragging into ordered
			// add draging to reorderedItems below (arr length++)
			// with over index
			const convertedIntoOrdered: Issue.AppIssue = {
				...dragging,
				ordered: true,
			};

			const reorderedItems: Issue.AppIssue[] = issuesToList.reduce(
				(reordered: Issue.AppIssue[], item: Issue.AppIssue) => {
					if (item.id === over.id) {
						return direction === "down"
							? [...reordered, over, convertedIntoOrdered]
							: [...reordered, convertedIntoOrdered, over];
					} else if (item.id === dragging.id) {
						return reordered;
					} else {
						return [...reordered, item];
					}
				},
				[]
			);

			// TODO:
			// MODIFY IT TO USE WITH ISSUES:

			// const convertedIntoBeforeAfter: Issue.AppIssue[] =
			// 	convertIndexesIntoBeforeAfterRelation(reorderedItems);

			// setItems(convertedIntoBeforeAfter);
		}

		// NOTE: there is no else for both unordered items (for now)
		// because those items will be sorted by ranking or other prop
	}

	function handleDragEnd() {
		if (!dragging || !over) return;
		if (dragging.id === over.id) return;

		// clear dragging state:
		setOver(null);
		setDragging(null);
		setCurrent(null);
		setPrev(null);
	}

	useEffect(() => console.log("set over:", over), [over]);
	useEffect(() => console.log("set dragging:", dragging), [dragging]);

	useEffect(() => {
		if (prev && current) {
			if (prev !== current) {
				const dir = current > prev ? "down" : "up";
				console.log("direction:", dir);
				setDirection(dir);
			} else {
				setDirection(null);
			}
		}
	}, [current, prev]);

	//=====================================================//

	if (!projectId) return null;

	const rootIssues = issuesToList.filter((i) => !i.parent || i.parent === root);

	const rootIssuesOrdered = listifyIssues(rootIssues.filter((i) => i.ordered));
	const rootIssuesUnordered = rootIssues.filter((i) => !i.ordered);

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
							<RecursiveListItem
								addChildOrdered={addChildOrdered}
								addChildUnordered={addChildUnordered}
								moveDown={moveDown}
								moveUp={moveUp}
								convertIntoOrdered={convertIntoOrdered}
								convertIntoUnordered={convertIntoUnordered}
								key={i.id}
								i={i}
								//========================================//
								handleDragStart={handleDragStart}
								handleDragOver={handleDragOver}
								handleDragEnd={handleDragEnd}
							/>
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
								<RecursiveListItem
									addChildOrdered={addChildOrdered}
									addChildUnordered={addChildUnordered}
									moveDown={moveDown}
									moveUp={moveUp}
									convertIntoOrdered={convertIntoOrdered}
									convertIntoUnordered={convertIntoUnordered}
									key={i.id}
									i={i}
									//========================================//
									handleDragStart={handleDragStart}
									handleDragOver={handleDragOver}
									handleDragEnd={handleDragEnd}
								/>
							))}
					</ul>
				</>
			) : null}
		</>
	);
}
