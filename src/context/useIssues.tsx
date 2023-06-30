import { createContext, useContext, useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import {
	collection,
	doc,
	getDoc,
	writeBatch,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore";
import useUser from "./useUser";
import { Issue } from "../interfaces/Issue";
import logError from "../lib/logError";
import rankifyIssue from "../lib/rankifyIssue";
import unrankifyIssue from "../lib/unrankifyIssue";
import rankifyIssues from "../lib/rankifyIssues";

type UpdateIssuesProps = {
	add?: Issue.AppIssue[];
	update?: Issue.AppIssue[];
	delete?: Issue.AppIssue[];
};

const IsuesContext = createContext<{
	issues: Issue.AppIssue[];
	setIssues: React.Dispatch<React.SetStateAction<Issue.AppIssue[]>>;
	findIssueById: (id: string) => Issue.AppIssue | null;
	updateIssues: (props: UpdateIssuesProps) => Promise<void>;
	addIssue: (
		issueData: Issue.FormData,
		projectId: string,
		ordered: boolean,
		after: string | null,
		before: string | null,
		parent: string | null
	) => Promise<string | null>;
	updateIssueData: (updatedIssue: Issue.AppIssue) => Promise<void>;
	deleteIssue: (issue: Issue.AppIssue) => Promise<void>;
	resolveIssue: (issue: Issue.AppIssue) => Promise<void>;
	reopenIssue: (issue: Issue.AppIssue) => Promise<void>;
	setToInProgressIssue: (issue: Issue.AppIssue) => Promise<void>;
	showClosedIssues: boolean;
	setShowClosedIssues: React.Dispatch<React.SetStateAction<boolean>>;
	showRank: boolean;
	setShowRank: React.Dispatch<React.SetStateAction<boolean>>;
	sortUnorderedIssuesByRank: boolean;
	setSortUnorderedIssuesByRank: React.Dispatch<React.SetStateAction<boolean>>;
	findAllIssueChidren: (issueToGetChildren: Issue.AppIssue) => Issue.AppIssue[];
	fetchIssue: (issueId: string) => Promise<void>;
	addAsAchildTo: (issue: Issue.AppIssue, newParentId: string) => Promise<void>;
	removeFromParent: (issue: Issue.AppIssue) => Promise<void>;
} | null>(null);

export default function useIssues() {
	const context = useContext(IsuesContext);

	if (!context) {
		throw new Error("useIssues has to be used within <IsuesContext.Provider>");
	}

	return context;
}

type IssuesProviderProps = {
	children: React.ReactNode;
};

export function IssuesProvider({ children }: IssuesProviderProps) {
	const [issues, setIssues] = useState<Issue.AppIssue[]>([]);

	const [showClosedIssues, setShowClosedIssues] = useState(false);
	const [showRank, setShowRank] = useState(false);
	const [sortUnorderedIssuesByRank, setSortUnorderedIssuesByRank] =
		useState(false);

	const { user } = useUser();

	//============================ helper functions =======================//

	function findAllIssueParents(
		issue: Issue.AppIssue,
		prevParents: Issue.AppIssue[] = []
	): Issue.AppIssue[] {
		const parents = [...prevParents];

		if (!issue || !issue.parent) return parents;

		const parent = findIssueById(issue.parent);

		if (parent) {
			parents.push(parent);
			return findAllIssueParents(parent, parents);
		}

		return parents;
	}

	function findIssueById(id: string): Issue.AppIssue | null {
		if (!id) return null;
		if (!issues || !issues.length) return null;

		const i = issues.find((i) => i.id === id);

		if (!i) return null;

		return i;
	}

	function findAllIssueChidren(
		issueToGetChildren: Issue.AppIssue,
		prevChildren: Issue.AppIssue[] = []
	) {
		let children: Issue.AppIssue[] = prevChildren;

		if (!issueToGetChildren) return children;
		//console.log("looking for children of", issueToGetChildren.title);

		if (
			!issueToGetChildren.children ||
			(issueToGetChildren.children && !issueToGetChildren.children.length)
		)
			return children;

		issueToGetChildren.children.forEach((i, x) => {
			const childIssue = findIssueById(i);

			if (childIssue) {
				if (childIssue.children && childIssue.children.length) {
					findAllIssueChidren(childIssue, children);
				}

				children.push(childIssue);
			}
		});

		return children;
	}

	function isLastUnresolvedParentIssue(parent: Issue.AppIssue) {
		const parentChildren: Issue.AppIssue[] = [];

		if (parent && parent.children) {
			parent.children.forEach((id) => {
				const i = findIssueById(id);
				if (i) {
					parentChildren.push(i);
				}
			});
		}
		//console.log(`${issue.title} parent children:`, parentChildren);

		const unresolvedParentChildren = parentChildren.length
			? parentChildren.filter(
					(i) => i.status === "open" || i.status === "in progress"
			  )
			: [];
		// console.log(
		// 	`${issue.title} parent unresolved children:`,
		// 	unresolvedParentChildren
		// );

		if (unresolvedParentChildren.length === 1) {
			return true;
		}

		return false;
	}

	//=========================== helper functions END ====================//

	async function fetchIssue(issueId: string) {
		console.log("fetching issue...");
		if (!user || !issueId)
			return console.error(
				"no logged user or no issue id... can not fetch issue"
			);

		if (issues.find((i) => i.id === issueId))
			return console.warn(
				`Issue with ${issueId} is already fetched. No need to fetch again.`
			);

		try {
			const docRef = doc(firestore, "issues", issueId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const fetchedIssue: Issue.DbIssue = docSnap.data() as Issue.DbIssue;
				console.log("Document data:", docSnap.data());
				const rankifiedIssue = rankifyIssue(fetchedIssue);

				if (rankifiedIssue) {
					setIssues([...issues, rankifiedIssue]);
				}
			} else {
				// docSnap.data() will be undefined in this case
				console.log("Found no issue with the id:", issueId);
			}
		} catch (error: any) {
			console.error(error);
			alert(error);
		}
	}

	/**
	 * This is a reusable function, that uses writeBatch(),
	 * so all passed issues will be deleted, added or updated
	 * in 1 single batch.
	 *
	 * It cares about deleting issues from all related collections
	 * & adding issues to all related collections.
	 *
	 * Also it updates app state automatically.
	 *
	 * So just pass all issues that need to be added, deleted or updated
	 * via add, delete or update prop
	 * and updateIssues() will take care of them.
	 *
	 * NOTE: you need to pass issues with updateTime!
	 *
	 * @param {UpdateIssuesProps} props {add?: Issue.AppIssue[], update?: Issue.AppIssue[], delete?: Issue.AppIssue[]}.
	 *
	 */
	async function updateIssues(props: UpdateIssuesProps) {
		console.log("issues to update:", props);

		if (!user || (user && !user.uid))
			return logError("You need to be logged to update issues. Log in!");

		const { add, update, delete: deleteIssues } = props;

		//==================================> INIT BATCH:

		const batch = writeBatch(firestore);

		//==================================> BATCH ADD:
		if (add && add.length) {
			add.forEach((i) => {
				// add new issue to /issues:
				const issueRef = doc(firestore, "issues", i.id);
				batch.set(issueRef, unrankifyIssue(i));

				// add new issue to /user-issues:
				const userIssuesRef = doc(firestore, "user-issues", user.uid);
				batch.update(userIssuesRef, {
					issuesIds: arrayUnion(i.id),
				});

				// add new issue to /project-issues:
				const projectIssuesRef = doc(firestore, "project-issues", i.projectId);
				batch.update(projectIssuesRef, { issuesIds: arrayUnion(i.id) });
			});
		}

		//==================================> BATCH UPDATE:
		if (update && update.length) {
			update.forEach((i) => {
				const issueRef = doc(firestore, "issues", i.id);
				batch.set(issueRef, unrankifyIssue(i));
			});
		}

		//==================================> BATCH DELETE:
		if (deleteIssues && deleteIssues.length) {
			deleteIssues.forEach((i) => {
				// delete issue from /issues:
				const issueRef = doc(firestore, "issues", i.id);
				batch.delete(issueRef);

				// delete issue id from /user-issues doc's "issuesIds" array:
				const userIssuesRef = doc(firestore, "user-issues", user.uid);
				batch.update(userIssuesRef, {
					issuesIds: arrayRemove(i.id),
				});

				// delete issue id from /project-issues doc's "issuesIds" array:
				const projectIssuesRef = doc(firestore, "project-issues", i.projectId);
				batch.update(projectIssuesRef, {
					issuesIds: arrayRemove(i.id),
				});
			});
		}

		//==================================> BATCH COMMIT:
		await batch.commit();

		//==================================> UPDATE APP STATE:

		// at first delete issues:
		const appIssuesAfterDelete: Issue.AppIssue[] = issues.filter((i) => {
			if (deleteIssues && deleteIssues.length) {
				const issueToDelete = deleteIssues.find((d) => d.id === i.id);

				if (issueToDelete) return false;
			}

			return true;
		});

		// then update remaining issues:
		const appIssuesAfterUpdate: Issue.AppIssue[] = appIssuesAfterDelete.map(
			(i) => {
				if (update && update.length) {
					const issueToUpdate = update.find((f) => f.id === i.id);

					if (issueToUpdate) {
						return issueToUpdate;
					}
				}

				return i;
			}
		);

		// finally add new issues:
		const appIssuesAfterAdd: Issue.AppIssue[] =
			add && add.length
				? [...appIssuesAfterUpdate, ...add]
				: [...appIssuesAfterUpdate];

		const rerankifiedUpdatedIssues = rankifyIssues(appIssuesAfterAdd);
		setIssues(rerankifiedUpdatedIssues);
	}

	/**
	 * @returns The new issue ID or null.
	 */
	async function addIssue(
		issueFormData: Issue.FormData,
		projectId: string,
		ordered: boolean,
		after: string | null,
		before: string | null,
		parent: string | null
	): Promise<string | null> {
		if (!user || !user.uid) {
			logError("You need to be logged to add an issue!");
			return null;
		}
		// get the id for new issue (create an empty doc):
		const { id: newIssueId } = doc(collection(firestore, "issues"));

		const creationTime = Date.now();

		const issueToAdd: Issue.DbIssue = {
			...issueFormData,
			authorId: user.uid,
			projectId,
			id: newIssueId,
			created: creationTime,
			updated: creationTime,
			inProgressFrom: null,
			closedAt: null,
			ordered,
			after,
			before,
			parent,
		};

		// if new issue is ordered => update also after/ before issues if exist:
		const issueToAddAfter: Issue.AppIssue | null =
			issueToAdd.ordered && issueToAdd.after
				? findIssueById(issueToAdd.after)
				: null;
		const issueToAddBefore: Issue.AppIssue | null =
			issueToAdd.ordered && issueToAdd.before
				? findIssueById(issueToAdd.before)
				: null;

		const issueToAddAfterUpdated: Issue.AppIssue | null = issueToAddAfter
			? { ...issueToAddAfter, before: newIssueId, updated: creationTime }
			: null;
		const issueToAddBeforeUpdated: Issue.AppIssue | null = issueToAddBefore
			? { ...issueToAddBefore, after: newIssueId, updated: creationTime }
			: null;

		// update & reopen parent if exist:
		const issueToAddParent: Issue.AppIssue | null = issueToAdd.parent
			? findIssueById(issueToAdd.parent)
			: null;

		const issueToAddParentUpdated: Issue.AppIssue | null = issueToAddParent
			? {
					...issueToAddParent,
					// if parent was closed, reopen it manually:
					status:
						issueToAddParent.status !== "open" &&
						issueToAddParent.status !== "in progress"
							? "open"
							: issueToAddParent.status,
					closedAt: null,
					//=========================================//
					updated: creationTime,
					children:
						issueToAddParent.children && issueToAddParent.children.length
							? [...issueToAddParent.children, issueToAdd.id]
							: [issueToAdd.id],
			  }
			: null;

		// now reopen potentially existing parent's parents:
		const reopenedResolvedParents: Issue.AppIssue[] = issueToAddParent
			? findAllIssueParents(issueToAddParent)
					.filter((i) => i.status !== "open" && i.status !== "in progress")
					.map((i) => ({
						...i,
						status: "open",
						updated: creationTime,
						closedAt: null,
					}))
			: [];

		console.log("updated parent in addIssue():", issueToAddParentUpdated);

		const issuesToUpdate: Issue.AppIssue[] = [
			...(issueToAddAfterUpdated ? [issueToAddAfterUpdated] : []),
			...(issueToAddBeforeUpdated ? [issueToAddBeforeUpdated] : []),
			...(issueToAddParentUpdated ? [issueToAddParentUpdated] : []),
			...reopenedResolvedParents,
		];

		try {
			await updateIssues({
				add: [rankifyIssue(issueToAdd)],
				update: issuesToUpdate,
			});
			return newIssueId;
		} catch (error: any) {
			logError(
				`An error occurred while adding an issue: ${error.message}. Cannot add issue.`
			);
			return null;
		}
	}

	/**
	 * Updates only issue data.
	 */
	async function updateIssueData(updatedIssue: Issue.AppIssue) {
		// NOTE:
		// as we have issue data only in /issues collection,
		// we need to update it only there
		if (!updatedIssue)
			return logError("No updated issue data provided... Cannot update issue.");

		const issueBeforeUpdates = findIssueById(updatedIssue.id);

		if (!issueBeforeUpdates) return;

		const updateTime = Date.now();

		try {
			await updateIssues({
				update: [{ ...updatedIssue, updated: updateTime }],
			});

			console.log(
				`Issue ${issueBeforeUpdates.id} ${issueBeforeUpdates.title} was successfully updated.`
			);
			alert(
				`Issue ${issueBeforeUpdates.id} ${issueBeforeUpdates.title} was successfully updated.`
			);
		} catch (error: any) {
			console.error(error);
			alert(error);
		}
	}

	async function deleteIssue(issue: Issue.AppIssue) {
		if (!user || (user && !user.uid))
			return logError("You need to be logged to delete issue. Log in!");

		if (!issue) {
			return logError("No issue id provided... Cannot delete issue.");
		} else {
			console.warn("issue to delete:", issue.title, issue.id, issue);
		}

		const confirmToDelete = window.confirm(
			`Are you sure you want to delete ${issue.title} issue permanently? This action can not be undone!`
		);

		if (!confirmToDelete) return;

		const confirmToDeleteChildrenIfExist =
			issue.children && issue.children.length
				? window.confirm(
						`The ${issue.title} issue you want to delete has children issues, so deleting this parent issue will delete all of its children. Are you sure you want to delete all ${issue.title} issue children (${issue.children.length})? This action cannot be undone!`
				  )
				: true;

		if (!confirmToDeleteChildrenIfExist) return;

		const deleteTime = Date.now();

		const after = issue.after ? findIssueById(issue.after) : null;
		const afterUpdated = after
			? {
					...after,
					before: issue.before,
					updated: deleteTime,
			  }
			: null;

		if (after) {
			console.warn(
				"issue to delete has after prop, so need to update the issue before:",
				after.title,
				after.id
			);
		} else {
			console.warn("issue to delete has no after prop => no need to update.");
		}

		const before = issue.before ? findIssueById(issue.before) : null;
		const beforeUpdated = before
			? {
					...before,
					after: issue.after,
					updated: deleteTime,
			  }
			: null;

		if (before) {
			console.warn(
				"issue to delete has before prop, so need to update the issue after:",
				before.title,
				before.id
			);
		} else {
			console.warn("issue to delete has no before prop => no need to update.");
		}

		// when issue has children =>
		// check recursively, if there are futher grand chidren =>
		// delete all children & grand children:
		const children = findAllIssueChidren(issue);

		if (children && children.length) {
			console.warn(
				"issue to delete has children, so need to delete children:",
				issue.children
			);
		} else {
			console.warn("issue to delete has no children => no need to update.");
		}

		// when issue has parent => remove its id from parent children:
		const parent: Issue.AppIssue | null = issue.parent
			? findIssueById(issue.parent)
			: null;
		const parentUpdated: Issue.AppIssue | null = parent
			? {
					...parent,
					updated: deleteTime,
					children:
						parent.children && parent.children.length
							? parent.children.filter((id) => id !== issue.id)
							: [],
			  }
			: null;

		if (parent) {
			console.warn(
				"issue to delete has parent prop, so need to update parent:",
				parent.title,
				parent.id
			);
		} else {
			console.warn("issue to delete has no parent prop => no need to update.");
		}

		const issuesToDelete: Issue.AppIssue[] = [
			issue,
			...(children ? children : []),
		];

		const issuesToUpdate: Issue.AppIssue[] = [
			...(afterUpdated ? [afterUpdated] : []),
			...(beforeUpdated ? [beforeUpdated] : []),
			...(parentUpdated ? [parentUpdated] : []),
		];

		try {
			await updateIssues({
				update: issuesToUpdate,
				delete: issuesToDelete,
			});

			console.log(
				`Your issue ${issue.title} with the id ${issue.id} was successfully deleted.`
			);
			alert(
				`Your issue ${issue.title} with the id ${issue.id} was successfully deleted.`
			);
		} catch (error: any) {
			logError(
				`An error occurred while deleting an issue: ${error.message}. Cannot delete issue.`
			);
		}
	}

	async function resolveIssue(issue: Issue.AppIssue) {
		if (!issue) return;

		// get recursively all issue chidren:
		const children = findAllIssueChidren(issue);
		const unresolvedChildren = children.filter(
			(ch) => ch.status === "open" || ch.status === "in progress"
		);

		// check if the issue has parent,
		// if true => check if the issue is the last one unresolved child,
		// if true => resolve the parent (the process can be recursive),
		// if false => resolve the issue:

		const parent = issue.parent ? findIssueById(issue.parent) : null;
		//console.log(`${issue.title} parent:`, parent);

		if (parent && isLastUnresolvedParentIssue(parent)) {
			// console.log(
			// 	"isLastUnresolvedParentIssue?",
			// 	isLastUnresolvedParentIssue(issue, parent)
			// );
			resolveIssue(parent);
		} else {
			// const confirmToResolveChildrenIfExist =
			// 	unresolvedChildren && unresolvedChildren.length
			// 		? window.confirm(
			// 				`The ${issue.title} issue you want to resolve has children issues, so resolving this parent issue will resolve all of its children. Are you sure you want to resolve all ${issue.title} issue children (${unresolvedChildren.length})?`
			// 		  )
			// 		: true;

			// if (!confirmToResolveChildrenIfExist) return;

			const updateTime = Date.now();

			const updatedIssue: Issue.AppIssue = {
				...issue,
				updated: updateTime,
				closedAt: updateTime,
				inProgressFrom: issue.inProgressFrom
					? issue.inProgressFrom
					: updateTime,
				status: "resolved",
			};

			// resolve all UNRESOLVED children & grand children:

			if (unresolvedChildren && unresolvedChildren.length) {
				console.warn(
					`issue to resolve has ${unresolvedChildren.length} unresolved children, so need to resolve unresolved children also:`,
					unresolvedChildren
				);
			} else {
				console.warn(
					"issue to resolve has no unresolved children => no need to additionally resolve anything."
				);
			}

			const resolvedChildren: Issue.AppIssue[] | null =
				unresolvedChildren && unresolvedChildren.length
					? unresolvedChildren.map((i) => ({
							...i,
							updated: updateTime,
							closedAt: updateTime,
							inProgressFrom: i.inProgressFrom ? i.inProgressFrom : updateTime,
							status: "resolved",
					  }))
					: null;

			try {
				await updateIssues({
					update: [updatedIssue, ...(resolvedChildren ? resolvedChildren : [])],
				});
				console.log(
					`Issue ${issue.id} ${issue.title} was resolved successfully!"`
				);
				alert(`Issue ${issue.id} ${issue.title} was resolved successfully!"`);
			} catch (error: any) {
				console.log(error);
				alert(error);
			}
		}
	}

	async function reopenIssue(issue: Issue.AppIssue): Promise<void> {
		if (!issue) return;

		// if issue has children & all of them are resolved
		// block the ability to reopen an issue
		// without adding a new child or reopening of any of its children:

		if (issue.children && issue.children.length) {
			const children = issue.children.map((id) => findIssueById(id));
			const isSomeUnresolvedIssue = children.find(
				(i) => i !== null && (i.status === "open" || i.status === "in progress")
			);

			if (!isSomeUnresolvedIssue) {
				alert(
					`${issue.title} issue has children issues and all of them are resolved, so you cannot reopen the issue without adding a new child or reopening one of any of its children`
				);
				return;
			}
		}

		const updateTime = Date.now();

		const updatedIssue: Issue.AppIssue = {
			...issue,
			updated: updateTime,
			closedAt: null,
			inProgressFrom: null,
			status: "open",
		};

		const reopenedResolvedParents: Issue.AppIssue[] = findAllIssueParents(issue)
			.filter((i) => i.status !== "open" && i.status !== "in progress")
			.map((i) => ({
				...i,
				status: "open",
				updated: updateTime,
				closedAt: null,
				inProgressFrom: null,
			}));

		try {
			await updateIssues({
				update: [updatedIssue, ...reopenedResolvedParents],
			});
			console.log(
				`Issue ${issue.id} ${issue.title} was reopened successfully!"`
			);
			alert(`Issue ${issue.id} ${issue.title} was reopened successfully!"`);
		} catch (error: any) {
			console.log(error);
			alert(error);
		}
	}

	async function setToInProgressIssue(issue: Issue.AppIssue) {
		if (!issue) return;

		const updateTime = Date.now();

		const updatedIssue: Issue.AppIssue = {
			...issue,
			updated: updateTime,
			inProgressFrom: updateTime,
			status: "in progress",
		};

		// if issue has a parent & it's not in progress
		// set parents to in progress
		const parents = findAllIssueParents(issue);
		const parentsSetToInProgress: Issue.AppIssue[] = parents
			.filter((p) => p.status !== "in progress")
			.map((p) => ({
				...p,
				status: "in progress",
				updated: updateTime,
				inProgressFrom: updateTime,
			}));

		try {
			await updateIssues({ update: [updatedIssue, ...parentsSetToInProgress] });
			console.log(
				`Issue ${issue.id} ${issue.title} was set to be in progress successfully!`
			);
			alert(
				`Issue ${issue.id} ${issue.title} was set to be in progress successfully!`
			);
		} catch (error: any) {
			console.log(error);
			alert(error);
		}
	}

	async function addAsAchildTo(issue: Issue.AppIssue, newParentId: string) {
		if (!newParentId || !newParentId.length || !issue) return;

		const projectIssues = issues.filter((i) => i.projectId === issue.projectId);

		const updateTime = Date.now();

		const prevParent = projectIssues.find((i) => i.id === issue.parent);

		const updatedIssue: Issue.AppIssue = {
			...issue,
			parent: newParentId,
			ordered: false,
			after: null,
			before: null,
			updated: updateTime,
		};

		const resolvePrevParent: boolean = prevParent
			? isLastUnresolvedParentIssue(prevParent)
			: false;

		// update & resolve parent if needed:
		const updatedPrevParent: Issue.AppIssue | null = prevParent
			? {
					...prevParent,
					status: resolvePrevParent ? "resolved" : prevParent.status,
					closedAt: resolvePrevParent ? updateTime : null,
					updated: updateTime,
					children: prevParent.children
						? prevParent.children.filter((id) => id !== issue.id)
						: [],
			  }
			: null;

		//================== resolve prev grand parents if needed...

		const grandParentsToResolve: Issue.AppIssue[] = [];

		// helper function:
		function resolveIssueWithoutUpdatingIssues(issueToResolve: Issue.AppIssue) {
			const resolvedIssue: Issue.AppIssue = {
				...issueToResolve,
				status: "resolved",
				closedAt: updateTime,
				updated: updateTime,
			};

			return resolvedIssue;
		}

		if (resolvePrevParent) {
			const grandParents = prevParent ? findAllIssueParents(prevParent) : [];

			grandParents.forEach((g) => {
				const resolveGrandParent = isLastUnresolvedParentIssue(g);

				if (resolveGrandParent) {
					grandParentsToResolve.push(resolveIssueWithoutUpdatingIssues(g));
				}
			});
		}

		//=====================================================//

		const beforeIssue = projectIssues.find((i) => i.id === issue.after);

		const afterIssue = projectIssues.find((i) => i.id === issue.before);

		const newParent = projectIssues.find(
			(i) => i.id === newParentId
		) as Issue.AppIssue;

		const reopenNewParent =
			newParent.status !== "open" && newParent.status !== "in progress";

		const updatedNewParent: Issue.AppIssue = {
			...newParent,
			// if parent was closed, reopen it manually:
			status: reopenNewParent ? "open" : newParent.status,
			closedAt: null,
			//=========================================//
			updated: updateTime,
			children: newParent.children
				? [...newParent.children, updatedIssue.id]
				: [updatedIssue.id],
		};

		// now reopen potentially existing parent's parents:
		const reopenedResolvedParents: Issue.AppIssue[] =
			newParent && reopenNewParent
				? findAllIssueParents(newParent)
						.filter((i) => i.status !== "open" && i.status !== "in progress")
						.map((i) => ({
							...i,
							status: "open",
							updated: updateTime,
							closedAt: null,
						}))
				: [];

		const updatedBefore: Issue.AppIssue | null = beforeIssue
			? { ...beforeIssue, before: issue.before, updated: updateTime }
			: null;
		const updatedAfter: Issue.AppIssue | null = afterIssue
			? { ...afterIssue, after: issue.after, updated: updateTime }
			: null;

		const updatedIssues = [
			updatedIssue,
			updatedNewParent,
			...(updatedBefore ? [updatedBefore] : []),
			...(updatedAfter ? [updatedAfter] : []),
			...(updatedPrevParent ? [updatedPrevParent] : []),
			...reopenedResolvedParents,
			...grandParentsToResolve,
		];

		try {
			await updateIssues({ update: updatedIssues });
		} catch (error: any) {
			logError(
				`An error occurred while adding issue as a child: ${error.message}. Cannot add issue.`
			);
		}
	}

	async function removeFromParent(issue: Issue.AppIssue) {
		if (issue.status !== "open" && issue.status !== "in progress") {
			return console.error(
				"Issue is resolved, so cannnot be removed from parent..."
			);
		}

		if (!issue.parent)
			return console.error(
				"Issue doesn't have parent, so cannnot be removed from parent..."
			);

		const parent = findIssueById(issue.parent) as Issue.AppIssue;

		console.log("removing issue from parent...");

		const resolveParent: boolean = isLastUnresolvedParentIssue(parent);

		const updateTime = Date.now();

		const updatedParent: Issue.AppIssue = {
			...parent,
			status: resolveParent ? "resolved" : parent.status,
			updated: updateTime,
			closedAt: resolveParent ? updateTime : null,
			children: parent.children
				? parent.children.filter((id) => id !== issue.id)
				: [],
		};

		const newParent = updatedParent.parent
			? findIssueById(updatedParent.parent)
			: null;

		const updatedNewParent: Issue.AppIssue | null = newParent
			? {
					...newParent,
					children: newParent.children ? [...newParent.children, issue.id] : [],
					updated: updateTime,
			  }
			: null;

		const beforeIssue = issue.after ? findIssueById(issue.after) : null;

		const afterIssue = issue.before ? findIssueById(issue.before) : null;

		const updatedIssue: Issue.AppIssue = {
			...issue,
			parent: parent.parent,
			ordered: false,
			before: null,
			after: null,
			updated: updateTime,
		};

		const updatedBefore: Issue.AppIssue | null = beforeIssue
			? { ...beforeIssue, before: issue.before, updated: updateTime }
			: null;
		const updatedAfter: Issue.AppIssue | null = afterIssue
			? { ...afterIssue, after: issue.after, updated: updateTime }
			: null;

		const updatedIssues = [
			updatedIssue,
			updatedParent,
			...(updatedBefore ? [updatedBefore] : []),
			...(updatedAfter ? [updatedAfter] : []),
			...(updatedNewParent ? [updatedNewParent] : []),
		];

		try {
			await updateIssues({ update: updatedIssues });
		} catch (error: any) {
			logError(
				`An error occurred while removing issue from a parent: ${error.message}. Cannot remove issue from a parent.`
			);
		}
	}

	// TODO:
	async function removeFromAllParents(issue: Issue.AppIssue) {
		return console.error("not implemented yet...");
	}

	// clear state when user is logged out:
	useEffect(() => {
		if (!user) {
			setIssues([]);
		}
	}, [user]);

	const value = {
		issues,
		setIssues,
		findIssueById,
		updateIssues,
		addIssue,
		updateIssueData,
		deleteIssue,
		resolveIssue,
		reopenIssue,
		setToInProgressIssue,
		showClosedIssues,
		setShowClosedIssues,
		findAllIssueChidren,
		fetchIssue,
		showRank,
		setShowRank,
		setSortUnorderedIssuesByRank,
		sortUnorderedIssuesByRank,
		addAsAchildTo,
		removeFromParent,
	};

	return (
		<IsuesContext.Provider value={value}>{children}</IsuesContext.Provider>
	);
}
