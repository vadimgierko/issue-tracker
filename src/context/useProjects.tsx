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
import { Project } from "../interfaces/Project";
import useUser from "./useUser";
import useIssues from "./useIssues";

const ProjectsContext = createContext<{
	projects: Project.Project[];
	loading: boolean;
	addProject: (projectData: Project.Data) => Promise<string>;
	updateProject: (updatedProject: Project.Project) => Promise<void>;
	deleteProject: (projectId: string) => Promise<void>;
} | null>(null);

export default function useProjects() {
	const context = useContext(ProjectsContext);

	if (!context) {
		throw new Error(
			"useProjects has to be used within <ProjectsContext.Provider>"
		);
	}

	return context;
}

type ProjectsProviderProps = {
	children: React.ReactNode;
};

export function ProjectsProvider({ children }: ProjectsProviderProps) {
	const [projects, setProjects] = useState<Project.Project[]>([]);
	const [loading, setLoading] = useState(true);
	const { user, firebaseUser } = useUser();
	const { issues, setIssues } = useIssues();

	console.log("user projects:", projects);

	/**
	 * @param projectData
	 * @returns The new project ID.
	 */
	async function addProject(projectData: Project.Data): Promise<string> {
		// =======================================================================
		// 1. add project to /projects
		// 2. add project id to /user-projects
		// 3. add project id to /project-issues
		if (user && user.uid) {
			try {
				// 1. add project to /projects
				// get the id for new project (create an empty doc):
				const { id: newProjectId } = doc(collection(firestore, "projects"));

				// complete project document object with authorId & project id:
				const newProject: Project.Project = {
					...projectData,
					authorId: user.uid,
					id: newProjectId,
				};

				// init batch to update multiply docs:
				// Get a new write batch
				const batch = writeBatch(firestore);

				// set new project:
				const newProjectRef = doc(firestore, "projects", newProjectId);
				batch.set(newProjectRef, newProject);

				// 2. add project id to /user-projects
				// (add newProjectId to doc's "projects" array)
				const userProjectsRef = doc(firestore, "user-projects", user.uid);
				batch.update(userProjectsRef, {
					projectsIds: arrayUnion(newProjectId),
				});

				// 3. add project id to /project-issues
				// init a doc with project issues ids in /project-issues collection:
				const projectIssuesRef = doc(firestore, "project-issues", newProjectId);
				batch.set(projectIssuesRef, { issuesIds: [] });

				// Commit the batch
				await batch.commit();

				setProjects([...projects, newProject]);

				return newProjectId;
			} catch (error: any) {
				const errorMessage = `An error occurred while adding the project: ${error.message}. Cannot add project.`;
				console.error(errorMessage);
				alert(errorMessage);
				return "";
			}
		}

		return "";
	}

	async function updateProject(updatedProject: Project.Project) {
		// NOTE:
		// as we have project data only in /projects collection,
		// we need to update it only there

		try {
			await setDoc(
				doc(firestore, "projects", updatedProject.id),
				updatedProject
			);

			// update app's state:
			const updatedProjects = projects.map((p) =>
				p.id === updatedProject.id ? updatedProject : p
			);
			setProjects(updatedProjects);
		} catch (error: any) {
			const errorMessage = `An error occurred while updating the project: ${error.message}. Cannot update project.`;
			console.error(errorMessage);
			alert(errorMessage);
		}
	}

	async function deleteProject(projectId: string) {
		// ===============================================================================
		// 1. delete project from /projects collection
		// 2. delete project from /user-projects doc array
		// 3. iterate through all project's issues ids in issues array in /project-issues
		//    & delete all these issues from /issues && /user-issues
		// 4. delete project from /project-issues

		try {
			if (!projectId)
				return console.error(
					"No project id provided... Cannot delete project."
				);

			if (!user || (user && !user.uid))
				return console.log("You need to be logged to delete project. Log in!");

			// init batch to update multiply docs:
			// Get a new write batch
			const batch = writeBatch(firestore);

			// get project's issues ids before deleting the project:
			const projectIssuesIds = issues
				.filter((i) => i.projectId === projectId)
				.map((i) => i.id);

			// 1. delete project from /projects collection
			const deletedProjectRef = doc(firestore, "projects", projectId);
			batch.delete(deletedProjectRef);

			// 2. delete project from /user-projects doc array
			const userProjectsRef = doc(firestore, "user-projects", user.uid);
			batch.update(userProjectsRef, {
				projectsIds: arrayRemove(projectId),
			});

			// 3. iterate through all project's issues ids in issues array in /project-issues
			//    & delete all these issues from /issues && /user-issues
			if (projectIssuesIds && projectIssuesIds.length) {
				projectIssuesIds.forEach((issueId) => {
					// delete all issues from /issues:
					const issueToDeleteRef = doc(firestore, "issues", issueId);
					batch.delete(issueToDeleteRef);

					// delete all issues ids from /user-issues:
					const userIssuesRef = doc(firestore, "user-issues", user.uid);
					batch.update(userIssuesRef, {
						issuesIds: arrayRemove(issueId),
					});
				});
			} else {
				console.warn(
					`Project with the id ${projectId} has no issues to delete.`
				);
			}

			// 4. delete project from /project-issues
			const projectIssuesRef = doc(firestore, "project-issues", projectId);
			batch.delete(projectIssuesRef);

			// Commit the batch
			await batch.commit();

			// update projects in app's state:
			const updatedProjects = projects.filter((p) => p.id !== projectId);
			setProjects(updatedProjects);

			// update issues in app's state:
			const updatedIssues = issues.filter((i) => i.projectId !== projectId);
			setIssues(updatedIssues);
		} catch (error: any) {
			const errorMessage = `An error occurred while deleting the project: ${error.message}. Cannot delete project.`;
			console.error(errorMessage);
			alert(errorMessage);
		}
	}

	// fetch user projects array from user-projects collection,
	// then fetch those projects data:
	useEffect(() => {
		async function fetchProjects(uid: string) {
			try {
				// fetch user projects array from user-projects collection:

				const docRef = doc(firestore, "user-projects", uid);
				const docSnap = await getDoc(docRef);

				const userProjectsDoc = docSnap.data();

				// then if there are user projects ids,
				// fetch those projects data:

				if (userProjectsDoc) {
					const projectsIds: string[] = userProjectsDoc.projectsIds;
					console.log("User projects ids:", projectsIds);

					const fetchedUserProjects = await Promise.all(
						projectsIds.map(async (projectId) => {
							const docRef = doc(firestore, "projects", projectId);
							const docSnap = await getDoc(docRef);
							if (docSnap.exists()) {
								return docSnap.data() as Project.Project;
							}
						})
					);

					if (fetchedUserProjects) {
						const filteredProjects = fetchedUserProjects.filter(
							(project) => project !== undefined
						) as Project.Project[];
						setProjects(filteredProjects);
					}
				} else {
					setProjects([]);
				}
			} catch (error: any) {
				if (error.code === "not-found") {
					// Handle case where collection doesn't exist
					console.error(error.message);
					setProjects([]);
				} else {
					// Handle other errors
					console.error(error.message);
					setProjects([]);
				}
			} finally {
				setLoading(false);
			}
		}

		if (!loading) return;
		if (!user) return;

		fetchProjects(user.uid);
	}, [loading, user, firebaseUser]);

	// clear state when user is logged out:
	useEffect(() => {
		if (!user) {
			setProjects([]);
			setLoading(true);
		}
	}, [user]);

	const value = {
		projects,
		loading,
		addProject,
		updateProject,
		deleteProject,
	};

	return (
		<ProjectsContext.Provider value={value}>
			{children}
		</ProjectsContext.Provider>
	);
}
