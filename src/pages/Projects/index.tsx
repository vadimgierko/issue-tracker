import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
	getLocalStorageItem,
	setLocalStorageItem,
} from "../../lib/localStorage";

export default function Projects() {
	const [projects, setProjects] = useState<string[]>(getProjects());

	function getProjects() {
		const storedProjects = getLocalStorageItem("projects");

		if (storedProjects) return storedProjects;

		return [];
	}

	function addProject(name: string) {
		const updatedProjects = [...projects, name];
		setLocalStorageItem("projects", updatedProjects);
	}

	if (!projects || (projects && !projects.length))
		return <p>There are no projects stored in local storage. Add one!</p>;

	return (
		<>
			<header className="text-center">
				<h1>Projects</h1>
				<hr />
			</header>
			<Outlet />
		</>
	);
}
