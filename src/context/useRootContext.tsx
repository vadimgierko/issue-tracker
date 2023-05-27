import { createContext, useContext, useState, useEffect } from "react";
import logError from "../lib/logError";
import useIssues from "./useIssues";
import useProjects from "./useProjects";
import useUser from "./useUser";
import { Project } from "../interfaces/Project";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { Issue } from "../interfaces/Issue";
import rankifyIssues from "../lib/rankifyIssues";

const RootContext = createContext<{
	fetchProjectIssues: (project: Project.Project) => Promise<void>;
	fetchAllIssues: () => Promise<void>;
} | null>(null);

export default function useRootContext() {
	const context = useContext(RootContext);

	if (!context) {
		throw new Error(
			"useRootContext has to be used within <RootContext.Provider>"
		);
	}

	return context;
}

type RootContextProviderProps = {
	children: React.ReactNode;
};

export function RootContextProvider({ children }: RootContextProviderProps) {
	const { user } = useUser();
	const { issues, setIssues } = useIssues();
	const { projects } = useProjects();

	const [fetchedProjects, setFetchedProjects] = useState<string[]>([]); // array that contains the ids of projects whose issues are already fetched

	async function fetchProjectIssues(project: Project.Project) {
		if (!project || !user) return;

		console.info(`Fetching ${project.title} project's issues...`);

		if (fetchedProjects.length && fetchedProjects.includes(project.id)) {
			console.warn(
				`${project.title} issues are already fetched. No need to fetch it again.`
			);
			return;
		}

		try {
			// fetch project's issuesIds array:

			const docRef = doc(firestore, "project-issues", project.id);
			const docSnap = await getDoc(docRef);

			const projectIssuesDoc = docSnap.data();

			// then if there are project issues ids,
			// fetch those issues data:

			if (projectIssuesDoc) {
				const issuesIds: string[] = projectIssuesDoc.issuesIds;
				console.log(`${project.title} project's issues ids: ${issuesIds}`);

				const fetchedProjectIssues = await Promise.all(
					issuesIds.map(async (issueId) => {
						const docRef = doc(firestore, "issues", issueId);
						const docSnap = await getDoc(docRef);
						if (docSnap.exists()) {
							return docSnap.data() as Issue.DbIssue;
						}
					})
				);

				if (fetchedProjectIssues) {
					const filteredIssues = fetchedProjectIssues.filter(
						(issue) => issue !== undefined
					) as Issue.DbIssue[];

					// rankify issues & add to app state:
					const rankifiedProjectIssues = rankifyIssues(filteredIssues);

					// check if there are no duplicated issues:
					const issuesIds = issues.map((i) => i.id);
					const rankifiedProjectIssuesIds = rankifiedProjectIssues.map(
						(i) => i.id
					);
					const uniqueIds = rankifiedProjectIssuesIds.filter(
						(id) => !issuesIds.includes(id)
					);
					const uniqueFetchedProjectIssues: Issue.AppIssue[] =
						rankifiedProjectIssues.filter((i) => uniqueIds.includes(i.id));

					setFetchedProjects([...fetchedProjects, project.id]);
					setIssues([...issues, ...uniqueFetchedProjectIssues]);
				}
			} else {
				console.warn(
					`There are no issues in ${project.title} project so far...`
				);
			}
		} catch (error: any) {
			if (error.code === "not-found") {
				// Handle case where collection doesn't exist
				logError(error.message);
			} else {
				// Handle other errors
				logError(error.message);
			}
		}
	}

	async function fetchAllIssues() {
		if (!user) return;

		console.info(`Fetching all user's issues...`);

		const allProjectsIds = projects.map((p) => p.id);

		const notFetchedProjectsIds = allProjectsIds.filter(
			(id) => !fetchedProjects.includes(id)
		);

		if (notFetchedProjectsIds.length) {
			console.warn(
				"Need to fetch issues related to projects of ids:",
				notFetchedProjectsIds
			);

			notFetchedProjectsIds.forEach((id) => {
				const project: Project.Project | undefined = projects.find(
					(p) => p.id === id
				);
				if (project) {
					return fetchProjectIssues(project);
				}
			});
		} else {
			console.info(
				"There are all issues from all projects fetched already. No need to fetch them again."
			);
		}
	}

	const value = { fetchProjectIssues, fetchAllIssues };

	return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
}
