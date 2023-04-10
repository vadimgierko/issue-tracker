import { useParams } from "react-router-dom";
import useProjects from "../../context/useProjects";
import { Project as ProjectType } from "../../interfaces/Project";

export default function Project() {
	const { projectId } = useParams<string>();
	const { value: projects } = useProjects();
	const project: ProjectType | undefined = projects.find(
		(p) => p.id === projectId
	);

	if (!projectId || !project)
		return (
			<p className="text-center text-danger">There is no such project...</p>
		);

	return (
		<>
			<header className="text-center my-3">
				<h1>{project.title}</h1>
				<p>{project.description}</p>
			</header>
			{/* {projectIssues.length ? (
				<IssuesList passedIssues={projectIssues} />
			) : (
				<p className="text-center text-danger">
					There are no issues in the project. Add one!
				</p>
			)} */}
		</>
	);
}
