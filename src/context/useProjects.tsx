import { createContext, useContext, useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import {
	collection,
	getDocs,
	where,
	query,
	doc,
	getDoc,
	writeBatch,
	arrayUnion,
	DocumentData,
	updateDoc,
	setDoc,
	deleteDoc,
	arrayRemove,
} from "firebase/firestore";
import { Project, ProjectData } from "../interfaces/Project";
import useUser from "./useUser";

const ProjectsContext = createContext<{
	projects: Project[];
	loading: boolean;
	addProject: (projectData: ProjectData) => Promise<string>;
	updateProject: (updatedProject: Project) => Promise<void>;
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
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useUser();

	console.log("user projects:", projects);

	/**
	 * @param projectData
	 * @returns The new project ID.
	 */
	async function addProject(projectData: ProjectData): Promise<string> {
		if (user && user.uid) {
			try {
				// get the id for new project (create an empty doc):
				const { id: newProjectId } = doc(collection(firestore, "projects"));

				// complete project document object with authorId & project id:
				const newProject: Project = {
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

				// add newProjectId to /user-projects:
				// (add newProjectId to doc's "projects" array)
				const userProjectsRef = doc(firestore, "user-projects", user.uid);

				if (projects && projects.length) {
					batch.update(userProjectsRef, {
						projectsIds: arrayUnion(newProjectId),
					});
				} else {
					// if there are no user projects,
					// that means we need to create user-projects collection
					// and set it then:
					batch.set(userProjectsRef, { projectsIds: [newProjectId] });
				}

				// Commit the batch
				await batch.commit();

				setProjects([...projects, newProject]);

				return newProjectId;
			} catch (error: any) {
				console.error(error.message);
				return "";
			}
		}

		return "";
	}

	async function updateProject(updatedProject: Project) {
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
			console.error(error.message);
		}
	}

	async function deleteProject(projectId: string) {
		// NOTE:
		// we need to delete project from /projects collection
		// & also from /user-projects doc array
		// so we use batch

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

			// delete project:
			const deletedProjectRef = doc(firestore, "projects", projectId);
			batch.delete(deletedProjectRef);

			// delete project id from /user-projects doc's "projects" array:
			const userProjectsRef = doc(firestore, "user-projects", user.uid);
			batch.update(userProjectsRef, {
				projectsIds: arrayRemove(projectId),
			});

			// Commit the batch
			await batch.commit();

			// update app's state:
			const updatedProjects = projects.filter((p) => p.id !== projectId);
			setProjects(updatedProjects);
		} catch (error: any) {
			console.error(error.message);
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

				// if (docSnap.exists()) {
				// 	console.log("User projects document data:", docSnap.data());
				// } else {
				// 	// docSnap.data() will be undefined in this case
				// 	console.log("No user projects document!");
				// }

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
								return docSnap.data() as Project;
							}
						})
					);

					if (fetchedUserProjects) {
						const filteredProjects = fetchedUserProjects.filter(
							(project) => project !== undefined
						) as Project[];
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
	}, [loading, user]);

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
