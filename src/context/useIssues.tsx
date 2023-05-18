import { createContext, useContext, useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import {
	collection,
	doc,
	getDoc,
	writeBatch,
	arrayUnion,
	setDoc,
	arrayRemove,
} from "firebase/firestore";
import useUser from "./useUser";
import { Issue } from "../interfaces/Issue";
import logError from "../lib/logError";
import rankifyIssue from "../lib/rankifyIssue";
import unrankifyIssue from "../lib/unrankifyIssue";
import rankifyIssues from "../lib/rankifyIssues";

const IsuesContext = createContext<{
	issues: Issue.AppIssue[];
	setIssues: React.Dispatch<React.SetStateAction<Issue.AppIssue[]>>;
	loading: boolean;
	addIssue: (
		issueData: Issue.FormData,
		projectId: string,
		ordered: boolean,
		after: string | null,
		before: string | null
	) => Promise<string>;
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
	 * @returns The new issue ID.
	 */
	async function addIssue(
		issueFormData: Issue.FormData,
		projectId: string,
		ordered: boolean,
		after: string | null,
		before: string | null
	): Promise<string> {
		if (!user || !user.uid) {
			logError("You need to be logged to add an issue!");
			return "";
		}

		try {
			// get the id for new issue (create an empty doc):
			const { id: newIssueId } = doc(collection(firestore, "issues"));

			const creationTime = Date.now();

			const newIssue: Issue.DbIssue = {
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
			};

			// init batch to update multiply docs:
			const batch = writeBatch(firestore);

			// set new issue:
			const newIssueRef = doc(firestore, "issues", newIssueId);
			batch.set(newIssueRef, newIssue);

			// add newIssueId to /user-issues:
			// (add newIssueId to doc's "issues" array)
			const userIssuesRef = doc(firestore, "user-issues", user.uid);
			batch.update(userIssuesRef, {
				issuesIds: arrayUnion(newIssueId),
			});

			// add newIssueId to /project-issues:
			// (add newIssueId to doc's "issuesIds" array)
			const projectIssuesRef = doc(firestore, "project-issues", projectId);
			batch.update(projectIssuesRef, { issuesIds: arrayUnion(newIssueId) });

			// if new issue is ordered => update also after/ before issues if the case:
			if (newIssue.ordered) {
				if (newIssue.after) {
					const issueBeforeNewRef = doc(firestore, "issues", newIssue.after);
					batch.update(issueBeforeNewRef, {
						before: newIssueId,
						updated: creationTime,
					});
				}

				if (newIssue.before) {
					const issueAfterNewIssueRef = doc(
						firestore,
						"issues",
						newIssue.before
					);
					batch.update(issueAfterNewIssueRef, {
						after: newIssueId,
						updated: creationTime,
					});
				}
			}

			// Commit the batch
			await batch.commit();

			// rankify new issue:
			const newIssueRankified: Issue.AppIssue = rankifyIssue(newIssue);
			// update also after/ before issues if exist
			const updatedIssues = issues.map((i) =>
				newIssueRankified.after && newIssueRankified.after === i.id
					? { ...i, before: newIssueId, updated: creationTime }
					: newIssueRankified.before && newIssueRankified.before === i.id
					? { ...i, after: newIssueId, updated: creationTime }
					: i
			);

			setIssues([...updatedIssues, newIssueRankified]);

			return newIssueId;
		} catch (error: any) {
			logError(
				`An error occurred while adding an issue: ${error.message}. Cannot add issue.`
			);
			return "";
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

		const isConvertedIntoOrdered =
			!issueBeforeUpdates.ordered && updatedIssueWithUpdateTime.ordered;
		const isConvertedIntoUnordered =
			issueBeforeUpdates.ordered && !updatedIssueWithUpdateTime.ordered;

		// 1. & 2.:

		if (isIssueStatusChanged) {
			const { status: beforeStatus } = issueBeforeUpdates;
			const { status: currentStatus } = updatedIssue;

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

			setIssues(updatedIssues);
		} catch (error: any) {
			logError(
				`An error occurred while updating an issue: ${error.message}. Cannot update issue.`
			);
		}
	}

	async function deleteIssue(issueId: string, projectId: string) {
		// NOTE:
		// we need to delete issue from /issues collection
		// & also from /user-issues & /project-issues doc array
		// so we use batch

		if (!issueId)
			return logError("No issue id provided... Cannot delete issue.");

		if (!projectId)
			return logError("No issue project id provided... Cannot delete issue.");

		if (!user || (user && !user.uid))
			return logError("You need to be logged to delete issue. Log in!");

		try {
			// init batch to update multiply docs:
			// Get a new write batch
			const batch = writeBatch(firestore);

			// delete project:
			const deletedIssueRef = doc(firestore, "issues", issueId);
			batch.delete(deletedIssueRef);

			// delete issue id from /user-issues doc's "issuesIds" array:
			const userIssuesRef = doc(firestore, "user-issues", user.uid);
			batch.update(userIssuesRef, {
				issuesIds: arrayRemove(issueId),
			});

			// delete issue id from /project-issues doc's "issuesIds" array:
			const projectIssuesRef = doc(firestore, "project-issues", projectId);
			batch.update(projectIssuesRef, {
				issuesIds: arrayRemove(issueId),
			});

			// Commit the batch
			await batch.commit();

			// update app's state:
			const updatedIssues = issues.filter((i) => i.id !== issueId);
			setIssues(updatedIssues);
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
		addIssue,
		updateIssue,
		deleteIssue,
	};

	return (
		<IsuesContext.Provider value={value}>{children}</IsuesContext.Provider>
	);
}
