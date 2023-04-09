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
} from "firebase/firestore";
import { Project } from "../types/Project";
import useUser from "./useUser";
import { ProjectData } from "../types/ProjectData";

// export interface ProjectsContextType {
// 	value: Project[];
// 	loading: boolean;
// 	addProject: (projectData: ProjectData) => Promise<void>;
// }

const ProjectsContext = createContext<{
	value: Project[];
	loading: boolean;
	addProject: (projectData: ProjectData) => Promise<string>;
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

interface ProjectsProviderProps {
	children: React.ReactNode;
}

export function ProjectsProvider({ children }: ProjectsProviderProps) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useUser();

	console.log("user projects:", projects);

	/**
	 *
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

				setLoading(false);
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
		value: projects,
		loading,
		addProject,
	};

	return (
		<ProjectsContext.Provider value={value}>
			{children}
		</ProjectsContext.Provider>
	);
}
