import { useParams } from "react-router-dom";
import { getLocalStorageItem } from "../../lib/localStorage";
import slugify from "slugify";
import { Issue } from "../../interfaces/Issue";
import IssuesList from "../Issues/IssuesList";

export default function Project() {
	const { projectSlug } = useParams<string>();
	const projectTitle: string = projectSlug
		? getProjectTitleBySlug(projectSlug)
		: "";
	const projectIssues: Issue[] = projectTitle ? getProjectIssues() : [];

	function getProjectTitleBySlug(slug: string): string {
		interface SlugifiedProject {
			title: string;
			slug: string;
		}

		const projects: string[] = getLocalStorageItem("projects");

		if (!projectSlug) return "";
		if (!projects || (projects && !projects.length)) return "";

		const slugifiedProjects: SlugifiedProject[] = projects.map((p) => ({
			title: p,
			slug: slugify(p, { lower: true }),
		}));

		const slugifiedProject = slugifiedProjects.find(
			(p: SlugifiedProject) => p.slug === projectSlug
		);

		if (slugifiedProject) {
			const projectTitle = slugifiedProject.title;
			return projectTitle;
		} else {
			return "";
		}
	}

	function getProjectIssues(): Issue[] | [] {
		if (projectTitle) {
			const storedIssues: Issue[] = getLocalStorageItem("issues");
			if (storedIssues)
				return storedIssues.filter((issue) => issue.project === projectTitle);
			return [];
		} else {
			return [];
		}
	}

	if (!projectSlug)
		return (
			<p className="text-center text-danger">There is no such project...</p>
		);

	return (
		<>
			<header className="text-center my-3">
				<h2>{projectTitle}</h2>
			</header>
			{projectIssues.length ? (
				<IssuesList passedIssues={projectIssues} />
			) : (
				<p className="text-center text-danger">
					There are no issues in the project. Add one!
				</p>
			)}
		</>
	);
}
