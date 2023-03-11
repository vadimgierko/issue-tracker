import { useParams } from "react-router-dom";
import { getLocalStorageItem } from "../../lib/localStorage";
import slugify from "slugify";

export default function Project() {
	const { projectSlug } = useParams<string>();

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

	if (!projectSlug)
		return (
			<p className="text-center text-danger">There is no such project...</p>
		);

	return (
		<h2 className="text-center my-3">{getProjectTitleBySlug(projectSlug)}</h2>
	);
}
