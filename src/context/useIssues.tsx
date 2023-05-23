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
	updateIssue: (updatedIssue: Issue.AppIssue) => Promise<void>;
	deleteIssue: (issueId: string, projectId: string) => Promise<void>;
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
	const { user } = useUser();

	console.log("user issues:", issues);

	/**
	 * This is a reusable function, that uses writeBatch(),
	 * so all passed issues will be set in 1 single batch.
	 * NOTE: you need to pass issues with updateTime!
	 *
	 * @param {UpdateIssuesProps} props - The payload object containing update property: {update: Issue.AppIssue[]}.
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

		// if new issue is ordered => update also after/ before issues if the case:
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

		// parent:
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
	 * Updates issue and adds update time automatically.
	 */
	async function updateIssue(updatedIssue: Issue.AppIssue) {
		// NOTE:
		// as we have issue data only in /issues collection,
		// we need to update it only there
		if (!updatedIssue)
			return logError("No updated issue data provided... Cannot update issue.");

		const issueBeforeUpdates = issues.find((i) => i.id === updatedIssue.id)!;

		const updateTime = Date.now();

		// update cases:
		// 1. only data update: just unrankify & update issue in db.
		// 2. status update: update status + unrankify & update issue in db.
		// 3. ordered false => true: check if there are after & before updates, update them + unrankify & update issue in db.
		// 4. ordered true => false: check if there are after & before updates, update them + unrankify & update issue in db.

		let updatedIssueWithUpdateTime: Issue.AppIssue = {
			...updatedIssue,
			updated: updateTime,
		};

		const isIssueStatusChanged =
			issueBeforeUpdates.status !== updatedIssueWithUpdateTime.status;

		const isIssueOrderedPropChanged =
			issueBeforeUpdates.ordered !== updatedIssueWithUpdateTime.ordered;

		// 1. & 2.:

		if (isIssueStatusChanged) {
			const { status: beforeStatus } = issueBeforeUpdates;
			const { status: currentStatus } = updatedIssueWithUpdateTime;

			if (beforeStatus === "open" && currentStatus === "in progress") {
				updatedIssueWithUpdateTime.inProgressFrom = updateTime;
			} else if (beforeStatus === "in progress" && currentStatus !== "open") {
				updatedIssueWithUpdateTime.closedAt = updateTime;
			} else if (beforeStatus === "in progress" && currentStatus === "open") {
				updatedIssueWithUpdateTime.inProgressFrom = null;
			} else if (
				!["open", "in progress"].includes(beforeStatus) &&
				currentStatus === "in progress"
			) {
				updatedIssueWithUpdateTime = {
					...updatedIssueWithUpdateTime,
					inProgressFrom: updateTime,
					closedAt: null,
				};
			} else if (
				!["open", "in progress"].includes(beforeStatus) &&
				currentStatus === "open"
			) {
				updatedIssueWithUpdateTime = {
					...updatedIssueWithUpdateTime,
					inProgressFrom: null,
					closedAt: null,
				};
			}
		}

		// unrankify updated issue to update it db:
		const updatedIssueUnrankified = unrankifyIssue(updatedIssueWithUpdateTime);

		try {
			const batch = writeBatch(firestore);

			// set updated issue:
			const updatedIssueRef = doc(
				firestore,
				"issues",
				updatedIssueUnrankified.id
			);
			batch.set(updatedIssueRef, updatedIssueUnrankified);

			let updatedIssueAfter: Issue.AppIssue | null = null;
			let updatedIssueBefore: Issue.AppIssue | null = null;

			if (isIssueOrderedPropChanged) {
				if (updatedIssueUnrankified.ordered) {
					if (updatedIssueUnrankified.after) {
						const issueAfter = issues.find(
							(i) => i.id === updatedIssueUnrankified.after
						);
						if (issueAfter) {
							updatedIssueAfter = {
								...issueAfter,
								before: updatedIssueUnrankified.id,
								updated: updateTime,
							};
						}
					}
				} else {
					const issueAfter = issues.find(
						(i) => i.id === issueBeforeUpdates.after
					);
					const issueBefore = issues.find(
						(i) => i.id === issueBeforeUpdates.before
					);
					if (issueAfter) {
						updatedIssueAfter = {
							...issueAfter,
							before: issueBeforeUpdates.before,
							updated: updateTime,
						};
					}
					if (issueBefore) {
						updatedIssueBefore = {
							...issueBefore,
							after: issueBeforeUpdates.after,
							updated: updateTime,
						};
					}
				}
			}

			if (updatedIssueAfter) {
				const updatedIssueAfterRef = doc(
					firestore,
					"issues",
					updatedIssueAfter.id
				);
				batch.set(updatedIssueAfterRef, unrankifyIssue(updatedIssueAfter));
			}

			if (updatedIssueBefore) {
				const updatedIssueBeforeRef = doc(
					firestore,
					"issues",
					updatedIssueBefore.id
				);
				batch.set(updatedIssueBeforeRef, unrankifyIssue(updatedIssueBefore));
			}

			batch.commit();

			// update app's state:
			const updatedIssues = issues.map((i) => {
				if (i.id === updatedIssue.id) {
					return updatedIssueWithUpdateTime;
				} else if (updatedIssueAfter && i.id === updatedIssueAfter.id) {
					return updatedIssueAfter;
				} else if (updatedIssueBefore && i.id === updatedIssueBefore.id) {
					return updatedIssueBefore;
				} else {
					return i;
				}
			});

			const rerankifiedUpdatedIssues = rankifyIssues(updatedIssues);
			setIssues(rerankifiedUpdatedIssues);
		} catch (error: any) {
			logError(
				`An error occurred while updating an issue: ${error.message}. Cannot update issue.`
			);
		}
	}

	async function deleteIssue(issueId: string, projectId: string) {
		if (!issueId)
			return logError("No issue id provided... Cannot delete issue.");

		if (!projectId)
			return logError("No issue project id provided... Cannot delete issue.");

		if (!user || (user && !user.uid))
			return logError("You need to be logged to delete issue. Log in!");

		const deleteTime = Date.now();

		const issueToDelete = findIssueById(issueId);

		if (!issueToDelete) {
			const message =
				"Issue to delete with the id " +
				issueId +
				" was not found in issues. Cannot delete issue...";
			return logError(message);
		}

		const issueToDeleteAfter = issueToDelete.after
			? findIssueById(issueToDelete.after)
			: null;
		const issueToDeleteAfterUpdated = issueToDeleteAfter
			? {
					...issueToDeleteAfter,
					before: issueToDelete.before,
					updated: deleteTime,
			  }
			: null;

		const issueToDeleteBefore = issueToDelete.before
			? findIssueById(issueToDelete.before)
			: null;
		const issueToDeleteBeforeUpdated = issueToDeleteBefore
			? {
					...issueToDeleteBefore,
					after: issueToDelete.after,
					updated: deleteTime,
			  }
			: null;

		const issuesToUpdate: Issue.AppIssue[] = [
			...(issueToDeleteAfterUpdated ? [issueToDeleteAfterUpdated] : []),
			...(issueToDeleteBeforeUpdated ? [issueToDeleteBeforeUpdated] : []),
		];

		try {
			await updateIssues({
				update: issuesToUpdate,
				delete: [issueToDelete],
			});
		} catch (error: any) {
			logError(
				`An error occurred while deleting an issue: ${error.message}. Cannot delete issue.`
			);
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
		updateIssue,
		deleteIssue,
	};

	return (
		<IsuesContext.Provider value={value}>{children}</IsuesContext.Provider>
	);
}
