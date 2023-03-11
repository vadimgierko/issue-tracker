import { Link } from "react-router-dom";
import slugify from "slugify";
import { getLocalStorageItem } from "../../lib/localStorage";

export default function ProjectsList() {
	const projects = getProjects();

	function getProjects(): string[] {
		const storedProjects = getLocalStorageItem("projects");

		if (storedProjects) return storedProjects;

		return [];
	}

	if (!projects || (projects && !projects.length))
		return (
			<p className="text-center text-danger my-3">
				There are no projects stored in local storage. Add one!
			</p>
		);

	return (
		<ul className="mt-3">
			{projects.map((title) => (
				<li key={title}>
					<Link to={"/projects/" + slugify(title, { lower: true })}>
						{title}
					</Link>
				</li>
			))}
		</ul>
	);
}
