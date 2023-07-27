import { createContext, useContext, useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import {
	collection,
	doc,
	writeBatch,
	onSnapshot,
	deleteField,
	updateDoc,
} from "firebase/firestore";
import { Project } from "../interfaces/Project";
import useUser from "./useUser";
import useIssues from "./useIssues";

const ProjectsContext = createContext<{
	projects: Project.Project[];
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
	const { user } = useUser();
	const { issues } = useIssues();

	/**
	 * WARNING: new & updated items should have current timestamps & all props updated!
	 */
	async function updateProjects({
		itemsToAdd = [],
		itemsIdsToDelete = [],
		itemsToUpdate = [],
	}: {
		itemsToAdd?: Project.Project[];
		itemsIdsToDelete?: string[];
		itemsToUpdate?: Project.Project[];
	}) {
		if (!user) return;

		try {
			const userItemsRef = doc(firestore, "user-projects", user.uid);

			const updatedKeys = {
				...itemsToAdd.reduce((obj, item) => ({ ...obj, [item.id]: item }), {}),
				...itemsIdsToDelete.reduce(
					(obj, id) => ({ ...obj, [id]: deleteField() }),
					{}
				),
				...itemsToUpdate.reduce(
					(obj, item) => ({ ...obj, [item.id]: item }),
					{}
				),
			};

			await updateDoc(userItemsRef, {
				...updatedKeys,
			});
		} catch (error: any) {
			const errorMessage = `An error occurred while updating projects: ${error.message}. Cannot update projects.`;
			console.error(errorMessage);
			alert(errorMessage);
		}
	}

	/**
	 * @param projectData
	 * @returns The new project ID.
	 */
	async function addProject(projectData: Project.Data): Promise<string> {
		if (user && user.uid) {
			const { id: newProjectId } = doc(collection(firestore, "projects"));

			const newProject: Project.Project = {
				...projectData,
				authorId: user.uid,
				id: newProjectId,
			};

			try {
				await updateProjects({ itemsToAdd: [newProject] });
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
		try {
			await updateProjects({ itemsToUpdate: [updatedProject] });
		} catch (error: any) {
			const errorMessage = `An error occurred while updating the project: ${error.message}. Cannot update project.`;
			console.error(errorMessage);
			alert(errorMessage);
		}
	}

	async function deleteProject(projectId: string) {
		if (!projectId)
			return console.error("No project id provided... Cannot delete project.");

		if (!user || (user && !user.uid))
			return console.log("You need to be logged to delete project. Log in!");

		// init batch to update multiply docs (2 in this case):
		const batch = writeBatch(firestore);

		// get project's issues ids before deleting the project:
		const projectIssuesIds = issues
			.filter((i) => i.projectId === projectId)
			.map((i) => i.id);

		// 1. delete project:
		const userProjectsRef = doc(firestore, "user-projects", user.uid);
		batch.update(userProjectsRef, {
			[projectId]: deleteField(),
		});

		// 2. iterate through all project's issues ids & delete all them from /user-issues:
		if (projectIssuesIds && projectIssuesIds.length) {
			const userIssuesRef = doc(firestore, "user-issues", user.uid);
			batch.update(userIssuesRef, {
				...projectIssuesIds.reduce(
					(obj, id) => ({ ...obj, [id]: deleteField() }),
					{}
				),
			});
		} else {
			console.warn(`Project with the id ${projectId} has no issues to delete.`);
		}

		try {
			await batch.commit();
		} catch (error: any) {
			const errorMessage = `An error occurred while deleting the project: ${error.message}. Cannot delete project.`;
			console.error(errorMessage);
			alert(errorMessage);
		}
	}

	// fetch /user-projects/userId doc
	// & listen to changes =>
	// convert into Project.Project[]
	// setProjects()
	useEffect(() => {
		if (user) {
			console.log(`Fetching user projects...`);

			interface ProjetsDocObject {
				[key: string]: Project.Project;
			}

			const unsubscribeUserProjects = onSnapshot(
				doc(firestore, `user-projects`, user.uid),
				(snapshot) => {
					const data = snapshot.data() as ProjetsDocObject;

					if (data) {
						if (Object.keys(data).length) {
							console.log(`Fetched user's projects doc object:`, data);

							//================ Calculate size of fetched document in bytes ============//
							const jsonString = JSON.stringify(data);
							const docSizeInBytes = jsonString.length * 4;

							// Calculate percentage of 1 MiB used by the document
							const oneMiBInBytes = 1024 * 1024;
							const percentageUsed = (docSizeInBytes / oneMiBInBytes) * 100;

							console.log(`Projects document size: ${docSizeInBytes} bytes`);
							console.log(
								`Percentage of 1 MiB used by projects doc: ${percentageUsed.toFixed(
									2
								)}%`
							);

							//==========================================================================//

							const convertedProjects: Project.Project[] = Object.keys(
								data
							).map((id) => data[id]);

							setProjects(convertedProjects);
						} else {
							console.warn("There is no user projects...");
							setProjects([]);
						}
					} else {
						console.warn("There is no user projects data at all...");
						setProjects([]);
					}
				}
			);

			return () => unsubscribeUserProjects();
		} else {
			setProjects([]);
		}
	}, [user]);

	const value = {
		projects,
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
