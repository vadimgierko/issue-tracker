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
	loading: boolean;
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
	findAllIssueChidrenRecursively: (
		issueToGetChildren: Issue.AppIssue
	) => Issue.AppIssue[];
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
	const [loading, setLoading] = useState(true);
	const [showClosedIssues, setShowClosedIssues] = useState(true);
	const { user } = useUser();

	console.log("user issues:", issues);

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

	function findIssueById(id: string): Issue.AppIssue | null {
		if (!id) return null;
		if (!issues || !issues.length) return null;

		const i = issues.find((i) => i.id === id);

		if (!i) return null;

		return i;
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

		// update parent if exist:
		const issueToAddParent: Issue.AppIssue | null = issueToAdd.parent
			? findIssueById(issueToAdd.parent)
			: null;

		const issueToAddParentUpdated: Issue.AppIssue | null = issueToAddParent
			? {
					...issueToAddParent,
					updated: creationTime,
					children:
						issueToAddParent.children && issueToAddParent.children.length
							? [...issueToAddParent.children, issueToAdd.id]
							: [issueToAdd.id],
			  }
			: null;

		console.log("updated parent in addIssue():", issueToAddParentUpdated);

		const issuesToUpdate: Issue.AppIssue[] = [
			...(issueToAddAfterUpdated ? [issueToAddAfterUpdated] : []),
			...(issueToAddBeforeUpdated ? [issueToAddBeforeUpdated] : []),
			...(issueToAddParentUpdated ? [issueToAddParentUpdated] : []),
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
		const children = findAllIssueChidrenRecursively(issue);

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

		const confirmToResolveChildrenIfExist =
			issue.children && issue.children.length
				? window.confirm(
						`The ${issue.title} issue you want to resolve has children issues, so resolving this parent issue will resolve all of its children. Are you sure you want to resolve all ${issue.title} issue children (${issue.children.length})?`
				  )
				: true;

		if (!confirmToResolveChildrenIfExist) return;

		const updateTime = Date.now();

		const updatedIssue: Issue.AppIssue = {
			...issue,
			updated: updateTime,
			closedAt: updateTime,
			status: "resolved",
		};

		// when issue has children =>
		// check recursively, if there are futher grand chidren =>
		// resolve all children & grand children:
		const children = findAllIssueChidrenRecursively(issue);

		if (children && children.length) {
			console.warn(
				"issue to resolve has children, so need to resolve children also:",
				issue.children
			);
		} else {
			console.warn("issue to resolve has no children => no need to update.");
		}

		const resolvedChildren: Issue.AppIssue[] | null =
			children && children.length
				? children.map((i) => ({
						...i,
						updated: updateTime,
						closedAt: updateTime,
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

	function findAllIssueChidrenRecursively(
		issueToGetChildren: Issue.AppIssue,
		prevChildren: Issue.AppIssue[] = []
	) {
		let children: Issue.AppIssue[] = prevChildren;

		if (!issueToGetChildren) return prevChildren;
		//console.log("looking for children of", issueToGetChildren.title);

		if (
			!issueToGetChildren.children ||
			(issueToGetChildren.children && !issueToGetChildren.children.length)
		)
			return [];

		// console.log(
		// 	issueToGetChildren.title,
		// 	"has",
		// 	issueToGetChildren.children.length,
		// 	"children:",
		// 	issueToGetChildren.children
		// );

		issueToGetChildren.children.forEach((i, x) => {
			const childIssue = findIssueById(i);

			if (childIssue) {
				//console.log("child issue", x + 1, ":", childIssue.title);

				if (childIssue.children && childIssue.children.length) {
					// console.log(
					// 	"child issue",
					// 	x + 1,
					// 	childIssue.title,
					// 	"has children too! Check for its children!"
					// );
					findAllIssueChidrenRecursively(childIssue, children);
				} else {
					// console.log(
					// 	"child issue",
					// 	x + 1,
					// 	childIssue.title,
					// 	"has no children. Push it to children[] to delete..."
					// );
				}

				children.push(childIssue);
			}
		});

		return children;
	}

	async function reopenIssue(issue: Issue.AppIssue) {
		if (!issue) return;

		const updateTime = Date.now();

		const updatedIssue: Issue.AppIssue = {
			...issue,
			updated: updateTime,
			closedAt: null,
			inProgressFrom: null,
			status: "open",
		};

		try {
			await updateIssues({ update: [updatedIssue] });
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

		try {
			await updateIssues({ update: [updatedIssue] });
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

	// fetch user issuesIds array from /user-issues collection,
	// then fetch those issues:
	useEffect(() => {
		async function fetchIssues(uid: string) {
			try {
				// fetch user issuesIds array from user-issues collection:

				const docRef = doc(firestore, "user-issues", uid);
				const docSnap = await getDoc(docRef);

				// if (docSnap.exists()) {
				// 	console.log("User projects document data:", docSnap.data());
				// } else {
				// 	// docSnap.data() will be undefined in this case
				// 	console.log("No user projects document!");
				// }

				const userIssuesDoc = docSnap.data();

				// then if there are user issues ids,
				// fetch those issues data:

				if (userIssuesDoc) {
					const issuesIds: string[] = userIssuesDoc.issuesIds;
					console.log("User issues ids:", issuesIds);

					const fetchedUserIssues = await Promise.all(
						issuesIds.map(async (issueId) => {
							const docRef = doc(firestore, "issues", issueId);
							const docSnap = await getDoc(docRef);
							if (docSnap.exists()) {
								return docSnap.data() as Issue.DbIssue;
							}
						})
					);

					if (fetchedUserIssues) {
						const filteredIssues = fetchedUserIssues.filter(
							(issue) => issue !== undefined
						) as Issue.DbIssue[];

						// rankify issues & add to app state:
						setIssues(rankifyIssues(filteredIssues));
					}
				} else {
					setIssues([]);
				}
			} catch (error: any) {
				if (error.code === "not-found") {
					// Handle case where collection doesn't exist
					logError(error.message);
					setIssues([]);
				} else {
					// Handle other errors
					logError(error.message);
					setIssues([]);
				}
			} finally {
				setLoading(false);
			}
		}

		if (!loading) return;
		if (!user) return;

		fetchIssues(user.uid);
	}, [loading, user]);

	// clear state when user is logged out:
	useEffect(() => {
		if (!user) {
			setIssues([]);
			setLoading(true);
		}
	}, [user]);

	const value = {
		issues,
		setIssues,
		loading,
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
		findAllIssueChidrenRecursively,
	};

	return (
		<IsuesContext.Provider value={value}>{children}</IsuesContext.Provider>
	);
}
