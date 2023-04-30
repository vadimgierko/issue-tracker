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

const IsuesContext = createContext<{
	issues: Issue.Issue[];
	setIssues: React.Dispatch<React.SetStateAction<Issue.Issue[]>>;
	loading: boolean;
	addIssue: (issueData: Issue.Data, projectId: string) => Promise<string>;
	updateIssue: (updatedIssue: Issue.Issue) => Promise<void>;
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
	const [issues, setIssues] = useState<Issue.Issue[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useUser();

	console.log("user issues:", issues);

	/**
	 * Add a new issue to the project & returns new issue id.
	 * @returns The new issue ID.
	 */
	async function addIssue(
		issueData: Issue.Data,
		projectId: string
	): Promise<string> {
		if (!user || !user.uid) {
			logError("You need to be logged to add an issue!");
			return "";
		}

		try {
			// get the id for new issue (create an empty doc):
			const { id: newIssueId } = doc(collection(firestore, "issues"));

			const creationTime = Date.now();
			// complete issue document object with authorId & project id:
			const newIssue: Issue.Issue = {
				...issueData,
				authorId: user.uid,
				projectId,
				id: newIssueId,
				created: creationTime,
				updated: creationTime,
				inProgressFrom: null,
				closedAt: null,
			};

			// init batch to update multiply docs:
			// Get a new write batch
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

			// Commit the batch
			await batch.commit();

			setIssues([...issues, newIssue]);

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
	async function updateIssue(updatedIssue: Issue.Issue) {
		// NOTE:
		// as we have issue data only in /issues collection,
		// we need to update it only there
		if (!updatedIssue)
			return logError("No updated issue data provided... Cannot update issue.");

		try {
			const issueBeforeUpdates = issues.find((i) => i.id === updatedIssue.id)!;
			const updateTime = Date.now();
			const isIssueStatusChanged =
				issueBeforeUpdates.status !== updatedIssue.status;

			let updatedIssueWithAdditionalUpdates: Issue.Issue = {
				...updatedIssue,
				updated: updateTime,
			};

			if (isIssueStatusChanged) {
				const { status: beforeStatus } = issueBeforeUpdates;
				const { status: currentStatus } = updatedIssue;

				if (beforeStatus === "open" && currentStatus === "in progress") {
					updatedIssueWithAdditionalUpdates.inProgressFrom = updateTime;
				} else if (beforeStatus === "in progress" && currentStatus !== "open") {
					updatedIssueWithAdditionalUpdates.closedAt = updateTime;
				} else if (beforeStatus === "in progress" && currentStatus === "open") {
					updatedIssueWithAdditionalUpdates.inProgressFrom = null;
				} else if (
					!["open", "in progress"].includes(beforeStatus) &&
					currentStatus === "in progress"
				) {
					updatedIssueWithAdditionalUpdates = {
						...updatedIssueWithAdditionalUpdates,
						inProgressFrom: updateTime,
						closedAt: null,
					};
				} else if (
					!["open", "in progress"].includes(beforeStatus) &&
					currentStatus === "open"
				) {
					updatedIssueWithAdditionalUpdates = {
						...updatedIssueWithAdditionalUpdates,
						inProgressFrom: null,
						closedAt: null,
					};
				}
			}

			await setDoc(
				doc(firestore, "issues", updatedIssue.id),
				updatedIssueWithAdditionalUpdates
			);

			// update app's state:
			const updatedIssues = issues.map((i) =>
				i.id === updatedIssue.id ? updatedIssueWithAdditionalUpdates : i
			);
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

	// fetch user issuesIds array from user-issues collection,
	// then fetch those issues data:
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
								return docSnap.data() as Issue.Issue;
							}
						})
					);

					if (fetchedUserIssues) {
						const filteredIssues = fetchedUserIssues.filter(
							(issue) => issue !== undefined
						) as Issue.Issue[];
						setIssues(filteredIssues);
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
